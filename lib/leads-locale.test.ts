import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  GRATIS_SIGNUP_EVENT,
  createMemoryLeadStore,
  createSupabaseLeadStore,
  gratisSignupPayload,
  parseWelcomeLocales,
  persistGratisSignup,
  selectWelcomeEvent,
  sendGratisSignupEvent,
  type LeadRow,
  type LeadStore,
} from "./leads";

const NBSP = " ";

describe("welcome event routing", () => {
  it("keeps the Bokmål event for nb and for missing or unknown languages", () => {
    for (const env of [undefined, "", "en,de,sv,da,es,fr"]) {
      assert.equal(selectWelcomeEvent("nb", env), GRATIS_SIGNUP_EVENT);
      assert.equal(selectWelcomeEvent(undefined, env), GRATIS_SIGNUP_EVENT);
      assert.equal(selectWelcomeEvent("xx", env), GRATIS_SIGNUP_EVENT);
    }
  });

  it("falls back to the Bokmål event until the language is listed in RESEND_WELCOME_LOCALES", () => {
    assert.equal(selectWelcomeEvent("en", undefined), GRATIS_SIGNUP_EVENT);
    assert.equal(selectWelcomeEvent("en", ""), GRATIS_SIGNUP_EVENT);
    assert.equal(selectWelcomeEvent("sv", "en,de"), GRATIS_SIGNUP_EVENT);
  });

  it("uses studentplanlegger.gratis_signup.<lang> for listed languages", () => {
    assert.equal(selectWelcomeEvent("en", "en,de"), "studentplanlegger.gratis_signup.en");
    assert.equal(selectWelcomeEvent("de", " EN , de "), "studentplanlegger.gratis_signup.de");
    for (const lang of ["en", "de", "sv", "da", "es", "fr"]) {
      assert.equal(selectWelcomeEvent(lang, "en,de,sv,da,es,fr"), `${GRATIS_SIGNUP_EVENT}.${lang}`);
    }
  });

  it("parses the env list, ignoring Bokmål, junk and duplicates", () => {
    assert.deepEqual(parseWelcomeLocales("en, de,nb,xx,EN,,fr"), ["en", "de", "fr"]);
    assert.deepEqual(parseWelcomeLocales(undefined), []);
  });
});

describe("welcome event payload", () => {
  it("carries locale, currency and Komplett in the subscriber's currency", () => {
    assert.deepEqual(gratisSignupPayload("nb", "NOK"), { locale: "nb", currency: "NOK", bundlePrice: "249 kr" });
    assert.deepEqual(gratisSignupPayload("en", "USD"), { locale: "en", currency: "USD", bundlePrice: "$23.99" });
    assert.deepEqual(gratisSignupPayload("en", "GBP"), { locale: "en", currency: "GBP", bundlePrice: "£18.49" });
    assert.deepEqual(gratisSignupPayload("de", "EUR"), { locale: "de", currency: "EUR", bundlePrice: `21,99${NBSP}€` });
    assert.deepEqual(gratisSignupPayload("sv", "SEK"), { locale: "sv", currency: "SEK", bundlePrice: `239${NBSP}kr` });
    assert.deepEqual(gratisSignupPayload("da", "DKK"), { locale: "da", currency: "DKK", bundlePrice: `169${NBSP}kr.` });
    assert.deepEqual(gratisSignupPayload("fr", "NOK"), { locale: "fr", currency: "NOK", bundlePrice: `249${NBSP}NOK` });
  });

  it("falls back to the language's currency, and to Bokmål for an unknown language", () => {
    assert.deepEqual(gratisSignupPayload("es", "bogus"), { locale: "es", currency: "EUR", bundlePrice: `21,99${NBSP}€` });
    assert.deepEqual(gratisSignupPayload("xx", undefined), { locale: "nb", currency: "NOK", bundlePrice: "249 kr" });
  });

  it("sends the routed event with the payload", async () => {
    const calls: Array<{ event: string; email: string; payload?: Record<string, unknown> }> = [];
    const client = {
      events: {
        async send(params: (typeof calls)[number]) {
          calls.push(params);
          return { data: {}, error: null };
        },
      },
    };
    assert.equal(await sendGratisSignupEvent(client, "a@student.no", { locale: "de", currency: "EUR" }, "de"), true);
    assert.equal(await sendGratisSignupEvent(client, "b@student.no", { locale: "de", currency: "EUR" }, ""), true);
    assert.deepEqual(calls, [
      {
        event: "studentplanlegger.gratis_signup.de",
        email: "a@student.no",
        payload: { locale: "de", currency: "EUR", bundlePrice: `21,99${NBSP}€` },
      },
      {
        event: GRATIS_SIGNUP_EVENT,
        email: "b@student.no",
        payload: { locale: "de", currency: "EUR", bundlePrice: `21,99${NBSP}€` },
      },
    ]);
  });
});

