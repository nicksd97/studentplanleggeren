import { localizePath, type Locale } from "../i18n/config";
import { SITE_EMAIL, SITE_ORIGIN } from "../site";

// Every link in a subscriber email points at the page in the subscriber's language:
// Bokmål unprefixed, everything else under /<lang> (same slugs, see app/(intl)/[lang]/).

const UTM = "utm_source=epost&utm_medium=email&utm_campaign=gratis-ukeplan";

/** Absolute URL of `path` in `locale`. The Bokmål front page is the bare origin. */
export function siteUrl(path: string, locale: Locale): string {
  const localized = localizePath(path, locale);
  return localized === "/" ? SITE_ORIGIN : `${SITE_ORIGIN}${localized}`;
}

export function emailLinks(locale: Locale) {
  return {
    site: siteUrl("/", locale),
    ukentligPlan: siteUrl(`/produkter?kategori=ukentlig&${UTM}&utm_content=ukentlig-plan`, locale),
    komplett: siteUrl(`/?${UTM}&utm_content=komplett#pakker`, locale),
    privacy: siteUrl("/personvern", locale),
    /** Welcome-series buttons. The live Bokmål templates link the bare front page. */
    packages: locale === "nb" ? SITE_ORIGIN : siteUrl("/#pakker", locale),
  };
}

export function unsubscribeMailto(subject: string): string {
  return `mailto:${SITE_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
