import type { Metadata } from "next";
import CampaignCapture from "@/components/analytics/CampaignCapture";
import ClickTracker from "@/components/analytics/ClickTracker";
import DiscountCapture from "@/components/analytics/DiscountCapture";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import VercelAnalytics from "@/components/analytics/VercelAnalytics";
import { CartProvider } from "@/lib/cart-context";
import { htmlLang, ogLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { I18nProvider } from "@/lib/i18n/provider";
import { langStaticParams, routeLocale, type LangParams } from "@/lib/i18n/route";
import { OG_IMAGE_PATH, SITE_NAME, SITE_ORIGIN, ogImageAlt } from "@/lib/site";
import { dmSans, playfair } from "../../fonts";
import "../../globals.css";

// Root layout for every language except Bokmål (/en, /de, /sv, /da, /es, /fr), so the
// server-rendered <html> carries the right lang. Mirrors app/(nb)/layout.tsx; the cart lives
// in sessionStorage and is shared across languages.

export const dynamicParams = false;

export function generateStaticParams() {
  return langStaticParams();
}

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await routeLocale(params);
  return {
    metadataBase: new URL(SITE_ORIGIN),
    icons: {
      icon: "/favicon.png",
      apple: "/favicon.png",
    },
    openGraph: {
      siteName: SITE_NAME,
      locale: ogLocale[locale],
      type: "website",
      images: [{ url: OG_IMAGE_PATH, alt: ogImageAlt(locale) }],
    },
  };
}

export default async function LocalizedRootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const locale = await routeLocale(params);
  return (
    <html
      lang={htmlLang[locale]}
      className={`${playfair.variable} ${dmSans.variable} antialiased`}
    >
      <body className="min-h-screen">
        <GoogleAnalytics />
        <I18nProvider locale={locale} messages={getMessages(locale)}>
          <CartProvider>
            <CampaignCapture />
            <DiscountCapture />
            <ClickTracker />
            {children}
          </CartProvider>
        </I18nProvider>
        <VercelAnalytics />
      </body>
    </html>
  );
}
