"use client";

import { useEffect } from "react";
import Link from "next/link";
import { cartAmountMinor, cartPricingSummary } from "@/lib/checkout";
import { priceMinor } from "@/lib/currency";
import { FIVE_PACK_PRICE, FIVE_PACK_SIZE } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import Button from "./Button";
import { localizePath } from "@/lib/i18n/config";
import { fmt } from "@/lib/i18n/format";
import { useMessages, usePricing } from "@/lib/i18n/provider";
import { itemDisplayName } from "@/lib/i18n/products";
import { useLocale } from "@/lib/i18n/use-locale";

export default function CartPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, removeItem, clearCart } = useCart();
  const pricing = cartPricingSummary(items);
  const locale = useLocale();
  const messages = useMessages();
  const t = messages.cart;
  const { currency, money, point, fill } = usePricing();
  const totalMinor = cartAmountMinor(items, currency) ?? 0;

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-white shadow-2xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-soft">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand-dark">
            {t.title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-brand-medium hover:text-brand-dark transition-colors cursor-pointer"
            aria-label={t.close}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="h-16 w-16 text-brand-soft mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-brand-medium mb-4">{t.empty}</p>
              <Link
                href={localizePath("/produkter", locale)}
                data-cta="handlekurv_produkter"
                onClick={onClose}
                className="text-sm text-brand-accent hover:underline font-medium"
              >
                {t.seeProducts}
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 rounded-xl bg-brand-pale/50 p-3"
                >
                  {item.image && (
                    <img
                      src={`/images/products/${item.image}`}
                      alt={itemDisplayName(item, messages)}
                      className="h-14 w-14 rounded-lg object-cover object-top shrink-0"
                    />
                  )}
                  {!item.image && (
                    <div className="h-14 w-14 rounded-lg bg-brand-pale shrink-0 flex items-center justify-center">
                      <svg className="h-6 w-6 text-brand-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-dark truncate">
                      {itemDisplayName(item, messages)}
                    </p>
                    {(item.type === "bundle" || !pricing?.fivePacks) && (
                      <p className="text-sm text-brand-medium">{point(item.price)}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-brand-medium hover:text-red-500 transition-colors cursor-pointer shrink-0"
                    aria-label={fmt(t.remove, { name: itemDisplayName(item, messages) })}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-brand-soft px-6 py-5 space-y-4">
            {pricing && pricing.fivePacks > 0 ? (
              <p className="text-sm text-brand-medium">
                {pricing.fivePacks === 1
                  ? fill(t.onePack)
                  : fmt(t.manyPacks, {
                      packs: pricing.fivePacks,
                      price: money(pricing.fivePacks * priceMinor(FIVE_PACK_PRICE, currency)),
                    })}
                {pricing.singleCount % FIVE_PACK_SIZE > 0
                  ? fmt(t.singles, { count: pricing.singleCount % FIVE_PACK_SIZE })
                  : ""}
              </p>
            ) : pricing && pricing.singleCount > 0 && pricing.singleCount < FIVE_PACK_SIZE ? (
              <p className="text-sm text-brand-medium">
                {fill(fmt(t.addMore, { count: FIVE_PACK_SIZE - pricing.singleCount }))}
              </p>
            ) : null}
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-medium">{t.total}</span>
              <span className="font-[family-name:var(--font-display)] text-xl font-bold text-brand-dark">
                {money(totalMinor)}
              </span>
            </div>
            <Button href={localizePath("/kasse", locale)} data-cta="handlekurv_kasse" variant="primary" fullWidth onClick={onClose}>
              {t.checkout}
            </Button>
            <button
              onClick={clearCart}
              className="block w-full text-center text-xs text-brand-medium hover:text-brand-dark transition-colors cursor-pointer"
            >
              {t.clear}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
