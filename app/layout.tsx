import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
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
      className={`${playfair.variable} ${dmSans.variable} antialiased`}
    >
      <body className="min-h-screen">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
