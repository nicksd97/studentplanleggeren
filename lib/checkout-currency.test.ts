import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  INVALID_CURRENCY_MESSAGE,
  VIPPS_NOK_ONLY_MESSAGE,
  confirmStripePayment,
  previewCheckoutDiscount,
  startCheckoutPayment,
  type CheckoutDependencies,
  type OrderRecord,
  type StripeCheckoutSession,
} from "./checkout";
import type { DiscountRow } from "./discount";

const abakus: DiscountRow = {
  code: "ABAKUS20",
  association_name: "Abakus, NTNU",
  percent: 20,
  active: true,
  expires_at: null,
  max_redemptions: null,
  redemption_count: 0,
};

function harness() {
  const orders: OrderRecord[] = [];
  const sessions: Parameters<CheckoutDependencies["stripe"]["createCheckoutSession"]>[0][] = [];
  const vippsPayments: number[] = [];
  const emails: Parameters<CheckoutDependencies["mailer"]["sendOrderConfirmation"]>[0][] = [];
  let session: StripeCheckoutSession | null = null;

  const deps: CheckoutDependencies = {
    orders: {
      async insertPending(data) {
        const order = { id: `order-${orders.length + 1}`, ...data } as OrderRecord;
        orders.push(order);
        return { ...order };
      },
      async findByPaymentId(id) {
        return orders.find((order) => order.payment_id === id) ?? null;
      },
      async completeIfPending(id) {
        const order = orders.find((row) => row.id === id);
        if (!order || order.payment_status !== "pending") return null;
        order.payment_status = "completed";
        return { ...order };
      },
      async markCancelled(id) {
        const order = orders.find((row) => row.id === id);
        if (order) order.payment_status = "cancelled";
        return order ?? null;
      },
      async updateBuyerDetails() {
        return null;
      },
    },
    vipps: {
      async createPayment(input) {
        vippsPayments.push(input.amountOre);
        return { redirectUrl: "https://landing.vipps.no/pay" };
      },
      async getPayment() {
        throw new Error("not used");
      },
      async capturePayment() {
        throw new Error("not used");
      },
    },
    stripe: {
      async createCheckoutSession(input) {
        sessions.push(input);
        return { id: `cs_${sessions.length}`, url: "https://checkout.stripe.com/c/pay/cs" };
      },
      async getCheckoutSession() {
        if (!session) throw new Error("no session");
        return session;
      },
    },
    mailer: {
      async sendOrderConfirmation(input) {
        emails.push(input);
      },
    },
    discounts: {
      async lookup(code) {
        return code === "ABAKUS20" ? { ok: true as const, row: abakus } : { ok: false as const, reason: "invalid" as const };
      },
      async incrementRedemption() {},
    },
    now: () => new Date("2026-11-18T12:00:00.000Z"),
    createReference: () => "ord-ref",
    createDownloadToken: () => "token-1",
  };

  return {
    deps,
    orders,
    sessions,
    vippsPayments,
    emails,
    setSession(value: StripeCheckoutSession) {
      session = value;
    },
  };
}

const buyer = {
  email: "kari@example.com",
  firstName: "Kari",
  lastName: "Nordmann",
  returnOrigin: "https://www.studentplanlegger.no",
};
const komplett = [{ id: "komplett", name: "Forged", price: 1, type: "bundle" }];
const sevenSingles = [
  "daglig-planlegger",
  "daglig-timeplan",
  "ukentlig-plan",
  "vane-tracker",
  "handlingsplan",
  "maal-planlegger",
  "reise-planlegger",
].map((id) => ({ id, name: "x", price: 1, type: "product" }));

