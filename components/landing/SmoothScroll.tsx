"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollStore } from "@/lib/scroll-store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HEADER_OFFSET = -64;

/** Element for a "#id" hash; ids need no selector escaping, bad hashes are ignored */
function elementForHash(hash: string): HTMLElement | null {
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

/**
 * Scroll plumbing for the landing page. Renders nothing.
 * - Always (unless reduced motion): a ScrollTrigger that writes page progress
 *   into the scroll store and drives the hero glow, plus refreshes after fonts
 *   and images load.
 * - Fine-pointer devices only: Lenis smooth wheel scrolling wired to GSAP's
 *   ticker, with same-page anchors routed through it. Phones keep native
 *   scrolling, which is already smooth and avoids non-passive touch listeners.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    ScrollTrigger.config({ ignoreMobileResize: true });

    // Page progress (0..1) for the 3D scene and the hero glow
    const progressTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        scrollStore.progress = self.progress;
        document.documentElement.style.setProperty(
          "--glow",
          String(Math.max(0, 1 - self.progress * 4))
        );
      },
    });

    // Layout can shift while fonts and images load; keep trigger positions honest
    let refreshTimer: number | undefined;
    const scheduleRefresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    };
    document.fonts?.ready.then(scheduleRefresh);
    const pendingImages = Array.from(document.images).filter((img) => !img.complete);
    pendingImages.forEach((img) => img.addEventListener("load", scheduleRefresh, { once: true }));

    const cleanups: Array<() => void> = [
      () => {
        window.clearTimeout(refreshTimer);
        pendingImages.forEach((img) => img.removeEventListener("load", scheduleRefresh));
        progressTrigger.kill();
        scrollStore.progress = 0;
        document.documentElement.style.removeProperty("--glow");
      },
    ];

    if (window.matchMedia("(pointer: fine)").matches) {
      const lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
      scrollStore.lenis = lenis;

      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Route same-page anchor links (#pakker, /#faq …) through Lenis
      const onClick = (e: MouseEvent) => {
        // Leave modified clicks and new-tab links to the browser
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
        if (!anchor || (anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return;
        const href = anchor.getAttribute("href") ?? "";
        const hash = href.startsWith("#") ? href : href.startsWith("/#") ? href.slice(1) : null;
        if (!hash || hash === "#") return;
        const target = elementForHash(hash);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: HEADER_OFFSET });
        history.pushState(null, "", hash);
      };
      document.addEventListener("click", onClick, true);

      // Honour a hash present on load (e.g. arriving from /produkter via /#pakker)
      let hashRaf = 0;
      if (location.hash) {
        const target = elementForHash(location.hash);
        if (target) {
          hashRaf = requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            lenis.scrollTo(target, { offset: HEADER_OFFSET, immediate: true });
          });
        }
      }

      cleanups.push(() => {
        cancelAnimationFrame(hashRaf);
        document.removeEventListener("click", onClick, true);
        gsap.ticker.remove(tick);
        lenis.destroy();
        // Lenis arms a 400ms timer on native scroll (Next scrolls to top on
        // navigation) that re-adds its class after destroy; clear it and sweep up
        window.clearTimeout((lenis as unknown as { _resetVelocityTimeout?: number })._resetVelocityTimeout);
        window.setTimeout(() => {
          document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-scrolling", "lenis-stopped");
        }, 500);
        scrollStore.lenis = null;
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
