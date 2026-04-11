"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import CartPanel from "@/components/ui/CartPanel";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Planleggere", href: "/produkter" },
    { label: "Pakker", href: "/#pakker" },
    { label: "FAQ", href: "/#faq" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-brand-soft/60"
            : "bg-transparent border-b border-brand-soft/30"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <img
                src="/images/brand/Studentplanlegger_Text-removebg-preview.png"
                alt="Studentplanlegger"
                className="h-10 sm:h-12 w-auto transition-opacity duration-300 group-hover:opacity-80"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm text-brand-medium hover:text-brand-dark transition-colors after:absolute after:-bottom-1 after:left-1/2 after:h-[1.5px] after:w-0 after:-translate-x-1/2 after:bg-brand-dark after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#pakker"
                className="inline-flex items-center rounded-full bg-brand-accent px-5 py-2 text-sm font-medium text-brand-dark hover:bg-brand-accent/90 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                Kjøp komplett
              </Link>

              {/* Cart button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-brand-medium hover:text-brand-dark transition-colors cursor-pointer"
                aria-label="Handlekurv"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-accent text-[10px] font-bold text-brand-dark animate-pop" key={itemCount}>
                    {itemCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Mobile: cart + hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-brand-dark cursor-pointer"
                aria-label="Handlekurv"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-accent text-[10px] font-bold text-brand-dark animate-pop" key={itemCount}>
                    {itemCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-brand-dark cursor-pointer"
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
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden bg-white rounded-b-2xl shadow-lg pb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm text-brand-medium hover:text-brand-dark hover:bg-brand-pale transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-4 pt-2">
                <Link
                  href="/#pakker"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center rounded-full bg-brand-accent px-5 py-2.5 text-sm font-medium text-brand-dark"
                >
                  Kjøp komplett
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
