import Button from "@/components/ui/Button";
import FadeInOnScroll from "@/components/ui/FadeInOnScroll";

export default function Hero() {
  return (
    <section className="relative pt-24 pb-0 md:pt-32 overflow-hidden">
      {/* Dot pattern background */}
      <div className="dot-pattern" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Section label */}
        <FadeInOnScroll delay={0}>
          <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-4">
            ✦ Laget for norske studenter ✦
          </p>
        </FadeInOnScroll>

        {/* Heading */}
        <FadeInOnScroll delay={100}>
          <h1 
            className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl lg:text-7xl font-bold text-brand-dark mb-4"
            style={{ textShadow: '0 2px 4px rgba(61,50,41,0.08)' }}
          >
            Studentplanlegger
          </h1>
        </FadeInOnScroll>

        {/* Subheading */}
        <FadeInOnScroll delay={200}>
          <p className="text-brand-medium text-lg sm:text-xl max-w-2xl mx-auto mb-12 md:mb-16">
            Få orden på studiene. 25 fyllbare PDF-planleggere for studenter. Daglig, ukentlig, månedlig — skriv ut eller fyll inn direkte på skjermen.
          </p>
        </FadeInOnScroll>

        {/* CTA buttons */}
        <FadeInOnScroll delay={300}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Button href="#pakker" variant="primary" className="text-base px-8 py-3.5 animate-pulse shadow-[0_0_15px_rgba(196,168,130,0.4)]">
              Se komplett pakke — 349 kr
            </Button>
            <Button href="/produkter" variant="outline" className="text-base px-8 py-3.5">
              Utforsk planleggerne
            </Button>
          </div>
        </FadeInOnScroll>

        {/* Trust signals */}
        <FadeInOnScroll delay={400}>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-brand-medium">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Betal med Vipps eller kort
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Fyllbare PDF-er
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              100% på norsk
            </span>
          </div>
        </FadeInOnScroll>
      </div>

      {/* Cover photo */}
      <FadeInOnScroll delay={500}>
        <div className="max-w-3xl mx-auto py-8 md:py-12 px-4 sm:px-6">
          <img
            src="/images/brand/Front page cover photo rev.2.png"
            alt="Studentplanlegger produkter — 25 fyllbare PDF-planleggere"
            className="w-full h-auto block rounded-lg shadow-xl transition-transform duration-500 hover:scale-[1.01]"
          />
        </div>
      </FadeInOnScroll>
    </section>
  );
}
