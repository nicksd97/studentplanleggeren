// Pure locale helpers, shared by proxy.ts, server components, client components and tests.
// Bokmål lives at the unprefixed URLs; every other language mirrors each page under /<lang>.

export const locales = ["nb", "en", "de", "sv", "da", "es", "fr"] as const;
export type Locale = (typeof locales)[number];

/** Languages served under a /<lang> prefix (everything except Bokmål). */
export const prefixedLocales = ["en", "de", "sv", "da", "es", "fr"] as const;
export type PrefixedLocale = (typeof prefixedLocales)[number];

export const defaultLocale: Locale = "nb";

/**
 * Languages the planner PDFs (and the free sample) exist in. Product copy says the planners
 * come in the visitor's language when it is listed here, and that they are in Norwegian
 * (Bokmål) otherwise. Downloads fall back to the Bokmål file if a translation is missing.
 */
export const PDF_LANGUAGES_AVAILABLE: readonly Locale[] = ["nb", "en", "de", "sv", "da", "es", "fr"];

export function hasTranslatedPdfs(locale: Locale): boolean {
  return PDF_LANGUAGES_AVAILABLE.includes(locale);
}

/** Set by the language switcher; read by proxy.ts. */
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
/** Request header proxy.ts sets so app/global-not-found.tsx knows the path's language. */
export const LOCALE_REQUEST_HEADER = "x-sp-locale";

export const htmlLang: Record<Locale, string> = {
  nb: "nb",
  en: "en",
  de: "de",
  sv: "sv",
  da: "da",
  es: "es",
  fr: "fr",
};

export const ogLocale: Record<Locale, string> = {
  nb: "nb_NO",
  en: "en_GB",
  de: "de_DE",
  sv: "sv_SE",
  da: "da_DK",
  es: "es_ES",
  fr: "fr_FR",
};

/** Language names in their own language, for the language menu. */
export const localeNames: Record<Locale, string> = {
  nb: "Norsk",
  en: "English",
  de: "Deutsch",
  sv: "Svenska",
  da: "Dansk",
  es: "Español",
  fr: "Français",
};

/** BCP 47 tags for dates and JSON-LD. */
export const localeTags: Record<Locale, string> = {
  nb: "nb-NO",
  en: "en-GB",
  de: "de-DE",
  sv: "sv-SE",
  da: "da-DK",
  es: "es-ES",
  fr: "fr-FR",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function isPrefixedLocale(value: unknown): value is PrefixedLocale {
  return typeof value === "string" && (prefixedLocales as readonly string[]).includes(value);
}

/** "/de/produkter" -> "de", "/de" -> "de", "/produkter" or "/deutsch" -> null. */
export function pathLocalePrefix(pathname: string | null | undefined): PrefixedLocale | null {
  if (!pathname) return null;
  const segment = pathname.split("/")[1] ?? "";
  return isPrefixedLocale(segment) ? segment : null;
}

export function isPrefixedPath(pathname: string): boolean {
  return pathLocalePrefix(pathname) !== null;
}

export function localeFromPathname(pathname: string | null | undefined): Locale {
  return pathLocalePrefix(pathname) ?? "nb";
}

/** "/de/produkter" -> "/produkter", "/en" -> "/", "/gratis" -> "/gratis". */
export function stripLocalePrefix(pathname: string): string {
  const prefix = pathLocalePrefix(pathname);
  if (!prefix) return pathname || "/";
  const rest = pathname.slice(prefix.length + 1);
  return rest === "" ? "/" : rest;
}

/**
 * Maps a href (path, optional ?query and #hash) in any language to the same page in `locale`.
 * External URLs, mailto: and bare #hash links are returned unchanged.
 */
export function localizePath(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const match = /^([^?#]*)(.*)$/.exec(href);
  const pathname = match?.[1] || "/";
  const suffix = match?.[2] ?? "";
  const base = stripLocalePrefix(pathname);
  if (locale === "nb") return `${base}${suffix}`;
  return `${base === "/" ? `/${locale}` : `/${locale}${base}`}${suffix}`;
}

export type LanguageAlternates = Record<Locale | "x-default", string>;

/** Every language version of one page, plus x-default (Bokmål). */
export function languageAlternates(
  path: string,
  toAbsolute: (path: string) => string,
): LanguageAlternates {
  const alternates = {} as LanguageAlternates;
  for (const locale of locales) {
    alternates[locale] = toAbsolute(localizePath(path, locale));
  }
  alternates["x-default"] = alternates.nb;
  return alternates;
}
