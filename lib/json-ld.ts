import { FIVE_PACK_PRICE, type Bundle, type Product } from "./products";
import type { Catalog } from "./catalog";
import { catalogPath } from "./catalog";
import type { faqItems } from "./faq";
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
  options: { includeContext?: boolean } = {},
): JsonLd {
  const includeContext = options.includeContext ?? true;
  const image =
    "image" in item && typeof item.image === "string"
      ? absoluteUrl(`/images/products/${item.image}`)
      : absoluteUrl(OG_IMAGE_PATH);

  return {
    ...(includeContext ? { "@context": "https://schema.org" } : {}),
    "@type": "Product",
    name: item.name,
    description: item.description,
    image,
    offers: {
      "@type": "Offer",
      price: item.price,
      priceCurrency: "NOK",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`${path}#${item.slug}`),
    },
  };
}

export function fivePackOfferJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "5-pakke",
    description: "Velg fem enkeltplanleggere og betal 99 kr.",
    image: absoluteUrl(OG_IMAGE_PATH),
    offers: {
      "@type": "Offer",
      price: FIVE_PACK_PRICE,
      priceCurrency: "NOK",
      availability: "https://schema.org/InStock",
      url: absoluteUrl("/produkter"),
    },
  };
}

export function productListJsonLd(catalog: Catalog): JsonLd {
  const path = catalogPath(catalog.key);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: catalog.products.length,
    itemListElement: catalog.products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: productOfferJsonLd(product, path, { includeContext: false }),
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
