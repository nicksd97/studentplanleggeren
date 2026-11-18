import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PDF_LANGUAGES_AVAILABLE,
  languageAlternates,
  localeFromPathname,
  locales,
  localizePath,
  prefixedLocales,
  stripLocalePrefix,
} from "./i18n/config";
import {
  currencyCookieToSet,
  decideLocale,
  isBot,
  isExcludedPath,
  localeForCountry,
  localeFromAcceptLanguage,
  parseAcceptLanguage,
  type LocaleRequest,
} from "./i18n/detect";
import { contents } from "./i18n/content/index";
import { messages } from "./i18n/messages/index";
import { en as enMessages } from "./i18n/messages/en";
import { itemDisplayName, localizeBundle, localizeProduct, pdfLanguageCopy } from "./i18n/products";
import { translateApiError } from "./i18n/api-errors";
import { catalogDescription, catalogTitle } from "./catalog";
import { faqItems, getFaqItems } from "./faq";
import { getGuides, guidePath, guideProductHref, guides } from "./guides";
import { alleProdukter, categoryGroups, pakker } from "./products";
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

/** Where a request ends up: the redirect location, or "stay". */
function target(overrides: Partial<LocaleRequest>): string {
  const decision = decideLocale(request(overrides));
  return decision.action === "redirect" ? decision.location : "stay";
}

describe("localizePath", () => {
  it("keeps Bokmål paths unprefixed and prefixes every other language", () => {
    assert.equal(localizePath("/", "nb"), "/");
    assert.equal(localizePath("/", "en"), "/en");
    assert.equal(localizePath("/", "de"), "/de");
    assert.equal(localizePath("/produkter", "sv"), "/sv/produkter");
    assert.equal(localizePath("/produkter?kategori=daglig", "da"), "/da/produkter?kategori=daglig");
    assert.equal(localizePath("/#pakker", "es"), "/es#pakker");
    assert.equal(localizePath("/guider/bygg-studievaner", "fr"), "/fr/guider/bygg-studievaner");
  });

  it("maps between languages and is idempotent", () => {
    assert.equal(localizePath("/en", "nb"), "/");
    assert.equal(localizePath("/de/kasse?betaling=avbrutt", "nb"), "/kasse?betaling=avbrutt");
    assert.equal(localizePath("/de/kasse?betaling=avbrutt", "fr"), "/fr/kasse?betaling=avbrutt");
    assert.equal(localizePath("/en/produkter", "en"), "/en/produkter");
    assert.equal(stripLocalePrefix("/sv/vilkar"), "/vilkar");
  });

  it("does not treat /enkel- or /deutsch-like paths as prefixed and leaves external links alone", () => {
    assert.equal(localeFromPathname("/enkel"), "nb");
    assert.equal(localeFromPathname("/deutsch"), "nb");
    assert.equal(localeFromPathname("/en"), "en");
    assert.equal(localeFromPathname("/da/takk"), "da");
    assert.equal(localizePath("/enkel", "en"), "/en/enkel");
    assert.equal(localizePath("mailto:hei@studentplanlegger.no", "de"), "mailto:hei@studentplanlegger.no");
    assert.equal(localizePath("#faq", "en"), "#faq");
  });
});

