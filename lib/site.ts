import { categoryGroups } from "./products.ts";

export interface PageMeta {
  title: string;
  description: string;
  alternates: { canonical: string };
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
