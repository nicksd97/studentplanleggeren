import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NewsletterSignup from "@/components/sections/NewsletterSignup";
import Button from "@/components/ui/Button";
import PriceText from "@/components/i18n/PriceText";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { pdfLanguageCopy } from "@/lib/i18n/products";

export default function GratisPage({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const t = messages.gratis;
  const pdfLanguage = pdfLanguageCopy(locale, messages).sentence;
  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-cream pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-4">
            {t.label}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-brand-dark mb-6 text-shadow-sm">
            {t.heading}
          </h1>
          <p className="text-brand-dark/80 leading-relaxed mb-8">
            {pdfLanguage ? `${t.intro} ${pdfLanguage}` : t.intro}
          </p>
          <ul className="space-y-3 mb-10">
            {t.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3 text-brand-dark/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl bg-white border border-brand-soft p-6 md:p-8 mb-10">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand-dark mb-2">
              {t.formHeading}
            </h2>
            <p className="text-brand-medium text-sm mb-6">{t.formText}</p>
            <NewsletterSignup variant="gratis" heading="" subheading="" />
          </div>

          <div className="text-center">
            <Button
              href={localizePath("/produkter", locale)}
              data-cta="gratis_produkter"
              variant="primary"
              className="text-base px-8 py-3.5"
            >
              <PriceText text={t.cta} />
            </Button>
            <p className="text-sm text-brand-medium mt-4">
              <PriceText text={t.komplett} />
            </p>
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
