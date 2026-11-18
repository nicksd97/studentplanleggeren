import type { Locale } from "./config";

// The /api routes answer in Bokmål and must stay unchanged; English pages translate
// the messages they know and fall back to a generic one.

const apiErrorsEn: Record<string, string> = {
  "Ugyldig forespørsel": "Invalid request.",
  "Ugyldig e-postadresse": "Invalid email address.",
  "For mange forsøk. Prøv igjen senere.": "Too many attempts. Please try again later.",
  "Kunne ikke lage nedlastingslenke": "Could not create a download link.",
  "Nyhetsbrev er ikke konfigurert": "The newsletter is not set up yet.",
  "Kunne ikke lagre kontakten": "Could not save your email address.",
  "Kunne ikke sende e-post": "Could not send the email.",
  Serverfeil: "Server error. Please try again.",
  "Mangler produkter": "Your cart is empty.",
  "Ukjent produkt": "Unknown product in the cart.",
  "Ugyldig betalingsmetode": "Invalid payment method.",
  "Mangler påkrevde felt": "Please fill in all required fields.",
  "Kunne ikke starte kortbetaling": "Could not start the card payment.",
  "Kortbetaling kan ikke belastes ennå. Stripe-kontoen er ikke aktivert.":
    "Card payments can't be charged yet. The Stripe account is not activated.",
  "Kunne ikke opprette ordre": "Could not create the order.",
  "Kunne ikke starte Vipps-betaling": "Could not start the Vipps payment.",
  "Ugyldig eller utløpt rabattkode": "Invalid or expired discount code.",
  "Ugyldig kode": "Invalid code.",
};

export const GENERIC_ERROR: Record<Locale, string> = {
  nb: "Noe gikk galt. Prøv igjen.",
  en: "Something went wrong. Please try again.",
};

export function translateApiError(
  message: string | undefined | null,
  locale: Locale,
  fallback: string = GENERIC_ERROR[locale],
): string {
  if (!message) return fallback;
  if (locale === "nb") return message;
  return apiErrorsEn[message] ?? fallback;
}
