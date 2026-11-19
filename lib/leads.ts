import type { CampaignTags } from "./attribution";
import { defaultCurrencyForLocale, parseCurrency, type Currency } from "./currency";
import { bundlePrice, GRATIS_SIGNUP_EVENT, welcomeEventName } from "./emails/welcome";
import { isLocale, isPrefixedLocale, type Locale, type PrefixedLocale } from "./i18n/config";
import { normalizeEmail } from "./newsletter";
import { isMissingColumnError } from "./order-insert-error";
import { supabaseAdmin } from "./supabase";

export { GRATIS_SIGNUP_EVENT };

export const LEAD_SOURCE_GRATIS = "gratis-ukeplan";
export const CAMPAIGN_GRATIS_SAMPLE = "gratis-sample";
export const CAMPAIGN_VELKOMSTSERIE = "velkomstserie";
export const CONSENT_SOURCE_FORM = "gratis-form";
export const CONSENT_SOURCE_BACKFILL = "resend-backfill";

export type LeadRow = {
  id: string;
  email: string;
  source: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  created_at: string;
  consent_at: string;
  consent_source: string;
  unsubscribed: boolean;
  unsubscribed_at: string | null;
  /** Site language at signup. Absent until supabase/migrations/2026-11-19-lead-locale.sql runs. */
  locale?: string | null;
  /** Currency the subscriber saw prices in. Same migration as `locale`. */
  currency?: string | null;
};

/** Lead columns added by supabase/migrations/2026-11-19-lead-locale.sql. */
export const LEAD_LOCALE_COLUMNS = ["locale", "currency"] as const;

export type LeadCampaignRow = {
  id: string;
  lead_id: string;
  campaign: string;
  status: string;
  sent_at: string | null;
  enrolled_at: string | null;
  created_at: string;
};

export type LeadStore = {
  findByEmail(email: string): Promise<LeadRow | null>;
  insert(lead: Omit<LeadRow, "id"> & { id?: string }): Promise<LeadRow>;
  update(id: string, patch: Partial<LeadRow>): Promise<LeadRow>;
  findCampaign(leadId: string, campaign: string): Promise<LeadCampaignRow | null>;
  insertCampaign(row: Omit<LeadCampaignRow, "id"> & { id?: string }): Promise<LeadCampaignRow>;
};

export type ResendEventClient = {
  events: {
    send(params: {
      event: string;
      email: string;
      payload?: Record<string, unknown>;
    }): Promise<{ data?: unknown; error?: unknown }>;
  };
};

export type ResendListContact = {
  id?: string;
  email?: string;
  unsubscribed?: boolean;
  created_at?: string;
};

export type PersistGratisSignupInput = {
  email: string;
  source?: string;
  tags?: CampaignTags | null;
  welcomeEnrolled: boolean;
  unsubscribed?: boolean;
  consentSource?: string;
  consentAt?: string;
  createdAt?: string;
  now?: string;
  /** Subscriber's site language; stored only when valid. */
  locale?: unknown;
  /** Subscriber's currency; stored only when valid. */
  currency?: unknown;
};

type LeadClient = Pick<typeof supabaseAdmin, "from">;

function newId(): string {
  return crypto.randomUUID();
}

export function createMemoryLeadStore(): LeadStore & {
  leads: LeadRow[];
  campaigns: LeadCampaignRow[];
} {
  const leads: LeadRow[] = [];
  const campaigns: LeadCampaignRow[] = [];

  return {
    leads,
    campaigns,
    async findByEmail(email) {
      return leads.find((row) => row.email === email) ?? null;
    },
    async insert(lead) {
      const row: LeadRow = { id: lead.id ?? newId(), ...lead };
      leads.push(row);
      return row;
    },
    async update(id, patch) {
      const index = leads.findIndex((row) => row.id === id);
      if (index < 0) {
        throw new Error("Lead not found");
      }
      leads[index] = { ...leads[index], ...patch, id };
      return leads[index];
    },
    async findCampaign(leadId, campaign) {
      return campaigns.find((row) => row.lead_id === leadId && row.campaign === campaign) ?? null;
    },
    async insertCampaign(row) {
      const created: LeadCampaignRow = { id: row.id ?? newId(), ...row };
      campaigns.push(created);
      return created;
    },
  };
}

type StoreError = { message?: string; code?: string; details?: string; hint?: string };

/** Keeps the Postgres/PostgREST code, so callers can tell a missing column from other failures. */
function requireRow<T>(data: T | null, error: StoreError | null, message: string): T {
  if (error || !data) {
    const failure = new Error(error?.message || message) as Error & StoreError;
    if (error?.code) failure.code = error.code;
    if (error?.details) failure.details = error.details;
    if (error?.hint) failure.hint = error.hint;
    throw failure;
  }
  return data;
}

