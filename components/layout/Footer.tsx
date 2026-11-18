import Link from "next/link";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { getGuides, guidePath } from "@/lib/guides";
import { localizePath, type Locale } from "@/lib/i18n/config";

const copy = {
  nb: {
    tagline: "Planleggere og produktivitetsverktøy laget for norske studenter.",
    products: "Produkter",
    komplett: "Komplett pakke",
    daily: "Daglig Pakke",
    weekly: "Ukentlig Pakke",
    all: "Alle planleggere",
    guides: "Guider",
    free: "Gratis smakebit",
    privacy: "Personvern",
    terms: "Vilkår",
    madeWith: "Laget med kjærlighet for norske studenter",
  },
  en: {
    tagline: "Planners and productivity tools made for students in Norway. The planners are in Norwegian (Bokmål).",
    products: "Products",
    komplett: "Complete bundle",
    daily: "Daily Bundle",
    weekly: "Weekly Bundle",
    all: "All planners",
    guides: "Guides",
    free: "Free sample",
    privacy: "Privacy",
    terms: "Terms",
    madeWith: "Made with love for students in Norway",
  },
};

export default function Footer({ locale = "nb" }: { locale?: Locale }) {
  const t = copy[locale];
  const href = (path: string) => localizePath(path, locale);
  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <img
                src="/images/brand/Studentplanlegger_Text-removebg-preview.png"
                alt="Studentplanlegger"
                className="h-6 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-brand-soft text-sm leading-relaxed">
              {t.tagline}
            </p>
          </div>

          {/* Produkter */}
          <div>
            <h4 className="font-medium text-sm mb-4 text-white/80">{t.products}</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href={href("/#pakker")} className="text-sm text-brand-soft hover:text-brand-accent transition-colors">
                  {t.komplett}
                </Link>
              </li>
              <li>
                <Link href={href("/produkter?kategori=daglig")} className="text-sm text-brand-soft hover:text-brand-accent transition-colors">
                  {t.daily}
                </Link>
              </li>
              <li>
                <Link href={href("/produkter?kategori=ukentlig")} className="text-sm text-brand-soft hover:text-brand-accent transition-colors">
                  {t.weekly}
                </Link>
              </li>
              <li>
                <Link href={href("/produkter")} className="text-sm text-brand-soft hover:text-brand-accent transition-colors">
                  {t.all}
                </Link>
              </li>
            </ul>
          </div>

          {/* Guider */}
          <div>
            <h4 className="font-medium text-sm mb-4 text-white/80">{t.guides}</h4>
            <ul className="space-y-2.5">
              {getGuides(locale).map((guide) => (
                <li key={guide.slug}>
                  <Link
                    href={guidePath(guide.slug, locale)}
                    className="text-sm text-brand-soft hover:text-brand-accent transition-colors"
                  >
                    {guide.footerLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-medium text-sm mb-4 text-white/80">Info</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href={href("/#faq")} className="text-sm text-brand-soft hover:text-brand-accent transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href={href("/gratis")} className="text-sm text-brand-soft hover:text-brand-accent transition-colors">
                  {t.free}
                </Link>
              </li>
              <li>
                <Link href={href("/personvern")} className="text-sm text-brand-soft hover:text-brand-accent transition-colors">
                  {t.privacy}
                </Link>
              </li>
              <li>
                <Link href={href("/vilkar")} className="text-sm text-brand-soft hover:text-brand-accent transition-colors">
                  {t.terms}
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hei@studentplanlegger.no"
                  className="text-sm text-brand-soft hover:text-brand-accent transition-colors"
                >
                  hei@studentplanlegger.no
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-2 relative before:absolute before:top-0 before:left-0 before:w-full before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent">
          <p className="text-sm text-white/40">
            &copy; 2026 Studentplanlegger · Studentplanlegger Davidson · {locale === "en" ? "Org. no." : "Org.nr:"} 937416156
          </p>
          <LanguageSwitcher
            className="text-white/60"
            linkClassName="hover:text-brand-accent transition-colors"
            activeClassName="font-bold text-white"
          />
          <p className="text-sm text-white/40">
            {t.madeWith}
          </p>
        </div>
      </div>
    </footer>
  );
}
