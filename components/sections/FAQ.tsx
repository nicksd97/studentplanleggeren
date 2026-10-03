import Accordion from "@/components/ui/Accordion";
import FadeInOnScroll from "@/components/ui/FadeInOnScroll";
import { faqItems } from "@/lib/faq";

export default function FAQ() {
  return (
    <section id="faq" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll>
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-3">
              ✦ Spørsmål? ✦
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-brand-dark text-shadow-sm">
              Ofte stilte spørsmål
            </h2>
          </div>
        </FadeInOnScroll>
        <FadeInOnScroll delay={150}>
          <Accordion items={faqItems} />
        </FadeInOnScroll>
      </div>
    </section>
  );
}
