"use client";

import { useEffect, type ReactNode } from "react";

/**
 * Client wrapper for the landing page. Owns everything that must only exist
 * on `/`: the dark theme, the overlays and (in later steps) smooth scroll and
 * the 3D scene. Sections are passed as children so they stay server-rendered.
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
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
