import Accordion from "@/components/ui/Accordion";
import FadeInOnScroll from "@/components/ui/FadeInOnScroll";
import { getFaqItems } from "@/lib/faq";
import type { Locale } from "@/lib/i18n/config";

const copy = {
  nb: { label: "✦ Spørsmål? ✦", heading: "Ofte stilte spørsmål" },
  en: { label: "✦ Questions? ✦", heading: "Frequently asked questions" },
};

export default function FAQ({ locale = "nb" }: { locale?: Locale }) {
  const t = copy[locale];
  return (
    <section id="faq" className="bg-white py-24 md:py-32">
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
        <FadeInOnScroll delay={150}>
          <Accordion items={getFaqItems(locale)} />
        </FadeInOnScroll>
      </div>
    </section>
  );
}
