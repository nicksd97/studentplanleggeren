import type { Metadata } from "next";
import CampaignCapture from "@/components/analytics/CampaignCapture";
import ClickTracker from "@/components/analytics/ClickTracker";
import DiscountCapture from "@/components/analytics/DiscountCapture";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import VercelAnalytics from "@/components/analytics/VercelAnalytics";
import { CartProvider } from "@/lib/cart-context";
import { OG_IMAGE_ALT_EN, OG_IMAGE_PATH, SITE_NAME, SITE_ORIGIN } from "@/lib/site";
import { dmSans, playfair } from "../../fonts";
import "../../globals.css";

// Root layout for the English site under /en, so the server-rendered <html> says lang="en".
// Mirrors app/(nb)/layout.tsx; the cart lives in sessionStorage and is shared across both.

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_GB",
    type: "website",
    images: [{ url: OG_IMAGE_PATH, alt: OG_IMAGE_ALT_EN }],
  },
};

export default function EnglishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
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
