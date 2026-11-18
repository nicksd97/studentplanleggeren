"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { campaignTagsFromItems } from "@/lib/attribution";
import { useCart } from "@/lib/cart-context";
import { minorToDecimal } from "@/lib/currency";
import { getFilesForItems, productFileMap } from "@/lib/product-files";
import { trackEvent, trackOnce } from "@/lib/track";
import { cartTier } from "@/lib/track-events";
import { hasTranslatedPdfs, localeTags, localizePath } from "@/lib/i18n/config";
import { fmt } from "@/lib/i18n/format";
import { useMessages } from "@/lib/i18n/provider";
import { itemDisplayName } from "@/lib/i18n/products";
import { useLocale } from "@/lib/i18n/use-locale";

/** Storage path -> product id, to show translated names for the files. */
const productIdByFile = new Map(
  Object.entries(productFileMap).flatMap(([id, files]) => files.map((file) => [file, id] as const)),
);

interface OrderData {
  id: string;
  email: string;
  firstName: string;
  items: { id: string; name: string; price: number; type: string }[];
  amountNok?: number;
  currency?: string;
  amountMinor?: number;
  locale?: string;
  paymentStatus: string;
  downloadCount: number;
  maxDownloads: number;
  expiresAt: string;
}

function TakkContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { clearCart } = useCart();
  const locale = useLocale();
  const messages = useMessages();
  const t = messages.takk;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(() => Boolean(token));
  const [error, setError] = useState(() => !token);

  useEffect(() => {
    if (!token) {
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

  useEffect(() => {
    if (order?.paymentStatus === "completed") {
      clearCart();
    }
  }, [order, clearCart]);

  useEffect(() => {
    if (!order || order.paymentStatus !== "completed") {
      return;
    }
    trackOnce(
      `purchase_${order.id}`,
      "purchase",
      {
        tier: cartTier(order.items),
        value: purchaseValue(order).value,
      },
      campaignTagsFromItems(order.items),
    );
  }, [order]);

  useEffect(() => {
    if (!order || order.paymentStatus !== "completed") {
      return;
    }
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
    if (!measurementId) {
      return;
    }
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag !== "function") {
      return;
    }
    const purchaseKey = `sp_purchase_${order.id}`;
    try {
      if (sessionStorage.getItem(purchaseKey)) {
        return;
      }
      sessionStorage.setItem(purchaseKey, "1");
    } catch {
      // Still record once in this page lifetime.
    }
    gtag("event", "purchase", {
      transaction_id: order.id,
      ...purchaseValue(order),
      ...campaignTagsFromItems(order.items),
    });
  }, [order]);

  useEffect(() => {
    if (!token || !order || order.paymentStatus === "completed") {
      return;
    }

    let stopped = false;
    const poll = async () => {
      try {
        const response = await fetch(`/api/vipps/status?token=${encodeURIComponent(token)}`);
        const data = await response.json();
        if (
          !stopped &&
          (data.paymentStatus === "completed" || data.paymentStatus === "cancelled")
        ) {
          setOrder((current) =>
            current ? { ...current, paymentStatus: data.paymentStatus } : current,
          );
        }
      } catch {
        // Keep showing the pending download state until payment confirms.
      }
    };

    const interval = window.setInterval(poll, 2000);
    const timeout = window.setTimeout(() => window.clearInterval(interval), 30000);
    return () => {
      stopped = true;
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [token, order]);

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
          {t.errorTitle}
        </h1>
        <p className="text-brand-medium mb-10">
          {t.errorText}
        </p>
        <Button href={localizePath("/", locale)} variant="primary">
          {t.home}
        </Button>
      </div>
    );
  }

  const files = getFilesForItems(order.items);
  // Translated sites download the PDFs in their language (Bokmål if a translation is missing).
  const languageNote =
    locale !== "nb" && !hasTranslatedPdfs(locale) ? messages.pdfLanguage.norwegian.sentence : null;
  const expiryDate = new Date(order.expiresAt);
  const isExpired = expiryDate < new Date();
  const downloadsLeft = order.maxDownloads - order.downloadCount;
  const isPaid = order.paymentStatus === "completed";
  const isCancelled = order.paymentStatus === "cancelled";

  return (
    <div className="max-w-lg mx-auto text-center">
      {/* Checkmark */}
      <div className="flex items-center justify-center mb-6">
        <div className={`h-20 w-20 rounded-full flex items-center justify-center ${isPaid ? "bg-green-100" : "bg-brand-soft"}`}>
          {isPaid ? (
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-10 w-10 text-brand-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
      </div>

      <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-brand-dark mb-3">
        {isPaid ? t.paidTitle : isCancelled ? t.cancelledTitle : t.pendingTitle}
      </h1>
      <p className="text-brand-medium mb-10">
        {isPaid ? (
          order.email.includes("@") ? (
            <>
              {t.confirmationSent}{" "}
              <span className="font-medium text-brand-dark">{order.email}</span>
            </>
          ) : (
            t.readyNoEmail
          )
        ) : isCancelled ? (
          t.cancelledText
        ) : (
          t.pendingText
        )}
      </p>

      {/* Download section */}
      <div className="bg-white rounded-2xl border border-brand-soft p-6 md:p-8 mb-8 text-left">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-brand-dark mb-4">
          {t.products}
        </h2>
        {languageNote && <p className="text-xs text-brand-medium mb-4">{languageNote}</p>}

        {order.paymentStatus === "completed" && !isExpired ? (
          <>
            <ul className="space-y-3">
              {files.map((file) => {
                const fileName = file.split("/").pop()?.replace(".pdf", "") || file;
                const productId = productIdByFile.get(file);
                const translatedName =
                  locale !== "nb" && productId ? messages.products[productId]?.name : undefined;
                const displayName =
                  translatedName ??
                  fileName
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
                      href={`/api/download?token=${token}&file=${encodeURIComponent(file)}${locale === "nb" ? "" : `&lang=${locale}`}`}
                      onClick={() => trackEvent("download_click", { kind: "kjop", product: fileName })}
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-brand-accent px-3 py-1.5 text-xs font-medium text-brand-dark hover:brightness-110 transition-all"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {t.download}
                    </a>
                  </li>
                );
              })}
            </ul>
            <p className="text-xs text-brand-medium/60 mt-4 text-center">
              {fmt(t.downloadsLeft, { count: downloadsLeft })} &middot; {t.expires}{" "}
              {expiryDate.toLocaleDateString(localeTags[locale], {
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
                    {itemDisplayName(item, messages)}
                  </span>
                  <button
                    disabled
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-xs text-brand-medium cursor-not-allowed"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {t.download}
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-xs text-brand-medium/60 mt-4 text-center">
              {isExpired ? t.expired : t.activatesOnPayment}
            </p>
          </>
        )}
      </div>

      <Button href={localizePath("/", locale)} variant="primary">
        {t.home}
      </Button>
    </div>
  );
}

// Also rendered at /<lang>/takk; the language comes from I18nProvider.
export default function TakkPage() {
  const locale = useLocale();
  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-20 px-4">
        <Suspense fallback={null}>
          <TakkContent />
        </Suspense>
      </main>
      <Footer locale={locale} />
    </>
  );
}

/** Purchase value for analytics, in the currency the order was charged in. */
function purchaseValue(order: OrderData): { value: number; currency: string } {
  if (order.currency && order.currency !== "NOK" && order.amountMinor != null) {
    return { value: minorToDecimal(order.amountMinor), currency: order.currency };
  }
  return {
    value: order.amountNok ?? order.items.reduce((sum, item) => sum + item.price, 0),
    currency: "NOK",
  };
}
