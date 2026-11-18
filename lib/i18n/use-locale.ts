"use client";

import { useContext } from "react";
import { usePathname } from "next/navigation";
import { localeFromPathname, type Locale } from "./config";
import { I18nContext } from "./provider";

/** Locale of the current page in client components: from I18nProvider, else from the URL. */
export function useLocale(): Locale {
  const context = useContext(I18nContext);
  const pathname = usePathname();
  return context?.locale ?? localeFromPathname(pathname);
}
