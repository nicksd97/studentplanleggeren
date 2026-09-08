import type Lenis from "lenis";

/**
 * Shared, mutable scroll/pointer state for the landing page.
 *
 * Written by SmoothScroll (Lenis instance, pointer position) and by the
 * scroll-progress ScrollTrigger; read every frame by the 3D scene. Kept as a
 * plain object on purpose: updating React state 60 times a second would
 * re-render the page for no reason.
 */
export const scrollStore = {
  /** 0 at the top of the page, 1 at the bottom */
  progress: 0,
  /** Pointer position normalised to -1..1 (0,0 = centre) */
  mouseX: 0,
  mouseY: 0,
  /** Active Lenis instance, or null when smooth scroll is off (reduced motion, other routes) */
  lenis: null as Lenis | null,
};
