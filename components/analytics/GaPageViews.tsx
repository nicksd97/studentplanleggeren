"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getGtag } from "@/lib/consent";
import { redactAnalyticsUrl } from "@/lib/track-events";

// Module-level so React's dev double-effect and re-renders can't send the same view twice.
let lastLocation: string | null = null;

/** Sends a GA4 page_view on the first load and on every client-side navigation. */
export default function GaPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    const gtag = getGtag();
    if (!gtag) return;
    // Full URL with utm_* kept so GA4 attributes the campaign; tokens and other params dropped.
    const pageLocation = redactAnalyticsUrl(window.location.href);
    if (pageLocation === lastLocation) return;
    lastLocation = pageLocation;
    gtag("set", { page_location: pageLocation });
    gtag("event", "page_view", { page_location: pageLocation, page_title: document.title });
  }, [pathname, search]);

  return null;
}
