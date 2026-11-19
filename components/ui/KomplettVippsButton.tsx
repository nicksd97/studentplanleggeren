"use client";

import { useRef, useState } from "react";
import { currentCampaignTags } from "@/lib/attribution";
import { currentDiscountCode } from "@/lib/discount";
import { completePackageCartItem } from "@/lib/products";
import { trackEvent } from "@/lib/track";
import { translateApiError } from "@/lib/i18n/api-errors";
import { useMessages } from "@/lib/i18n/provider";
import { useLocale } from "@/lib/i18n/use-locale";

type KomplettVippsButtonProps = {
  label?: string;
  className?: string;
  fullWidth?: boolean;
  /** Where the button sits, for checkout_start analytics. */
  source?: string;
};

export default function KomplettVippsButton({
  label,
  className = "",
  fullWidth = false,
  source = "ukjent",
}: KomplettVippsButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  const locale = useLocale();
  const messages = useMessages();
  const t = messages.komplettVipps;

  async function startVipps() {
    if (inFlight.current) return;
    inFlight.current = true;
    trackEvent("checkout_start", { method: "vipps", tier: "komplett", source });
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [completePackageCartItem()],
          paymentProvider: "vipps",
          campaign: currentCampaignTags(),
          discountCode: currentDiscountCode(),
          // Vipps is NOK-only; this button is only shown to visitors paying in NOK.
          currency: "NOK",
          locale,
        }),
      });
      const data = (await response.json()) as { redirectUrl?: string; error?: string };
      if (data.redirectUrl) {
        window.location.assign(data.redirectUrl);
        return;
      }
      setError(translateApiError(data.error, messages, t.error));
      inFlight.current = false;
    } catch {
      setError(t.error);
      inFlight.current = false;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={fullWidth ? "w-full" : undefined}>
      <button
        type="button"
        onClick={startVipps}
        disabled={loading}
        className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-110 shadow-sm hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:hover:translate-y-0 ${
          fullWidth ? "w-full" : ""
        } ${className}`}
        style={{ backgroundColor: "#FF5B24" }}
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          label ?? t.label
        )}
      </button>
      {error ? <p className="mt-2 text-center text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
