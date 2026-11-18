import type { Locale } from "./i18n/config";
import { FIVE_PACK_PRICE, KOMPLETT_PRICE, SINGLE_PRICE, THEME_PACK_PRICE } from "./products";

// Local-currency prices for Stripe card checkout. Vipps stays NOK-only.
//
// The catalog is priced in NOK (lib/products.ts). Every other currency uses this fixed table of
// charm prices — no live FX, so a price never changes between page view and payment.
// Derived 18 November 2026 from approximate rates 1 NOK ≈ 0.94 SEK, 0.64 DKK, 0.085 EUR,
// 0.073 GBP, 0.095 USD, then rounded *up* to the next charm price (SEK/DKK whole kronor ending
// in 9, EUR/GBP/USD .49 or .99):
//
//   NOK   39     99     149    249
//   SEK   39     99     149    239
//   DKK   29     69     99     169
//   EUR   3.49   8.99   12.99  21.99
//   GBP   2.99   7.49   10.99  18.49
//   USD   3.99   9.49   14.49  23.99
//
// All amounts below are in minor units (øre/öre/cents/pence). Adding a NOK price point to the
// catalog means adding a row here; lib/currency.test.ts fails until every currency has it.

export const currencies = ["NOK", "SEK", "DKK", "EUR", "GBP", "USD"] as const;
export type Currency = (typeof currencies)[number];

export const DEFAULT_CURRENCY: Currency = "NOK";

/** Functional cookie set by proxy.ts from the visitor's country; read by the price display. */
export const CURRENCY_COOKIE = "sp_currency";
export const CURRENCY_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Every distinct NOK price the catalog uses. */
export const NOK_PRICE_POINTS = [SINGLE_PRICE, FIVE_PACK_PRICE, THEME_PACK_PRICE, KOMPLETT_PRICE] as const;

export const PRICE_TABLE: Record<Currency, Record<number, number>> = {
  NOK: { 39: 3900, 99: 9900, 149: 14900, 249: 24900 },
  SEK: { 39: 3900, 99: 9900, 149: 14900, 249: 23900 },
  DKK: { 39: 2900, 99: 6900, 149: 9900, 249: 16900 },
  EUR: { 39: 349, 99: 899, 149: 1299, 249: 2199 },
  GBP: { 39: 299, 99: 749, 149: 1099, 249: 1849 },
  USD: { 39: 399, 99: 949, 149: 1449, 249: 2399 },
};

/** Stripe's minimum charge per currency, in minor units. */
export const STRIPE_MINIMUM_MINOR: Record<Currency, number> = {
  NOK: 300,
  SEK: 300,
  DKK: 250,
  EUR: 50,
  GBP: 30,
  USD: 50,
};

/**
 * Discounted totals are rounded to this step: whole kroner for NOK/SEK/DKK (as NOK always has
 * been), whole cents/pence for EUR/GBP/USD.
 */
export const ROUNDING_STEP_MINOR: Record<Currency, number> = {
  NOK: 100,
  SEK: 100,
  DKK: 100,
  EUR: 1,
  GBP: 1,
  USD: 1,
};

export function isCurrency(value: unknown): value is Currency {
  return typeof value === "string" && (currencies as readonly string[]).includes(value);
}

/** "eur" / " EUR " -> "EUR"; anything else -> null. */
export function parseCurrency(value: unknown): Currency | null {
  if (typeof value !== "string") return null;
  const upper = value.trim().toUpperCase();
  return isCurrency(upper) ? upper : null;
}

/** Price of one NOK price point in `currency`, in minor units. Throws for unknown price points. */
export function priceMinor(nokPrice: number, currency: Currency): number {
  const minor = PRICE_TABLE[currency][nokPrice];
  if (minor === undefined) {
    throw new Error(`No ${currency} price for ${nokPrice} NOK`);
  }
  return minor;
}

/** Percent discount in minor units, rounded to the currency's step. */
export function discountedMinor(listMinor: number, percent: number, currency: Currency): number {
  const step = ROUNDING_STEP_MINOR[currency];
  return Math.round((listMinor * (100 - percent)) / 100 / step) * step;
}

// ── Country -> currency ─────────────────────────────────────────

const NOK_COUNTRIES = new Set(["NO", "SJ", "BV"]);
const DKK_COUNTRIES = new Set(["DK", "GL", "FO"]);
const GBP_COUNTRIES = new Set(["GB", "IM", "JE", "GG"]);
/** United States and its territories. */
const USD_COUNTRIES = new Set(["US", "PR", "GU", "VI", "AS", "MP", "UM"]);
/**
 * Euro area, the microstates and Balkan users of the euro, plus the French overseas
 * departments and collectivities that use the euro.
 */