describe("Stripe checkout in local currency", () => {
  const expected: Array<[string, typeof komplett, number]> = [
    ["NOK", komplett, 24900],
    ["SEK", komplett, 23900],
    ["DKK", komplett, 16900],
    ["EUR", komplett, 2199],
    ["GBP", komplett, 1849],
    ["USD", komplett, 2399],
    ["EUR", sevenSingles, 899 + 2 * 349],
    ["SEK", sevenSingles, 9900 + 2 * 3900],
  ];

  for (const [currency, items, amount] of expected) {
    it(`charges ${amount} minor units of ${currency} for ${items.length} item(s), ignoring client prices`, async () => {
      const h = harness();
      const result = await startCheckoutPayment(
        { ...buyer, items, amountNok: 1, paymentProvider: "stripe", currency: currency.toLowerCase(), locale: "de" },
        h.deps,
      );
      assert.equal(result.ok, true);
      assert.equal(h.sessions[0].currency, currency);
      assert.equal(h.sessions[0].amountMinor, amount);
      assert.equal(h.sessions[0].locale, "de");
      assert.match(h.sessions[0].cancelUrl, /\/de\/kasse\?betaling=avbrutt$/);
      assert.equal(h.orders[0].currency, currency);
      assert.equal(h.orders[0].amount_minor, amount);
      assert.equal(h.orders[0].locale, "de");
    });
  }

  it("stores the NOK-equivalent in amount_nok for non-NOK orders", async () => {
    const h = harness();
    await startCheckoutPayment({ ...buyer, items: komplett, paymentProvider: "stripe", currency: "EUR" }, h.deps);
    assert.equal(h.orders[0].amount_nok, 249);
  });

  it("applies percent discount codes per currency, rounded in minor units", async () => {
    const cases: Array<[string, number, number, number]> = [
      ["NOK", 24900, 19900, 5000],
      ["EUR", 2199, 1759, 440],
      ["GBP", 1849, 1479, 370],
      ["USD", 2399, 1919, 480],
      ["SEK", 23900, 19100, 4800],
      ["DKK", 16900, 13500, 3400],
    ];
    for (const [currency, list, amount, discount] of cases) {
      const h = harness();
      const result = await startCheckoutPayment(
        { ...buyer, items: komplett, paymentProvider: "stripe", currency, discountCode: "abakus20" },
        h.deps,
      );
      assert.equal(result.ok, true, currency);
      assert.equal(h.sessions[0].amountMinor, amount, currency);
      assert.equal(h.orders[0].list_amount_minor, list, currency);
      assert.equal(h.orders[0].discount_minor, discount, currency);
      assert.equal(h.orders[0].amount_nok, 199, currency);
      assert.equal(h.orders[0].discount_percent, 20, currency);

      const preview = await previewCheckoutDiscount(komplett, "ABAKUS20", h.deps.discounts!.lookup, currency);
      assert.equal(preview.ok && preview.amountMinor, amount, currency);
      assert.equal(preview.ok && preview.currency, currency);
    }
  });

  it("keeps NOK checkout identical when no currency is sent", async () => {
    const h = harness();
    await startCheckoutPayment({ ...buyer, items: komplett, paymentProvider: "stripe" }, h.deps);
    assert.equal(h.sessions[0].currency, "NOK");
    assert.equal(h.sessions[0].amountMinor, 24900);
    assert.equal(h.sessions[0].locale, "nb");
    assert.match(h.sessions[0].cancelUrl, /\.no\/kasse\?betaling=avbrutt$/);
  });

  it("rejects unknown currencies before creating anything", async () => {
    for (const currency of ["BTC", "nok2", 12, "CHF"]) {
      const h = harness();
      const result = await startCheckoutPayment(
        { ...buyer, items: komplett, paymentProvider: "stripe", currency },
        h.deps,
      );
      assert.deepEqual(result, { ok: false, status: 400, error: INVALID_CURRENCY_MESSAGE }, String(currency));
      assert.equal(h.sessions.length, 0);
      assert.equal(h.orders.length, 0);
    }
    const preview = await previewCheckoutDiscount(komplett, "ABAKUS20", async () => ({ ok: true, row: abakus }), "BTC");
    assert.equal(preview.ok, false);
  });
});

describe("Vipps stays NOK-only", () => {
  it("rejects Vipps with any other currency", async () => {
    for (const currency of ["EUR", "SEK", "DKK", "GBP", "USD"]) {
      const h = harness();
      const result = await startCheckoutPayment(
        { ...buyer, items: komplett, paymentProvider: "vipps", currency },
        h.deps,
      );
      assert.deepEqual(result, { ok: false, status: 400, error: VIPPS_NOK_ONLY_MESSAGE }, currency);
      assert.equal(h.vippsPayments.length, 0);
      assert.equal(h.orders.length, 0);
    }
  });

  it("starts Vipps in NOK exactly as before", async () => {
    const h = harness();
    const result = await startCheckoutPayment(
      { ...buyer, items: komplett, paymentProvider: "vipps", currency: "NOK", locale: "en" },
      h.deps,
    );
    assert.equal(result.ok, true);
    assert.deepEqual(h.vippsPayments, [24900]);
    assert.equal(h.orders[0].currency, "NOK");
    assert.equal(h.orders[0].locale, "en");
  });
});

describe("Stripe confirmation compares the stored currency and amount", () => {
  it("completes a EUR order paid in EUR and mails in the buyer's language", async () => {
    const h = harness();
    await startCheckoutPayment(
      { ...buyer, items: komplett, paymentProvider: "stripe", currency: "EUR", locale: "fr" },
      h.deps,
    );
    h.setSession({ id: "cs_1", status: "complete", payment_status: "paid", amount_total: 2199, currency: "eur" });
    const result = await confirmStripePayment({ sessionId: "cs_1" }, h.deps);
    assert.deepEqual(result, { ok: true, downloadToken: "token-1", locale: "fr" });
    assert.equal(h.emails[0].currency, "EUR");
    assert.equal(h.emails[0].amountMinor, 2199);
    assert.equal(h.emails[0].locale, "fr");
  });

  it("refuses a session in the wrong currency or amount", async () => {
    for (const session of [
      { amount_total: 2199, currency: "nok" },
      { amount_total: 24900, currency: "nok" },
      { amount_total: 2000, currency: "eur" },
    ]) {
      const h = harness();
      await startCheckoutPayment({ ...buyer, items: komplett, paymentProvider: "stripe", currency: "EUR" }, h.deps);
      h.setSession({ id: "cs_1", status: "complete", payment_status: "paid", ...session });
      const result = await confirmStripePayment({ sessionId: "cs_1" }, h.deps);
      assert.equal(result.ok, false);
      assert.equal(!result.ok && result.reason, "mismatch");
      assert.equal(h.orders[0].payment_status, "pending");
    }
  });

  it("still confirms older NOK orders without currency fields from amount_nok", async () => {
    const h = harness();
    h.orders.push({
      id: "old",
      email: "a@b.no",
      first_name: "A",
      last_name: "B",
      items: [{ id: "komplett", name: "Studentplanlegger Komplett", price: 249, type: "bundle" }],
      amount_nok: 249,
      payment_provider: "stripe",
      payment_id: "cs_old",
      payment_status: "pending",
      download_token: "old-token",
      token_expires_at: "2026-11-25T12:00:00.000Z",
    });
    h.setSession({ id: "cs_old", status: "complete", payment_status: "paid", amount_total: 24900, currency: "nok" });
    const result = await confirmStripePayment({ sessionId: "cs_old" }, h.deps);
    assert.equal(result.ok, true);
  });
});
