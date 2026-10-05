import { productFileMap } from "./product-files";

export const NEWSLETTER_SEGMENT_NAME = "lead-gratis-ukeplan";
export const DEFAULT_LEAD_MAGNET_STORAGE_PATH = "leads/gratis-ukentlig-plan-smakebit.pdf";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WINDOW_MS = 60 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map<string, number[]>();

export function normalizeEmail(input: unknown): string | null {
  if (typeof input !== "string") {
    return null;
  }
  const email = input.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email)) {
    return null;
  }
  return email;
}

export function isHoneypot(body: { company?: unknown; website?: unknown }): boolean {
  for (const value of [body.company, body.website]) {
    if (typeof value === "string" && value.trim() !== "") {
      return true;
    }
  }
  return false;
}

export function allowNewsletterRequest(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

export function leadMagnetStoragePath(): string {
  return process.env.LEAD_MAGNET_STORAGE_PATH ?? DEFAULT_LEAD_MAGNET_STORAGE_PATH;
}

export function assertSafeLeadMagnetPath(path: string): void {
  const paidPaths = new Set(Object.values(productFileMap).flat());
  if (path.startsWith("planners/")) {
    throw new Error("Lead magnet path must not use paid planner files");
  }
  if (paidPaths.has(path)) {
    throw new Error("Lead magnet path must not use paid planner files");
  }
  if (path.includes("ukentlig-plan.pdf") && !path.includes("smakebit")) {
    throw new Error("Lead magnet path must not use the commercial weekly plan");
  }
}
