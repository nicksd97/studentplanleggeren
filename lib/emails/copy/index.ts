import { isLocale, type Locale } from "../../i18n/config";
import type { EmailCopy } from "../types";
import { da } from "./da";
import { de } from "./de";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { nb } from "./nb";
import { sv } from "./sv";

export const emailCopies: Record<Locale, EmailCopy> = { nb, en, de, sv, da, es, fr };

/** The subscriber's language; Bokmål for anything missing or unknown. */
export function emailLocale(value: unknown): Locale {
  return isLocale(value) ? value : "nb";
}

export function getEmailCopy(locale: unknown): EmailCopy {
  return emailCopies[emailLocale(locale)];
}
