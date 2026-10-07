"use client";

import { useState } from "react";
import type { Bundle } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import Button from "./Button";
import KomplettVippsButton from "./KomplettVippsButton";
import { trackEvent } from "@/lib/track";
import { priceTierFor } from "@/lib/track-events";

function useBundleCart(bundle: Bundle) {
  const { addItem, isInCart } = useCart();
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleAdd() {
    if (isInCart(bundle.id)) {
      setFeedback("Allerede i handlekurven");
      setTimeout(() => setFeedback(null), 2000);
      return;
    }
    addItem({
      id: bundle.id,
      name: bundle.name,
      price: bundle.price,
      type: "bundle",
    });
    trackEvent("add_to_cart", { product: bundle.id, tier: priceTierFor({ id: bundle.id, type: "bundle", price: bundle.price }) });
    setFeedback("Lagt til \u2713");
    setTimeout(() => setFeedback(null), 2000);
  }

  return { handleAdd, feedback };
}

function FeaturedKomplettCard({ bundle }: { bundle: Bundle }) {
  return (
      <div className="relative max-w-[560px] mx-auto bg-brand-dark rounded-2xl border-2 border-brand-accent shadow-2xl overflow-hidden">
        {/* Ribbon */}
        <div className="bg-brand-accent text-brand-dark text-center py-2 text-sm font-medium">
          ✦ Best verdi ✦
        </div>

        <div className="p-8 md:p-10">
          <h3 className="font-[family-name:var(--font-display)] text-3xl font-bold text-white mb-3">
            {bundle.name}
          </h3>
          <p className="text-brand-soft text-sm mb-6">{bundle.description}</p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-8">
            <span className="font-[family-name:var(--font-display)] text-5xl md:text-6xl font-bold text-white">
              {bundle.price}
            </span>
            <span className="text-white/70 text-xl">kr</span>
          </div>

          {/* Includes */}
          <div className="space-y-2.5 mb-8">
            {[
              "5 daglige planleggere",
              "5 ukentlige planleggere",
              "3 månedlige planleggere",
              "1 årlig planlegger",
              "5 produktivitetsverktøy",
              "3 helse og livsstil",
              "3 sporingsverktøy",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-brand-accent shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>

          <KomplettVippsButton
            source="pakkekort"
            fullWidth
            className="text-base py-4"
            label={`Kjøp komplett pakke med Vipps — ${bundle.price} kr`}
          />
          <p className="text-center text-white/30 text-xs mt-3">
            Umiddelbar nedlasting · Ingen abonnement
          </p>
        </div>
      </div>
    );
}

export default function BundleCard({ bundle }: { bundle: Bundle }) {
  const { handleAdd, feedback } = useBundleCart(bundle);

  if (bundle.featured) {
    return <FeaturedKomplettCard bundle={bundle} />;
  }

  return (
    <div className="bg-white rounded-2xl border border-brand-soft p-6 md:p-8 relative">
      <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand-dark mb-2">
        {bundle.name}
      </h3>
      <p className="text-sm text-brand-medium mb-1">
        {bundle.productIds.length} planleggere · Fyllbar PDF
      </p>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="font-[family-name:var(--font-display)] text-3xl font-bold text-brand-dark">
          {bundle.price} kr
        </span>
      </div>
      <Button variant="secondary" fullWidth onClick={handleAdd}>
        {feedback ?? "Kjøp pakke"}
      </Button>
    </div>
  );
}
