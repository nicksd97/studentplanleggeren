import type { Metadata } from "next";
import { headers } from "next/headers";
import NotFoundPage from "@/components/pages/NotFoundPage";
import { CartProvider } from "@/lib/cart-context";
import { LOCALE_REQUEST_HEADER, htmlLang, isLocale, ogLocale, type Locale } from "@/lib/i18n/config";
import { getContent } from "@/lib/i18n/content";
import { getMessages } from "@/lib/i18n/messages";
import { I18nProvider } from "@/lib/i18n/provider";
import { SITE_NAME, SITE_ORIGIN } from "@/lib/site";
import { dmSans, playfair } from "./fonts";
import "./globals.css";

// 404 for URLs no route matches. With separate Bokmål and other-language root layouts there is no
// shared layout to render it in, so this renders the whole document; proxy.ts tags the
// request with the language of its path.

function notFoundCopy(locale: Locale): { title: string; description: string } {
  if (locale === "nb") {
    return {
      title: "Siden finnes ikke — Studentplanlegger",
      description:
        "Denne siden finnes ikke. Gå til Studentplanlegger for å se de fyllbare PDF-planleggerne.",
    };
  }
  return getContent(locale).meta.notFound;
}

async function requestLocale(): Promise<Locale> {
  const value = (await headers()).get(LOCALE_REQUEST_HEADER);
  return isLocale(value) ? value : "nb";
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const t = notFoundCopy(locale);
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
        <I18nProvider locale={locale} messages={getMessages(locale)}>
          <CartProvider>
            <NotFoundPage locale={locale} />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
