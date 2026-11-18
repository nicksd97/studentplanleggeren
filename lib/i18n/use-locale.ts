"use client";

import { usePathname } from "next/navigation";
import { localeFromPathname, type Locale } from "./config";

/** Locale of the current page in client components: /en/* is English, the rest Bokmål. */
export function useLocale(): Locale {
  return localeFromPathname(usePathname());
}
