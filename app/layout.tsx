import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  title: "Studentplanlegger — Få orden på studiene",
  description:
    "25 fyllbare PDF-planleggere for norske studenter. Daglig, ukentlig, månedlig og mer — skriv ut eller fyll inn digitalt.",
  keywords: [
    "studentplanlegger",
    "planlegger student",
    "ukentlig plan",
    "daglig planlegger",
    "vane tracker",
    "pomodoro planlegger",
    "fyllbar pdf",
    "studieplanlegger",
  ],
  openGraph: {
    locale: "nb_NO",
    url: "https://studentplanlegger.no",
    siteName: "Studentplanlegger",
    title: "Studentplanlegger — Få orden på studiene",
    description:
      "25 fyllbare PDF-planleggere for norske studenter. Daglig, ukentlig, månedlig og mer — skriv ut eller fyll inn digitalt.",
    type: "website",
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
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${dmSans.variable} antialiased`}
    >
      <body className="min-h-screen">
        {/* Marks that scripts run, so CSS-only pre-hides (landing reveals) never strand a page without JS */}
        <Script id="js-flag" strategy="beforeInteractive">
          {`document.documentElement.setAttribute("data-js","")`}
        </Script>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
