import Reveal from "@/components/landing/Reveal";
import Eyebrow from "@/components/landing/Eyebrow";

export default function PainPoints() {
  const cards = [
    {
      icon: (
        <svg className="h-6 w-6 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      title: "...aldri vet hvor du skal begynne",
      description:
        "Semesterstart, eksamen, prosjekter — det er mye å holde styr på. Med daglige og ukentlige planleggere får du oversikt fra dag én.",
    },
    {
      icon: (
        <svg className="h-6 w-6 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
        </svg>
      ),
      title: "...vil bygge bedre vaner",
      description:
        "Det er lett å starte, vanskelig å holde ut. Vane Trackeren og 30-dagers utfordringen hjelper deg å faktisk holde det gående.",
    },
    {
      icon: (
        <svg className="h-6 w-6 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "...vil nå målene dine",
      description:
        "Enten det er karaktermål, treningsmål eller sparemål — Mål Planleggeren og Handlingsplanen bryter store mål ned til konkrete steg.",
    },
  ];

  return (
    <section className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Eyebrow n="04">Kjenner du deg igjen?</Eyebrow>
          <h2 className="mt-4 font-[family-name:var(--font-display)] font-bold leading-[0.95] tracking-[-0.02em] text-[clamp(2.5rem,6vw,5.5rem)] text-ink">
            For deg <span className="italic font-normal text-ink/80">som...</span>
          </h2>
        </Reveal>

        <Reveal stagger={0.12} className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="h-full rounded-2xl border border-line bg-surface md:backdrop-blur-sm p-6 md:p-8 hover:border-brand-accent/40 hover:bg-surface-2 hover:-translate-y-1 transition-all duration-500"
            >
              <div className="h-12 w-12 rounded-full bg-brand-accent/10 ring-1 ring-brand-accent/25 flex items-center justify-center">
                {card.icon}
              </div>
              <h3 className="mt-6 font-[family-name:var(--font-display)] text-2xl leading-tight text-ink">
                {card.title}
              </h3>
              <p className="mt-3 text-ink-muted leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
