import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LegalTranslationNote from "@/components/pages/LegalTranslationNote";
import type { LegalPageCopy } from "@/components/legal/types";
import type { PrefixedLocale } from "@/lib/i18n/config";

/** Translated privacy policy or terms of sale; same layout as the Norwegian pages. */
export default function LegalPage({
  copy,
  locale,
  norwegianPath,
}: {
  copy: LegalPageCopy;
  locale: PrefixedLocale;
  norwegianPath: string;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <p className="text-sm text-brand-muted mb-4">{copy.orgLine}</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark mb-8">
            {copy.title}
          </h1>
          <p className="text-brand-muted mb-8">{copy.updated}</p>
          <LegalTranslationNote locale={locale} norwegianPath={norwegianPath} />

          <div className="prose prose-brand max-w-none space-y-8 text-brand-dark/80">
            {copy.body}
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
