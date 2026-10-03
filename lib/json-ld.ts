import type { Bundle, Product } from "./products";
import type { Catalog } from "./catalog";
import { catalogPath } from "./catalog";
import type { faqItems } from "./faq";
import {
  LEGAL_NAME,
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

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    name: SITE_NAME,
    url: SITE_ORIGIN,
    inLanguage: "nb-NO",
    publisher: {
      "@id": `${SITE_ORIGIN}/#organization`,
    },
  };
}

export function productOfferJsonLd(
  item: Bundle | Product,
  path = "/#pakker",
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    description: item.description,
    offers: {
      "@type": "Offer",
      price: item.price,
      priceCurrency: "NOK",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(path),
    },
  };
}

export function productListJsonLd(catalog: Catalog): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: catalog.products.length,
    itemListElement: catalog.products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: productOfferJsonLd(product, catalogPath(catalog.key)),
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
