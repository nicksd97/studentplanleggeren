import { currencyForCountry, defaultCurrencyForLocale, parseCurrency, type Currency } from "../currency";
import { isLocale, isPrefixedPath, localeFromPathname, localizePath, type Locale } from "./config";

// Pure decision logic for proxy.ts: should this request for an unprefixed (Bokmål) page be
// sent to its twin in another language, and which currency cookie should it get? Kept free of
// Next imports so it is unit-testable.

export const NORWEGIAN_COUNTRIES = new Set(["NO", "SJ", "BV"]);
const SWEDISH_COUNTRIES = new Set(["SE"]);
const DANISH_COUNTRIES = new Set(["DK", "GL", "FO"]);
const GERMAN_COUNTRIES = new Set(["DE", "AT", "LI"]);
/** Spain and Spanish-speaking Latin America. */
export const SPANISH_COUNTRIES = new Set([
  "ES", "MX", "AR", "CO", "CL", "PE", "VE", "EC", "GT", "CU", "BO", "DO", "HN", "PY", "SV",
  "NI", "CR", "PA", "UY", "PR",
]);
/** France, Monaco and francophone countries and territories. */
export const FRENCH_COUNTRIES = new Set([
  "FR", "MC", "SN", "CI", "ML", "BF", "NE", "TG", "BJ", "GA", "CG", "CD", "CM", "MG", "HT",
  "RE", "GP", "MQ", "GF", "YT", "PF", "NC",
]);

/** Headers a geo/language decision depends on; sent as Vary on unprefixed pages. */
export const LOCALE_VARY = "Cookie, Accept-Language, x-vercel-ip-country";

const BOT_PATTERN = new RegExp(
  [
    "googlebot",
    "google-inspectiontool",
    "bingbot",
    "slurp",
    "duckduckbot",
    "baiduspider",
    "yandex",
    "applebot",
    "facebookexternalhit",
    "twitterbot",
    "linkedinbot",
    "slackbot",
    "discordbot",
    "whatsapp",
    "telegrambot",
    "petalbot",
    "semrush",
    "ahrefs",
    "mj12bot",
    "gptbot",
    "chatgpt",
    "oai-searchbot",
    "claudebot",
    "perplexity",
    "ccbot",
    "lighthouse",
    "headless",
    "bot",
    "crawl",
    "spider",
    "preview",
  ].join("|"),
  "i",
);

export function isBot(userAgent: string | null | undefined): boolean {
  const ua = userAgent?.trim() ?? "";
  return ua === "" || BOT_PATTERN.test(ua);
}

/** Paths the proxy never touches, even if the matcher lets them through. */
export function isExcludedPath(pathname: string): boolean {
  return (
    pathname === "/api" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.[^/]+$/.test(pathname)
  );
}

/** Primary language subtag: "de-CH" -> "de", "NB" -> "nb". */
function primary(tag: string): string {
  return tag.split("-")[0].toLowerCase();
}

const TAG_LOCALE: Record<string, Locale> = {
  nb: "nb",
  nn: "nb",
  no: "nb",
  en: "en",
  de: "de",
  sv: "sv",
  da: "da",
  es: "es",
  fr: "fr",
};

/** Parses Accept-Language into tags ordered by preference (q desc, then header order). */
export function parseAcceptLanguage(header: string | null | undefined): string[] {
  if (!header) return [];
  return header
    .split(",")
    .map((part, index) => {
      const [rawTag, ...params] = part.trim().split(";");
      const tag = rawTag.trim().toLowerCase();
      let q = 1;
      for (const param of params) {
        const [key, value] = param.trim().split("=");
        if (key === "q") {
          const parsed = Number(value);
          q = Number.isFinite(parsed) ? parsed : 0;
        }
      }
      return { tag, q, index };
    })
    .filter((entry) => entry.tag !== "" && entry.tag !== "*" && entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index)
    .map((entry) => entry.tag);
}

/**
 * The visitor's most preferred language among `candidates` (primary subtags), or null when the
 * header names none of them.
 */
