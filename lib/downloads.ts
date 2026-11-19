import { hasTranslatedPdfs, isLocale, type Locale } from "./i18n/config";
import { getFilesForItems } from "./product-files";

// PDF delivery in the buyer's language. Storage layout in the "products" bucket:
//   Bokmål:        planners/<slug>.pdf                     leads/gratis-ukentlig-plan-smakebit.pdf
//   translations:  planners/<lang>/<slug>.pdf              leads/<lang>/gratis-ukentlig-plan-smakebit.pdf
// A missing translation falls back to the Bokmål file.

/** "planners/daglig-planlegger.pdf" + "de" -> "planners/de/daglig-planlegger.pdf". */
export function localizedStoragePath(path: string, locale: Locale): string {
  if (locale === "nb" || !hasTranslatedPdfs(locale)) return path;
  const slash = path.lastIndexOf("/");
  return slash === -1 ? `${locale}/${path}` : `${path.slice(0, slash)}/${locale}${path.slice(slash)}`;
}

/** Language to deliver: a valid ?lang= from the download page, else the order's, else Bokmål. */
export function downloadLocale(param: unknown, orderLocale: unknown): Locale {
  if (isLocale(param)) return param;
  if (isLocale(orderLocale)) return orderLocale;
  return "nb";
}

/** Only files that belong to the order's items can be downloaded with its token. */
export function isOrderFile(file: string, items: unknown): boolean {
  if (!Array.isArray(items)) return false;
  const valid = items.filter(
    (item): item is { id: string; type: string } =>
      Boolean(item) && typeof item.id === "string" && typeof item.type === "string",
  );
  return getFilesForItems(valid).includes(file);
}

/** Returns a signed URL for `path`, or null if the object can't be signed (e.g. doesn't exist). */
export type SignStoragePath = (path: string) => Promise<string | null>;

/**
 * Signs the file in `locale`, falling back to the Bokmål object when the translated one is
 * missing. Returns which path was used, or null if neither could be signed.
 */
export async function signLocalizedPath(
  path: string,
  locale: Locale,
  sign: SignStoragePath,
): Promise<{ url: string; path: string } | null> {
  const localized = localizedStoragePath(path, locale);
  if (localized !== path) {
    const url = await sign(localized).catch(() => null);
    if (url) return { url, path: localized };
  }
  const url = await sign(path).catch(() => null);
  return url ? { url, path } : null;
}
