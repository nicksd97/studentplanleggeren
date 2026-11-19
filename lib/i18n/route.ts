import { notFound } from "next/navigation";
import { isPrefixedLocale, prefixedLocales, type PrefixedLocale } from "./config";

// Helpers for the app/(intl)/[lang] routes (every language except Bokmål).

export type LangParams = { params: Promise<{ lang: string }> };

export function langStaticParams(): { lang: PrefixedLocale }[] {
  return prefixedLocales.map((lang) => ({ lang }));
}

/** The route's language; 404 for anything that isn't a prefixed locale. */
export async function routeLocale(params: Promise<{ lang: string }>): Promise<PrefixedLocale> {
  const { lang } = await params;
  if (!isPrefixedLocale(lang)) notFound();
  return lang;
}
