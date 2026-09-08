export type DeviceTier = {
  /** Small screen or weak hardware: fewer shapes, fewer particles, lower dpr */
  low: boolean;
  /** Touch-first device: no pointer parallax */
  coarse: boolean;
  reducedMotion: boolean;
  webgl: boolean;
};

/**
 * One-shot capability sniff. Runs on the client only (called from a
 * useState initialiser inside the dynamically imported scene).
 */
export function detectTier(): DeviceTier {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const small = window.matchMedia("(max-width: 767px)").matches;
  const weak = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let webgl = false;
  try {
    const canvas = document.createElement("canvas");
    webgl = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    webgl = false;
  }

  return { low: small || weak, coarse, reducedMotion, webgl };
}
