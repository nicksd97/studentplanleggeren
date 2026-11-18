import type { PrefixedLocale } from "../config";
import { da } from "./da";
import { de } from "./de";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { sv } from "./sv";
import type { Content } from "./types";

// Server-only page content for the prefixed languages. Bokmål content lives where it always
// has: the page files in app/(nb), lib/guides.ts, lib/faq.ts and lib/catalog.ts.

export const contents: Record<PrefixedLocale, Content> = { en, de, sv, da, es, fr };

export function getContent(locale: PrefixedLocale): Content {
  return contents[locale];
}

export type { Content, OrderEmailCopy } from "./types";
