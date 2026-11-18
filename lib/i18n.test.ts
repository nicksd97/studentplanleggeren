import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { languageAlternates, localeFromPathname, localizePath, stripLocalePrefix } from "./i18n/config";
import {
  decideLocale,
  isBot,
  isExcludedPath,
  localeFromAcceptLanguage,
  parseAcceptLanguage,
  type LocaleRequest,
} from "./i18n/detect";
import { itemDisplayName, localizeBundle, localizeProduct } from "./i18n/products";
import { translateApiError } from "./i18n/api-errors";
import { catalogDescription, catalogTitle } from "./catalog";
import { faqItems, faqItemsEn } from "./faq";
import { getGuides, guidePath, guideProductHref, guides } from "./guides";
import { guidesEn } from "./i18n/guides";
import { alleProdukter, pakker } from "./products";
import { absoluteUrl, indexablePaths, pageMeta, robotsDisallow, sitemapEntries } from "./site";

const CHROME =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const GOOGLEBOT = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

function request(overrides: Partial<LocaleRequest> = {}): LocaleRequest {
  return {
    method: "GET",
    pathname: "/",
    search: "",
    cookieLocale: undefined,
    userAgent: CHROME,
    country: undefined,
    acceptLanguage: undefined,
    ...overrides,
  };
}

describe("localizePath", () => {
  it("keeps Bokmål paths unprefixed and prefixes English with /en", () => {
    assert.equal(localizePath("/", "nb"), "/");
    assert.equal(localizePath("/", "en"), "/en");
    assert.equal(localizePath("/produkter", "en"), "/en/produkter");
    assert.equal(localizePath("/produkter?kategori=daglig", "en"), "/en/produkter?kategori=daglig");
    assert.equal(localizePath("/#pakker", "en"), "/en#pakker");
    assert.equal(localizePath("/guider/bygg-studievaner", "en"), "/en/guider/bygg-studievaner");
  });

  it("maps English paths back to Bokmål and is idempotent", () => {
    assert.equal(localizePath("/en", "nb"), "/");
    assert.equal(localizePath("/en/kasse?betaling=avbrutt", "nb"), "/kasse?betaling=avbrutt");
    assert.equal(localizePath("/en/produkter", "en"), "/en/produkter");
    assert.equal(stripLocalePrefix("/en/vilkar"), "/vilkar");
  });

  it("does not treat /enkel-like paths as English and leaves external links alone", () => {
    assert.equal(localeFromPathname("/enkel"), "nb");
    assert.equal(localeFromPathname("/en"), "en");
    assert.equal(localeFromPathname("/en/takk"), "en");
    assert.equal(localizePath("/enkel", "en"), "/en/enkel");
    assert.equal(localizePath("mailto:hei@studentplanlegger.no", "en"), "mailto:hei@studentplanlegger.no");
    assert.equal(localizePath("#faq", "en"), "#faq");
  });
});

