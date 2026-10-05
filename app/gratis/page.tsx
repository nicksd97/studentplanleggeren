import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NewsletterSignup from "@/components/sections/NewsletterSignup";
import Button from "@/components/ui/Button";
import { pageMeta } from "@/lib/site";

const GRATIS_DESCRIPTION =
  "Last ned en gratis fyllbar ukeplan-smakebit. Én side til å prøve formatet — ikke hele produktet. Full ukeplan fra 39 kr.";

export const metadata = pageMeta({
  title: "Gratis ukentlig plan-smakebit — Studentplanlegger",
  description: GRATIS_DESCRIPTION,
  path: "/gratis",
});

const bullets = [
  "Fyllbare felt for mål, prioriteringer og mandag–onsdag",
  "Samme visning som de betalte planleggerne",
  "Full ukeplan og 24 andre PDF-er i nettbutikken",
];

export default function GratisPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-cream pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-4">
            GRATIS SMAKEBIT
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-brand-dark mb-6 text-shadow-sm">
            Last ned gratis ukentlig plan-smakebit
          </h1>
          <p className="text-brand-dark/80 leading-relaxed mb-8">
            En fyllbar PDF på én side, så du kan prøve formatet før du kjøper. Dette er ikke hele
            planleggeren — bare et utdrag av den ukentlige planen.
          </p>
          <ul className="space-y-3 mb-10">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3 text-brand-dark/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl bg-white border border-brand-soft p-6 md:p-8 mb-10">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand-dark mb-2">
              Få smakebiten på e-post
            </h2>
            <p className="text-brand-medium text-sm mb-6">
              Skriv inn e-posten din. Vi sender en nedlastingslenke — ikke hele produktet.
            </p>
            <NewsletterSignup variant="gratis" heading="" subheading="" />
          </div>

          <div className="text-center">
            <Button href="/produkter" variant="primary" className="text-base px-8 py-3.5">
              Se alle planleggerne — fra 39 kr
            </Button>
            <p className="text-sm text-brand-medium mt-4">
              Komplett pakke med 25 planleggere: 249 kr.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