describe("locale detection by country", () => {
  const cases: Array<[string, string, string?]> = [
    ["NO", "stay"],
    ["SJ", "stay"],
    ["BV", "stay"],
    ["SE", "/sv"],
    ["DK", "/da"],
    ["GL", "/da"],
    ["FO", "/da"],
    ["DE", "/de"],
    ["AT", "/de"],
    ["LI", "/de"],
    ["CH", "/de"],
    ["CH", "/de", "de-CH,de;q=0.9,fr;q=0.8"],
    ["CH", "/fr", "fr-CH,fr;q=0.9,de;q=0.5"],
    ["CH", "/de", "it-CH,en;q=0.8"],
    ["ES", "/es"],
    ["MX", "/es"],
    ["AR", "/es"],
    ["CO", "/es"],
    ["PR", "/es"],
    ["UY", "/es"],
    ["FR", "/fr"],
    ["MC", "/fr"],
    ["SN", "/fr"],
    ["CI", "/fr"],
    ["CD", "/fr"],
    ["RE", "/fr"],
    ["NC", "/fr"],
    ["LU", "/fr"],
    ["LU", "/fr", "fr-LU,fr"],
    ["LU", "/de", "de-LU,de;q=0.9,fr;q=0.5"],
    ["LU", "/en", "en-GB,en"],
    ["BE", "/en"],
    ["BE", "/fr", "fr-BE,fr;q=0.9,nl;q=0.8"],
    ["BE", "/en", "nl-BE,nl;q=0.9,fr;q=0.5"],
    ["BE", "/en", "de-BE"],
    ["CA", "/en"],
    ["CA", "/fr", "fr-CA,en;q=0.5"],
    ["CA", "/en", "en-CA,fr;q=0.5"],
    ["GB", "/en"],
    ["US", "/en"],
    ["JP", "/en"],
    ["NL", "/en"],
    ["IT", "/en"],
    ["BR", "/en"],
  ];

  for (const [country, expected, acceptLanguage] of cases) {
    it(`${country}${acceptLanguage ? ` (${acceptLanguage})` : ""} -> ${expected}`, () => {
      assert.equal(target({ country, acceptLanguage }), expected);
    });
  }

  it("keeps path, query string and lower-case country codes", () => {
    assert.equal(target({ country: "de", pathname: "/produkter", search: "?kategori=daglig" }), "/de/produkter?kategori=daglig");
    const decision = decideLocale(request({ country: "SE", pathname: "/gratis" }));
    assert.deepEqual(decision, { action: "redirect", location: "/sv/gratis", locale: "sv", reason: "country" });
    assert.equal(localeForCountry("se"), "sv");
  });

  it("varies Norwegian responses on the inputs the decision used", () => {
    const decision = decideLocale(request({ country: "NO" }));
    assert.equal(decision.action === "next" && decision.vary, true);
  });
});

describe("locale detection: cookie, bots, headers, paths", () => {
  it("lets any supported cookie win over the country", () => {
    assert.equal(target({ country: "NO", cookieLocale: "de" }), "/de");
    assert.equal(target({ country: "NO", cookieLocale: "en", pathname: "/gratis" }), "/en/gratis");
    assert.equal(target({ country: "US", cookieLocale: "sv" }), "/sv");
    assert.equal(target({ country: "FR", cookieLocale: "nb" }), "stay");
    assert.equal(target({ country: "US", cookieLocale: "nb" }), "stay");
    // Unknown values are ignored and the country decides.
    assert.equal(target({ country: "NO", cookieLocale: "it" }), "stay");
    assert.equal(target({ country: "DE", cookieLocale: "xx" }), "/de");
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
      for (const country of ["US", "DE", "SE", "FR"]) {
        assert.equal(target({ userAgent, country, acceptLanguage: "en-US" }), "stay", userAgent);
      }
    }
    assert.equal(isBot(null), true);
    assert.equal(isBot(CHROME), false);
  });

  it("uses Accept-Language when there is no country header", () => {
    assert.equal(target({ acceptLanguage: "nb-NO,nb;q=0.9,en;q=0.8" }), "stay");
    assert.equal(target({ acceptLanguage: "nn" }), "stay");
    assert.equal(target({ acceptLanguage: "no" }), "stay");
    assert.equal(target({ acceptLanguage: "en-US,en;q=0.9" }), "/en");
    assert.equal(target({ acceptLanguage: "de-DE,de;q=0.9" }), "/de");
    assert.equal(target({ acceptLanguage: "sv-SE" }), "/sv");
    assert.equal(target({ acceptLanguage: "da" }), "/da");
    assert.equal(target({ acceptLanguage: "es-MX,es;q=0.9" }), "/es");
    assert.equal(target({ acceptLanguage: "fr-FR" }), "/fr");
    assert.equal(target({ acceptLanguage: "it-IT,it;q=0.9" }), "/en");
    assert.equal(target({ acceptLanguage: "" }), "stay");
    assert.equal(target({ acceptLanguage: "*" }), "stay");
    assert.equal(target({}), "stay");
  });

  it("picks the first supported language by q-value", () => {
    assert.equal(localeFromAcceptLanguage("it, nb;q=0.9, en;q=0.8"), "nb");
    assert.equal(localeFromAcceptLanguage("en;q=0.5, no;q=0.9"), "nb");
    assert.equal(localeFromAcceptLanguage("pl, sv;q=0.9, en;q=0.8"), "sv");
    assert.equal(localeFromAcceptLanguage("en, nb;q=0"), "en");
    assert.equal(localeFromAcceptLanguage("ja"), "en");
    assert.equal(localeFromAcceptLanguage(null), null);
    assert.deepEqual(parseAcceptLanguage("en;q=0.5, nb-NO, de;q=0.7"), ["nb-no", "de", "en"]);
  });

  it("never redirects prefixed pages, API routes, assets or non-GET requests", () => {
    for (const lang of prefixedLocales) {
      for (const pathname of [`/${lang}`, `/${lang}/produkter`, `/${lang}/kasse`]) {
        const decision = decideLocale(request({ pathname, country: "NO", cookieLocale: "nb" }));
        assert.deepEqual(decision, { action: "next", vary: false, locale: lang, reason: "prefixed-path" });
        assert.equal(target({ pathname, country: "US", cookieLocale: "fr" }), "stay");
      }
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
      assert.equal(target({ pathname, country: "US" }), "stay", pathname);
    }
    assert.equal(target({ method: "POST", country: "US" }), "stay");
    assert.equal(target({ method: "HEAD", country: "US" }), "/en");
  });
});

