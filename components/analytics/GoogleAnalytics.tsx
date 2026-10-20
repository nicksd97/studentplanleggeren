import Script from "next/script";
import { Suspense } from "react";
import { configuredMeasurementId } from "@/lib/analytics";
import { gaBootstrapScript } from "@/lib/consent";
import ConsentBanner from "./ConsentBanner";
import GaPageViews from "./GaPageViews";

/** Renders nothing unless NEXT_PUBLIC_GA_MEASUREMENT_ID is a valid GA4 id. */
export default function GoogleAnalytics() {
  const measurementId = configuredMeasurementId();
  if (!measurementId) {
    return null;
  }

  return (
    <>
      {/* beforeInteractive: consent defaults and `gtag` must exist before any page effect calls trackEvent().
          The lint rule predates the App Router, where the root layout tree is the supported place for it. */}
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <Script id="ga-init" strategy="beforeInteractive">
        {gaBootstrapScript(measurementId)}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
        strategy="afterInteractive"
      />
      <Suspense fallback={null}>
        <GaPageViews />
      </Suspense>
      <ConsentBanner />
    </>
  );
}
