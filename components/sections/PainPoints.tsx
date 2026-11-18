import FadeInOnScroll from "@/components/ui/FadeInOnScroll";
import type { Locale } from "@/lib/i18n/config";

const copy = {
  nb: {
    label: "✦ Kjenner du deg igjen? ✦",
    heading: "For deg som...",
    cards: [
      {
        title: "...aldri vet hvor du skal begynne",
        description:
          "Semesterstart, eksamen, prosjekter — det er mye å holde styr på. Med daglige og ukentlige planleggere får du oversikt fra dag én.",
      },
      {
        title: "...vil bygge bedre vaner",
        description:
          "Det er lett å starte, vanskelig å holde ut. Vane Trackeren og 30-dagers utfordringen hjelper deg å faktisk holde det gående.",
      },
      {
        title: "...vil nå målene dine",
        description:
          "Enten det er karaktermål, treningsmål eller sparemål — Mål Planleggeren og Handlingsplanen bryter store mål ned til konkrete steg.",
      },
    ],
  },
  en: {
    label: "✦ Sound familiar? ✦",
    heading: "For you if you...",
    cards: [
      {
        title: "...never know where to start",
        description:
          "Semester start, exams, projects — there's a lot to keep track of. Daily and weekly planners give you an overview from day one.",
      },
      {
        title: "...want to build better habits",
        description:
          "Starting is easy, sticking with it is hard. The Habit Tracker and the 30-Day Challenge help you actually keep it going.",
      },
      {
        title: "...want to reach your goals",
        description:
          "Whether it's grade goals, fitness goals or savings goals — the Goal Planner and the Action Plan break big goals down into concrete steps.",
      },
    ],
  },
};

export default function PainPoints({ locale = "nb" }: { locale?: Locale }) {
  const t = copy[locale];
  const cards = [
    {
      icon: (
        <svg className="h-6 w-6 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      ...t.cards[0],
    },
    {
      icon: (
        <svg className="h-6 w-6 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
        </svg>
      ),
      ...t.cards[1],
    },
    {
      icon: (
        <svg className="h-6 w-6 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      ...t.cards[2],
    },
  ];

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll>
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-3">
              {t.label}
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-brand-dark text-shadow-sm">
              {t.heading}
            </h2>
          </div>
        </FadeInOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <FadeInOnScroll key={i} delay={i * 100}>
              <div
                className="bg-brand-cream rounded-2xl p-6 md:p-8 border border-transparent transition-all duration-300 hover:border-brand-accent hover:shadow-lg hover:bg-gradient-to-br hover:from-white hover:to-brand-pale/30 h-full"
              >
                <div className="h-16 w-16 rounded-full bg-brand-pale flex items-center justify-center mb-5 ring-1 ring-brand-accent/10">
                  {card.icon}
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-brand-dark mb-3">
                  {card.title}
                </h3>
                <p className="text-sm text-brand-medium leading-relaxed">
                  {card.description}
                </p>
              </div>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