describe("currency cookie from the proxy", () => {
  it("sets the currency from the country, else from the page language", () => {
    assert.equal(currencyCookieToSet({ existing: undefined, country: "NO", locale: "nb" }), "NOK");
    assert.equal(currencyCookieToSet({ existing: undefined, country: "SE", locale: "sv" }), "SEK");
    assert.equal(currencyCookieToSet({ existing: undefined, country: "DE", locale: "de" }), "EUR");
    assert.equal(currencyCookieToSet({ existing: undefined, country: "GB", locale: "en" }), "GBP");
    assert.equal(currencyCookieToSet({ existing: undefined, country: "US", locale: "en" }), "USD");
    assert.equal(currencyCookieToSet({ existing: undefined, country: null, locale: "da" }), "DKK");
    assert.equal(currencyCookieToSet({ existing: undefined, country: null, locale: "en" }), "USD");
    assert.equal(currencyCookieToSet({ existing: undefined, country: "", locale: "nb" }), "NOK");
  });

  it("never overrides a valid cookie, but replaces an invalid one", () => {
    assert.equal(currencyCookieToSet({ existing: "EUR", country: "NO", locale: "nb" }), null);
    assert.equal(currencyCookieToSet({ existing: "nok", country: "US", locale: "en" }), null);
    assert.equal(currencyCookieToSet({ existing: "BTC", country: "NO", locale: "nb" }), "NOK");
  });
});

describe("multilingual SEO metadata", () => {
  const expectedLanguages = (path: string) => {
    const languages: Record<string, string> = {};
    for (const locale of locales) languages[locale] = absoluteUrl(localizePath(path, locale));
    languages["x-default"] = absoluteUrl(path);
    return languages;
  };

  it("gives every language a self-canonical and the same hreflang set with x-default = Bokmål", () => {
    const path = "/produkter?kategori=daglig";
    for (const locale of locales) {
      const meta = pageMeta({ title: "T", description: "D", path, locale });
      assert.equal(meta.alternates.canonical, absoluteUrl(localizePath(path, locale)));
      assert.deepEqual(meta.alternates.languages, expectedLanguages(path));
      assert.equal(meta.openGraph.url, meta.alternates.canonical);
      assert.equal(meta.openGraph.alternateLocale?.length, locales.length - 1);
    }
    assert.equal(pageMeta({ title: "T", description: "D", path, locale: "de" }).openGraph.locale, "de_DE");
    assert.equal(pageMeta({ title: "T", description: "D", path, locale: "sv" }).openGraph.locale, "sv_SE");
    assert.equal(pageMeta({ title: "T", description: "D", path, locale: "da" }).openGraph.locale, "da_DK");
    assert.equal(pageMeta({ title: "T", description: "D", path, locale: "es" }).openGraph.locale, "es_ES");
    assert.equal(pageMeta({ title: "T", description: "D", path, locale: "fr" }).openGraph.locale, "fr_FR");
    assert.equal(pageMeta({ title: "T", description: "D", path }).openGraph.locale, "nb_NO");
  });

  it("fills price placeholders in metadata with the language's default currency", () => {
    assert.equal(pageMeta({ title: "T", description: "Fra {single}", path: "/" }).description, "Fra 39 kr");
    assert.equal(pageMeta({ title: "T", description: "Ab {single}", path: "/", locale: "de" }).description, "Ab 3,49 €");
    assert.equal(pageMeta({ title: "T", description: "From {single}", path: "/", locale: "en" }).description, "From $3.99");
  });

  it("keeps noindex pages noindex in every language without hreflang", () => {
    for (const locale of prefixedLocales) {
      const meta = pageMeta({ title: "T", description: "D", path: "/kasse", index: false, locale });
      assert.deepEqual(meta.robots, { index: false, follow: false });
      assert.equal(meta.alternates.canonical, `https://www.studentplanlegger.no/${locale}/kasse`);
      assert.equal(meta.alternates.languages, undefined);
      assert.ok(robotsDisallow.includes(`/${locale}/kasse`));
      assert.ok(robotsDisallow.includes(`/${locale}/takk`));
    }
  });

  it("lists every page in every language in the sitemap with full alternates", () => {
    const entries = sitemapEntries();
    const paths = indexablePaths();
    assert.equal(entries.length, paths.length * locales.length);
    const urls = new Set(entries.map((entry) => entry.url));
    for (const path of paths) {
      for (const locale of locales) {
        assert.ok(urls.has(absoluteUrl(localizePath(path, locale))), `${locale} ${path}`);
      }
    }
    for (const entry of entries) {
      assert.deepEqual(
        Object.keys(entry.alternates?.languages ?? {}).sort(),
        [...locales, "x-default"].sort(),
      );
    }
    assert.deepEqual(languageAlternates("/", absoluteUrl), {
      nb: "https://www.studentplanlegger.no/",
      en: "https://www.studentplanlegger.no/en",
      de: "https://www.studentplanlegger.no/de",
      sv: "https://www.studentplanlegger.no/sv",
      da: "https://www.studentplanlegger.no/da",
      es: "https://www.studentplanlegger.no/es",
      fr: "https://www.studentplanlegger.no/fr",
      "x-default": "https://www.studentplanlegger.no/",
    });
  });
});