/** A memory store that rejects locale/currency like a database without the 2026-11-19 migration. */
function storeWithoutLocaleColumns(error: { code: string; message: string }) {
  const inner = createMemoryLeadStore();
  const attempts: Array<Record<string, unknown>> = [];
  const reject = (row: Record<string, unknown>) => {
    attempts.push(row);
    if ("locale" in row || "currency" in row) {
      throw Object.assign(new Error(error.message), { code: error.code });
    }
  };
  const store: LeadStore = {
    ...inner,
    async insert(lead) {
      reject(lead);
      return inner.insert(lead);
    },
    async update(id, patch) {
      reject(patch);
      return inner.update(id, patch);
    },
  };
  return { store, inner, attempts };
}

describe("persistGratisSignup locale and currency", () => {
  it("stores a valid locale and currency, and ignores invalid ones", async () => {
    const store = createMemoryLeadStore();
    const lead = await persistGratisSignup(store, {
      email: "ny@student.no",
      welcomeEnrolled: false,
      locale: "de",
      currency: "eur",
    });
    assert.equal(lead.locale, "de");
    assert.equal(lead.currency, "EUR");

    const other = await persistGratisSignup(store, {
      email: "annen@student.no",
      welcomeEnrolled: false,
      locale: "xx",
      currency: "BTC",
    });
    assert.equal("locale" in other, false);
    assert.equal("currency" in other, false);
  });

  it("updates the language on a repeat signup", async () => {
    const store = createMemoryLeadStore();
    await persistGratisSignup(store, { email: "ny@student.no", welcomeEnrolled: false, locale: "nb", currency: "NOK" });
    const again = await persistGratisSignup(store, {
      email: "ny@student.no",
      welcomeEnrolled: false,
      locale: "sv",
      currency: "SEK",
    });
    assert.equal(store.leads.length, 1);
    assert.equal(again.locale, "sv");
    assert.equal(again.currency, "SEK");
  });

  it("retries the insert once without the columns when PostgREST doesn't know them (PGRST204)", async () => {
    const { store, inner, attempts } = storeWithoutLocaleColumns({
      code: "PGRST204",
      message: "Could not find the 'currency' column of 'leads' in the schema cache",
    });
    const lead = await persistGratisSignup(store, {
      email: "ny@student.no",
      welcomeEnrolled: true,
      locale: "fr",
      currency: "EUR",
    });
    assert.equal(attempts.length, 2);
    assert.equal(attempts[0]?.locale, "fr");
    assert.equal("locale" in (attempts[1] ?? {}), false);
    assert.equal(lead.email, "ny@student.no");
    assert.equal(inner.leads.length, 1);
    assert.equal(inner.campaigns.length, 2);
  });

  it("retries the update once without the columns on Postgres 42703", async () => {
    const { store, inner, attempts } = storeWithoutLocaleColumns({
      code: "42703",
      message: 'column "locale" of relation "leads" does not exist',
    });
    await inner.insert({
      email: "gammel@student.no",
      source: "gratis-ukeplan",
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      created_at: "2026-10-01T00:00:00.000Z",
      consent_at: "2026-10-01T00:00:00.000Z",
      consent_source: "gratis-form",
      unsubscribed: false,
      unsubscribed_at: null,
    } as Omit<LeadRow, "id">);
    const lead = await persistGratisSignup(store, {
      email: "gammel@student.no",
      welcomeEnrolled: false,
      locale: "en",
      currency: "GBP",
    });
    assert.equal(attempts.length, 2);
    assert.equal(lead.email, "gammel@student.no");
    assert.equal("locale" in lead, false);
  });

  it("does not retry other errors", async () => {
    const { store, attempts } = storeWithoutLocaleColumns({
      code: "23505",
      message: "duplicate key value violates unique constraint",
    });
    await assert.rejects(
      persistGratisSignup(store, { email: "ny@student.no", welcomeEnrolled: false, locale: "en" }),
      /duplicate key/,
    );
    assert.equal(attempts.length, 1);
  });

  it("passes the PostgREST error code through the Supabase store, so the fallback works live", async () => {
    const rows: Array<Record<string, unknown>> = [];
    const client = {
      from() {
        return {
          insert(row: Record<string, unknown>) {
            rows.push(row);
            const missing = "locale" in row;
            return {
              select() {
                return {
                  async single() {
                    return missing
                      ? {
                          data: null,
                          error: {
                            code: "PGRST204",
                            message: "Could not find the 'locale' column of 'leads' in the schema cache",
                          },
                        }
                      : { data: { id: "lead-1", ...row }, error: null };
                  },
                };
              },
            };
          },
        };
      },
    };
    const store = createSupabaseLeadStore(client as never);
    const memory = createMemoryLeadStore();
    const lead = await persistGratisSignup(
      { ...memory, insert: store.insert },
      { email: "ny@student.no", welcomeEnrolled: false, locale: "es", currency: "EUR" },
    );
    assert.equal(lead.id, "lead-1");
    assert.equal(rows.length, 2);
    assert.equal(rows[0]?.locale, "es");
    assert.equal("locale" in (rows[1] ?? {}), false);
  });
});

