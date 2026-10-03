import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { alleProdukter, categoryGroups, pakker } from "./products";
import {
  assertGuideCatalog,
  getGuide,
  guidePath,
  guidePaths,
  guideProduct,
  guideProductHref,
  guides,
} from "./guides";
import {
  SITE_ORIGIN,
  absoluteUrl,
  indexablePaths,
  pageMeta,
  robotsDisallow,
} from "./site";
import {
  resolveCatalog,
  catalogTitle,
  catalogDescription,
  catalogHeading,
} from "./catalog";
import {
  faqPageJsonLd,
  organizationJsonLd,
  productOfferJsonLd,
  productListJsonLd,
  websiteJsonLd,
} from "./json-ld";
import { faqItems } from "./faq";

describe("site URLs", () => {
  it("uses the www host, never the apex", () => {
    assert.equal(SITE_ORIGIN, "https://www.studentplanlegger.no");
    assert.equal(absoluteUrl("/produkter"), "https://www.studentplanlegger.no/produkter");
    assert.equal(
      absoluteUrl("/produkter?kategori=daglig"),
      "https://www.studentplanlegger.no/produkter?kategori=daglig",
    );
    assert.equal(new URL(absoluteUrl("/")).hostname, "www.studentplanlegger.no");
  });

  it("lists public indexable paths and omits checkout, thanks, and API", () => {
    const paths = indexablePaths();
    assert.ok(paths.includes("/"));
    assert.ok(paths.includes("/produkter"));
    assert.ok(paths.includes("/produkter?kategori=daglig"));
    assert.ok(paths.includes("/produkter?kategori=ukentlig"));
    assert.ok(paths.includes("/produkter?kategori=maanedlig"));
    assert.ok(paths.includes("/produkter?kategori=aarlig"));
    assert.ok(paths.includes("/produkter?kategori=produktivitet"));
    assert.ok(paths.includes("/produkter?kategori=helse"));
    assert.ok(paths.includes("/produkter?kategori=sporing"));
    assert.ok(paths.includes("/personvern"));
    assert.ok(paths.includes("/vilkar"));
    for (const path of guidePaths()) {
      assert.ok(paths.includes(path), `missing guide path ${path}`);
    }
    assert.ok(!paths.includes("/kasse"));
    assert.ok(!paths.includes("/takk"));
    assert.ok(paths.every((path) => !path.startsWith("/api")));
  });

  it("builds per-page metadata with matching canonical and og:url", () => {
    const meta = pageMeta({
      title: "Kjøpsvilkår — Studentplanlegger",
      description: "Kjøpsvilkår for fyllbare PDF-planleggere hos Studentplanlegger.",
      path: "/vilkar",
    });
    assert.equal(meta.alternates?.canonical, "https://www.studentplanlegger.no/vilkar");
    assert.equal(meta.openGraph?.url, "https://www.studentplanlegger.no/vilkar");
    assert.equal(meta.openGraph?.title, meta.title);
    assert.equal(meta.openGraph?.description, meta.description);
    assert.ok(meta.openGraph?.images);
  });

  it("disallows checkout and download routes from robots", () => {
    assert.ok(robotsDisallow.includes("/kasse"));
    assert.ok(robotsDisallow.includes("/takk"));
    assert.ok(robotsDisallow.includes("/api/"));
  });
});

describe("product catalog for crawlers", () => {
  it("returns every product for the unfiltered catalog", () => {
    const catalog = resolveCatalog(undefined);
    assert.equal(catalog.key, "alle");
    assert.equal(catalog.products.length, alleProdukter.length);
    assert.ok(catalog.products.some((product) => product.name === "Daglig Planlegger"));
    assert.ok(catalog.products.every((product) => product.price > 0));
  });

  it("returns a distinct product set for each linked category", () => {
    const namesByCategory = new Map<string, string[]>();
    for (const group of categoryGroups) {
      const catalog = resolveCatalog(group.key);
      assert.equal(catalog.key, group.key);
      assert.deepEqual(
        catalog.products.map((product) => product.id),
        group.products.map((product) => product.id),
      );
      namesByCategory.set(group.key, catalog.products.map((product) => product.name));
    }
    assert.notDeepEqual(namesByCategory.get("daglig"), namesByCategory.get("ukentlig"));
  });

  it("falls back to the full catalog for an unknown category", () => {
    const catalog = resolveCatalog("ukjent");
    assert.equal(catalog.key, "alle");
    assert.equal(catalog.products.length, alleProdukter.length);
  });

  it("gives each category a unique Norwegian title, description, and h1", () => {
    const keys = ["alle", ...categoryGroups.map((group) => group.key)];
    const titles = keys.map((key) => catalogTitle(key));
    const descriptions = keys.map((key) => catalogDescription(key));
    const headings = keys.map((key) => catalogHeading(key));
    assert.equal(new Set(titles).size, keys.length);
    assert.equal(new Set(descriptions).size, keys.length);
    assert.equal(new Set(headings).size, keys.length);
    for (const title of titles) {
      assert.match(title, /Studentplanlegger/);
    }
    for (const description of descriptions) {
      assert.ok(description.length >= 70);
    }
  });
});

