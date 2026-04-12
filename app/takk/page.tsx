"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { getFilesForItems } from "@/lib/product-files";

interface OrderData {
  id: string;
  email: string;
  firstName: string;
  items: { id: string; name: string; price: number; type: string }[];
  paymentStatus: string;
  downloadCount: number;
  maxDownloads: number;
  expiresAt: string;
}

function TakkContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError(true);
      return;
    }

    fetch(`/api/orders/verify?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(true);
        } else {
          setOrder(data);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-20 w-20 rounded-full bg-brand-soft mx-auto" />
          <div className="h-8 bg-brand-soft rounded w-3/4 mx-auto" />
          <div className="h-4 bg-brand-soft rounded w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-brand-dark mb-3">
          Noe gikk galt
        </h1>
        <p className="text-brand-medium mb-10">
          Vi kunne ikke finne ordren din. Sjekk e-posten din eller kontakt oss for hjelp.
        </p>
        <Button href="/" variant="primary">
          Tilbake til forsiden
        </Button>
      </div>
    );
  }

  const files = getFilesForItems(order.items);
  const expiryDate = new Date(order.expiresAt);
  const isExpired = expiryDate < new Date();
  const downloadsLeft = order.maxDownloads - order.downloadCount;

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
        Takk for kj&#248;pet!
      </h1>
      <p className="text-brand-medium mb-10">
        En bekreftelse er sendt til{" "}
        <span className="font-medium text-brand-dark">{order.email}</span>
      </p>

      {/* Download section */}
      <div className="bg-white rounded-2xl border border-brand-soft p-6 md:p-8 mb-8 text-left">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-brand-dark mb-4">
          Dine produkter
        </h2>

        {order.paymentStatus === "completed" && !isExpired ? (
          <>
            <ul className="space-y-3">
              {files.map((file) => {
                const fileName = file.split("/").pop()?.replace(".pdf", "") || file;
                const displayName = fileName
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ");

                return (
                  <li
                    key={file}
                    className="flex items-center justify-between gap-3 rounded-xl bg-brand-pale/50 p-3"
                  >
                    <span className="text-sm font-medium text-brand-dark truncate">
                      {displayName}
                    </span>
                    <a
                      href={`/api/download?token=${token}&file=${encodeURIComponent(file)}`}
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-brand-accent px-3 py-1.5 text-xs font-medium text-brand-dark hover:brightness-110 transition-all"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Last ned
                    </a>
                  </li>
                );
              })}
            </ul>
            <p className="text-xs text-brand-medium/60 mt-4 text-center">
              {downloadsLeft} nedlastinger gjensT&#229;r &middot; Lenken utl&#248;per{" "}
              {expiryDate.toLocaleDateString("nb-NO", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </>
        ) : (
          <>
            <ul className="space-y-3">
              {order.items.map((item) => (
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
              {isExpired
                ? "Nedlastingslenken har utl\u00f8pt. Kontakt oss for hjelp."
                : "Nedlasting aktiveres n\u00e5r betalingen er bekreftet"}
            </p>
          </>
        )}
      </div>

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
