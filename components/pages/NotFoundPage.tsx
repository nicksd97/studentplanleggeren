import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { localizePath, type Locale } from "@/lib/i18n/config";

const copy = {
  nb: {
    heading: "Siden finnes ikke",
    text: "Vi fant ikke siden du leter etter. Se planleggerne, eller gå tilbake til forsiden.",
    home: "Til forsiden",
    planners: "Se planleggerne",
  },
  en: {
    heading: "Page not found",
    text: "We couldn't find the page you're looking for. Browse the planners, or go back to the home page.",
    home: "Go to the home page",
    planners: "See the planners",
  },
};

export default function NotFoundPage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-cream pt-28 pb-20 px-4">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-sm font-medium tracking-[0.1em] uppercase text-brand-medium mb-3">
            404
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-brand-dark mb-4">
            {t.heading}
          </h1>
          <p className="text-brand-medium mb-8">{t.text}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={localizePath("/", locale)}
              className="inline-flex items-center rounded-full bg-brand-accent px-6 py-2.5 text-sm font-bold text-brand-dark hover:brightness-110 transition-all"
            >
              {t.home}
            </Link>
            <Link
              href={localizePath("/produkter", locale)}
              className="inline-flex items-center rounded-full border border-brand-soft px-6 py-2.5 text-sm font-medium text-brand-dark hover:bg-white transition-all"
            >
              {t.planners}
            </Link>
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
