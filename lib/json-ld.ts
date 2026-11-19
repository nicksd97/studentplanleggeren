import { FIVE_PACK_PRICE, type Bundle, type Product } from "./products";
import type { Catalog } from "./catalog";
import { catalogPath } from "./catalog";
import {
  defaultCurrencyForLocale,
  fillPrices,
  minorToDecimal,
  priceMinor,
  type Currency,
} from "./currency";
import type { FaqItem } from "./faq";
import { getContent } from "./i18n/content/index";
import { localeTags, localizePath, type Locale } from "./i18n/config";
import { getMessages } from "./i18n/messages/index";
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

/**
 * Offer price in the page language's default currency (pages are static, so this is what the
 * server renders). NOK keeps whole-krone numbers as before; other currencies use decimals.
 */
function offerPrice(nokPrice: number, currency: Currency) {
  return {
    price: currency === "NOK" ? nokPrice : minorToDecimal(priceMinor(nokPrice, currency)),
    priceCurrency: currency,
  };
}

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
    inLanguage: locale === "nb" ? "nb-NO" : localeTags[locale],
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
  const messages = getMessages(locale);
  const localized =
    "productIds" in item ? localizeBundle(item, messages) : localizeProduct(item, messages);
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
      ...offerPrice(item.price, defaultCurrencyForLocale(locale)),
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`${localizePath(path, locale)}#${item.slug}`),
    },
  };
}

export function fivePackOfferJsonLd(locale: Locale = "nb"): JsonLd {
  const currency = defaultCurrencyForLocale(locale);
  const copy =
    locale === "nb"
      ? { name: "5-pakke", description: "Velg fem enkeltplanleggere og betal 99 kr." }
      : getContent(locale).fivePack;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: copy.name,
    description: fillPrices(copy.description, currency, locale),
    image: absoluteUrl(OG_IMAGE_PATH),
    offers: {
      "@type": "Offer",
      ...offerPrice(FIVE_PACK_PRICE, currency),
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

export function faqPageJsonLd(items: FaqItem[], locale: Locale = "nb"): JsonLd {
  const currency = defaultCurrencyForLocale(locale);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: fillPrices(item.answer, currency, locale),
      },
    })),
  };
}
