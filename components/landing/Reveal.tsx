"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

/**
 * Scroll-triggered reveal for the landing page (GSAP ScrollTrigger).
 * Drop-in replacement for FadeInOnScroll: `delay` is in milliseconds.
 * With `stagger`, each direct child animates in sequence instead of the wrapper.
 * Animates opacity only (never visibility), so hidden content stays in the
 * tab order and the accessibility tree; focusing anything inside completes
 * the reveal immediately. Under prefers-reduced-motion nothing animates.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  y = 40,
  stagger,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = stagger ? Array.from(el.children) : el;
        // In stagger mode the children animate, so the wrapper itself must be shown
        if (stagger) gsap.set(el, { opacity: 1 });
        const tween = gsap.fromTo(
          targets,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            delay: delay / 1000,
            stagger: stagger ?? 0,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
        // Keyboard users must never land on an invisible control
        const onFocus = () => tween.progress(1);
        el.addEventListener("focusin", onFocus, { once: true });
        return () => el.removeEventListener("focusin", onFocus);
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} data-reveal className={className}>
      {children}
    </div>
  );
}
