"use client";

import { useState } from "react";
import { pakker, alleProdukter } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const previewProducts = alleProdukter.slice(0, 8);

function BundleButton({
  bundleId,
  label,
  variant = "primary",
  className = "",
  fullWidth = false,
}: {
  bundleId: string;
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
  fullWidth?: boolean;
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
    <Button
      variant={variant}
      className={className}
      fullWidth={fullWidth}
      onClick={handleAdd}
    >
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

        {/* Featured bundle card */}
        <div className="bg-white rounded-2xl border border-brand-soft shadow-lg overflow-hidden mb-10 max-w-2xl mx-auto">
          {/* Preview grid */}
          <div className="grid grid-cols-3 gap-0.5 bg-brand-soft/50 p-0.5">
            {previewProducts.map((product) => (
              <div key={product.id} className="relative aspect-[3/4] bg-brand-pale overflow-hidden">
                <img
                  src={`/images/products/${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            ))}
            {/* "og 17 til..." overlay on last cell */}
            <div className="relative aspect-[3/4] bg-brand-dark/80 flex items-center justify-center">
              <span className="text-white text-sm font-medium text-center px-2">
                og {alleProdukter.length - previewProducts.length} til...
              </span>
            </div>
          </div>

          {/* Price block */}
          <div className="p-6 md:p-8 text-center">
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
        </div>

        {/* Category bundles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {categoryBundles.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-white rounded-2xl border border-brand-soft p-6 md:p-8 relative"
            >
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
                <span className="text-brand-medium/60 line-through text-sm">
                  {bundle.originalPrice} kr
                </span>
                <Badge variant="accent" className="ml-1">
                  Spar {bundle.savingsPercent}%
                </Badge>
              </div>
              <BundleButton
                bundleId={bundle.id}
                label="Kjøp pakke"
                variant="secondary"
                fullWidth
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