export function preferredLanguage(
  header: string | null | undefined,
  candidates: readonly string[],
): string | null {
  for (const tag of parseAcceptLanguage(header)) {
    const language = primary(tag);
    if (candidates.includes(language)) return language;
  }
  return null;
}

/**
 * Locale from Accept-Language alone (no country known): the first supported language wins
 * (nb/nn/no -> nb), anything else -> en. null when the header is absent or empty.
 */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale | null {
  const tags = parseAcceptLanguage(header);
  if (tags.length === 0) return null;
  for (const tag of tags) {
    const locale = TAG_LOCALE[primary(tag)];
    if (locale) return locale;
  }
  return "en";
}

/** Site language for a visitor's country; Accept-Language settles multilingual countries. */
export function localeForCountry(country: string, acceptLanguage?: string | null): Locale {
  const code = country.trim().toUpperCase();
  if (NORWEGIAN_COUNTRIES.has(code)) return "nb";
  if (SWEDISH_COUNTRIES.has(code)) return "sv";
  if (DANISH_COUNTRIES.has(code)) return "da";
  if (GERMAN_COUNTRIES.has(code)) return "de";
  if (code === "CH") {
    return preferredLanguage(acceptLanguage, ["de", "fr"]) === "fr" ? "fr" : "de";
  }
  if (code === "LU") {
    const language = preferredLanguage(acceptLanguage, ["fr", "de", "nl", "en"]);
    if (language === "de") return "de";
    if (language === "nl" || language === "en") return "en";
    return "fr";
  }
  if (code === "BE" || code === "CA") {
    return preferredLanguage(acceptLanguage, ["fr", "de", "nl", "en"]) === "fr" ? "fr" : "en";
  }
  if (SPANISH_COUNTRIES.has(code)) return "es";
  if (FRENCH_COUNTRIES.has(code)) return "fr";
  return "en";
}

export interface LocaleRequest {
  method: string;
  pathname: string;
  /** Raw query string including "?", or "". */
  search: string;
  cookieLocale: string | null | undefined;
  userAgent: string | null | undefined;
  country: string | null | undefined;
  acceptLanguage: string | null | undefined;
}

export type LocaleDecision =
  | { action: "redirect"; location: string; locale: Locale; reason: string }
  | { action: "next"; vary: boolean; locale: Locale; reason: string };

export function decideLocale(request: LocaleRequest): LocaleDecision {
  const pathLocale = localeFromPathname(request.pathname);
  const next = (vary: boolean, reason: string): LocaleDecision => ({
    action: "next",
    vary,
    locale: pathLocale,
    reason,
  });

  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD") return next(false, "method");
  if (isExcludedPath(request.pathname)) return next(false, "excluded");
  // An explicitly requested language (/en, /de, …) is always served, never redirected.
  if (isPrefixedPath(request.pathname)) return next(false, "prefixed-path");

  const to = (locale: Locale, reason: string): LocaleDecision =>
    locale === "nb"
      ? next(true, reason)
      : {
          action: "redirect",
          location: `${localizePath(request.pathname, locale)}${request.search}`,
          locale,
          reason,
        };

  // A language the visitor picked in the language menu always wins.
  const cookie = request.cookieLocale?.trim().toLowerCase();
  if (isLocale(cookie)) return to(cookie, "cookie");

  if (isBot(request.userAgent)) return next(true, "bot");

  const country = request.country?.trim().toUpperCase();
  if (country) return to(localeForCountry(country, request.acceptLanguage), "country");

  const fromHeader = localeFromAcceptLanguage(request.acceptLanguage);
  if (fromHeader) return to(fromHeader, "accept-language");
  return next(true, "default");
}

/**
 * Currency cookie value proxy.ts should set, or null to leave it alone: never overrides a
 * valid existing cookie; otherwise the visitor's country decides, then the page language.
 */
export function currencyCookieToSet({
  existing,
  country,
  locale,
}: {
  existing: string | null | undefined;
  country: string | null | undefined;
  locale: Locale;
}): Currency | null {
  if (parseCurrency(existing)) return null;
  return currencyForCountry(country) ?? defaultCurrencyForLocale(locale);
}
