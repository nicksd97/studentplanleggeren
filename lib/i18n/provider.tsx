"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import {
  CURRENCY_COOKIE,
  CURRENCY_COOKIE_MAX_AGE,
  currencyFromCookieHeader,
  defaultCurrencyForLocale,
  fillPrices,
  formatMoney,
  formatPricePoint,
  type Currency,
} from "../currency";
import type { Locale } from "./config";
import type { Messages } from "./messages/types";

// The root layouts pass the current language and its dictionary here, so client components
// get their copy without bundling every language.

type I18nValue = { locale: Locale; messages: Messages };

export const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ locale, messages }), [locale, messages]);
  return <I18nContext value={value}>{children}</I18nContext>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used within I18nProvider");
  return value;
}

export function useMessages(): Messages {
  return useI18n().messages;
}

// ── Currency ────────────────────────────────────────────────────
// proxy.ts sets the sp_currency cookie from the visitor's country. Pages are static, so the
// server renders the language's default currency and the browser switches to the cookie's
// after hydration.

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function readCookieCurrency(): Currency | null {
  try {
    return currencyFromCookieHeader(document.cookie);
  } catch {
    return null;
  }
}

/** Stores a currency choice (same cookie proxy.ts sets) and re-renders prices. */
export function rememberCurrency(currency: Currency) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CURRENCY_COOKIE}=${currency}; Max-Age=${CURRENCY_COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  for (const listener of listeners) listener();
}

export function useCurrency(): Currency {
  const { locale } = useI18n();
  const fallback = defaultCurrencyForLocale(locale);
  return useSyncExternalStore(
    subscribe,
    () => readCookieCurrency() ?? fallback,
    () => fallback,
  );
}

export type Pricing = {
  locale: Locale;
  currency: Currency;
  /** Vipps only takes NOK. */
  vipps: boolean;
  /** Formats an amount in minor units of the current currency. */
  money: (minor: number) => string;
  /** Formats one catalog price (given in NOK) in the current currency. */
  point: (nokPrice: number) => string;
  /** Fills {single}, {fivePack}, {theme} and {komplett} in copy. */
  fill: (text: string) => string;
};

export function usePricing(): Pricing {
  const { locale } = useI18n();
  const currency = useCurrency();
  return useMemo(
    () => ({
      locale,
      currency,
      vipps: currency === "NOK",
      money: (minor: number) => formatMoney(minor, currency, locale),
      point: (nokPrice: number) => formatPricePoint(nokPrice, currency, locale),
      fill: (text: string) => fillPrices(text, currency, locale),
    }),
    [locale, currency],
  );
}
