"use client";

import { useState } from "react";
import { pakker } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const includes = [
  "5 daglige planleggere",
  "5 ukentlige planleggere",
  "3 månedlige planleggere",
  "1 årsplanlegger",
  "5 produktivitetsverktøy",
  "3 helse og livsstil",
  "3 sporingsverktøy",
  "12 papirmaler",
];

function BundleButton({
  bundleId,
  label,
  variant = "primary",
  className = "",
}: {
  bundleId: string;
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const { addItem, isInCart } = useCart();
  const [feedback, setFeedback] = useState<string | null>(null);
  const bundle = pakker.find((p) => p.id === bundleId)!;

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
    setFeedback("Lagt til \u2713");
    setTimeout(() => setFeedback(null), 2000);
  }

  return (
    <Button variant={variant} className={className} onClick={handleAdd}>
      {feedback ?? label}
    </Button>
  );
}

export default function BundleShowcase() {
  const featured = pakker.find((p) => p.featured)!;
  const categoryBundles = pakker.filter((p) => !p.featured);

  return (
    <section id="pakker" className="relative bg-brand-pale py-20 md:py-28">
      <div className="dot-pattern" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-3">
            ✦ Alt du trenger ✦
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-brand-dark mb-4">
            Studentplanlegger Komplett
          </h2>
          <p className="text-brand-medium max-w-2xl mx-auto">
            {featured.description}
          </p>
        </div>

        {/* What's included */}
        <div className="max-w-lg mx-auto mb-10">
          <p className="text-sm font-medium text-brand-dark text-center mb-4">
            25 planleggere inkludert:
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {includes.map((item) => (
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
                <span className="text-sm text-brand-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price block */}
        <div className="text-center mb-10">
          <div className="flex items-baseline justify-center gap-3 mb-2">
            <span className="font-[family-name:var(--font-display)] text-5xl font-bold text-brand-dark">
              {featured.price}
            </span>
            <span className="text-brand-dark/70 text-xl">kr</span>
            <span className="text-brand-medium/60 line-through text-lg">
              {featured.originalPrice} kr
            </span>
          </div>
          <div className="mb-6">
            <Badge variant="accent">Spar {featured.savingsPercent}%</Badge>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <BundleButton
              bundleId="komplett"
              label={`Kjøp komplett pakke — ${featured.price} kr`}
              variant="primary"
              className="text-base px-8 py-3.5"
            />
            <Button
              href="/produkter"
              variant="outline"
              className="text-base px-8 py-3.5"
            >
              Se alle 25 planleggere
            </Button>
          </div>
        </div>

        {/* Category bundles — compact row */}
        <div className="border-t border-brand-soft/60 pt-8">
          <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium text-center mb-5">
            ✦ Eller velg en pakke ✦
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
            {categoryBundles.map((bundle) => (
              <div
                key={bundle.id}
                className="flex items-center justify-between gap-3 bg-white rounded-xl border border-brand-soft px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-brand-dark truncate">
                    {bundle.name}
                  </p>
                  <p className="text-xs text-brand-medium">
                    {bundle.productIds.length} planleggere · {bundle.price} kr
                  </p>
                </div>
                <BundleButton
                  bundleId={bundle.id}
                  label="Kjøp"
                  variant="secondary"
                  className="text-xs px-4 py-1.5 shrink-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
