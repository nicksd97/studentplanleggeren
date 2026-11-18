import Link from "next/link";
import { getGuides, guidePath } from "@/lib/guides";
import type { Locale } from "@/lib/i18n/config";

const copy = {
  nb: { label: "✦ Guider ✦", heading: "Råd til studiehverdagen", read: "Les guiden" },
  en: { label: "✦ Guides ✦", heading: "Tips for everyday student life", read: "Read the guide" },
};

export default function GuideList({ locale = "nb" }: { locale?: Locale }) {
  const t = copy[locale];
  return (
    <section className="bg-brand-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-3">
            {t.label}
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-brand-dark text-shadow-sm">
            {t.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {getGuides(locale).map((guide) => (
            <Link
              key={guide.slug}
              href={guidePath(guide.slug, locale)}
              data-cta={`guide_${guide.slug}`}
              className="block bg-white rounded-2xl p-6 md:p-8 border border-brand-soft/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand-dark mb-2">
                {guide.heading}
              </h3>
              <p className="text-sm text-brand-medium leading-relaxed mb-4">
                {guide.summary}
              </p>
              <span className="text-sm font-medium text-brand-dark">{t.read}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
