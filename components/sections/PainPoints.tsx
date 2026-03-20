export default function PainPoints() {
  const cards = [
    {
      icon: (
        <svg className="h-6 w-6 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M12 8v4m0 0v4m0-4h4m-4 0H8" />
        </svg>
      ),
      title: "...lurer på hvor pengene forsvinner",
      description:
        "Lånekassen-pengene er plutselig borte halvveis i måneden. Med Studentbudsjettet ser du nøyaktig hvor alt går — og hva du kan justere.",
    },
    {
      icon: (
        <svg className="h-6 w-6 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 21h20M6 17V9m4 8V5m4 12v-6m4 6V3" />
        </svg>
      ),
      title: "...vil ha kontroll på Lånekassen-lånet",
      description:
        "Hvor mye gjeld har du egentlig når du er ferdig? Lånekassen-planleggeren gir deg full oversikt over stipend, lån og nedbetalingsplan.",
    },
    {
      icon: (
        <svg className="h-6 w-6 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 7h4l3-4h6l3 4h4v12H2V7z" />
          <path strokeLinecap="round" d="M8 14h8M8 17h5" />
        </svg>
      ),
      title: "...vil spare til noe stort",
      description:
        "Ferie, nødfond, BSU eller bil — Sparegrisen hjelper deg å sette mål og faktisk nå dem, selv med studentbudsjett.",
    },
  ];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-3">
            ✦ Kjenner du deg igjen? ✦
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-brand-dark">
            For deg som...
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-brand-cream rounded-2xl p-6 md:p-8 border border-transparent hover:border-brand-accent transition-colors"
            >
              <div className="h-12 w-12 rounded-full bg-brand-pale flex items-center justify-center mb-5">
                {card.icon}
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-brand-dark mb-3">
                {card.title}
              </h3>
              <p className="text-sm text-brand-medium leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
