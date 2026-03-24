const cards = [
  {
    image: "/images/marketing/il_1588xN.4593615381_kh5v.jpg.webp",
    alt: "Fyll inn planleggeren digitalt på PC, Mac, iPad eller nettbrett",
    label: "Fyll inn digitalt",
    subtext: "Bruk på PC, Mac, iPad eller nettbrett",
  },
  {
    image: "/images/marketing/il_1588xN.4546213582_d4qb.jpg.webp",
    alt: "Årlig, månedlig, ukentlig og daglig planleggere",
    label: "Årlig, månedlig, ukentlig og daglig",
    subtext: "Planleggere for alle behov",
  },
  {
    image: "/images/marketing/il_1588xN.4593614661_13gt.jpg.webp",
    alt: "Tilgjengelig i flere størrelser: A4, A5, Letter og Half Letter",
    label: "Flere størrelser",
    subtext: "A4, A5, Letter og Half Letter",
  },
];

export default function DeviceShowcase() {
  return (
    <section className="py-20 md:py-28 bg-brand-cream">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Label */}
        <p className="text-center text-sm font-medium text-brand-accent mb-3">
          ✦ Bruk den overalt ✦
        </p>

        {/* Heading */}
        <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-brand-dark text-center mb-4">
          Fungerer på alle enheter
        </h2>

        {/* Subtext */}
        <p className="text-brand-medium text-center max-w-xl mx-auto mb-12">
          Fyll ut planleggerne digitalt på PC, Mac, iPad eller nettbrett — eller
          skriv ut på papir. Du velger.
        </p>

        {/* Three image cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.label} className="text-center">
              <div className="rounded-2xl overflow-hidden shadow-md mb-4 bg-brand-soft">
                <img
                  src={card.image}
                  alt={card.alt}
                  className="w-full h-60 object-contain"
                />
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-base font-bold text-brand-dark mb-1">
                {card.label}
              </h3>
              <p className="text-sm text-brand-medium">{card.subtext}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
