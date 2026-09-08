import Reveal from "@/components/landing/Reveal";
import Eyebrow from "@/components/landing/Eyebrow";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Velg",
      description:
        "Velg verktøyet eller pakken som passer ditt behov. Enkeltprodukter fra 79 kr, komplette pakker fra 249 kr.",
      icon: (
        <svg className="h-6 w-6 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Betal",
      description:
        "Trygg betaling med Vipps eller bankkort. Ingen abonnement — du betaler én gang og eier produktet for alltid.",
      icon: (
        <svg className="h-6 w-6 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25h-15a2.25 2.25 0 00-2.25 2.25v10.5a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Last ned",
      description:
        "Last ned filene med én gang — fyllbare PDF-er til utskrift eller digital bruk. Klar på under ett minutt.",
      icon: (
        <svg className="h-6 w-6 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Eyebrow n="06">Enkelt og raskt</Eyebrow>
          <h2 className="mt-4 font-[family-name:var(--font-display)] font-bold leading-[0.95] tracking-[-0.02em] text-[clamp(2.5rem,6vw,5.5rem)] text-ink">
            Slik <span className="italic font-normal text-ink/80">fungerer</span> det
          </h2>
        </Reveal>

        {/* Editorial numbered list: hairline, display numeral, icon disc, title, copy */}
        <Reveal
          stagger={0.12}
          className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12"
        >
          {steps.map((step) => (
            <div key={step.number} className="border-t border-line pt-8">
              <div className="flex items-start justify-between gap-4">
                <span
                  aria-hidden="true"
                  className="font-[family-name:var(--font-display)] leading-none text-5xl md:text-6xl text-brand-accent/60"
                >
                  {step.number}
                </span>
                <div className="h-12 w-12 shrink-0 rounded-full bg-brand-accent/10 ring-1 ring-brand-accent/25 flex items-center justify-center">
                  {step.icon}
                </div>
              </div>

              <h3 className="mt-8 font-[family-name:var(--font-display)] text-2xl font-bold text-ink">
                {step.title}
              </h3>
              <p className="mt-3 max-w-sm text-base text-ink-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
