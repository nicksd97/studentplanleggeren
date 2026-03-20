import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
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
  title: "Studentplanleggeren — Din økonomi. Din kontroll.",
  description:
    "Norges finansplanlegger for studenter. Budsjett, Lånekassen-plan, sparemål og mer — som utskrivbare PDF-er og interaktive regneark.",
  keywords: [
    "studentbudsjett",
    "lånekassen",
    "økonomi student",
    "budsjettplanlegger",
    "sparetips studenter",
    "norsk budsjettmal",
    "studentplanlegger",
  ],
  openGraph: {
    locale: "nb_NO",
    url: "https://studentplanleggeren.no",
    siteName: "Studentplanleggeren",
    title: "Studentplanleggeren — Din økonomi. Din kontroll.",
    description:
      "Norges finansplanlegger for studenter. Budsjett, Lånekassen-plan, sparemål og mer — som utskrivbare PDF-er og interaktive regneark.",
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
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
