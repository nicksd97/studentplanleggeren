import Link from "next/link";

export default function Footer() {
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
              Planleggere og produktivitetsverktøy laget for norske studenter.
            </p>
          </div>

          {/* Produkter */}
          <div>
            <h4 className="font-medium text-sm mb-4 text-white/80">Produkter</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/#pakker" className="text-sm text-brand-soft hover:text-brand-accent transition-colors">
                  Komplett pakke
                </Link>
              </li>
              <li>
                <Link href="/produkter?kategori=daglig" className="text-sm text-brand-soft hover:text-brand-accent transition-colors">
                  Daglig Pakke
                </Link>
              </li>
              <li>
                <Link href="/produkter?kategori=ukentlig" className="text-sm text-brand-soft hover:text-brand-accent transition-colors">
                  Ukentlig Pakke
                </Link>
              </li>
              <li>
                <Link href="/produkter" className="text-sm text-brand-soft hover:text-brand-accent transition-colors">
                  Alle planleggere
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-medium text-sm mb-4 text-white/80">Info</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/#faq" className="text-sm text-brand-soft hover:text-brand-accent transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/personvern" className="text-sm text-brand-soft hover:text-brand-accent transition-colors">
                  Personvern
                </Link>
              </li>
              <li>
                <Link href="/vilkar" className="text-sm text-brand-soft hover:text-brand-accent transition-colors">
                  Vilkår
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="font-medium text-sm mb-4 text-white/80">Kontakt</h4>
            <a
              href="mailto:hei@studentplanlegger.no"
              className="text-sm text-brand-soft hover:text-brand-accent transition-colors"
            >
              hei@studentplanlegger.no
            </a>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-2 relative before:absolute before:top-0 before:left-0 before:w-full before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent">
          <p className="text-sm text-white/40">
            &copy; 2026 Studentplanlegger · Studentplanlegger Davidson · Org.nr: 937416156
          </p>
          <p className="text-sm text-white/40">
            Laget med kjærlighet for norske studenter
          </p>
        </div>
      </div>
    </footer>
  );
}
