import type { Metadata } from "next";
import { headers } from "next/headers";
import NotFoundPage from "@/components/pages/NotFoundPage";
import { CartProvider } from "@/lib/cart-context";
import { LOCALE_REQUEST_HEADER, htmlLang, isLocale, ogLocale, type Locale } from "@/lib/i18n/config";
import { SITE_NAME, SITE_ORIGIN } from "@/lib/site";
import { dmSans, playfair } from "./fonts";
import "./globals.css";

// 404 for URLs no route matches. With separate Bokmål and English root layouts there is no
// shared layout to render it in, so this renders the whole document; proxy.ts tags the
// request with the language of its path.

const copy = {
  nb: {
    title: "Siden finnes ikke — Studentplanlegger",
    description:
      "Denne siden finnes ikke. Gå til Studentplanlegger for å se de fyllbare PDF-planleggerne.",
  },
  en: {
    title: "Page not found — Studentplanlegger",
    description:
      "This page doesn't exist. Visit Studentplanlegger to see the fillable PDF planners.",
  },
};

async function requestLocale(): Promise<Locale> {
  const value = (await headers()).get(LOCALE_REQUEST_HEADER);
  return isLocale(value) ? value : "nb";
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const t = copy[locale];
  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: t.title,
    description: t.description,
    icons: { icon: "/favicon.png", apple: "/favicon.png" },
    robots: { index: false, follow: true },
    openGraph: {
      title: t.title,
      description: t.description,
      siteName: SITE_NAME,
      locale: ogLocale[locale],
      type: "website",
    },
  };
}

export default async function GlobalNotFound() {
  const locale = await requestLocale();
  return (
    <html
      lang={htmlLang[locale]}
      className={`${playfair.variable} ${dmSans.variable} antialiased`}
    >
      <body className="min-h-screen">
        <CartProvider>
          <NotFoundPage locale={locale} />
        </CartProvider>
      </body>
    </html>
  );
}