describe("locale detection", () => {
  it("serves Bokmål to Norway (and Svalbard / Bouvet Island) without redirect", () => {
    for (const country of ["NO", "no", "SJ", "BV"]) {
      const decision = decideLocale(request({ country }));
      assert.equal(decision.action, "next", country);
      assert.equal(decision.action === "next" && decision.vary, true);
    }
  });

  it("sends visitors from other countries to the /en twin with the query string", () => {
    for (const country of ["US", "DE", "SE"]) {
      const decision = decideLocale(
        request({ country, pathname: "/produkter", search: "?kategori=daglig" }),
      );
      assert.deepEqual(decision, {
        action: "redirect",
        location: "/en/produkter?kategori=daglig",
        reason: "country",
      });
    }
    const home = decideLocale(request({ country: "US" }));
    assert.equal(home.action === "redirect" && home.location, "/en");
  });

  it("lets the cookie win over the country", () => {
    const en = decideLocale(request({ country: "NO", cookieLocale: "en", pathname: "/gratis" }));
    assert.equal(en.action === "redirect" && en.location, "/en/gratis");
    const nb = decideLocale(request({ country: "US", cookieLocale: "nb" }));
    assert.equal(nb.action, "next");
  });

  it("ignores unknown cookie values", () => {
    const decision = decideLocale(request({ country: "NO", cookieLocale: "de" }));
    assert.equal(decision.action, "next");
  });

  it("never redirects crawlers or empty user agents", () => {
    for (const userAgent of [
      GOOGLEBOT,
      "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.0; +https://openai.com/gptbot)",
      "facebookexternalhit/1.1",
      "Mozilla/5.0 (compatible; AhrefsBot/7.0)",
      "Mozilla/5.0 Chrome-Lighthouse",
      "Mozilla/5.0 HeadlessChrome/120.0",
      "Mozilla/5.0 (compatible; Google-InspectionTool/1.0)",
      "ClaudeBot/1.0",
      "PerplexityBot/1.0",
      "",
    ]) {
      assert.equal(isBot(userAgent), true, userAgent);
      const decision = decideLocale(request({ userAgent, country: "US", acceptLanguage: "en-US" }));
      assert.equal(decision.action, "next", userAgent);
    }
    assert.equal(isBot(null), true);
    assert.equal(isBot(CHROME), false);
  });

  it("falls back to Accept-Language when there is no country header", () => {
    assert.equal(decideLocale(request({ acceptLanguage: "nb-NO,nb;q=0.9,en;q=0.8" })).action, "next");
    assert.equal(decideLocale(request({ acceptLanguage: "nn" })).action, "next");
    assert.equal(decideLocale(request({ acceptLanguage: "en-US,en;q=0.9" })).action, "redirect");
    assert.equal(decideLocale(request({ acceptLanguage: "de-DE,de;q=0.9" })).action, "redirect");
    assert.equal(decideLocale(request({ acceptLanguage: "" })).action, "next");
    assert.equal(decideLocale(request({ acceptLanguage: "*" })).action, "next");
    assert.equal(decideLocale(request({})).action, "next");
  });

  it("ranks Norwegian against English by q-value", () => {
    assert.equal(localeFromAcceptLanguage("da, nb;q=0.9, en;q=0.8"), "nb");
    assert.equal(localeFromAcceptLanguage("en;q=0.5, no;q=0.9"), "nb");
    assert.equal(localeFromAcceptLanguage("sv, en;q=0.9, nb;q=0.8"), "en");
    assert.equal(localeFromAcceptLanguage("en, nb;q=0"), "en");
    assert.equal(localeFromAcceptLanguage(null), null);
    assert.deepEqual(parseAcceptLanguage("en;q=0.5, nb-NO, de;q=0.7"), ["nb-no", "de", "en"]);
  });

  it("never redirects /en pages, API routes, assets or non-GET requests", () => {
    for (const pathname of ["/en", "/en/produkter", "/en/kasse"]) {
      const decision = decideLocale(request({ pathname, country: "NO", cookieLocale: "nb" }));
      assert.deepEqual(decision, { action: "next", vary: false, reason: "english-path" });
    }
    for (const pathname of [
      "/api/cron/keepalive",
      "/api/orders",
      "/_next/static/chunks/main.js",
      "/favicon.ico",
      "/robots.txt",
      "/sitemap.xml",
      "/images/cover.png",
    ]) {
      assert.equal(isExcludedPath(pathname), true, pathname);
      assert.equal(decideLocale(request({ pathname, country: "US" })).action, "next", pathname);
    }
    assert.equal(decideLocale(request({ method: "POST", country: "US" })).action, "next");
    assert.equal(decideLocale(request({ method: "HEAD", country: "US" })).action, "redirect");
  });
});

