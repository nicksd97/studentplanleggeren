"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/track";
import { outboundTarget } from "@/lib/track-events";

/**
 * One delegated listener instead of client handlers on every server component:
 * elements with `data-cta="hero_komplett"` send cta_click, and links that leave
 * the site send outbound_click.
 */
export default function ClickTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const cta = target.closest<HTMLElement>("[data-cta]");
      if (cta?.dataset.cta) {
        trackEvent("cta_click", { cta: cta.dataset.cta });
      }

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (link) {
        const outbound = outboundTarget(link.href, window.location.hostname);
        if (outbound) trackEvent("outbound_click", outbound);
      }
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
