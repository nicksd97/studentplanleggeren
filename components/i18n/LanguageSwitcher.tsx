"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  htmlLang,
  localeNames,
  locales,
  localizePath,
  type Locale,
} from "@/lib/i18n/config";
import { useMessages } from "@/lib/i18n/provider";
import { useLocale } from "@/lib/i18n/use-locale";

/** Short label in the closed menu ("NO" reads better than "NB" for Norwegian visitors). */
const codes: Record<Locale, string> = {
  nb: "NO",
  en: "EN",
  de: "DE",
  sv: "SV",
  da: "DA",
  es: "ES",
  fr: "FR",
};

function rememberLocale(locale: Locale) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LOCALE_COOKIE}=${locale}; Max-Age=${LOCALE_COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

/**
 * Compact language menu (<details>, so it works without JavaScript and on touch). The options
 * are plain links with hreflang so crawlers see every language; a click stores the choice in
 * the NEXT_LOCALE cookie (read by proxy.ts) and keeps the query string and hash.
 */
export default function LanguageSwitcher({
  tone = "light",
  placement = "down",
  className = "",
}: {
  tone?: "light" | "dark";
  /** Open the list below (header) or above (footer) the button. */
  placement?: "down" | "up";
  className?: string;
}) {
  const pathname = usePathname() ?? "/";
  const current = useLocale();
  const t = useMessages().switcher;
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function close(event: Event) {
      const details = ref.current;
      if (!details?.open) return;
      if (event instanceof KeyboardEvent) {
        if (event.key !== "Escape") return;
        details.open = false;
        details.querySelector("summary")?.focus();
        return;
      }
      if (event.target instanceof Node && !details.contains(event.target)) details.open = false;
    }
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  function handleClick(event: MouseEvent<HTMLAnchorElement>, locale: Locale) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    rememberLocale(locale);
    const { pathname: path, search, hash } = window.location;
    window.location.assign(`${localizePath(path, locale)}${search}${hash}`);
  }

  const dark = tone === "dark";
  return (
    <details ref={ref} className={`group relative text-sm ${className}`}>
      <summary
        aria-label={`${t.label}: ${localeNames[current]}`}
        className={`flex cursor-pointer list-none items-center gap-1.5 rounded-full px-2.5 py-1.5 transition-colors [&::-webkit-details-marker]:hidden ${
          dark
            ? "text-white/70 hover:text-white hover:bg-white/10"
            : "text-brand-medium hover:text-brand-dark hover:bg-brand-pale"
        }`}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3 7.5 7.03 7.5 12s2.015 9 4.5 9zM3.6 9h16.8M3.6 15h16.8" />
        </svg>
        <span className="font-medium">{codes[current]}</span>
        <svg className="h-3 w-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <ul
        className={`absolute z-50 min-w-[10rem] rounded-xl border border-brand-soft bg-white py-1.5 shadow-lg ${
          placement === "up" ? "bottom-full mb-2" : "top-full mt-2"
        } right-0`}
      >
        {locales.map((locale) => {
          const active = locale === current;
          return (
            <li key={locale}>
              <a
                href={localizePath(pathname, locale)}
                hrefLang={htmlLang[locale]}
                lang={htmlLang[locale]}
                aria-current={active ? "true" : undefined}
                data-cta={`sprak_${locale}`}
                onClick={(event) => handleClick(event, locale)}
                className={`flex items-center justify-between gap-3 px-4 py-2 text-brand-dark transition-colors hover:bg-brand-pale ${
                  active ? "font-bold" : ""
                }`}
              >
                <span>{localeNames[locale]}</span>
                <span className="text-xs text-brand-medium">{codes[locale]}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