const EUR_COUNTRIES = new Set([
  "AT", "BE", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT", "LU", "MT",
  "NL", "PT", "SK", "SI", "ES",
  "AD", "MC", "SM", "VA", "ME", "XK",
  "AX", "RE", "GP", "MQ", "GF", "YT", "PM", "BL", "MF",
]);
/** Other European countries: shown EUR rather than USD. */
const OTHER_EUROPE = new Set([
  "AL", "AM", "AZ", "BA", "BG", "BY", "CH", "CZ", "GE", "GI", "HU", "IS", "LI", "MD", "MK",
  "PL", "RO", "RS", "RU", "TR", "UA",
]);

/** Currency for an ISO 3166-1 alpha-2 country code; null when the code is missing. */
export function currencyForCountry(country: string | null | undefined): Currency | null {
  const code = country?.trim().toUpperCase();
  if (!code || !/^[A-Z]{2}$/.test(code)) return null;
  if (NOK_COUNTRIES.has(code)) return "NOK";
  if (code === "SE") return "SEK";
  if (DKK_COUNTRIES.has(code)) return "DKK";
  if (GBP_COUNTRIES.has(code)) return "GBP";
  if (USD_COUNTRIES.has(code)) return "USD";
  if (EUR_COUNTRIES.has(code) || OTHER_EUROPE.has(code)) return "EUR";
  return "USD";
}

const LOCALE_CURRENCY: Record<Locale, Currency> = {
  nb: "NOK",
  en: "USD",
  de: "EUR",
  sv: "SEK",
  da: "DKK",
  es: "EUR",
  fr: "EUR",
};

/** Used when the country is unknown, and as the server-rendered default before the cookie is read. */
export function defaultCurrencyForLocale(locale: Locale): Currency {
  return LOCALE_CURRENCY[locale];
}

// ── Formatting ──────────────────────────────────────────────────
// Hand-rolled instead of Intl.NumberFormat so server and browser render the exact same string
// (ICU versions differ in spaces and symbols, which would break hydration).

const NBSP = " ";

function groupThousands(whole: string, separator: string): string {
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

function formatNumber(minor: number, locale: Locale): string {
  const negative = minor < 0;
  const abs = Math.abs(Math.round(minor));
  const whole = Math.floor(abs / 100);
  const cents = abs % 100;
  const english = locale === "en";
  const grouped = groupThousands(String(whole), english ? "," : locale === "de" ? "." : NBSP);
  const decimals = cents === 0 ? "" : `${english ? "." : ","}${String(cents).padStart(2, "0")}`;
  return `${negative ? "-" : ""}${grouped}${decimals}`;
}

/**
 * "39 kr" (nb, NOK — exactly as the Bokmål site always showed it), "NOK 39", "€3.49", "3,49 €",
 * "39 kr" (sv, SEK), "29 kr." (da, DKK), "$3.99", "£2.99".
 */
export function formatMoney(minor: number, currency: Currency, locale: Locale): string {
  const n = formatNumber(minor, locale);
  if (locale === "en") {
    switch (currency) {
      case "EUR":
        return `€${n}`;
      case "GBP":
        return `£${n}`;
      case "USD":
        return `$${n}`;
      default:
        return `${currency} ${n}`;
    }
  }
  if (currency === "NOK" && locale === "nb") return `${n} kr`;
  if (currency === "SEK" && locale === "sv") return `${n}${NBSP}kr`;
  if (currency === "DKK" && locale === "da") return `${n}${NBSP}kr.`;
  switch (currency) {
    case "EUR":
      return `${n}${NBSP}€`;
    case "GBP":
      return `${n}${NBSP}£`;
    case "USD":
      return `${n}${NBSP}$`;
    default:
      return `${n}${NBSP}${currency}`;
  }
}

/** Format one NOK price point in the given currency. */
export function formatPricePoint(nokPrice: number, currency: Currency, locale: Locale): string {
  return formatMoney(priceMinor(nokPrice, currency), currency, locale);
}

/** Minor units -> decimal amount ("3.49") for JSON-LD and analytics. */
export function minorToDecimal(minor: number): number {
  return Math.round(minor) / 100;
}

/**
 * Fills {single}, {fivePack}, {theme} and {komplett} in copy with the price in `currency`.
 * Copy is written with placeholders so the same sentence works in every currency.
 */
export function fillPrices(text: string, currency: Currency, locale: Locale): string {
  return text.replace(/\{(single|fivePack|theme|komplett)\}/g, (_, key: string) => {
    const nok =
      key === "single"
        ? SINGLE_PRICE
        : key === "fivePack"
          ? FIVE_PACK_PRICE
          : key === "theme"
            ? THEME_PACK_PRICE
            : KOMPLETT_PRICE;
    return formatPricePoint(nok, currency, locale);
  });
}

/** Reads the currency cookie from a document.cookie-style string. */
export function currencyFromCookieHeader(cookieHeader: string | null | undefined): Currency | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === CURRENCY_COOKIE) return parseCurrency(rest.join("="));
  }
  return null;
}