describe("guide articles", () => {
  it("publishes three or four unique indexable guides", () => {
    assert.ok(guides.length >= 3 && guides.length <= 4);
    const slugs = guides.map((guide) => guide.slug);
    const titles = guides.map((guide) => guide.title);
    const descriptions = guides.map((guide) => guide.description);
    const headings = guides.map((guide) => guide.heading);
    assert.equal(new Set(slugs).size, guides.length);
    assert.equal(new Set(titles).size, guides.length);
    assert.equal(new Set(descriptions).size, guides.length);
    assert.equal(new Set(headings).size, guides.length);
    for (const title of titles) {
      assert.match(title, /Studentplanlegger/);
    }
    for (const description of descriptions) {
      assert.ok(description.length >= 70);
    }
  });

  it("links each guide to a product and category that already exist", () => {
    for (const guide of guides) {
      assert.ok(assertGuideCatalog(guide), guide.slug);
      const product = guideProduct(guide);
      assert.ok(product);
      assert.equal(guideProductHref(guide), `/produkter?kategori=${guide.catalogKey}`);
      assert.ok(guide.productCta.length > 0);
      assert.ok(guide.productLead.includes(product.name));
    }
    assert.ok(getGuide("planlegg-studiedagen"));
    assert.equal(guidePath("planlegg-studiedagen"), "/guider/planlegg-studiedagen");
    const catalogKeys = new Set(guides.map((guide) => guide.catalogKey));
    assert.deepEqual([...catalogKeys].sort(), [
      "daglig",
      "produktivitet",
      "sporing",
      "ukentlig",
    ]);
  });

  it("gives each guide a www canonical and matching og:url", () => {
    for (const guide of guides) {
      const meta = pageMeta({
        title: guide.title,
        description: guide.description,
        path: guidePath(guide.slug),
      });
      const url = `https://www.studentplanlegger.no/guider/${guide.slug}`;
      assert.equal(meta.alternates.canonical, url);
      assert.equal(meta.openGraph.url, url);
    }
  });

  it("does not invent prices, reviews, or ratings", () => {
    const catalogPrices = new Set(
      [...alleProdukter, ...pakker].flatMap((item) => {
        const prices = [item.price];
        if ("originalPrice" in item) prices.push(item.originalPrice);
        return prices;
      }),
    );
    const copy = guides
      .flatMap((guide) => [
        guide.title,
        guide.description,
        guide.heading,
        guide.summary,
        guide.productLead,
        guide.productCta,
        ...guide.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
      ])
      .join("\n");

    assert.equal(/anmeldelse|stjerner|rating|anmelder/i.test(copy), false);
    const mentionedPrices = [...copy.matchAll(/(\d+)\s*kr/gi)].map((match) => Number(match[1]));
    for (const price of mentionedPrices) {
      assert.ok(catalogPrices.has(price), `unknown price ${price}`);
    }
  });
});

describe("structured data", () => {
  it("describes the real organization without inventing social profiles", () => {
    const org = organizationJsonLd();
    assert.equal(org["@type"], "Organization");
    assert.equal(org.name, "Studentplanlegger");
    assert.equal(org.legalName, "Studentplanlegger Davidson");
    assert.equal(org.url, SITE_ORIGIN);
    assert.equal(org.email, "hei@studentplanlegger.no");
    assert.equal(org.identifier.value, "937416156");
    assert.equal("sameAs" in org, false);
  });

  it("describes the website on the www host", () => {
    const site = websiteJsonLd();
    assert.equal(site["@type"], "WebSite");
    assert.equal(site.url, SITE_ORIGIN);
    assert.equal(site.inLanguage, "nb-NO");
  });

  it("emits Product/Offer JSON-LD from catalog prices only", () => {
    const komplett = pakker.find((bundle) => bundle.featured);
    assert.ok(komplett);
    const product = productOfferJsonLd(komplett);
    assert.equal(product["@type"], "Product");
    assert.equal(product.name, komplett.name);
    assert.equal(product.offers["@type"], "Offer");
    assert.equal(product.offers.price, komplett.price);
    assert.equal(product.offers.priceCurrency, "NOK");
    assert.ok(typeof product.image === "string" && product.image.startsWith(SITE_ORIGIN));
    assert.equal("aggregateRating" in product, false);
    assert.equal("review" in product, false);
  });

  it("lists visible catalog products with their real prices", () => {
    const daglig = resolveCatalog("daglig");
    const list = productListJsonLd(daglig);
    assert.equal(list["@type"], "ItemList");
    assert.equal(list.numberOfItems, daglig.products.length);
    assert.equal(list.itemListElement.length, daglig.products.length);
    assert.equal(list.itemListElement[0].item.offers.price, daglig.products[0].price);
    assert.ok(
      String(list.itemListElement[0].item.image).endsWith(
        `/images/products/${daglig.products[0].image}`,
      ),
    );
    assert.equal("@context" in list.itemListElement[0].item, false);
  });

  it("builds FAQPage JSON-LD from the homepage questions", () => {
    const faq = faqPageJsonLd(faqItems);
    assert.equal(faq["@type"], "FAQPage");
    assert.equal(faq.mainEntity.length, faqItems.length);
    assert.equal(faq.mainEntity[0].name, faqItems[0].question);
    assert.equal(faq.mainEntity[0].acceptedAnswer.text, faqItems[0].answer);
  });
});