export function createSupabaseLeadStore(client: LeadClient = supabaseAdmin): LeadStore {
  return {
    async findByEmail(email) {
      const { data, error } = await client.from("leads").select("*").eq("email", email).maybeSingle();
      if (error) {
        throw new Error(error.message);
      }
      return (data as LeadRow | null) ?? null;
    },
    async insert(lead) {
      const { data, error } = await client.from("leads").insert(lead).select("*").single();
      return requireRow(data as LeadRow | null, error, "Kunne ikke lagre lead");
    },
    async update(id, patch) {
      const { data, error } = await client.from("leads").update(patch).eq("id", id).select("*").single();
      return requireRow(data as LeadRow | null, error, "Kunne ikke oppdatere lead");
    },
    async findCampaign(leadId, campaign) {
      const { data, error } = await client
        .from("lead_campaigns")
        .select("*")
        .eq("lead_id", leadId)
        .eq("campaign", campaign)
        .maybeSingle();
      if (error) {
        throw new Error(error.message);
      }
      return (data as LeadCampaignRow | null) ?? null;
    },
    async insertCampaign(row) {
      const { data, error } = await client.from("lead_campaigns").insert(row).select("*").single();
      return requireRow(data as LeadCampaignRow | null, error, "Kunne ikke lagre kampanje");
    },
  };
}

/** Env var listing the languages whose Resend welcome automation is live, e.g. "en,de,sv". */
export const WELCOME_LOCALES_ENV = "RESEND_WELCOME_LOCALES";

/** "en, DE,xx,nb" -> ["en", "de"]: prefixed locales only (Bokmål always has its automation). */
export function parseWelcomeLocales(value: string | null | undefined): PrefixedLocale[] {
  if (!value) return [];
  const parsed = value
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(isPrefixedLocale);
  return [...new Set(parsed)];
}

/**
 * Event that starts the welcome series: "studentplanlegger.gratis_signup.<lang>" when that
 * language's automation is listed in RESEND_WELCOME_LOCALES, else the Bokmål event, so every
 * signup still gets the (Bokmål) series before the other automations exist.
 */
export function selectWelcomeEvent(
  locale: unknown,
  enabledLocales: string | null | undefined = process.env[WELCOME_LOCALES_ENV],
): string {
  if (!isPrefixedLocale(locale)) return GRATIS_SIGNUP_EVENT;
  return parseWelcomeLocales(enabledLocales).includes(locale) ? welcomeEventName(locale) : GRATIS_SIGNUP_EVENT;
}

export type GratisSignupPayload = { locale: Locale; currency: Currency; bundlePrice: string };

/** Event payload: the automation templates read event.bundlePrice as {{{BUNDLE_PRICE}}}. */
export function gratisSignupPayload(locale: unknown, currency: unknown): GratisSignupPayload {
  const lang: Locale = isLocale(locale) ? locale : "nb";
  const cur = parseCurrency(currency) ?? defaultCurrencyForLocale(lang);
  return { locale: lang, currency: cur, bundlePrice: bundlePrice(lang, cur) };
}

export async function sendGratisSignupEvent(
  resend: ResendEventClient,
  email: string,
  subscriber: { locale?: unknown; currency?: unknown } = {},
  enabledLocales: string | null | undefined = process.env[WELCOME_LOCALES_ENV],
): Promise<boolean> {
  try {
    const { error } = await resend.events.send({
      event: selectWelcomeEvent(subscriber.locale, enabledLocales),
      email,
      payload: gratisSignupPayload(subscriber.locale, subscriber.currency),
    });
    return !error;
  } catch {
    return false;
  }
}

function firstTouch(existing: string | null | undefined, incoming: string | undefined): string | null {
  return existing ?? incoming ?? null;
}

async function ensureCampaign(
  store: LeadStore,
  leadId: string,
  campaign: string,
  fields: { status: string; sent_at: string | null; enrolled_at: string | null },
  now: string,
): Promise<void> {
  const existing = await store.findCampaign(leadId, campaign);
  if (existing) {
    return;
  }
  await store.insertCampaign({
    lead_id: leadId,
    campaign,
    status: fields.status,
    sent_at: fields.sent_at,
    enrolled_at: fields.enrolled_at,
    created_at: now,
  });
}

