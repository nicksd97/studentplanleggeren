export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "Daglig Planleggeren har forandret morgenrutinen min. Jeg bruker 5 minutter på å planlegge dagen og får mye mer gjort.",
      name: "Ida M.",
      study: "Juss, UiO",
      initials: "IM",
    },
    {
      quote:
        "Ukentlig Plan er genial for semesterplanlegging. Endelig ser jeg hele uken i ett blikk i stedet for å glemme ting.",
      name: "Thea K.",
      study: "Sykepleie, NTNU",
      initials: "TK",
    },
    {
      quote:
        "Elsker at jeg kan fylle inn direkte på iPaden. Slipper å skrive ut, og det ser fortsatt pent ut.",
      name: "Nora S.",
      study: "Økonomi, NHH",
      initials: "NS",
    },
  ];

  return (
    <section className="bg-brand-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-3">
            ✦ Fra studenter som deg ✦
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-brand-dark">
            Hva andre sier
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 md:p-8"
            >
              {/* Quote mark */}
              <svg
                className="h-8 w-8 text-brand-accent/30 mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
              </svg>
              <p className="text-brand-dark text-sm leading-relaxed mb-6">
                {t.quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-pale flex items-center justify-center">
                  <span className="text-xs font-medium text-brand-medium">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-dark">
                    {t.name}
                  </p>
                  <p className="text-xs text-brand-medium">{t.study}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
