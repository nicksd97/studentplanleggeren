import type { Metadata } from "next";
import localFont from "next/font/local";
import CampaignCapture from "@/components/analytics/CampaignCapture";
import ClickTracker from "@/components/analytics/ClickTracker";
import DiscountCapture from "@/components/analytics/DiscountCapture";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import VercelAnalytics from "@/components/analytics/VercelAnalytics";
import { CartProvider } from "@/lib/cart-context";
import { OG_IMAGE_ALT, OG_IMAGE_PATH, SITE_NAME, SITE_ORIGIN } from "@/lib/site";
import "./globals.css";

// Self-hosted so `next build` never fetches from Google Fonts (a failed fetch fails the deploy).
const playfair = localFont({
  src: "./fonts/playfair-display-latin.woff2",
  variable: "--font-display",
  weight: "400 900",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const dmSans = localFont({
  src: "./fonts/dm-sans-latin.woff2",
  variable: "--font-body",
  weight: "100 1000",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    siteName: SITE_NAME,
    locale: "nb_NO",
    type: "website",
    images: [{ url: OG_IMAGE_PATH, alt: OG_IMAGE_ALT }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nb"
      className={`${playfair.variable} ${dmSans.variable} antialiased`}
    >
      <body className="min-h-screen">
        <GoogleAnalytics />
        <CartProvider>
          <CampaignCapture />
          <DiscountCapture />
          <ClickTracker />
          {children}
        </CartProvider>
        <VercelAnalytics />
      </body>
    </html>
  );
}
