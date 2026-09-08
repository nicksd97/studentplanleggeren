"use client";

import { useEffect, type ReactNode } from "react";
import dynamic from "next/dynamic";
import SmoothScroll from "./SmoothScroll";

// three.js and friends are only ever loaded in the browser, on this route
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

/**
 * Client wrapper for the landing page. Owns everything that must only exist
 * on `/`: the dark theme, the overlays, smooth scroll and the 3D scene.
 * Sections are passed as children so they stay server-rendered.
 */
export default function LandingShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.theme = "dark";
    // Temporary background comparison switch: /?bg=warm
    const bg = new URLSearchParams(window.location.search).get("bg");
    if (bg) html.dataset.bg = bg;
    return () => {
      delete html.dataset.theme;
      delete html.dataset.bg;
    };
  }, []);

  return (
    <div className="theme-dark relative min-h-screen">
      <SmoothScroll />
      <div className="glow" aria-hidden="true" />
      <HeroScene />
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      {/* Side rail (desktop only) */}
      <div
        aria-hidden="true"
        className="hidden lg:flex fixed left-5 top-0 bottom-0 z-20 pointer-events-none items-center"
      >
        <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] uppercase tracking-[0.35em] text-ink-muted/60">
          Studentplanlegger — Laget for norske studenter
        </span>
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
