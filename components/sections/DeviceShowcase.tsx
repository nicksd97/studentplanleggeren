import FadeInOnScroll from "@/components/ui/FadeInOnScroll";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

const images = ["/images/marketing/1.png", "/images/marketing/3.png", "/images/marketing/2.png"];

export default function DeviceShowcase({ locale = "nb" }: { locale?: Locale }) {
  const t = getMessages(locale).devices;
  const cards = t.cards.map((card, index) => ({ ...card, image: images[index] }));
  return (
    <section className="py-24 md:py-32 bg-brand-cream">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll>
          {/* Label */}
          <p className="text-center text-sm font-medium text-brand-accent mb-3">
            {t.label}
          </p>

          {/* Heading */}
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-brand-dark text-center mb-4 text-shadow-sm">
            {t.heading}
          </h2>

          {/* Subtext */}
          <p className="text-brand-medium text-center max-w-xl mx-auto mb-16">
            {t.intro}
          </p>
        </FadeInOnScroll>

        {/* Three image cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-6">
          {cards.map((card, index) => (
            <FadeInOnScroll key={card.label} delay={index * 150} className="text-center group">
              <div className="rounded-lg overflow-hidden shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:scale-[1.02] mb-6 bg-brand-soft">
                <img
                  src={card.image}
                  alt={card.alt}
                  className="w-full h-60 object-contain"
                />
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-black text-brand-dark mb-2">
                {card.label}
              </h3>
              <p className="text-sm text-brand-medium mt-1">{card.subtext}</p>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
