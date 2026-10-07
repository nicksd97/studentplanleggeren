import type { CampaignTags } from "./attribution";
import { FIVE_PACK_SIZE, KOMPLETT_PRICE, pakker } from "./products";

export type TrackEventName =
  | "cta_click"
  | "product_click"
  | "product_view"
  | "catalog_view"
  | "add_to_cart"
  | "checkout_start"
  | "purchase"
  | "lead_signup"
  | "lead_signup_error"
  | "download_click"
  | "discount_applied"
  | "outbound_click";

export type PriceTier = "enkelt" | "5-pakke" | "tema" | "komplett";

export type TrackValue = string | number | boolean;
export type TrackProps = Record<string, TrackValue | null | undefined>;

// Vercel Pro records 2 custom-data properties per event, Web Analytics Plus records 8.
export const DEFAULT_PROP_LIMIT = 2;
export const MAX_PROP_LIMIT = 8;
const MAX_VALUE_LENGTH = 100;

const BUNDLE_IDS = new Set(pakker.map((bundle) => bundle.id));

export function priceTierFor(item: { id: string; type?: string; price?: number }): PriceTier {
  if (item.id === "komplett" || item.price === KOMPLETT_PRICE) return "komplett";
  if (item.type === "bundle" || BUNDLE_IDS.has(item.id)) return "tema";
  return "enkelt";
}

/** The highest tier in a cart or order; five or more singles count as a 5-pakke. */
export function cartTier(items: { id: string; type?: string; price?: number }[]): PriceTier | null {
  if (items.length === 0) return null;
  const tiers = items.map(priceTierFor);
  if (tiers.includes("komplett")) return "komplett";
  if (tiers.includes("tema")) return "tema";
  const singles = tiers.filter((tier) => tier === "enkelt").length;
  return singles >= FIVE_PACK_SIZE ? "5-pakke" : "enkelt";
}

export function propLimit(raw: string | undefined): number {
  const parsed = Number.parseInt(raw ?? "", 10);
  if (!Number.isFinite(parsed)) return DEFAULT_PROP_LIMIT;
  return Math.min(MAX_PROP_LIMIT, Math.max(0, parsed));
}

function cleanValue(value: TrackValue | null | undefined): TrackValue | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value === "boolean") return value;
  const trimmed = value.replace(/[\r\n\0]/g, "").trim().slice(0, MAX_VALUE_LENGTH);
  if (!trimmed) return undefined;
  // Never let an email address (or anything that looks like one) reach analytics.
  if (trimmed.includes("@")) return undefined;
  return trimmed;
}

/**
 * Event-specific properties come first, in priority order, then path and campaign.
 * Only the first `limit` survive, so the most useful ones fit the plan's cap.
 */
export function buildEventProps(
  props: TrackProps,
  context: { path?: string; campaign?: CampaignTags | null },
  limit: number,
): Record<string, TrackValue> {
  const ordered: [string, TrackValue | null | undefined][] = [
    ...Object.entries(props),
    ["path", context.path],
    ["utm_source", context.campaign?.utm_source],
    ["utm_campaign", context.campaign?.utm_campaign],
  ];
  const out: Record<string, TrackValue> = {};
  for (const [key, raw] of ordered) {
    if (Object.keys(out).length >= limit) break;
    if (key in out) continue;
    const value = cleanValue(raw);
    if (value !== undefined) out[key] = value;
  }
  return out;
}

const KEPT_QUERY_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "kategori"];

/** Strips every query parameter except campaign tags and the catalog filter (drops ?token=, etc.). */
export function redactAnalyticsUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const kept = new URLSearchParams();
    for (const key of KEPT_QUERY_PARAMS) {
      const value = parsed.searchParams.get(key);
      if (value) kept.set(key, value);
    }
    parsed.search = kept.toString();
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return url;
  }
}

const SOCIAL_HOSTS = ["instagram.com", "tiktok.com", "facebook.com", "snapchat.com", "youtube.com", "pinterest.com", "linkedin.com", "x.com", "twitter.com"];

export function outboundTarget(
  href: string,
  siteHost: string,
): { target: string; kind: "social" | "epost" | "ekstern" } | null {
  if (href.startsWith("mailto:")) return { target: "epost", kind: "epost" };
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  const host = url.hostname.replace(/^www\./, "");
  if (host === siteHost.replace(/^www\./, "")) return null;
  const social = SOCIAL_HOSTS.some((s) => host === s || host.endsWith(`.${s}`));
  return { target: host, kind: social ? "social" : "ekstern" };
}
