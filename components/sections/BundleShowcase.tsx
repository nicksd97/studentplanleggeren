"use client";

import { useState } from "react";
import { pakker } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import FadeInOnScroll from "@/components/ui/FadeInOnScroll";

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
    <section id="pakker" className="relative bg-brand-pale py-24 md:py-32">
      <div className="dot-pattern" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeInOnScroll>
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-3">
              ✦ Alt du trenger ✦
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold text-brand-dark mb-4 text-shadow-sm">
              Studentplanlegger Komplett
            </h2>
            <p className="text-brand-medium max-w-2xl mx-auto">
              {featured.description}
            </p>
          </div>
        </FadeInOnScroll>

        {/* Product preview fan */}
        <FadeInOnScroll delay={100}>
          <div className="flex justify-center items-center py-12 max-w-2xl mx-auto group">
            {[
              { src: "daglig-planlegger.jpg", rotate: "-rotate-6", hover: "group-hover:-translate-x-8 group-hover:-translate-y-2 group-hover:-rotate-12" },
              { src: "ukentlig-plan.jpg", rotate: "rotate-2", hover: "group-hover:-translate-x-2 group-hover:-translate-y-1" },
              { src: "pomodoro-planlegger.jpg", rotate: "-rotate-2", hover: "group-hover:translate-x-2 group-hover:-translate-y-1" },
              { src: "vane-tracker.jpg", rotate: "rotate-6", hover: "group-hover:translate-x-8 group-hover:-translate-y-2 group-hover:rotate-12" },
            ].map((item, i) => (
              <div
                key={item.src}
                className={`w-52 h-72 rounded-md border-[3px] border-white shadow-xl overflow-hidden shrink-0 bg-white transition-all duration-500 ease-out ${item.rotate} ${item.hover} ${i > 0 ? "-ml-8" : ""}`}
              >
                <img
                  src={`/images/products/${item.src}`}
                  alt=""
                  className="w-full h-full object-cover object-top"
                />
              </div>
            ))}
          </div>
        </FadeInOnScroll>

        {/* What's included */}
        <FadeInOnScroll delay={200}>
          <div className="max-w-lg mx-auto mb-10 mt-6">
            <p className="text-sm font-bold text-brand-dark text-center mb-5">
              25 planleggere inkludert:
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {includes.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-brand-accent shrink-0"
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
                  <span className="text-base font-medium text-brand-dark">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeInOnScroll>

        {/* Price block */}
        <FadeInOnScroll delay={300}>
          <div className="text-center mb-16">
            <div className="flex items-baseline justify-center gap-3 mb-3">
              <span className="font-[family-name:var(--font-display)] text-6xl md:text-7xl font-bold text-brand-dark text-shadow-sm">
                {featured.price}
              </span>
              <span className="text-brand-dark/70 text-2xl font-bold">kr</span>
              <span className="text-brand-medium/60 line-through text-xl">
                {featured.originalPrice} kr
              </span>
            </div>
            <div className="mb-8">
              <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-brand-accent text-brand-dark font-bold shadow-sm">Spar {featured.savingsPercent}%</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <BundleButton
                bundleId="komplett"
                label={`Kjøp komplett pakke — ${featured.price} kr`}
                variant="primary"
                className="text-lg px-10 py-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              />
              <Button
                href="/produkter"
                variant="outline"
                className="text-lg px-10 py-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 bg-white/50"
              >
                Se alle 25 planleggere
              </Button>
            </div>
          </div>
        </FadeInOnScroll>

        {/* Category bundles — compact row */}
        <FadeInOnScroll delay={400}>
          <div className="border-t border-brand-soft/60 pt-10">
            <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium text-center mb-6">
              ✦ Eller velg en pakke ✦
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {categoryBundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className="flex items-center justify-between gap-3 bg-white rounded-xl border border-brand-soft px-5 py-4 transition-all duration-300 hover:border-brand-accent hover:shadow-md hover:-translate-y-0.5 group"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-brand-dark truncate group-hover:text-brand-medium transition-colors">
                      {bundle.name}
                    </p>
                    <p className="text-xs text-brand-medium mt-0.5">
                      {bundle.productIds.length} planleggere · {bundle.price} kr
                    </p>
                  </div>
                  <BundleButton
                    bundleId={bundle.id}
                    label="Kjøp"
                    variant="secondary"
                    className="text-xs px-5 py-2 shrink-0 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
