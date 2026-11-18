import type { MetadataRoute } from "next";
import { guidePaths } from "./guides";
import { defaultCurrencyForLocale, fillPrices } from "./currency";
import { getContent } from "./i18n/content/index";
import {
  languageAlternates,
  localizePath,
  locales,
  ogLocale,
  prefixedLocales,
  type Locale,
} from "./i18n/config";
import { categoryGroups } from "./products";

export interface PageMeta {
  title: string;
  description: string;
  alternates: { canonical: string; languages?: Record<string, string> };
  openGraph: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    locale: string;
    alternateLocale?: string[];
    type: "website";
    images: { url: string; alt: string }[];
  };
  robots: { index: boolean; follow: boolean };
}

export const SITE_ORIGIN = "https://www.studentplanlegger.no";
export const SITE_NAME = "Studentplanlegger";
export const SITE_EMAIL = "hei@studentplanlegger.no";
export const LEGAL_NAME = "Studentplanlegger Davidson";
export const ORG_NUMBER = "937416156";
export const OG_IMAGE_PATH = "/images/cover.png";
export const OG_IMAGE_ALT = "Studentplanlegger — 25 fyllbare PDF-planleggere";

export const robotsDisallow = [
  "/kasse",
  "/takk",
  "/api/",
  ...prefixedLocales.flatMap((locale) => [`/${locale}/kasse`, `/${locale}/takk`]),
];

export function ogImageAlt(locale: Locale): string {
  return locale === "nb" ? OG_IMAGE_ALT : getContent(locale).meta.ogImageAlt;
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalized === "/" ? "/" : normalized}`;
}

export function indexablePaths(): string[] {
  return [
    "/",
    "/produkter",
    ...categoryGroups.map((group) => `/produkter?kategori=${group.key}`),
    ...guidePaths(),
    "/gratis",
    "/personvern",
    "/vilkar",
  ];
}

function sitemapPriority(path: string): number {
  return path === "/"
    ? 1
    : path.startsWith("/produkter")
      ? 0.8
      : path === "/gratis"
        ? 0.7
        : path.startsWith("/guider")
          ? 0.6
          : 0.4;
}

/** One sitemap entry per page and language, each listing every language version (hreflang). */
export function sitemapEntries(): MetadataRoute.Sitemap {
  return indexablePaths().flatMap((path) => {
    const languages = languageAlternates(path, absoluteUrl);
    return locales.map((locale) => ({
      url: absoluteUrl(localizePath(path, locale)),
      changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: sitemapPriority(path),
      alternates: { languages },
    }));
  });
}

export function pageMeta({
  title,
  description,
  path,
  index = true,
  locale = "nb",
}: {
  title: string;
  description: string;
  /** The Bokmål path; other languages pass the same path with their locale. */
  path: string;
  index?: boolean;
  locale?: Locale;
}): PageMeta {
  const url = absoluteUrl(localizePath(path, locale));
  // Metadata is static, so prices in it use the language's default currency.
  description = fillPrices(description, defaultCurrencyForLocale(locale), locale);
  return {
    title,
    description,
    alternates: index
      ? { canonical: url, languages: languageAlternates(path, absoluteUrl) }
      : { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((other) => other !== locale).map((other) => ogLocale[other]),
      type: "website",
      images: [
        {
          url: OG_IMAGE_PATH,
          alt: ogImageAlt(locale),
        },
      ],
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}
