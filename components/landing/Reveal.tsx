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
 * Under prefers-reduced-motion nothing animates and content is simply visible.
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
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            delay: delay / 1000,
            stagger: stagger ?? 0,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
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
