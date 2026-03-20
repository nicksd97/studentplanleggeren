import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
      {/* Dot pattern background */}
      <div className="dot-pattern" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Section label */}
        <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-4">
          ✦ Laget for norske studenter ✦
        </p>

        {/* Heading */}
        <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl lg:text-7xl font-bold text-brand-dark mb-4">
          Studentplanlegger
        </h1>

        {/* Subheading */}
        <p className="text-brand-medium text-lg sm:text-xl max-w-2xl mx-auto mb-12 md:mb-16">
          Få orden på studiene. 25 fyllbare PDF-planleggere for studenter. Daglig, ukentlig, månedlig — skriv ut eller fyll inn direkte på skjermen.
        </p>

        {/* Marketing showcase image */}
        <div className="relative max-w-3xl mx-auto mb-10">
          <img
            src="/images/hero-showcase.png"
            alt="Studentplanlegger produkter — 25 fyllbare PDF-planleggere"
            className="w-full h-auto"
          />
          {/* Umiddelbar nedlasting badge */}
          <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-brand-accent flex flex-col items-center justify-center text-center shadow-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-brand-dark mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span className="text-[9px] sm:text-xs font-bold text-brand-dark uppercase leading-tight tracking-wide">
                Umiddelbar<br/>nedlasting
              </span>
            </div>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Button href="#komplett" variant="primary" className="text-base px-8 py-3.5">
            Se komplett pakke — 349 kr
          </Button>
          <Button href="#planleggere" variant="outline" className="text-base px-8 py-3.5">
            Utforsk planleggerne
          </Button>
        </div>

        {/* Trust signals */}
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
      </div>

      {/* Gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white" />
    </section>
  );
}
