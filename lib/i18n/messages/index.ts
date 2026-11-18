import type { Locale } from "../config";
import { da } from "./da";
import { de } from "./de";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { nb } from "./nb";
import { sv } from "./sv";
import type { Messages } from "./types";

// All UI dictionaries. Import from server code only: client components get the current
// language's dictionary from I18nProvider (lib/i18n/provider.tsx), so pages ship one language.

export const messages: Record<Locale, Messages> = { nb, en, de, sv, da, es, fr };

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}

export type { Messages } from "./types";
