import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { guideProductHref, type Guide } from "@/lib/guides";
import { localizePath, type Locale } from "@/lib/i18n/config";

const copy = {
  nb: { home: "Forside", guide: "Guide" },
  en: { home: "Home", guide: "Guide" },
};

export default function GuidePage({ guide, locale }: { guide: Guide; locale: Locale }) {
  const t = copy[locale];
  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-cream pt-28 pb-20">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-4">
            <Link href={localizePath("/", locale)} className="hover:text-brand-dark transition-colors">
              {t.home}
            </Link>
            <span className="mx-2 text-brand-soft">/</span>
            {t.guide}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-brand-dark mb-8 text-shadow-sm">
            {guide.heading}
          </h1>

          <div className="space-y-8 text-brand-dark/80 leading-relaxed">
            {guide.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand-dark mb-3">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <aside className="mt-12 rounded-2xl bg-white border border-brand-soft p-6 md:p-8">
            <p className="text-brand-dark/80 leading-relaxed mb-5">
              {guide.productLead}
            </p>
            <Link
              href={guideProductHref(guide, locale)}
              className="inline-flex items-center rounded-full bg-brand-accent px-6 py-2.5 text-sm font-bold text-brand-dark hover:brightness-110 transition-all"
            >
              {guide.productCta}
            </Link>
          </aside>
        </article>
      </main>
      <Footer locale={locale} />
    </>
  );
}
