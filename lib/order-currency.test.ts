import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isMissingCurrencyColumnError } from "./order-insert-error";
import { createSupabaseOrderStore, orderMetaFromItems } from "./order-store";

const pending = {
  email: "kari@example.com",
  first_name: "Kari",
  last_name: "Nordmann",
  items: [{ id: "komplett", name: "Studentplanlegger Komplett", price: 249, type: "bundle" as const }],
  amount_nok: 249,
  payment_provider: "stripe",
  payment_id: "cs_1",
  payment_status: "pending",
  download_token: "token-1",
  token_expires_at: "2026-11-25T12:00:00.000Z",
};

const NEW_COLUMNS = ["currency", "amount_minor", "list_amount_minor", "discount_minor", "locale"];

/** Fake PostgREST: rejects inserts with the new columns like a database without the migration. */
function fakeClient({ migrated }: { migrated: boolean }) {
  const inserts: Record<string, unknown>[] = [];
  const client = {
    from() {
      return {
        insert(row: Record<string, unknown>) {
          inserts.push(row);
          return {
            select() {
              return {
                async single() {
                  const unknown = NEW_COLUMNS.find((column) => column in row);
                  if (!migrated && unknown) {
                    return {
                      data: null,
                      error: {
                        code: "PGRST204",
                        message: `Could not find the '${unknown}' column of 'orders' in the schema cache`,
                        details: null,
                        hint: null,
                      },
                    };
                  }
                  return { data: { id: `order-${inserts.length}`, ...row }, error: null };
                },
              };
            },
          };
        },
      };
    },
  };
  return { client, inserts };
}

describe("order insert with and without the currency/locale migration", () => {
  it("writes the new columns when they exist", async () => {
    const { client, inserts } = fakeClient({ migrated: true });
    const store = createSupabaseOrderStore(client as never);
    const order = await store.insertPending({ ...pending, currency: "EUR", amount_minor: 2199, locale: "de" });
    assert.equal(inserts.length, 1);
    assert.equal(inserts[0].currency, "EUR");
    assert.equal(inserts[0].amount_minor, 2199);
    assert.equal(inserts[0].locale, "de");
    assert.equal(order.currency, "EUR");
    assert.equal(order.amount_minor, 2199);
    assert.equal(order.locale, "de");
  });

  it("retries a NOK/Bokmål order without the new columns, stored exactly as before", async () => {
    const { client, inserts } = fakeClient({ migrated: false });
    const store = createSupabaseOrderStore(client as never);
    const order = await store.insertPending({ ...pending, currency: "NOK", amount_minor: 24900, locale: "nb" });
    assert.equal(inserts.length, 2);
    const legacy = inserts[1];
    for (const column of NEW_COLUMNS) assert.equal(column in legacy, false, column);
    assert.deepEqual(legacy.items, pending.items);
    assert.equal(legacy.amount_nok, 249);
    assert.equal(order.payment_status, "pending");
    assert.equal(order.currency, undefined);
  });

  it("keeps currency, amount and language of a non-NOK order in item metadata", async () => {
    const { client, inserts } = fakeClient({ migrated: false });
    const store = createSupabaseOrderStore(client as never);
    const order = await store.insertPending({
      ...pending,
      discount_code: "ABAKUS20",
      list_amount_nok: 249,
      discount_nok: 50,
      discount_percent: 20,
      amount_nok: 199,
      currency: "EUR",
      amount_minor: 1759,
      list_amount_minor: 2199,
      discount_minor: 440,
      locale: "fr",
    });
    const legacy = inserts[1];
    for (const column of NEW_COLUMNS) assert.equal(column in legacy, false, column);
    assert.deepEqual(orderMetaFromItems(legacy.items), {
      locale: "fr",
      currency: "EUR",
      amount_minor: 1759,
      list_amount_minor: 2199,
      discount_minor: 440,
    });
    // Read back through the same mapping the checkout uses.
    assert.equal(order.currency, "EUR");
    assert.equal(order.amount_minor, 1759);
    assert.equal(order.discount_minor, 440);
    assert.equal(order.locale, "fr");
    assert.equal(order.items[0].id, "komplett");
  });

  it("stops trying the new columns after the first miss", async () => {
    const { client, inserts } = fakeClient({ migrated: false });
    const store = createSupabaseOrderStore(client as never);
    await store.insertPending({ ...pending });
    await store.insertPending({ ...pending, payment_id: "cs_2" });
    assert.equal(inserts.length, 3);
  });

  it("recognises missing-column errors, and only those", () => {
    assert.equal(
      isMissingCurrencyColumnError({
        code: "PGRST204",
        message: "Could not find the 'amount_minor' column of 'orders' in the schema cache",
      }),
      true,
    );
    assert.equal(
      isMissingCurrencyColumnError({ code: "42703", message: 'column "locale" of relation "orders" does not exist' }),
      true,
    );
    assert.equal(isMissingCurrencyColumnError({ code: "23505", message: "duplicate key value" }), false);
    assert.equal(
      isMissingCurrencyColumnError({ code: "42703", message: 'column "something_else" does not exist' }),
      false,
    );
    assert.equal(isMissingCurrencyColumnError(new Error("fetch failed")), false);
  });
});
