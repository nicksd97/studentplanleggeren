"use client";

import { useEffect, useState } from "react";
import { pakker } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

const komplett = pakker.find((bundle) => bundle.featured)!;

export default function ProdukterStickyBar() {
  const [showBar, setShowBar] = useState(false);
  const { addItem, isInCart } = useCart();
  const [bundleFeedback, setBundleFeedback] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            Alle 25 fyllbare PDF-er
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
  );
}
