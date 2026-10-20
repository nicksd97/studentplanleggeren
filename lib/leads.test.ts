import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  CAMPAIGN_GRATIS_SAMPLE,
  CAMPAIGN_VELKOMSTSERIE,
  CONSENT_SOURCE_BACKFILL,
  CONSENT_SOURCE_FORM,
  GRATIS_SIGNUP_EVENT,
  LEAD_SOURCE_GRATIS,
  contactsFromListPage,
  createMemoryLeadStore,
  importResendContact,
  leadFromResendContact,
  persistGratisSignup,
  sendGratisSignupEvent,
} from "./leads";

describe("lead constants", () => {
  it("uses the gratis source and the two campaign keys", () => {
    assert.equal(LEAD_SOURCE_GRATIS, "gratis-ukeplan");
    assert.equal(CAMPAIGN_GRATIS_SAMPLE, "gratis-sample");
    assert.equal(CAMPAIGN_VELKOMSTSERIE, "velkomstserie");
    assert.equal(GRATIS_SIGNUP_EVENT, "studentplanlegger.gratis_signup");
  });
});

describe("sendGratisSignupEvent", () => {
  it("sends the custom event and returns true when Resend accepts it", async () => {
    const calls: Array<{ event: string; email: string }> = [];
    const ok = await sendGratisSignupEvent(
      {
        events: {
          async send(params) {
            calls.push(params);
            return { data: { object: "event", event: params.event }, error: null };
          },
        },
      },
      "ny@student.no",
    );

    assert.equal(ok, true);
    assert.deepEqual(calls, [{ event: GRATIS_SIGNUP_EVENT, email: "ny@student.no" }]);
  });

  it("returns false when the SDK reports an error or throws", async () => {
    const errorResult = await sendGratisSignupEvent(
      {
        events: {
          async send() {
            return { data: null, error: { message: "restricted_api_key" } };
          },
        },
      },
      "ny@student.no",
    );
    const thrown = await sendGratisSignupEvent(
      {
        events: {
          async send() {
            throw new Error("network");
          },
        },
      },
      "ny@student.no",
    );

    assert.equal(errorResult, false);
    assert.equal(thrown, false);
  });
});

describe("persistGratisSignup", () => {
  it("inserts a lead with source, first-touch UTM, consent and the sample campaign", async () => {
    const store = createMemoryLeadStore();
    const lead = await persistGratisSignup(store, {
      email: "ny@student.no",
      tags: { utm_source: "instagram", utm_medium: "social", utm_campaign: "eksamen" },
      welcomeEnrolled: false,
    });

    assert.equal(lead.email, "ny@student.no");
    assert.equal(lead.source, LEAD_SOURCE_GRATIS);
    assert.equal(lead.utm_source, "instagram");
    assert.equal(lead.utm_campaign, "eksamen");
    assert.equal(lead.consent_source, CONSENT_SOURCE_FORM);
    assert.equal(lead.unsubscribed, false);
    assert.deepEqual(
      store.campaigns.map((row) => row.campaign),
      [CAMPAIGN_GRATIS_SAMPLE],
    );
    assert.equal(store.campaigns[0]?.status, "sent");
    assert.ok(store.campaigns[0]?.sent_at);
  });

  it("records velkomstserie only when the welcome event succeeded", async () => {
    const enrolled = createMemoryLeadStore();
    await persistGratisSignup(enrolled, {
      email: "ny@student.no",
      welcomeEnrolled: true,
    });
    const skipped = createMemoryLeadStore();
    await persistGratisSignup(skipped, {
      email: "gammel@student.no",
      welcomeEnrolled: false,
    });

    assert.deepEqual(
      enrolled.campaigns.map((row) => row.campaign).sort(),
      [CAMPAIGN_GRATIS_SAMPLE, CAMPAIGN_VELKOMSTSERIE],
    );
    assert.equal(
      enrolled.campaigns.find((row) => row.campaign === CAMPAIGN_VELKOMSTSERIE)?.status,
      "enrolled",
    );
    assert.ok(enrolled.campaigns.find((row) => row.campaign === CAMPAIGN_VELKOMSTSERIE)?.enrolled_at);
    assert.deepEqual(
      skipped.campaigns.map((row) => row.campaign),
      [CAMPAIGN_GRATIS_SAMPLE],
    );
  });

  it("upserts on email and keeps the first UTM values", async () => {
    const store = createMemoryLeadStore();
    const first = await persistGratisSignup(store, {
      email: "ny@student.no",
      tags: { utm_source: "instagram", utm_campaign: "eksamen" },
      welcomeEnrolled: true,
    });
    const second = await persistGratisSignup(store, {
      email: "NY@student.no",
      tags: { utm_source: "tiktok", utm_campaign: "ny" },
      welcomeEnrolled: true,
    });

    assert.equal(store.leads.length, 1);
    assert.equal(second.id, first.id);
    assert.equal(second.utm_source, "instagram");
    assert.equal(second.utm_campaign, "eksamen");
    assert.equal(
      store.campaigns.filter((row) => row.campaign === CAMPAIGN_VELKOMSTSERIE).length,
      1,
    );
  });
});

