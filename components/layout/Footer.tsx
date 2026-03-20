export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-9 w-9 rounded-full bg-brand-medium/30 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="1" width="10" height="13" rx="1.5" stroke="#C4A882" strokeWidth="1.5" fill="none" />
                  <rect x="6" y="4" width="10" height="13" rx="1.5" stroke="#C4A882" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
              <span className="font-[family-name:var(--font-display)] text-lg font-bold">
                Studentplanleggeren
              </span>
            </div>
            <p className="text-brand-soft text-sm leading-relaxed">
              Finansplanleggere og produktivitetsverktøy laget spesielt for norske studenter.
            </p>
          </div>

          {/* Produkter */}
          <div>
            <h4 className="font-medium text-sm mb-4 text-white/80">Produkter</h4>
            <ul className="space-y-2.5">
              {[
                "Studentbudsjettet",
                "Lånekassen-planleggeren",
                "Sparegrisen",
                "Sommerjobb-kalkulatoren",
                "Etter-eksamen (FI Starter)",
                "Økonomipakken",
              ].map((name) => (
                <li key={name}>
                  <a href="#okonomi" className="text-sm text-brand-soft hover:text-brand-accent transition-colors">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-medium text-sm mb-4 text-white/80">Info</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#faq" className="text-sm text-brand-soft hover:text-brand-accent transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-brand-soft hover:text-brand-accent transition-colors">
                  Personvern
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-brand-soft hover:text-brand-accent transition-colors">
                  Vilkår
                </a>
              </li>
            </ul>
          </div>

          {/* Følg oss */}
          <div>
            <h4 className="font-medium text-sm mb-4 text-white/80">Følg oss</h4>
            <div className="flex gap-4">
              {/* Instagram */}
              <a href="#" className="text-brand-soft hover:text-brand-accent transition-colors" aria-label="Instagram">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              {/* TikTok */}
              <a href="#" className="text-brand-soft hover:text-brand-accent transition-colors" aria-label="TikTok">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48v-7.1a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-.8-.07 4.87 4.87 0 01-.39.04z" />
                </svg>
              </a>
              {/* Email */}
              <a href="mailto:hei@studentplanleggeren.no" className="text-brand-soft hover:text-brand-accent transition-colors" aria-label="E-post">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-sm text-white/40">
            &copy; 2026 Studentplanleggeren · NSD Drift
          </p>
          <p className="text-sm text-white/40">
            Laget med kjærlighet for norske studenter
          </p>
        </div>
      </div>
    </footer>
  );
}
