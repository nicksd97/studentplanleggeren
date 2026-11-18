// Pure locale helpers, shared by proxy.ts, server components, client components and tests.
// Bokmål lives at the unprefixed URLs; English mirrors every page under /en.

export const locales = ["nb", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "nb";
export const EN_PREFIX = "/en";

/** Set by the language switcher; read by proxy.ts. */
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
/** Request header proxy.ts sets so app/global-not-found.tsx knows the path's language. */
export const LOCALE_REQUEST_HEADER = "x-sp-locale";

export const htmlLang: Record<Locale, string> = { nb: "nb", en: "en" };
export const ogLocale: Record<Locale, string> = { nb: "nb_NO", en: "en_GB" };

export function isLocale(value: unknown): value is Locale {
  return value === "nb" || value === "en";
}

export function isEnglishPath(pathname: string): boolean {
  return pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`);
}

export function localeFromPathname(pathname: string | null | undefined): Locale {
  return pathname && isEnglishPath(pathname) ? "en" : "nb";
}

/** "/en/produkter" -> "/produkter", "/en" -> "/", "/gratis" -> "/gratis". */
export function stripLocalePrefix(pathname: string): string {
  if (!isEnglishPath(pathname)) return pathname || "/";
  const rest = pathname.slice(EN_PREFIX.length);
  return rest === "" ? "/" : rest;
}

/**
 * Maps a Bokmål href (path, optional ?query and #hash) to the same page in `locale`.
 * External URLs, mailto: and bare #hash links are returned unchanged.
 */
export function localizePath(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const match = /^([^?#]*)(.*)$/.exec(href);
  const pathname = match?.[1] || "/";
  const suffix = match?.[2] ?? "";
  const base = stripLocalePrefix(pathname);
  if (locale === "nb") return `${base}${suffix}`;
  return `${base === "/" ? EN_PREFIX : `${EN_PREFIX}${base}`}${suffix}`;
}

/** Bokmål and English URLs for one page, plus x-default (Bokmål). */
export function languageAlternates(
  path: string,
  toAbsolute: (path: string) => string,
): Record<"nb" | "en" | "x-default", string> {
  const nb = toAbsolute(localizePath(path, "nb"));
  return {
    nb,
    en: toAbsolute(localizePath(path, "en")),
    "x-default": nb,
  };
}
