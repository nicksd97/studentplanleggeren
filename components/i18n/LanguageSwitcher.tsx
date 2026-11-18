"use client";

import type { MouseEvent } from "react";
import { usePathname } from "next/navigation";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  localeFromPathname,
  localizePath,
  type Locale,
} from "@/lib/i18n/config";

const options: { locale: Locale; label: string; hrefLang: string }[] = [
  { locale: "nb", label: "Norsk", hrefLang: "nb" },
  { locale: "en", label: "English", hrefLang: "en" },
];

function rememberLocale(locale: Locale) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LOCALE_COOKIE}=${locale}; Max-Age=${LOCALE_COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

/**
 * Plain links so crawlers see the other-language URL; the click handler stores the
 * choice in a cookie (read by proxy.ts) and keeps the query string and hash.
 */
export default function LanguageSwitcher({
  className = "",
  linkClassName = "",
  activeClassName = "",
}: {
  className?: string;
  linkClassName?: string;
  activeClassName?: string;
}) {
  const pathname = usePathname() ?? "/";
  const current = localeFromPathname(pathname);

  function handleClick(event: MouseEvent<HTMLAnchorElement>, locale: Locale) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    rememberLocale(locale);
    const { pathname: path, search, hash } = window.location;
    window.location.assign(`${localizePath(path, locale)}${search}${hash}`);
  }

  return (
    <div
      className={`flex items-center gap-1.5 text-sm ${className}`}
      aria-label={current === "en" ? "Language" : "Språk"}
      role="group"
    >
      {options.map((option, index) => {
        const active = option.locale === current;
        return (
          <span key={option.locale} className="flex items-center gap-1.5">
            {index > 0 && <span aria-hidden="true" className="opacity-40">|</span>}
            <a
              href={localizePath(pathname, option.locale)}
              hrefLang={option.hrefLang}
              lang={option.hrefLang}
              aria-current={active ? "true" : undefined}
              data-cta={`sprak_${option.locale}`}
              onClick={(event) => handleClick(event, option.locale)}
              className={`${linkClassName} ${active ? activeClassName : ""}`}
            >
              {option.label}
            </a>
          </span>
        );
      })}
    </div>
  );
}