describe("Resend backfill mapping", () => {
  it("maps a segment contact to a gratis lead with the sample campaign only", async () => {
    const mapped = leadFromResendContact({
      email: "Gammel@Student.no",
      unsubscribed: true,
      created_at: "2026-09-01T10:00:00.000Z",
    });
    assert.ok(mapped);
    assert.equal(mapped.email, "gammel@student.no");
    assert.equal(mapped.source, LEAD_SOURCE_GRATIS);
    assert.equal(mapped.consentSource, CONSENT_SOURCE_BACKFILL);
    assert.equal(mapped.unsubscribed, true);
    assert.equal(mapped.createdAt, "2026-09-01T10:00:00.000Z");

    const store = createMemoryLeadStore();
    const result = await importResendContact(store, {
      email: "gammel@student.no",
      unsubscribed: true,
      created_at: "2026-09-01T10:00:00.000Z",
    });

    assert.equal(result, "imported");
    assert.deepEqual(
      store.campaigns.map((row) => row.campaign),
      [CAMPAIGN_GRATIS_SAMPLE],
    );
  });

  it("skips invalid addresses and does not invent a welcome enrollment", async () => {
    assert.equal(leadFromResendContact({ email: "ikke-epost" }), null);
    const store = createMemoryLeadStore();
    assert.equal(await importResendContact(store, { email: "ikke-epost" }), "skipped");
    assert.equal(store.leads.length, 0);
  });

  it("reads paginated Resend list payloads", () => {
    const page = contactsFromListPage({
      object: "list",
      has_more: true,
      data: [
        { id: "c1", email: "a@student.no", unsubscribed: false, created_at: "2026-09-01T00:00:00Z" },
        { id: "c2", email: "b@student.no", unsubscribed: false, created_at: "2026-09-02T00:00:00Z" },
      ],
    });
    assert.equal(page.contacts.length, 2);
    assert.equal(page.hasMore, true);
    assert.equal(page.nextAfter, "c2");
    assert.deepEqual(contactsFromListPage(null), { contacts: [], hasMore: false, nextAfter: undefined });
  });
});

describe("signup and backfill wiring", () => {
  const route = readFileSync(new URL("../app/api/newsletter/route.ts", import.meta.url), "utf8");
  const backfill = readFileSync(new URL("../scripts/backfill-resend-leads.ts", import.meta.url), "utf8");
  const personvern = readFileSync(new URL("../app/personvern/page.tsx", import.meta.url), "utf8");
  const signup = readFileSync(new URL("../components/sections/NewsletterSignup.tsx", import.meta.url), "utf8");

  it("fires the welcome event only for new signups and never lets it break the handler", () => {
    assert.match(route, /isNew/);
    assert.match(route, /sendGratisSignupEvent/);
    assert.match(route, /persistGratisSignup/);
    assert.match(route, /try/);
    assert.match(route, /catch/);
    assert.match(route, /CAMPAIGN_COOKIE|parseCampaignCookie/);
    assert.match(signup, /currentCampaignTags/);
  });

  it("imports existing segment contacts without starting the welcome series", () => {
    assert.match(backfill, /contacts\.list/);
    assert.match(backfill, /importResendContact/);
    assert.equal(backfill.includes("events.send"), false);
    assert.equal(backfill.includes("studentplanlegger.gratis_signup"), false);
    assert.match(backfill, /--apply/);
    assert.doesNotMatch(backfill, /console\.log\([^)]*email/i);
  });

  it("describes lead storage and e-postmarkedsføring on personvern", () => {
    assert.match(personvern, /20\. oktober 2026/);
    assert.match(personvern, /Google Analytics 4/);
    assert.match(personvern, /samtykke/i);
    assert.match(personvern, /Supabase/);
    assert.match(personvern, /leads/);
    assert.match(personvern, /velkomstserie|velkomst/);
    assert.match(personvern, /kampanje|UTM|utm/i);
    assert.match(personvern, /sp_campaign|kampanjekapsel|førsteparts/);
    assert.equal(personvern.includes("ingen e-postmarkedsføring"), false);
  });
});