describe("signup route passes language and currency on", () => {
  const route = readFileSync(new URL("../app/api/newsletter/route.ts", import.meta.url), "utf8");
  const signup = readFileSync(new URL("../components/sections/NewsletterSignup.tsx", import.meta.url), "utf8");
  const migration = readFileSync(
    new URL("../supabase/migrations/2026-11-19-lead-locale.sql", import.meta.url),
    "utf8",
  );
  const schema = readFileSync(new URL("../scripts/schema.sql", import.meta.url), "utf8");

  it("sends locale from every signup form and validates it on the server", () => {
    assert.match(signup, /JSON\.stringify\(\{[^}]*\blocale\b[^}]*\}\)/);
    assert.match(route, /isLocale\(payload\.locale\)/);
    assert.match(route, /subscriberCurrency\(/);
    assert.match(route, /CURRENCY_COOKIE/);
    assert.match(route, /sendLeadMagnetEmail\(\{[^}]*locale, currency \}\)/);
    assert.match(route, /sendGratisSignupEvent\(resend, email, \{ locale, currency \}\)/);
    assert.match(route, /persistGratisSignup\([\s\S]*locale,\s*currency,/);
  });

  it("adds nullable locale and currency columns idempotently", () => {
    for (const sql of [migration, schema]) {
      assert.match(sql, /ALTER TABLE leads ADD COLUMN IF NOT EXISTS locale text;/);
      assert.match(sql, /ALTER TABLE leads ADD COLUMN IF NOT EXISTS currency text;/);
    }
    assert.doesNotMatch(migration, /NOT NULL/);
  });
});
