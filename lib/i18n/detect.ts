import { isEnglishPath, localizePath } from "./config";

// Pure decision logic for proxy.ts: should this request for an unprefixed (Bokmål)
// page be sent to its /en twin? Kept free of Next imports so it is unit-testable.

export const NORWEGIAN_COUNTRIES = new Set(["NO", "SJ", "BV"]);

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

function isNorwegianTag(tag: string): boolean {
  const primary = tag.split("-")[0];
  return primary === "nb" || primary === "nn" || primary === "no";
}

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
 * "nb" when Norwegian is the top preference or ranks above English, "en" when the
 * visitor clearly prefers another language, null when the header is absent/unclear.
 */
export function localeFromAcceptLanguage(header: string | null | undefined): "nb" | "en" | null {
  const tags = parseAcceptLanguage(header);
  if (tags.length === 0) return null;
  const norwegian = tags.findIndex(isNorwegianTag);
  if (norwegian === 0) return "nb";
  const english = tags.findIndex((tag) => tag.split("-")[0] === "en");
  if (norwegian !== -1 && (english === -1 || norwegian < english)) return "nb";
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
  | { action: "redirect"; location: string; reason: string }
  | { action: "next"; vary: boolean; reason: string };

export function decideLocale(request: LocaleRequest): LocaleDecision {
  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    return { action: "next", vary: false, reason: "method" };
  }
  if (isExcludedPath(request.pathname)) {
    return { action: "next", vary: false, reason: "excluded" };
  }
  // An explicitly requested English page is always served.
  if (isEnglishPath(request.pathname)) {
    return { action: "next", vary: false, reason: "english-path" };
  }

  const toEnglish = (reason: string): LocaleDecision => ({
    action: "redirect",
    location: `${localizePath(request.pathname, "en")}${request.search}`,
    reason,
  });

  const cookie = request.cookieLocale?.trim().toLowerCase();
  if (cookie === "en") return toEnglish("cookie");
  if (cookie === "nb") return { action: "next", vary: true, reason: "cookie" };

  if (isBot(request.userAgent)) {
    return { action: "next", vary: true, reason: "bot" };
  }

  const country = request.country?.trim().toUpperCase();
  if (country) {
    if (NORWEGIAN_COUNTRIES.has(country)) {
      return { action: "next", vary: true, reason: "country" };
    }
    return toEnglish("country");
  }

  if (localeFromAcceptLanguage(request.acceptLanguage) === "en") {
    return toEnglish("accept-language");
  }
  return { action: "next", vary: true, reason: "default" };
}
