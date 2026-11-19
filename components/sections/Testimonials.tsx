import FadeInOnScroll from "@/components/ui/FadeInOnScroll";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

const people = [
  { name: "Ida M.", initials: "IM" },
  { name: "Thea K.", initials: "TK" },
  { name: "Nora S.", initials: "NS" },
];

export default function Testimonials({ locale = "nb" }: { locale?: Locale }) {
  const t = getMessages(locale).testimonials;
  const testimonials = t.quotes.map((quote, index) => ({ ...quote, ...people[index] }));

  return (
    <section className="bg-brand-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll>
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-3">
              {t.label}
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-brand-dark text-shadow-sm">
              {t.heading}
            </h2>
            {t.note && <p className="text-xs text-brand-medium mt-3">{t.note}</p>}
          </div>
        </FadeInOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <FadeInOnScroll key={i} delay={i * 150}>
              <div
                className="bg-white rounded-2xl p-6 md:p-8 border-l-[4px] border-brand-accent/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md h-full flex flex-col"
              >
                {/* Quote mark */}
                <svg
                  className="h-10 w-10 text-brand-accent/40 mb-4 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
                </svg>
                <p className="text-brand-dark text-sm leading-relaxed mb-6 flex-grow">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-pale flex items-center justify-center ring-2 ring-brand-accent/20">
                    <span className="text-xs font-bold text-brand-medium">
                      {t.initials}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-dark">
                      {t.name}
                    </p>
                    <p className="text-xs text-brand-medium">{t.study}</p>
                  </div>
                </div>
              </div>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
