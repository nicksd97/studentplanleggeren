"use client";

import { useState } from "react";
import { pakker } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/landing/Eyebrow";
import Reveal from "@/components/landing/Reveal";

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

const fan = [
  { src: "daglig-planlegger.jpg", rotate: "-rotate-6", hover: "group-hover:-translate-x-8 group-hover:-translate-y-2 group-hover:-rotate-12" },
  { src: "ukentlig-plan.jpg", rotate: "rotate-2", hover: "group-hover:-translate-x-2 group-hover:-translate-y-1" },
  { src: "pomodoro-planlegger.jpg", rotate: "-rotate-2", hover: "group-hover:translate-x-2 group-hover:-translate-y-1" },
  { src: "vane-tracker.jpg", rotate: "rotate-6", hover: "group-hover:translate-x-8 group-hover:-translate-y-2 group-hover:rotate-12" },
];

function BundleButton({
  bundleId,
  label,
  variant = "primary",
  className = "",
}: {
  bundleId: string;
  label: string;
  variant?: "primary" | "ghost";
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
    setFeedback("Lagt til ✓");
    setTimeout(() => setFeedback(null), 2000);
  }

  return (
    <Button variant={variant} className={className} onClick={handleAdd}>
      {feedback ?? label}
    </Button>
  );
}

function Check() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-brand-accent"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function BundleShowcase() {
  const featured = pakker.find((p) => p.featured)!;
  const categoryBundles = pakker.filter((p) => !p.featured);

  return (
    <section id="pakker" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <Eyebrow n="05">Alt du trenger</Eyebrow>
          <h2 className="mt-4 font-[family-name:var(--font-display)] font-bold leading-[0.95] tracking-[-0.02em] text-[clamp(2.5rem,6vw,5.5rem)] text-ink">
            Studentplanlegger <span className="italic font-normal text-ink/80">Komplett</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg text-ink-muted leading-relaxed">
            {featured.description}
          </p>
        </Reveal>

        {/* Product fan + what's included / price */}
        <div className="mt-16 grid grid-cols-1 gap-14 md:mt-20 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Product preview fan */}
          <Reveal delay={100} className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[55%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/10 blur-3xl"
            />
            <div className="group relative flex items-center justify-center py-6 lg:py-10">
              {fan.map((item, i) => (
                <div
                  key={item.src}
                  className={`aspect-[13/18] w-[31%] shrink-0 overflow-hidden rounded-lg border-[3px] border-white/10 bg-white/[0.04] shadow-2xl transition-all duration-500 ease-out ${item.rotate} ${item.hover} ${i > 0 ? "-ml-[8%]" : ""}`}
                >
                  <img
                    src={`/images/products/${item.src}`}
                    alt=""
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              ))}
            </div>
          </Reveal>

          {/* What's included + price */}
          <Reveal delay={200} stagger={0.12}>
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-ink-muted">
                25 planleggere inkludert:
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {includes.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check />
                    <span className="text-base text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="my-10 h-px bg-line" />

            {/* Price block */}
            <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
              <div className="flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-display)] font-bold leading-none tracking-[-0.03em] text-[clamp(4rem,10vw,8rem)] text-ink">
                  {featured.price}
                </span>
                <span className="font-[family-name:var(--font-display)] text-2xl text-ink/80 md:text-3xl">
                  kr
                </span>
              </div>
              <div className="flex items-center gap-3 pb-2 md:pb-4">
                <span className="text-lg text-ink-muted line-through md:text-xl">
                  {featured.originalPrice} kr
                </span>
                <span className="inline-flex items-center justify-center rounded-full bg-brand-accent px-3.5 py-1.5 text-sm font-bold text-brand-dark">
                  Spar {featured.savingsPercent}%
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <BundleButton
                bundleId="komplett"
                label={`Kjøp komplett pakke — ${featured.price} kr`}
                variant="primary"
                className="px-8 py-4 text-base shadow-[0_0_32px_rgba(196,168,130,0.35)] hover:-translate-y-0.5 sm:px-10"
              />
              <Button
                href="/produkter"
                variant="ghost"
                className="px-8 py-4 text-base hover:-translate-y-0.5 sm:px-10"
              >
                Se alle 25 planleggere
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Category bundles */}
        <div className="mt-20 md:mt-28">
          <Reveal>
            <div className="flex items-center gap-5">
              <p className="shrink-0 text-[11px] uppercase tracking-[0.25em] text-ink-muted">
                Eller velg en pakke
              </p>
              <div className="h-px flex-1 bg-line" />
            </div>
          </Reveal>
          <Reveal stagger={0.12} className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {categoryBundles.map((bundle) => (
              <div
                key={bundle.id}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-brand-accent/40 hover:bg-surface-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{bundle.name}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {bundle.productIds.length} planleggere · {bundle.price} kr
                  </p>
                </div>
                <BundleButton
                  bundleId={bundle.id}
                  label="Kjøp"
                  variant="ghost"
                  className="min-h-11 shrink-0 px-5 py-2 text-xs"
                />
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
