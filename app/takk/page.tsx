"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/lib/cart-context";
import Button from "@/components/ui/Button";

function TakkContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "din e-post";
  const { items } = useCart();

  return (
    <div className="max-w-lg mx-auto text-center">
      {/* Checkmark */}
      <div className="flex items-center justify-center mb-6">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-brand-dark mb-3">
        Takk for kjøpet!
      </h1>
      <p className="text-brand-medium mb-10">
        En e-post med nedlastingslenker er sendt til{" "}
        <span className="font-medium text-brand-dark">{email}</span>
      </p>

      {/* Download section */}
      {items.length > 0 && (
        <div className="bg-white rounded-2xl border border-brand-soft p-6 md:p-8 mb-8 text-left">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-brand-dark mb-4">
            Dine produkter
          </h2>
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-brand-pale/50 p-3"
              >
                <span className="text-sm font-medium text-brand-dark truncate">
                  {item.name}
                </span>
                <button
                  disabled
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-xs text-brand-medium cursor-not-allowed"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Last ned
                </button>
              </li>
            ))}
          </ul>
          <p className="text-xs text-brand-medium/60 mt-4 text-center">
            Nedlasting aktiveres når betalingen er bekreftet
          </p>
        </div>
      )}

      <Button href="/" variant="primary">
        Tilbake til forsiden
      </Button>
    </div>
  );
}

export default function TakkPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-20 px-4">
        <Suspense fallback={null}>
          <TakkContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
