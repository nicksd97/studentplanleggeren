import FadeInOnScroll from "@/components/ui/FadeInOnScroll";

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
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll>
          <div className="text-center mb-16">
            <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-3">
              ✦ Enkelt og raskt ✦
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-brand-dark text-shadow-sm">
              Slik fungerer det
            </h2>
          </div>
        </FadeInOnScroll>

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-8 left-[15%] right-[15%] border-t-[1.5px] border-dashed border-brand-soft -z-10" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative z-0">
            {steps.map((step, index) => (
              <FadeInOnScroll key={step.number} delay={index * 150} className="text-center bg-white px-4">
                <div className="h-16 w-16 rounded-full bg-brand-pale border border-brand-soft flex items-center justify-center mx-auto mb-4 animate-float">
                  {step.icon}
                </div>
                <span className="text-base font-bold text-brand-accent mb-1 block">
                  Steg {step.number}
                </span>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand-dark mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-brand-medium leading-relaxed">
                  {step.description}
                </p>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
