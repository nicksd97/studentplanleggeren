"use client";

import { useState } from "react";
import { pakker } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import Button from "@/components/ui/Button";
import FadeInOnScroll from "@/components/ui/FadeInOnScroll";
import KomplettVippsButton from "@/components/ui/KomplettVippsButton";
import { trackEvent } from "@/lib/track";
import { priceTierFor } from "@/lib/track-events";
import { localizePath } from "@/lib/i18n/config";
import { fmt } from "@/lib/i18n/format";
import { useMessages, usePricing } from "@/lib/i18n/provider";
import { itemDisplayName, localizeBundle, pdfLanguageCopy } from "@/lib/i18n/products";
import { useLocale } from "@/lib/i18n/use-locale";

/** "249 kr" -> ["", "249", "kr"], "€21.99" -> ["€", "21.99", ""], so the number can be big. */
function splitMoney(formatted: string): [string, string, string] {
  const match = /^(\D*?)(\d[\d.,\s\u00a0]*\d|\d)(\D*)$/.exec(formatted);
  if (!match) return ["", formatted, ""];
  return [match[1].trim(), match[2], match[3].trim()];
}

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
  const t = useMessages().bundleShowcase;
  const bundle = pakker.find((p) => p.id === bundleId)!;

  function handleAdd() {
    if (isInCart(bundle.id)) {
      setFeedback(t.alreadyInCart);
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
    setFeedback(t.added);
    setTimeout(() => setFeedback(null), 2000);
  }

  return (
    <Button variant={variant} className={className} onClick={handleAdd}>
      {feedback ?? label}
    </Button>
  );
}

export default function BundleShowcase() {
  const locale = useLocale();
  const messages = useMessages();
  const t = messages.bundleShowcase;
  const { point, fill, vipps } = usePricing();
  const featured = localizeBundle(pakker.find((p) => p.featured)!, messages);
  const categoryBundles = pakker.filter((p) => !p.featured).map((p) => localizeBundle(p, messages));
  const pdfLanguage = pdfLanguageCopy(locale, messages).sentence;
  const [pricePrefix, priceNumber, priceSuffix] = splitMoney(point(featured.price));

  return (
    <section id="pakker" className="relative bg-brand-pale py-24 md:py-32">
      <div className="dot-pattern" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeInOnScroll>
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-3">
              {t.label}
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold text-brand-dark mb-4 text-shadow-sm">
              {t.heading}
            </h2>
            <p className="text-brand-medium max-w-2xl mx-auto">
              {pdfLanguage ? `${featured.description} ${pdfLanguage}` : featured.description}
            </p>
          </div>
        </FadeInOnScroll>

        {/* Product preview fan */}
        <FadeInOnScroll delay={100}>
          <div className="flex justify-center items-center py-12 max-w-2xl mx-auto group">
            {[
              { src: "daglig-planlegger.jpg", id: "daglig-planlegger", alt: "Daglig Planlegger", rotate: "-rotate-6", hover: "group-hover:-translate-x-8 group-hover:-translate-y-2 group-hover:-rotate-12" },
              { src: "ukentlig-plan.jpg", id: "ukentlig-plan", alt: "Ukentlig Plan", rotate: "rotate-2", hover: "group-hover:-translate-x-2 group-hover:-translate-y-1" },
              { src: "pomodoro-planlegger.jpg", id: "pomodoro-planlegger", alt: "Pomodoro Planlegger", rotate: "-rotate-2", hover: "group-hover:translate-x-2 group-hover:-translate-y-1" },
              { src: "vane-tracker.jpg", id: "vane-tracker", alt: "Vane Tracker", rotate: "rotate-6", hover: "group-hover:translate-x-8 group-hover:-translate-y-2 group-hover:rotate-12" },
            ].map((item, i) => (
              <div
                key={item.src}
                className={`w-52 h-72 rounded-md border-[3px] border-white shadow-xl overflow-hidden shrink-0 bg-white transition-all duration-500 ease-out ${item.rotate} ${item.hover} ${i > 0 ? "-ml-8" : ""}`}
              >
                <img
                  src={`/images/products/${item.src}`}
                  alt={itemDisplayName({ id: item.id, name: item.alt }, messages)}
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
              {t.includedTitle}
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {t.includes.map((item) => (
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
            <div className="flex items-baseline justify-center gap-3 mb-8">
              {pricePrefix && (
                <span className="text-brand-dark/70 text-2xl font-bold">{pricePrefix}</span>
              )}
              <span className="font-[family-name:var(--font-display)] text-6xl md:text-7xl font-bold text-brand-dark text-shadow-sm">
                {priceNumber}
              </span>
              {priceSuffix && (
                <span className="text-brand-dark/70 text-2xl font-bold">{priceSuffix}</span>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {vipps ? (
                <KomplettVippsButton
                  source="pakker"
                  label={fmt(t.buyKomplett, { price: point(featured.price) })}
                  className="text-lg px-10 py-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                />
              ) : (
                // Vipps only takes NOK; other currencies add the bundle to the cart for card checkout.
                <BundleButton
                  bundleId={featured.id}
                  label={fmt(t.addKomplett, { price: point(featured.price) })}
                  className="text-lg px-10 py-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                />
              )}
              <Button
                href={localizePath("/produkter", locale)}
                data-cta="pakker_produkter"
                variant="outline"
                className="text-lg px-10 py-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 bg-white/50"
              >
                {t.seeAll}
              </Button>
            </div>
          </div>
        </FadeInOnScroll>

        {/* Category bundles — compact row */}
        <FadeInOnScroll delay={400}>
          <div className="border-t border-brand-soft/60 pt-10">
            <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium text-center mb-6">
              {t.orPick}
            </p>
            <p className="text-sm text-brand-medium text-center mb-6">
              {fill(t.packsNote)}
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
                      {fmt(t.bundleMeta, { count: bundle.productIds.length, price: point(bundle.price) })}
                    </p>
                  </div>
                  <BundleButton
                    bundleId={bundle.id}
                    label={t.buy}
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