describe("English SEO metadata", () => {
  it("gives both languages a self-referencing canonical and the same hreflang set", () => {
    const nb = pageMeta({ title: "T", description: "D", path: "/produkter?kategori=daglig" });
    const en = pageMeta({ title: "T", description: "D", path: "/produkter?kategori=daglig", locale: "en" });
    const languages = {
      nb: "https://www.studentplanlegger.no/produkter?kategori=daglig",
      en: "https://www.studentplanlegger.no/en/produkter?kategori=daglig",
      "x-default": "https://www.studentplanlegger.no/produkter?kategori=daglig",
    };
    assert.equal(nb.alternates.canonical, languages.nb);
    assert.equal(en.alternates.canonical, languages.en);
    assert.deepEqual(nb.alternates.languages, languages);
    assert.deepEqual(en.alternates.languages, languages);
    assert.equal(nb.openGraph.locale, "nb_NO");
    assert.equal(en.openGraph.locale, "en_GB");
    assert.equal(en.openGraph.url, languages.en);
  });

  it("keeps noindex pages noindex in English without hreflang", () => {
    const meta = pageMeta({ title: "T", description: "D", path: "/kasse", index: false, locale: "en" });
    assert.deepEqual(meta.robots, { index: false, follow: false });
    assert.equal(meta.alternates.canonical, "https://www.studentplanlegger.no/en/kasse");
    assert.equal(meta.alternates.languages, undefined);
    assert.ok(robotsDisallow.includes("/en/kasse"));
    assert.ok(robotsDisallow.includes("/en/takk"));
  });

  it("lists every page in both languages in the sitemap with alternates", () => {
    const entries = sitemapEntries();
    const paths = indexablePaths();
    assert.equal(entries.length, paths.length * 2);
    const urls = new Set(entries.map((entry) => entry.url));
    for (const path of paths) {
      assert.ok(urls.has(absoluteUrl(path)), path);
      assert.ok(urls.has(absoluteUrl(localizePath(path, "en"))), path);
    }
    for (const entry of entries) {
      assert.deepEqual(Object.keys(entry.alternates?.languages ?? {}).sort(), ["en", "nb", "x-default"]);
    }
    assert.deepEqual(languageAlternates("/", absoluteUrl), {
      nb: "https://www.studentplanlegger.no/",
      en: "https://www.studentplanlegger.no/en",
      "x-default": "https://www.studentplanlegger.no/",
    });
  });
});

describe("English content", () => {
  it("translates every product and bundle and says the planners are in Norwegian", () => {
    for (const product of alleProdukter) {
      const en = localizeProduct(product, "en");
      assert.notEqual(en.name, product.name, product.id);
      assert.match(en.description, /Norwegian \(Bokmål\)/, product.id);
      assert.equal(en.price, product.price);
      assert.equal(en.id, product.id);
      assert.equal(localizeProduct(product, "nb"), product);
    }
    for (const bundle of pakker) {
      const en = localizeBundle(bundle, "en");
      assert.equal(en.price, bundle.price);
      assert.deepEqual(en.productIds, bundle.productIds);
    }
    assert.equal(itemDisplayName({ id: "komplett", name: "Studentplanlegger Komplett" }, "en"), "Studentplanlegger Complete");
    assert.equal(itemDisplayName({ id: "komplett", name: "Studentplanlegger Komplett" }, "nb"), "Studentplanlegger Komplett");
  });

  it("mirrors the guides with the same slugs and English product links", () => {
    assert.deepEqual(guidesEn.map((guide) => guide.slug), guides.map((guide) => guide.slug));
    assert.equal(getGuides("en"), guidesEn);
    for (const guide of guidesEn) {
      assert.match(guide.title, /Studentplanlegger/);
      assert.ok(guide.description.length >= 70);
      assert.equal(guidePath(guide.slug, "en"), `/en/guider/${guide.slug}`);
      assert.equal(guideProductHref(guide, "en"), `/en/produkter?kategori=${guide.catalogKey}`);
      const product = alleProdukter.find((item) => item.slug === guide.productSlug);
      assert.ok(product);
      assert.ok(guide.productLead.includes(localizeProduct(product, "en").name), guide.slug);
    }
  });

  it("keeps the Bokmål catalog copy and has English copy for every category", () => {
    assert.equal(catalogTitle("daglig"), "Daglige planleggere — Studentplanlegger");
    assert.equal(catalogTitle("daglig", "en"), "Daily planners — Studentplanlegger");
    assert.match(catalogDescription("alle", "en"), /Norwegian \(Bokmål\)/);
    assert.ok(faqItemsEn.length >= faqItems.length);
    assert.ok(faqItemsEn.some((item) => /Norwegian \(Bokmål\)/.test(item.answer)));
  });

  it("translates known API errors on English pages and leaves Bokmål untouched", () => {
    assert.equal(translateApiError("Serverfeil", "nb"), "Serverfeil");
    assert.equal(translateApiError("Ugyldig e-postadresse", "en"), "Invalid email address.");
    assert.equal(translateApiError("Noe helt nytt", "en"), "Something went wrong. Please try again.");
    assert.equal(translateApiError(undefined, "nb"), "Noe gikk galt. Prøv igjen.");
  });
});
