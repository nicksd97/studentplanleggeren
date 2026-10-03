import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import { OG_IMAGE_ALT, OG_IMAGE_PATH, SITE_NAME, SITE_ORIGIN } from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
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
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
