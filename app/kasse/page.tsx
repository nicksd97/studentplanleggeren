"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/lib/cart-context";
import { pakker } from "@/lib/products";
import Button from "@/components/ui/Button";

export default function KassePage() {
  const { items, totalPrice, removeItem } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    fornavn: "",
    etternavn: "",
    epost: "",
    epostBekreft: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const bundleItems = items.filter((i) => i.type === "bundle");
  const totalSavings = bundleItems.reduce((sum, item) => {
    const bundle = pakker.find((p) => p.id === item.id);
    return sum + (bundle ? bundle.originalPrice - bundle.price : 0);
  }, 0);

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.fornavn.trim()) errs.fornavn = "Fornavn er påkrevd";
    if (!form.etternavn.trim()) errs.etternavn = "Etternavn er påkrevd";
    if (!form.epost.trim()) {
      errs.epost = "E-post er påkrevd";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.epost)) {
      errs.epost = "Ugyldig e-postadresse";
    }
    if (!form.epostBekreft.trim()) {
      errs.epostBekreft = "Bekreft e-posten din";
    } else if (form.epost !== form.epostBekreft) {
      errs.epostBekreft = "E-postadressene stemmer ikke overens";
    }
    return errs;
  }

  function handlePay() {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      router.push(`/takk?order=demo&email=${encodeURIComponent(form.epost)}`);
    }, 1000);
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
              Handlekurven er tom
            </h1>
            <p className="text-brand-medium mb-6">
              Legg til produkter før du går til kassen.
            </p>
            <Button href="/#planleggere" variant="primary">
              Se produkter
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-20 px-4">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-brand-dark mb-10 text-center">
            Kasse
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left: Order form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-brand-soft p-6 md:p-8">
                <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand-dark mb-6">
                  Dine opplysninger
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1.5">
                      Fornavn
                    </label>
                    <input
                      type="text"
                      value={form.fornavn}
                      onChange={(e) => handleChange("fornavn", e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3 text-sm text-brand-dark bg-brand-cream/50 outline-none transition-colors focus:border-brand-accent ${
                        errors.fornavn ? "border-red-400" : "border-brand-soft"
                      }`}
                      placeholder="Ola"
                    />
                    {errors.fornavn && (
                      <p className="text-xs text-red-500 mt-1">{errors.fornavn}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1.5">
                      Etternavn
                    </label>
                    <input
                      type="text"
                      value={form.etternavn}
                      onChange={(e) => handleChange("etternavn", e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3 text-sm text-brand-dark bg-brand-cream/50 outline-none transition-colors focus:border-brand-accent ${
                        errors.etternavn ? "border-red-400" : "border-brand-soft"
                      }`}
                      placeholder="Nordmann"
                    />
                    {errors.etternavn && (
                      <p className="text-xs text-red-500 mt-1">{errors.etternavn}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-brand-dark mb-1.5">
                    E-post
                  </label>
                  <input
                    type="email"
                    value={form.epost}
                    onChange={(e) => handleChange("epost", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm text-brand-dark bg-brand-cream/50 outline-none transition-colors focus:border-brand-accent ${
                      errors.epost ? "border-red-400" : "border-brand-soft"
                    }`}
                    placeholder="ola@example.com"
                  />
                  {errors.epost && (
                    <p className="text-xs text-red-500 mt-1">{errors.epost}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1.5">
                    Bekreft e-post
                  </label>
                  <input
                    type="email"
                    value={form.epostBekreft}
                    onChange={(e) => handleChange("epostBekreft", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm text-brand-dark bg-brand-cream/50 outline-none transition-colors focus:border-brand-accent ${
                      errors.epostBekreft ? "border-red-400" : "border-brand-soft"
                    }`}
                    placeholder="ola@example.com"
                  />
                  {errors.epostBekreft && (
                    <p className="text-xs text-red-500 mt-1">{errors.epostBekreft}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Order summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-brand-soft p-6 md:p-8 sticky top-24">
                <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand-dark mb-6">
                  Ordresammendrag
                </h2>

                <ul className="space-y-3 mb-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-brand-medium hover:text-red-500 transition-colors shrink-0 cursor-pointer"
                          aria-label={`Fjern ${item.name}`}
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <span className="text-sm text-brand-dark truncate">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium text-brand-dark shrink-0">
                        {item.price} kr
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-brand-soft pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-medium">Delsum</span>
                    <span className="text-brand-dark">{totalPrice} kr</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Du sparer</span>
                      <span className="text-green-600 font-medium">
                        {totalSavings} kr
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-brand-soft">
                    <span className="font-medium text-brand-dark">Totalt</span>
                    <span className="font-[family-name:var(--font-display)] text-xl font-bold text-brand-dark">
                      {totalPrice} kr
                    </span>
                  </div>
                </div>

                {/* Payment buttons */}
                <div className="space-y-3 mb-4">
                  <button
                    onClick={handlePay}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-medium text-white transition-colors cursor-pointer disabled:opacity-70"
                    style={{ backgroundColor: "#FF5B24" }}
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      "Betal med Vipps"
                    )}
                  </button>
                  <button
                    onClick={handlePay}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-dark py-3.5 text-sm font-medium text-white hover:bg-brand-dark/90 transition-colors cursor-pointer disabled:opacity-70"
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Betal med kort
                      </>
                    )}
                  </button>
                </div>

                <p className="text-center text-xs text-brand-medium mb-2">
                  Trygg betaling · Umiddelbar nedlasting
                </p>
                <p className="text-center text-[10px] text-brand-medium/60">
                  Ved å kjøpe godtar du våre kjøpsvilkår
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
