import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NewsletterSignup from "@/components/sections/NewsletterSignup";
import Button from "@/components/ui/Button";
import { localizePath, type Locale } from "@/lib/i18n/config";

const copy = {
  nb: {
    label: "GRATIS SMAKEBIT",
    heading: "Last ned gratis ukentlig plan-smakebit",
    intro:
      "En fyllbar PDF på én side, så du kan prøve formatet før du kjøper. Dette er ikke hele planleggeren — bare et utdrag av den ukentlige planen.",
    bullets: [
      "Fyllbare felt for mål, prioriteringer, gjøremål, vaner og mandag–onsdag",
      "Ekte side fra Ukentlig Plan — samme design som fullversjonen",
      "Full ukeplan og 24 andre PDF-er i nettbutikken",
    ],
    formHeading: "Få smakebiten på e-post",
    formText: "Skriv inn e-posten din. Vi sender en nedlastingslenke — ikke hele produktet.",
    cta: "Se alle planleggerne — fra 39 kr",
    komplett: "Komplett pakke med 25 planleggere: 249 kr.",
  },
  en: {
    label: "FREE SAMPLE",
    heading: "Download a free weekly plan sample",
    intro:
      "A one-page fillable PDF, so you can try the format before you buy. This isn't the whole planner — just an excerpt from the weekly plan. Like all our planners, it is in Norwegian (Bokmål).",
    bullets: [
      "Fillable fields for goals, priorities, to-dos, habits and Monday–Wednesday",
      "A real page from Weekly Plan — same design as the full version",
      "The full weekly plan and 24 other PDFs are in the shop",
    ],
    formHeading: "Get the sample by email",
    formText: "Enter your email. We'll send you a download link — not the whole product.",
    cta: "See all the planners — from NOK 39",
    komplett: "Complete bundle with 25 planners: NOK 249.",
  },
};

export default function GratisPage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-cream pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-4">
            {t.label}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-brand-dark mb-6 text-shadow-sm">
            {t.heading}
          </h1>
          <p className="text-brand-dark/80 leading-relaxed mb-8">{t.intro}</p>
          <ul className="space-y-3 mb-10">
            {t.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3 text-brand-dark/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl bg-white border border-brand-soft p-6 md:p-8 mb-10">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand-dark mb-2">
              {t.formHeading}
            </h2>
            <p className="text-brand-medium text-sm mb-6">{t.formText}</p>
            <NewsletterSignup variant="gratis" heading="" subheading="" />
          </div>

          <div className="text-center">
            <Button
              href={localizePath("/produkter", locale)}
              data-cta="gratis_produkter"
              variant="primary"
              className="text-base px-8 py-3.5"
            >
              {t.cta}
            </Button>
            <p className="text-sm text-brand-medium mt-4">{t.komplett}</p>
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
