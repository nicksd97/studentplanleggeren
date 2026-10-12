import type { CampaignTags } from "./attribution";
import { normalizeEmail } from "./newsletter";
import { supabaseAdmin } from "./supabase";

export const LEAD_SOURCE_GRATIS = "gratis-ukeplan";
export const CAMPAIGN_GRATIS_SAMPLE = "gratis-sample";
export const CAMPAIGN_VELKOMSTSERIE = "velkomstserie";
export const GRATIS_SIGNUP_EVENT = "studentplanlegger.gratis_signup";
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
};

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
    send(params: { event: string; email: string }): Promise<{ data?: unknown; error?: unknown }>;
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

function requireRow<T>(data: T | null, error: { message?: string } | null, message: string): T {
  if (error || !data) {
    throw new Error(error?.message || message);
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

export async function sendGratisSignupEvent(resend: ResendEventClient, email: string): Promise<boolean> {
  try {
    const { error } = await resend.events.send({
      event: GRATIS_SIGNUP_EVENT,
      email,
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

  const lead = existing
    ? await store.update(existing.id, {
        consent_at: input.consentAt ?? now,
        consent_source: input.consentSource ?? existing.consent_source,
        utm_source: firstTouch(existing.utm_source, tags.utm_source),
        utm_medium: firstTouch(existing.utm_medium, tags.utm_medium),
        utm_campaign: firstTouch(existing.utm_campaign, tags.utm_campaign),
        utm_content: firstTouch(existing.utm_content, tags.utm_content),
        unsubscribed,
        unsubscribed_at: unsubscribed ? (existing.unsubscribed_at ?? now) : null,
      })
    : await store.insert({
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
      });

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