export async function persistGratisSignup(
  store: LeadStore,
  input: PersistGratisSignupInput,
): Promise<LeadRow> {
  const email = normalizeEmail(input.email);
  if (!email) {
    throw new Error("Ugyldig e-postadresse");
  }

  const now = input.now ?? new Date().toISOString();
  const tags = input.tags ?? {};
  const existing = await store.findByEmail(email);
  const unsubscribed = input.unsubscribed ?? existing?.unsubscribed ?? false;
  const localeFields: Pick<LeadRow, "locale" | "currency"> = {};
  if (isLocale(input.locale)) localeFields.locale = input.locale;
  const currency = parseCurrency(input.currency);
  if (currency) localeFields.currency = currency;

  // Writes locale/currency, and retries once without them while the migration that adds the
  // columns hasn't run, so signups keep being stored.
  async function write<T>(run: (fields: typeof localeFields) => Promise<T>): Promise<T> {
    if (Object.keys(localeFields).length === 0) return run({});
    try {
      return await run(localeFields);
    } catch (error) {
      if (!isMissingColumnError(error, LEAD_LOCALE_COLUMNS)) throw error;
      return run({});
    }
  }

  const lead = existing
    ? await write((fields) => store.update(existing.id, {
        ...fields,
        consent_at: input.consentAt ?? now,
        consent_source: input.consentSource ?? existing.consent_source,
        utm_source: firstTouch(existing.utm_source, tags.utm_source),
        utm_medium: firstTouch(existing.utm_medium, tags.utm_medium),
        utm_campaign: firstTouch(existing.utm_campaign, tags.utm_campaign),
        utm_content: firstTouch(existing.utm_content, tags.utm_content),
        unsubscribed,
        unsubscribed_at: unsubscribed ? (existing.unsubscribed_at ?? now) : null,
      }))
    : await write((fields) => store.insert({
        ...fields,
        email,
        source: input.source ?? LEAD_SOURCE_GRATIS,
        utm_source: tags.utm_source ?? null,
        utm_medium: tags.utm_medium ?? null,
        utm_campaign: tags.utm_campaign ?? null,
        utm_content: tags.utm_content ?? null,
        created_at: input.createdAt ?? now,
        consent_at: input.consentAt ?? now,
        consent_source: input.consentSource ?? CONSENT_SOURCE_FORM,
        unsubscribed,
        unsubscribed_at: unsubscribed ? now : null,
      }));

  await ensureCampaign(
    store,
    lead.id,
    CAMPAIGN_GRATIS_SAMPLE,
    { status: "sent", sent_at: now, enrolled_at: null },
    now,
  );

  if (input.welcomeEnrolled) {
    await ensureCampaign(
      store,
      lead.id,
      CAMPAIGN_VELKOMSTSERIE,
      { status: "enrolled", sent_at: null, enrolled_at: now },
      now,
    );
  }

  return lead;
}

export function leadFromResendContact(contact: ResendListContact): PersistGratisSignupInput | null {
  const email = normalizeEmail(contact.email);
  if (!email) {
    return null;
  }
  return {
    email,
    source: LEAD_SOURCE_GRATIS,
    welcomeEnrolled: false,
    unsubscribed: Boolean(contact.unsubscribed),
    consentSource: CONSENT_SOURCE_BACKFILL,
    consentAt: contact.created_at,
    createdAt: contact.created_at,
  };
}

export async function importResendContact(
  store: LeadStore,
  contact: ResendListContact,
): Promise<"imported" | "skipped"> {
  const mapped = leadFromResendContact(contact);
  if (!mapped) {
    return "skipped";
  }
  await persistGratisSignup(store, mapped);
  return "imported";
}

export function contactsFromListPage(payload: unknown): {
  contacts: ResendListContact[];
  hasMore: boolean;
  nextAfter?: string;
} {
  if (!payload || typeof payload !== "object") {
    return { contacts: [], hasMore: false, nextAfter: undefined };
  }

  const root = payload as { data?: unknown; has_more?: unknown };
  const inner = root.data;
  const list = Array.isArray(inner)
    ? inner
    : inner && typeof inner === "object" && Array.isArray((inner as { data?: unknown }).data)
      ? ((inner as { data: unknown[] }).data)
      : [];
  const contacts = list.filter((item): item is ResendListContact => Boolean(item) && typeof item === "object");
  const hasMore = Boolean(
    root.has_more ??
      (inner && typeof inner === "object" && !Array.isArray(inner) && (inner as { has_more?: unknown }).has_more),
  );
  const last = contacts[contacts.length - 1];
  const nextAfter = typeof last?.id === "string" ? last.id : undefined;
  return { contacts, hasMore, nextAfter };
}
