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
        const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
        if (!anchor) return;
        const href = anchor.getAttribute("href") ?? "";
        const hash = href.startsWith("#") ? href : href.startsWith("/#") ? href.slice(1) : null;
        if (!hash || hash === "#") return;
        const target = document.querySelector<HTMLElement>(hash);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: HEADER_OFFSET });
        history.pushState(null, "", hash);
      };
      document.addEventListener("click", onClick, true);

      // Honour a hash present on load (e.g. arriving from /produkter via /#pakker)
      if (location.hash) {
        const target = document.querySelector<HTMLElement>(location.hash);
        if (target) {
          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            lenis.scrollTo(target, { offset: HEADER_OFFSET, immediate: true });
          });
        }
      }

      cleanups.push(() => {
        document.removeEventListener("click", onClick, true);
        gsap.ticker.remove(tick);
        lenis.destroy();
        scrollStore.lenis = null;
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
