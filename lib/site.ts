import { guidePaths } from "./guides";
import { categoryGroups } from "./products";

export interface PageMeta {
  title: string;
  description: string;
  alternates: { canonical: string; types: Record<string, string> };
  openGraph: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    locale: string;
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

export const robotsDisallow = ["/kasse", "/takk", "/api/"];

export const LLMS_TXT_PATH = "/llms.txt";
export const LLMS_FULL_TXT_PATH = "/llms-full.txt";

// Search and AI crawlers we want to read the shop, for both training and live answers.
// A named group replaces the `*` group for that bot, so each one gets the same disallows.
export const allowedCrawlers = [
  "Googlebot",
  "Bingbot",
  "Google-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Applebot",
  "Applebot-Extended",
];

export function robotsRules(): { userAgent: string | string[]; allow: string; disallow: string[] }[] {
  return [
    { userAgent: "*", allow: "/", disallow: robotsDisallow },
    { userAgent: allowedCrawlers, allow: "/", disallow: robotsDisallow },
  ];
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

export function pageMeta({
  title,
  description,
  path,
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
}): PageMeta {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      types: { "text/plain": absoluteUrl(LLMS_TXT_PATH) },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "nb_NO",
      type: "website",
      images: [
        {
          url: OG_IMAGE_PATH,
          alt: OG_IMAGE_ALT,
        },
      ],
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}
