import type { Metadata } from "next";
import CampaignCapture from "@/components/analytics/CampaignCapture";
import ClickTracker from "@/components/analytics/ClickTracker";
import DiscountCapture from "@/components/analytics/DiscountCapture";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import VercelAnalytics from "@/components/analytics/VercelAnalytics";
import { CartProvider } from "@/lib/cart-context";
import { OG_IMAGE_ALT, OG_IMAGE_PATH, SITE_NAME, SITE_ORIGIN } from "@/lib/site";
import { dmSans, playfair } from "../fonts";
import "../globals.css";

// Root layout for the Bokmål site (unprefixed URLs). English has its own in app/(en)/en.

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