/** Placeholders like {single} or {name} in a string. */
function placeholders(value: string): string[] {
  return [...value.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
}

/** Walks two dictionaries in parallel and reports structural differences. */
function compareShape(reference: unknown, other: unknown, path: string, problems: string[]) {
  if (typeof reference === "string") {
    if (typeof other !== "string") {
      problems.push(`${path}: not a string`);
      return;
    }
    if (placeholders(reference).join() !== placeholders(other).join()) {
      problems.push(`${path}: placeholders ${placeholders(other)} vs ${placeholders(reference)}`);
    }
    return;
  }
  if (Array.isArray(reference)) {
    if (!Array.isArray(other) || other.length !== reference.length) {
      problems.push(`${path}: array length`);
      return;
    }
    reference.forEach((item, index) => compareShape(item, other[index], `${path}[${index}]`, problems));
    return;
  }
  if (reference && typeof reference === "object") {
    if (!other || typeof other !== "object") {
      problems.push(`${path}: missing object`);
      return;
    }
    for (const key of Object.keys(reference)) {
      compareShape((reference as Record<string, unknown>)[key], (other as Record<string, unknown>)[key], `${path}.${key}`, problems);
    }
  }
}

describe("translations", () => {
  it("has a complete UI dictionary with the same placeholders for every prefixed language", () => {
    for (const locale of prefixedLocales) {
      const problems: string[] = [];
      compareShape(enMessages, messages[locale], locale, problems);
      assert.deepEqual(problems, [], locale);
    }
  });

  it("has complete page content with the same placeholders for every prefixed language", () => {
    for (const locale of prefixedLocales) {
      const problems: string[] = [];
      const { guides: localizedGuides, ...rest } = contents[locale];
      const { guides: enGuides, ...enRest } = contents.en;
      const withoutLists = (content: typeof rest) => ({
        ...content,
        faq: undefined,
        meta: { ...content.meta, home: { ...content.meta.home, keywords: undefined } },
      });
      compareShape(withoutLists(enRest), withoutLists(rest), locale, problems);
      assert.ok(rest.meta.home.keywords.length >= 3, `${locale} keywords`);
      assert.ok(rest.faq.length >= faqItems.length - 1, `${locale} faq`);
      assert.equal(localizedGuides.length, enGuides.length);
      assert.deepEqual(problems, [], locale);
    }
  });

  it("translates every product, bundle and category in every language", () => {
    for (const locale of prefixedLocales) {
      const dictionary = messages[locale];
      for (const product of alleProdukter) {
        const localized = localizeProduct(product, dictionary);
        // Some names are the same word as in Bokmål (Swedish "Handlingsplan"), so check the entry.
        assert.ok(dictionary.products[product.id]?.name, `${locale} ${product.id}`);
        assert.equal(localized.features.length, product.features.length, `${locale} ${product.id}`);
        assert.equal(localized.price, product.price);
        assert.equal(localized.id, product.id);
      }
      for (const bundle of pakker) {
        const localized = localizeBundle(bundle, dictionary);
        assert.ok(dictionary.bundles[bundle.id], `${locale} ${bundle.id}`);
        assert.equal(localized.price, bundle.price);
        assert.deepEqual(localized.productIds, bundle.productIds);
      }
      for (const key of ["alle", ...categoryGroups.map((group) => group.key)]) {
        assert.ok(dictionary.categoryLabels[key], `${locale} ${key}`);
      }
    }
    assert.equal(localizeProduct(alleProdukter[0], messages.nb), alleProdukter[0]);
    assert.equal(itemDisplayName({ id: "komplett", name: "Studentplanlegger Komplett" }, messages.en), "Studentplanlegger Complete");
    assert.equal(itemDisplayName({ id: "komplett", name: "Studentplanlegger Komplett" }, messages.nb), "Studentplanlegger Komplett");
  });

  it("mirrors the guides with the same slugs, categories and product names", () => {
    for (const locale of prefixedLocales) {
      const localized = getGuides(locale);
      assert.deepEqual(localized.map((guide) => guide.slug), guides.map((guide) => guide.slug));
      localized.forEach((guide, index) => {
        assert.equal(guide.catalogKey, guides[index].catalogKey);
        assert.equal(guide.productSlug, guides[index].productSlug);
        assert.match(guide.title, / — Studentplanlegger$/);
        assert.ok(guide.description.length >= 70, `${locale} ${guide.slug}`);
        assert.ok(guide.sections.length === guides[index].sections.length, `${locale} ${guide.slug} sections`);
        assert.equal(guidePath(guide.slug, locale), `/${locale}/guider/${guide.slug}`);
        assert.equal(guideProductHref(guide, locale), `/${locale}/produkter?kategori=${guide.catalogKey}`);
        const product = alleProdukter.find((item) => item.slug === guide.productSlug);
        assert.ok(product);
        assert.ok(
          guide.productLead.includes(localizeProduct(product, messages[locale]).name),
          `${locale} ${guide.slug}`,
        );
      });
    }
  });

  it("keeps the Bokmål catalog copy and has translated copy for every category", () => {
    assert.equal(catalogTitle("daglig"), "Daglige planleggere — Studentplanlegger");
    assert.equal(catalogTitle("daglig", "en"), "Daily planners — Studentplanlegger");
    for (const locale of prefixedLocales) {
      assert.match(catalogTitle("daglig", locale), /Studentplanlegger/);
      assert.notEqual(catalogDescription("alle", locale), catalogDescription("alle"));
    }
  });

  it("says the planners come in the visitor's language when translated PDFs exist", () => {
    assert.deepEqual([...PDF_LANGUAGES_AVAILABLE].sort(), [...locales].sort());
    assert.equal(pdfLanguageCopy("en", messages.en).sentence, "All planners are available in English.");
    assert.equal(pdfLanguageCopy("nb", messages.nb).sentence, "");
    for (const locale of prefixedLocales) {
      const faq = getFaqItems(locale);
      assert.equal(faq[0].answer, contents[locale].faqLanguage.available, locale);
      assert.doesNotMatch(pdfLanguageCopy(locale, messages[locale]).sentence, /\{/);
    }
    assert.equal(getFaqItems("nb"), faqItems);
  });

  it("translates known API errors and leaves Bokmål untouched", () => {
    assert.equal(translateApiError("Serverfeil", messages.nb), "Serverfeil");
    assert.equal(translateApiError("Ugyldig e-postadresse", messages.en), "Invalid email address.");
    assert.equal(translateApiError("Noe helt nytt", messages.en), "Something went wrong. Please try again.");
    assert.equal(translateApiError(undefined, messages.nb), "Noe gikk galt. Prøv igjen.");
    for (const locale of prefixedLocales) {
      assert.deepEqual(Object.keys(messages[locale].apiErrors).sort(), Object.keys(messages.en.apiErrors).sort(), locale);
      assert.notEqual(translateApiError("Ugyldig valuta", messages[locale]), "Ugyldig valuta");
    }
  });
});
