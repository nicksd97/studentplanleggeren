"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { categoryGroups, alleProdukter, pakker } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

const tabs = [
  { key: "alle", label: "Alle", count: alleProdukter.length },
  ...categoryGroups.map((g) => ({
    key: g.key,
    label: g.label,
    count: g.products.length,
  })),
];

const komplett = pakker.find((p) => p.featured)!;

function ProdukterContent() {
  const searchParams = useSearchParams();
  const [active, setActive] = useState("alle");
  const [showBar, setShowBar] = useState(false);
  const { addItem, isInCart } = useCart();
  const [bundleFeedback, setBundleFeedback] = useState<string | null>(null);

  useEffect(() => {
    const kategori = searchParams.get("kategori");
    if (kategori && tabs.some((t) => t.key === kategori)) {
      setActive(kategori);
    }
  }, [searchParams]);

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered =
    active === "alle"
      ? alleProdukter
      : categoryGroups.find((g) => g.key === active)?.products ?? [];

  function handleAddBundle() {
    if (isInCart(komplett.id)) {
      setBundleFeedback("Allerede i handlekurven");
      setTimeout(() => setBundleFeedback(null), 2000);
      return;
    }
    addItem({
      id: komplett.id,
      name: komplett.name,
      price: komplett.price,
      type: "bundle",
    });
    setBundleFeedback("Lagt til \u2713");
    setTimeout(() => setBundleFeedback(null), 2000);
  }

  return (
    <>
      <main className="min-h-screen bg-brand-cream pt-24 pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="text-center mb-10">
            <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-brand-dark mb-3">
              Alle planleggere
            </h1>
            <p className="text-brand-medium max-w-xl mx-auto">
              25 fyllbare PDF-planleggere. Velg enkeltvis eller spar med en pakke.
            </p>
          </div>

          {/* Category filter tabs */}
          <div className="mb-10 -mx-4 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-1 min-w-max justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActive(tab.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    active === tab.key
                      ? "bg-brand-accent text-brand-dark"
                      : "text-brand-medium hover:text-brand-dark hover:bg-brand-pale"
                  }`}
                >
                  {tab.label}
                  <span className="ml-1.5 text-xs opacity-60">({tab.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>

      {/* Sticky bundle bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-brand-dark/95 backdrop-blur-md border-t border-brand-accent/30 shadow-[0_-4px_20px_rgba(0,0,0,0.25)] transition-transform duration-500 ease-out ${
          showBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-white text-sm font-bold truncate">
              Studentplanlegger Komplett — alle 25 for {komplett.price} kr
            </p>
            <p className="text-white/60 text-xs hidden sm:block mt-0.5">
              Spar {komplett.savingsPercent}% — originalpris {komplett.originalPrice} kr
            </p>
          </div>
          <button
            onClick={handleAddBundle}
            className="shrink-0 inline-flex items-center rounded-full bg-brand-accent px-6 py-2.5 text-sm font-bold text-brand-dark hover:bg-white hover:scale-105 transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(196,168,130,0.3)] animate-pulse"
          >
            {bundleFeedback ?? "Legg i handlekurv"}
          </button>
        </div>
      </div>
    </>
  );
}

export default function ProdukterPage() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <ProdukterContent />
      </Suspense>
      <Footer />
    </>
  );
}
