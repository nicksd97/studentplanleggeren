import Eyebrow from "@/components/landing/Eyebrow";
import Reveal from "@/components/landing/Reveal";

const cards = [
  {
    image: "/images/marketing/3.png",
    alt: "Årlig, månedlig, ukentlig og daglig planleggere",
    label: "Årlig, månedlig, ukentlig og daglig",
    subtext: "Planleggere for alle behov",
  },
  {
    image: "/images/marketing/2.png",
    alt: "Tilgjengelig i flere størrelser: A4, A5, Letter og Half Letter",
    label: "Flere størrelser",
    subtext: "A4, A5, Letter og Half Letter",
  },
];

export default function DeviceShowcase() {
  return (
    <section className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <Reveal>
          <Eyebrow n="02">Bruk den overalt</Eyebrow>

          <h2 className="mt-4 font-[family-name:var(--font-display)] font-bold leading-[0.95] tracking-[-0.02em] text-[clamp(2.5rem,6vw,5.5rem)] text-ink">
            Fungerer på <span className="italic font-normal text-ink/80">alle</span> enheter
          </h2>

          <p className="mt-6 max-w-xl text-lg text-ink-muted leading-relaxed">
            Fyll ut planleggerne digitalt på PC, Mac, iPad eller nettbrett — eller
            skriv ut på papir. Du velger.
          </p>
        </Reveal>

        {/* Open band: the 3D laptop, tablet, pages and notebook float here (see components/three/poses.ts) */}
        <div data-devices-band aria-hidden="true" className="h-[300px] md:h-[440px]" />

        {/* Two image cards */}
        <Reveal
          stagger={0.12}
          className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl"
        >
          {cards.map((card) => (
            <div
              key={card.label}
              className="group rounded-2xl border border-line bg-surface md:backdrop-blur-sm p-6 md:p-8 hover:border-brand-accent/40 hover:bg-surface-2 hover:-translate-y-1 transition-all duration-500"
            >
              <div className="overflow-hidden rounded-xl bg-white/[0.04] ring-1 ring-white/10">
                <img
                  src={card.image}
                  alt={card.alt}
                  className="w-full h-60 object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <h3 className="mt-6 font-[family-name:var(--font-display)] text-xl font-bold text-ink">
                {card.label}
              </h3>
              <p className="mt-2 text-sm text-ink-muted">{card.subtext}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
