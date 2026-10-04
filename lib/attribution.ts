export const CAMPAIGN_COOKIE = "sp_campaign";
export const CAMPAIGN_STORAGE_KEY = "sp_campaign";

const CAMPAIGN_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;
const MAX_TAG_LENGTH = 100;

export type CampaignKey = (typeof CAMPAIGN_KEYS)[number];
export type CampaignTags = Partial<Record<CampaignKey, string>>;

type TagSource = string | URLSearchParams | Record<string, unknown> | null | undefined;

function sanitizeTag(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const compact = trimmed.replace(/[\r\n\0]/g, "").slice(0, MAX_TAG_LENGTH);
  return compact || undefined;
}

function readRaw(input: TagSource, key: CampaignKey): unknown {
  if (!input) return undefined;
  if (typeof input === "string") {
    return new URLSearchParams(input.startsWith("?") ? input.slice(1) : input).get(key);
  }
  if (input instanceof URLSearchParams) {
    return input.get(key);
  }
  return input[key];
}

export function parseCampaignTags(input: TagSource): CampaignTags | null {
  const tags: CampaignTags = {};
  for (const key of CAMPAIGN_KEYS) {
    const value = sanitizeTag(readRaw(input, key));
    if (value) tags[key] = value;
  }
  return Object.keys(tags).length > 0 ? tags : null;
}

export function mergeCampaignTags(
  incoming: CampaignTags | null | undefined,
  stored: CampaignTags | null | undefined,
): CampaignTags | null {
  return incoming ?? stored ?? null;
}

export function attachCampaignTags<T extends object>(
  items: T[],
  tags: CampaignTags | null | undefined,
): T[] {
  if (!tags || items.length === 0) return items;
  return items.map((item, index) => (index === 0 ? { ...item, ...tags } : item));
}

export function campaignTagsFromItems(items: unknown): CampaignTags | null {
  if (!Array.isArray(items) || items.length === 0) return null;
  const first = items[0];
  if (!first || typeof first !== "object") return null;
  return parseCampaignTags(first as Record<string, unknown>);
}

export function campaignCookieValue(tags: CampaignTags): string {
  return JSON.stringify(tags);
}

export function parseCampaignCookie(value: string | null | undefined): CampaignTags | null {
  if (!value) return null;
  const candidates = [value];
  try {
    candidates.push(decodeURIComponent(value));
  } catch {
    // Use the raw cookie if it is already decoded.
  }
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as unknown;
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) continue;
      const tags = parseCampaignTags(parsed as Record<string, unknown>);
      if (tags) return tags;
    } catch {
      // Try the next encoding.
    }
  }
  return null;
}

export function rememberCampaignTags(tags: CampaignTags): void {
  const value = campaignCookieValue(tags);
  try {
    window.sessionStorage.setItem(CAMPAIGN_STORAGE_KEY, value);
  } catch {
    // Private mode can block storage; the cookie is enough for this visit.
  }
  document.cookie = `${CAMPAIGN_COOKIE}=${encodeURIComponent(value)}; Path=/; Max-Age=2592000; SameSite=Lax`;
}

export function readStoredCampaignTags(): CampaignTags | null {
  try {
    const stored = parseCampaignCookie(window.sessionStorage.getItem(CAMPAIGN_STORAGE_KEY));
    if (stored) return stored;
  } catch {
    // Fall through to the cookie.
  }
  const cookie = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${CAMPAIGN_COOKIE}=`));
  if (!cookie) return null;
  return parseCampaignCookie(decodeURIComponent(cookie.slice(CAMPAIGN_COOKIE.length + 1)));
}

export function currentCampaignTags(): CampaignTags | null {
  return mergeCampaignTags(parseCampaignTags(window.location.search), readStoredCampaignTags());
}
