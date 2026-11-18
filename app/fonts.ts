import localFont from "next/font/local";

// Self-hosted so `next build` never fetches from Google Fonts (a failed fetch fails the deploy).
// Shared by the Bokmål and English root layouts.
export const playfair = localFont({
  src: "./fonts/playfair-display-latin.woff2",
  variable: "--font-display",
  weight: "400 900",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const dmSans = localFont({
  src: "./fonts/dm-sans-latin.woff2",
  variable: "--font-body",
  weight: "100 1000",
  display: "swap",
});
