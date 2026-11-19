"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/lib/cart-context";
import { currentCampaignTags } from "@/lib/attribution";
import { cartAmountMinor, cartPricingSummary, isCardCheckoutAllowed } from "@/lib/checkout";
import { priceMinor, type Currency } from "@/lib/currency";
import { currentDiscountCode, rememberDiscountCode } from "@/lib/discount";
import { FIVE_PACK_PRICE, FIVE_PACK_SIZE, SINGLE_PRICE } from "@/lib/products";
import Button from "@/components/ui/Button";
import { trackEvent, trackOnce } from "@/lib/track";
import { cartTier } from "@/lib/track-events";
import { translateApiError } from "@/lib/i18n/api-errors";
import { localizePath } from "@/lib/i18n/config";
import { fmt } from "@/lib/i18n/format";
import { useMessages, usePricing } from "@/lib/i18n/provider";
import { itemDisplayName, pdfLanguageCopy } from "@/lib/i18n/products";
import { useLocale } from "@/lib/i18n/use-locale";

// Also rendered at /<lang>/kasse; the language comes from I18nProvider. Prices are shown in the
// visitor's currency (sp_currency cookie); the server recomputes every amount from its own table.
export default function KassePage() {
  const { items, totalPrice, removeItem } = useCart();
  const cardCheckoutAllowed = isCardCheckoutAllowed();
  const locale = useLocale();
  const messages = useMessages();
  const t = messages.kasse;
  const { currency, money, point, vipps } = usePricing();
  const pdfLanguage = pdfLanguageCopy(locale, messages).short;

  const [form, setForm] = useState({
    fornavn: "",
    etternavn: "",
    epost: "",
    epostBekreft: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingProvider, setLoadingProvider] = useState<"vipps" | "stripe" | null>(null);
  const [paymentError, setPaymentError] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeMessage, setCodeMessage] = useState("");
  const [codeBusy, setCodeBusy] = useState(false);
  const [applied, setApplied] = useState<{
    code: string;
    currency: Currency;
    amountMinor: number;
    listAmountMinor: number;
    discountMinor: number;
    percent: number;
    associationName: string;
  } | null>(null);
  const loading = loadingProvider !== null;

  const pricing = cartPricingSummary(items);
  const listAmountMinor = cartAmountMinor(items, currency) ?? totalPrice * 100;
  // A preview made in another currency (cookie changed) is not shown.
  const activeDiscount = applied && applied.currency === currency ? applied : null;
  const displayTotal = activeDiscount?.amountMinor ?? listAmountMinor;

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.fornavn.trim()) errs.fornavn = t.errors.firstName;
    if (!form.etternavn.trim()) errs.etternavn = t.errors.lastName;
    if (!form.epost.trim()) {
      errs.epost = t.errors.email;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.epost)) {
      errs.epost = t.errors.emailInvalid;
    }
    if (!form.epostBekreft.trim()) {
      errs.epostBekreft = t.errors.confirm;
    } else if (form.epost !== form.epostBekreft) {
      errs.epostBekreft = t.errors.mismatch;
    }
    return errs;
  }

  async function previewCode(code: string, source: "lagret" | "manuell") {
    const trimmed = code.trim();
    if (!trimmed) {
      setApplied(null);
      setCodeError("");
      setCodeMessage("");
      return;
    }

    setCodeBusy(true);
    setCodeError("");
    setCodeMessage("");
    try {
      const response = await fetch("/api/rabattkode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: trimmed,
          currency,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            type: item.type,
          })),
        }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        amountNok?: number;
        percent?: number;
        associationName?: string;
        code?: string;
        currency?: Currency;
        amountMinor?: number;
        listAmountMinor?: number;
        discountMinor?: number;
      };
      if (!data.ok || !data.code || data.amountMinor == null) {
        setApplied(null);
        setCodeError(data.error || t.invalidCode);
        return;
      }
      rememberDiscountCode(data.code);
      trackOnce(`rabatt_${data.code}`, "discount_applied", { code: data.code, source });
      setApplied({
        code: data.code,
        currency: data.currency ?? currency,
        amountMinor: data.amountMinor,
        listAmountMinor: data.listAmountMinor ?? listAmountMinor,
        discountMinor: data.discountMinor ?? 0,
        percent: data.percent ?? 0,
        associationName: data.associationName ?? "",
      });
      setCodeMessage(
        fmt(t.codeActive, {
          code: data.code,
          percent: data.percent ?? 0,
          association: data.associationName ?? "",
          amount: money(data.amountMinor),
        }),
      );
    } catch {
      setApplied(null);
      setCodeError(t.invalidCode);
    } finally {
      setCodeBusy(false);
    }
  }

  useEffect(() => {
    const betaling = new URLSearchParams(window.location.search).get("betaling");
    if (betaling === "avbrutt") {
      setPaymentError(t.cancelled);
    }
    const stored = currentDiscountCode();
    if (stored) {
      setCodeInput(stored);
      void previewCode(stored, "lagret");
    }
    // Preview the landing ?kode= once; later item edits use Bruk.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handlePayment(provider: "vipps" | "stripe") {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    trackEvent("checkout_start", {
      method: provider === "vipps" ? "vipps" : "kort",
      tier: cartTier(items),
      source: "kasse",
    });
    setLoadingProvider(provider);
    setPaymentError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.epost,
          firstName: form.fornavn,
          lastName: form.etternavn,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            type: item.type,
          })),
          amountNok: totalPrice,
          paymentProvider: provider,
          currency,
          locale,
          campaign: currentCampaignTags(),
          discountCode: (applied?.code || codeInput).trim() || undefined,
        }),
      });

      const data = await response.json();

      if (data.redirectUrl) {
        window.location.assign(data.redirectUrl);
        return;
      }

      setPaymentError(translateApiError(data.error, messages, t.genericError));
    } catch {
      setPaymentError(t.genericError);
    } finally {
      setLoadingProvider(null);
    }
  }

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-28 pb-20 px-4">
          <div className="max-w-md mx-auto text-center">
            <svg className="h-20 w-20 text-brand-soft mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-brand-dark mb-3">
              {t.emptyTitle}
            </h1>
            <p className="text-brand-medium mb-6">
              {t.emptyText}
            </p>
            <Button href={localizePath("/#planleggere", locale)} data-cta="kasse_tom_produkter" variant="primary">
              {t.seeProducts}
            </Button>
          </div>
        </main>
        <Footer locale={locale} />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-20 px-4">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-brand-dark mb-8 text-center text-shadow-sm">
            {t.title}
          </h1>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-3 mb-10 text-sm font-medium">
            <span className="flex items-center gap-2 text-brand-dark font-bold">
              <span className="h-6 w-6 rounded-full bg-brand-accent text-brand-dark flex items-center justify-center text-xs shadow-sm">1</span>
              {t.steps[0]}
            </span>
            <span className="w-8 h-[2px] bg-brand-accent/30 rounded-full"></span>
            <span className="flex items-center gap-2 text-brand-medium">
              <span className="h-6 w-6 rounded-full border-2 border-brand-soft flex items-center justify-center text-xs">2</span>
              {t.steps[1]}
            </span>
            <span className="w-8 h-[2px] bg-brand-soft rounded-full"></span>
            <span className="flex items-center gap-2 text-brand-medium">
              <span className="h-6 w-6 rounded-full border-2 border-brand-soft flex items-center justify-center text-xs">3</span>
              {t.steps[2]}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left: Order form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-brand-soft p-8">
                <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand-dark mb-6">
                  {t.details}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1.5">
                      {t.firstName}
                    </label>
                    <input
                      type="text"
                      value={form.fornavn}
                      onChange={(e) => handleChange("fornavn", e.target.value)}
                      className={`w-full rounded-lg border px-4 py-3.5 text-sm text-brand-dark bg-brand-cream/50 outline-none transition-all shadow-sm focus:ring-2 focus:ring-brand-accent/40 focus:border-brand-accent ${
                        errors.fornavn ? "border-red-400 focus:ring-red-400/40" : "border-brand-soft"
                      }`}
                      placeholder={t.firstNamePlaceholder}
                    />
                    {errors.fornavn && (
                      <p className="text-xs text-red-500 mt-1">{errors.fornavn}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1.5">
                      {t.lastName}
                    </label>
                    <input
                      type="text"
                      value={form.etternavn}
                      onChange={(e) => handleChange("etternavn", e.target.value)}
                      className={`w-full rounded-lg border px-4 py-3.5 text-sm text-brand-dark bg-brand-cream/50 outline-none transition-all shadow-sm focus:ring-2 focus:ring-brand-accent/40 focus:border-brand-accent ${
                        errors.etternavn ? "border-red-400 focus:ring-red-400/40" : "border-brand-soft"
                      }`}
                      placeholder={t.lastNamePlaceholder}
                    />
                    {errors.etternavn && (
                      <p className="text-xs text-red-500 mt-1">{errors.etternavn}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-brand-dark mb-1.5">
                    {t.email}
                  </label>
                  <input
                    type="email"
                    value={form.epost}
                    onChange={(e) => handleChange("epost", e.target.value)}
                    className={`w-full rounded-lg border px-4 py-3.5 text-sm text-brand-dark bg-brand-cream/50 outline-none transition-all shadow-sm focus:ring-2 focus:ring-brand-accent/40 focus:border-brand-accent ${
                      errors.epost ? "border-red-400 focus:ring-red-400/40" : "border-brand-soft"
                    }`}
                    placeholder={t.emailPlaceholder}
                  />
                  {errors.epost && (
                    <p className="text-xs text-red-500 mt-1">{errors.epost}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1.5">
                    {t.confirmEmail}
                  </label>
                  <input
                    type="email"
                    value={form.epostBekreft}
                    onChange={(e) => handleChange("epostBekreft", e.target.value)}
                    className={`w-full rounded-lg border px-4 py-3.5 text-sm text-brand-dark bg-brand-cream/50 outline-none transition-all shadow-sm focus:ring-2 focus:ring-brand-accent/40 focus:border-brand-accent ${
                      errors.epostBekreft ? "border-red-400 focus:ring-red-400/40" : "border-brand-soft"
                    }`}
                    placeholder={t.emailPlaceholder}
                  />
                  {errors.epostBekreft && (
                    <p className="text-xs text-red-500 mt-1">{errors.epostBekreft}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Order summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-brand-soft p-8 sticky top-24">
                <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand-dark mb-6">
                  {t.summary}
                </h2>

                <ul className="space-y-3 mb-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-brand-medium hover:text-red-500 transition-colors shrink-0 cursor-pointer"
                          aria-label={fmt(t.remove, { name: itemDisplayName(item, messages) })}
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <span className="text-sm text-brand-dark truncate">{itemDisplayName(item, messages)}</span>
                      </div>
                      {(item.type === "bundle" || !pricing?.fivePacks) && (
                        <span className="text-sm font-medium text-brand-dark shrink-0">
                          {point(item.price)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="border-t border-brand-soft pt-4 space-y-2 mb-6">
                  {pricing && pricing.fivePacks > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-medium">
                        {pricing.fivePacks === 1
                          ? t.fivePack
                          : `${pricing.fivePacks} × ${t.fivePack}`}
                      </span>
                      <span className="text-brand-dark">
                        {money(pricing.fivePacks * priceMinor(FIVE_PACK_PRICE, currency))}
                      </span>
                    </div>
                  )}
                  {pricing &&
                    pricing.fivePacks > 0 &&
                    pricing.singleCount % FIVE_PACK_SIZE > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-medium">
                        {pricing.singleCount % FIVE_PACK_SIZE === 1
                          ? t.singleOne
                          : fmt(t.singleOther, { count: pricing.singleCount % FIVE_PACK_SIZE })}
                      </span>
                      <span className="text-brand-dark">
                        {money((pricing.singleCount % FIVE_PACK_SIZE) * priceMinor(SINGLE_PRICE, currency))}
                      </span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-brand-soft space-y-2">
                    <label className="block text-sm font-medium text-brand-dark">
                      {t.discountCode}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={codeInput}
                        onChange={(event) => {
                          setCodeInput(event.target.value);
                          setCodeError("");
                          setCodeMessage("");
                        }}
                        className="min-w-0 flex-1 rounded-lg border border-brand-soft px-3 py-2.5 text-sm text-brand-dark bg-brand-cream/50 outline-none transition-all shadow-sm focus:ring-2 focus:ring-brand-accent/40 focus:border-brand-accent"
                        placeholder={t.discountPlaceholder}
                        autoComplete="off"
                        spellCheck={false}
                      />
                      <button
                        type="button"
                        onClick={() => void previewCode(codeInput, "manuell")}
                        disabled={codeBusy || loading}
                        className="shrink-0 rounded-lg border border-brand-soft bg-white px-3 py-2.5 text-sm font-medium text-brand-dark hover:bg-brand-cream/60 disabled:opacity-60"
                      >
                        {t.apply}
                      </button>
                    </div>
                    {codeError ? (
                      <p className="text-xs text-red-500">{t.invalidCode}</p>
                    ) : null}
                    {codeMessage ? (
                      <p className="text-xs text-brand-medium">{codeMessage}</p>
                    ) : null}
                  </div>
                  {activeDiscount && activeDiscount.discountMinor > 0 ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-medium">
                        {fmt(t.listPrice, { amount: money(activeDiscount.listAmountMinor) })}
                      </span>
                    </div>
                  ) : null}
                  <div className="flex justify-between pt-2 border-t border-brand-soft">
                    <span className="font-medium text-brand-dark">{t.total}</span>
                    <span className="font-[family-name:var(--font-display)] text-xl font-bold text-brand-dark">
                      {money(displayTotal)}
                    </span>
                  </div>
                </div>

                {/* Payment buttons */}
                <div className="space-y-3 mb-4">
                  {/* Vipps only takes NOK. */}
                  {vipps && (
                    <>
                    <button
                      onClick={() => handlePayment("vipps")}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-white transition-all hover:brightness-110 shadow-sm hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:hover:translate-y-0"
                      style={{ backgroundColor: "#FF5B24" }}
                    >
                      {loadingProvider === "vipps" ? (
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <>
                          {t.payVipps}
                          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                            {t.recommended}
                          </span>
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-brand-medium">{t.or}</p>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => handlePayment("stripe")}
                    disabled={!cardCheckoutAllowed || loading}
                    aria-disabled={!cardCheckoutAllowed}
                    className="w-full flex items-center justify-center gap-2 rounded-full border border-brand-soft bg-white py-3.5 text-sm font-medium text-brand-dark shadow-sm transition-all hover:bg-brand-cream/60 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {loadingProvider === "stripe" ? (
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        {t.payCard}
                      </>
                    )}
                  </button>
                </div>
                {!cardCheckoutAllowed && (
                  <p className="text-center text-xs text-brand-medium mb-3">
                    {t.cardDisabled}
                  </p>
                )}

                {paymentError && (
                  <p className="text-center text-sm text-red-500 mb-3">{paymentError}</p>
                )}

                <p className="text-center text-xs text-brand-medium mb-2">
                  {pdfLanguage ? `${t.secure} · ${pdfLanguage}` : t.secure}
                </p>
                <p className="text-center text-[10px] text-brand-medium/60">
                  {t.acceptTerms}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
