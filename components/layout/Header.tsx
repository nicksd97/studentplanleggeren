"use client";

import { useState, useEffect } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Planleggere", href: "#planleggere" },
    { label: "Pakker", href: "#pakker" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 rounded-full bg-brand-dark flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="1" width="10" height="13" rx="1.5" stroke="#C4A882" strokeWidth="1.5" fill="none" />
                <rect x="6" y="4" width="10" height="13" rx="1.5" stroke="#C4A882" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-display)] text-lg font-bold text-brand-dark">
              Studentplanleggeren
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-brand-medium hover:text-brand-dark transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#komplett"
              className="inline-flex items-center rounded-full bg-brand-accent px-5 py-2 text-sm font-medium text-brand-dark hover:bg-brand-accent/90 transition-colors"
            >
              Kjøp komplett
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-brand-dark"
            aria-label="Meny"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white rounded-b-2xl shadow-lg pb-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm text-brand-medium hover:text-brand-dark hover:bg-brand-pale transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="px-4 pt-2">
              <a
                href="#komplett"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center rounded-full bg-brand-accent px-5 py-2.5 text-sm font-medium text-brand-dark"
              >
                Kjøp komplett
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
