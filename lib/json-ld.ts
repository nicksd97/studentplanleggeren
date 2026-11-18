import { FIVE_PACK_PRICE, type Bundle, type Product } from "./products";
import type { Catalog } from "./catalog";
import { catalogPath } from "./catalog";
import type { faqItems } from "./faq";
import { localizePath, type Locale } from "./i18n/config";
import { localizeBundle, localizeProduct } from "./i18n/products";
import {
  LEGAL_NAME,
  OG_IMAGE_PATH,
  ORG_NUMBER,
  SITE_EMAIL,
  SITE_NAME,
  SITE_ORIGIN,
  absoluteUrl,
} from "./site";

type JsonLd = Record<string, unknown>;

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    url: SITE_ORIGIN,
    email: SITE_EMAIL,
    logo: absoluteUrl("/images/brand/Studentplanlegger_Logo.png"),
    identifier: {
      "@type": "PropertyValue",
      name: "Organisasjonsnummer",
      value: ORG_NUMBER,
    },
  };
}

export function websiteJsonLd(locale: Locale = "nb"): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    name: SITE_NAME,
    url: SITE_ORIGIN,
    inLanguage: locale === "en" ? ["nb-NO", "en"] : "nb-NO",
    publisher: {
      "@id": `${SITE_ORIGIN}/#organization`,
    },
  };
}

export function productOfferJsonLd(
  item: Bundle | Product,
  path = "/#pakker",
  options: { includeContext?: boolean; locale?: Locale } = {},
): JsonLd {
  const includeContext = options.includeContext ?? true;
  const locale = options.locale ?? "nb";
  const localized =
    "productIds" in item ? localizeBundle(item, locale) : localizeProduct(item, locale);
  const image =
    "image" in item && typeof item.image === "string"
      ? absoluteUrl(`/images/products/${item.image}`)
      : absoluteUrl(OG_IMAGE_PATH);

  return {
    ...(includeContext ? { "@context": "https://schema.org" } : {}),
    "@type": "Product",
    name: localized.name,
    description: localized.description,
    image,
    offers: {
      "@type": "Offer",
      price: item.price,
      priceCurrency: "NOK",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`${localizePath(path, locale)}#${item.slug}`),
    },
  };
}

export function fivePackOfferJsonLd(locale: Locale = "nb"): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: locale === "en" ? "5-pack" : "5-pakke",
    description:
      locale === "en"
        ? "Choose any five single planners and pay NOK 99. The planners are in Norwegian (Bokmål)."
        : "Velg fem enkeltplanleggere og betal 99 kr.",
    image: absoluteUrl(OG_IMAGE_PATH),
    offers: {
      "@type": "Offer",
      price: FIVE_PACK_PRICE,
      priceCurrency: "NOK",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(localizePath("/produkter", locale)),
    },
  };
}

export function productListJsonLd(catalog: Catalog, locale: Locale = "nb"): JsonLd {
  const path = catalogPath(catalog.key);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: catalog.products.length,
    itemListElement: catalog.products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: productOfferJsonLd(product, path, { includeContext: false, locale }),
    })),
  };
}

export function faqPageJsonLd(items: typeof faqItems): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
