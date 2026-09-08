import Reveal from "@/components/landing/Reveal";
import Eyebrow from "@/components/landing/Eyebrow";

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
    <section className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Eyebrow n="07">Fra studenter som deg</Eyebrow>
          <h2 className="mt-4 font-[family-name:var(--font-display)] font-bold leading-[0.95] tracking-[-0.02em] text-[clamp(2.5rem,6vw,5.5rem)] text-ink">
            Hva <span className="italic font-normal text-ink/80">andre</span> sier
          </h2>
        </Reveal>

        <Reveal stagger={0.12} className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="h-full flex flex-col rounded-2xl border border-line bg-surface backdrop-blur-sm p-6 md:p-8 transition-all duration-500 hover:border-brand-accent/40 hover:bg-surface-2 hover:-translate-y-1"
            >
              {/* Opening quote mark */}
              <span
                aria-hidden="true"
                className="block h-10 font-[family-name:var(--font-display)] text-[6rem] leading-[0.5] text-brand-accent/40 select-none"
              >
                &ldquo;
              </span>

              <blockquote className="mt-4 flex-grow">
                <p className="font-[family-name:var(--font-display)] italic text-xl text-ink leading-snug">
                  {t.quote}
                </p>
              </blockquote>

              <figcaption className="mt-8 pt-6 border-t border-line flex items-center gap-3">
                <div className="h-11 w-11 shrink-0 rounded-full bg-surface-2 ring-1 ring-brand-accent/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-brand-accent">{t.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{t.name}</p>
                  <p className="text-xs text-ink-muted">{t.study}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
