import type { PrefixedLocale } from "@/lib/i18n/config";
import { da } from "./da";
import { de } from "./de";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { sv } from "./sv";
import type { LegalCopy } from "./types";

export const legalCopy: Record<PrefixedLocale, LegalCopy> = { en, de, sv, da, es, fr };
