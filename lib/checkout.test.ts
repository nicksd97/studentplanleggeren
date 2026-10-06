import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  confirmStripePayment,
  confirmVippsPayment,
  isCardCheckoutAllowed,
  priceCheckoutItems,
  startCheckoutPayment,
} from "./checkout";
import type {
  CheckoutDependencies,
  OrderRecord,
  StripeCheckoutSession,
  VippsPayment,
} from "./checkout";
import { createOrderInsertFailure } from "./order-insert-error";
import {
  alleProdukter,
  completePackageCartItem,
  FIVE_PACK_PRICE,
  KOMPLETT_PRICE,
  SINGLE_PRICE,
  THEME_PACK_PRICE,
} from "./products";

const product = alleProdukter[0];
assert.ok(product);
const komplettOre = KOMPLETT_PRICE * 100;
const fiveSingles = alleProdukter.slice(0, 5).map((entry) => ({ id: entry.id, price: 1 }));

function payment(overrides: Partial<VippsPayment> = {}): VippsPayment {
  const amount = overrides.amount ?? { currency: "NOK", value: product.price * 100 };
  return {
    reference: "ord-testref01",
    state: "CREATED",
    amount,
    aggregate: {
      authorizedAmount: { currency: "NOK", value: 0 },
      capturedAmount: { currency: "NOK", value: 0 },
      cancelledAmount: { currency: "NOK", value: 0 },
      refundedAmount: { currency: "NOK", value: 0 },
    },
    ...overrides,
  };
}

function stripeSession(overrides: Partial<StripeCheckoutSession> = {}): StripeCheckoutSession {
  return {
    id: "cs_test_123",
    status: "open",
    payment_status: "unpaid",
    amount_total: product.price * 100,
    currency: "nok",
    ...overrides,
  };
}

function memoryDeps(vippsPayment: VippsPayment | null = null) {
  const orders: OrderRecord[] = [];
  let nextPayment: VippsPayment | null = vippsPayment;
  let nextSession: StripeCheckoutSession | null = null;
  const emails: Array<{
    email: string;
    downloadToken: string;
    amountNok?: number;
    discountCode?: string;
    discountNok?: number;
  }> = [];
  const createdPayments: Array<{
    reference: string;
    amountOre: number;
    profileScope?: string;
  }> = [];
  const createdSessions: Array<{ amountOre: number; email: string; successUrl: string; cancelUrl: string }> =
    [];
  const captures: Array<{ reference: string; amountOre: number }> = [];
  const purchases: OrderRecord[] = [];

  const deps: CheckoutDependencies = {
    orders: {
      async insertPending(data) {
        const order: OrderRecord = { id: `order-${orders.length + 1}`, ...data };
        orders.push(order);
        return { ...order };
      },
      async findByPaymentId(paymentId) {
        return orders.find((order) => order.payment_id === paymentId) ?? null;
      },
      async completeIfPending(id) {
        const order = orders.find((row) => row.id === id);
        if (!order || order.payment_status !== "pending") return null;
        order.payment_status = "completed";
        return { ...order };
      },
      async markCancelled(id) {
        const order = orders.find((row) => row.id === id);
        if (!order || order.payment_status === "completed") return order ?? null;
        order.payment_status = "cancelled";
        return { ...order };
      },
      async updateBuyerDetails(id, details) {
        const order = orders.find((row) => row.id === id);
        if (!order) return null;
        if (details.email !== undefined) order.email = details.email;
        if (details.first_name !== undefined) order.first_name = details.first_name;
        if (details.last_name !== undefined) order.last_name = details.last_name;
        return { ...order };
      },
    },
    vipps: {
      async createPayment(input) {
        createdPayments.push({
          reference: input.reference,
          amountOre: input.amountOre,
          profileScope: input.profileScope,
        });
        return { redirectUrl: `https://landing.vipps.no/pay/${input.reference}` };
      },
      async getPayment() {
        if (!nextPayment) throw new Error("Vipps payment not found");
        return nextPayment;
      },
      async capturePayment(reference, amountOre) {
        captures.push({ reference, amountOre });
        if (!nextPayment) throw new Error("Vipps payment not found");
        nextPayment = {
          ...nextPayment,
          aggregate: {
            ...nextPayment.aggregate,
            capturedAmount: { currency: "NOK", value: amountOre },
          },
        };
        return nextPayment;
      },
    },
    stripe: {
      async createCheckoutSession(input) {
        createdSessions.push({
          amountOre: input.amountOre,
          email: input.email,
          successUrl: input.successUrl,
          cancelUrl: input.cancelUrl,
        });
        return { id: "cs_test_123", url: "https://checkout.stripe.com/c/pay/cs_test_123" };
      },
      async getCheckoutSession() {
        if (!nextSession) throw new Error("Stripe session not found");
        return nextSession;
      },
    },
    mailer: {
      async sendOrderConfirmation(input) {
        emails.push({
          email: input.email,
          downloadToken: input.downloadToken,
          amountNok: input.amountNok,
          discountCode: input.discountCode,
          discountNok: input.discountNok,
        });
      },
    },
    discounts: {
      async lookup() {
        return { ok: false, reason: "invalid" as const };
      },
      async incrementRedemption() {},
    },
    analytics: {
      async recordPurchase(order) {
        purchases.push({ ...order });
      },
    },
    now: () => new Date("2026-10-03T12:00:00.000Z"),
    createReference: () => "ord-testref01",
    createDownloadToken: () => "download-token-test",
  };

  return {
    deps,
    orders,
    emails,
    purchases,
    createdPayments,
    createdSessions,
    captures,
    setPayment(value: VippsPayment | null) {
      nextPayment = value;
    },
    setSession(value: StripeCheckoutSession | null) {
      nextSession = value;
    },
  };
}

const checkoutInput = {
  email: "ola@example.com",
  firstName: "Ola",
  lastName: "Nordmann",
  items: [{ id: product.id, name: "Forged name", price: 1, type: "product" as const }],
  amountNok: 1,
  paymentProvider: "vipps" as const,
  returnOrigin: "https://www.studentplanlegger.no",
};

describe("catalog prices and 5-pack", () => {
  it("prices every single at 39 kr and theme packs at 149 kr", () => {
    assert.equal(SINGLE_PRICE, 39);
    assert.equal(THEME_PACK_PRICE, 149);
    assert.equal(FIVE_PACK_PRICE, 99);
    assert.equal(KOMPLETT_PRICE, 249);
    assert.ok(alleProdukter.every((entry) => entry.price === SINGLE_PRICE));
    const daglig = priceCheckoutItems([{ id: "daglig-pakke", price: 1 }]);
    assert.equal("error" in daglig, false);
    if ("error" in daglig) throw new Error(daglig.error);
    assert.equal(daglig.amountNok, THEME_PACK_PRICE);
  });

  it("charges 99 kr for any 5 singles even if the client forges unit prices", () => {
    const priced = priceCheckoutItems(fiveSingles);
    assert.equal("error" in priced, false);
    if ("error" in priced) throw new Error(priced.error);
    assert.equal(priced.amountNok, FIVE_PACK_PRICE);
    assert.equal(priced.items.length, 5);
    assert.ok(priced.items.every((item) => item.price === SINGLE_PRICE));
  });

  it("keeps leftover singles at 39 kr after each complete 5-pack", () => {
    const six = alleProdukter.slice(0, 6).map((entry) => ({ id: entry.id }));
    const ten = alleProdukter.slice(0, 10).map((entry) => ({ id: entry.id }));
    const four = alleProdukter.slice(0, 4).map((entry) => ({ id: entry.id }));
    const sixPriced = priceCheckoutItems(six);
    const tenPriced = priceCheckoutItems(ten);
    const fourPriced = priceCheckoutItems(four);
    assert.equal("error" in sixPriced, false);
    assert.equal("error" in tenPriced, false);
    assert.equal("error" in fourPriced, false);
    if ("error" in sixPriced || "error" in tenPriced || "error" in fourPriced) {
      throw new Error("expected singles to price");
    }
    assert.equal(sixPriced.amountNok, FIVE_PACK_PRICE + SINGLE_PRICE);
    assert.equal(tenPriced.amountNok, FIVE_PACK_PRICE * 2);
    assert.equal(fourPriced.amountNok, SINGLE_PRICE * 4);
  });

  it("does not fold theme packs into the 5-pack count", () => {
    const mixed = priceCheckoutItems([
      { id: "daglig-pakke" },
      ...alleProdukter.slice(5, 9).map((entry) => ({ id: entry.id })),
    ]);
    assert.equal("error" in mixed, false);
    if ("error" in mixed) throw new Error(mixed.error);
    assert.equal(mixed.amountNok, THEME_PACK_PRICE + SINGLE_PRICE * 4);
  });

  it("rejects a fake 5-pack bundle id so checkout still needs the five product ids", () => {
    const fake = priceCheckoutItems([{ id: "fem-pakke" }]);
    assert.deepEqual(fake, { error: "Ukjent produkt" });
  });

  it("starts Vipps and Stripe at the 5-pack amount, not the forged client total", async () => {
    const { deps, orders, createdPayments } = memoryDeps();
    const vipps = await startCheckoutPayment(
      {
        items: fiveSingles,
        amountNok: 1,
        paymentProvider: "vipps",
        returnOrigin: "https://www.studentplanlegger.no",
      },
      deps,
    );
    assert.equal(vipps.ok, true);
    assert.equal(orders[0].amount_nok, FIVE_PACK_PRICE);
    assert.equal(createdPayments[0].amountOre, FIVE_PACK_PRICE * 100);

    const stripeHarness = memoryDeps();
    const stripe = await startCheckoutPayment(
      {
        ...checkoutInput,
        items: fiveSingles,
        amountNok: 1,
        paymentProvider: "stripe",
      },
      stripeHarness.deps,
    );
    assert.equal(stripe.ok, true);
    assert.equal(stripeHarness.orders[0].amount_nok, FIVE_PACK_PRICE);
    assert.equal(stripeHarness.createdSessions[0].amountOre, FIVE_PACK_PRICE * 100);
  });
});

describe("card checkout", () => {
  it("is allowed so Betal med kort can start a real Stripe payment", () => {
    assert.equal(isCardCheckoutAllowed(), true);
  });

  it("stores a pending catalog-priced order and does not email a download link", async () => {
    const { deps, orders, emails, createdSessions } = memoryDeps();
    const result = await startCheckoutPayment(
      { ...checkoutInput, paymentProvider: "stripe" },
      deps,
    );

    assert.equal(result.ok, true);
    if (!result.ok) throw new Error("expected Stripe checkout to start");
    assert.equal(result.redirectUrl, "https://checkout.stripe.com/c/pay/cs_test_123");
    assert.equal("downloadToken" in result, false);
    assert.equal(orders.length, 1);
    assert.equal(orders[0].payment_status, "pending");
    assert.equal(orders[0].payment_provider, "stripe");
    assert.equal(orders[0].payment_id, "cs_test_123");
    assert.equal(orders[0].amount_nok, product.price);
    assert.equal(orders[0].items[0].price, product.price);
    assert.equal(createdSessions[0].amountOre, product.price * 100);
    assert.equal(createdSessions[0].email, "ola@example.com");
    assert.match(createdSessions[0].successUrl, /session_id=\{CHECKOUT_SESSION_ID\}/);
    assert.match(createdSessions[0].cancelUrl, /kasse\?betaling=avbrutt/);
    assert.equal(emails.length, 0);
  });

  it("does not complete or email when Stripe cannot create a checkout session", async () => {
    const harness = memoryDeps();
    harness.deps.stripe.createCheckoutSession = async () => {
      throw new Error("Your account cannot currently make live charges.");
    };

    const result = await startCheckoutPayment(
      { ...checkoutInput, paymentProvider: "stripe" },
      harness.deps,
    );

    assert.equal(result.ok, false);
    if (result.ok) throw new Error("expected Stripe start to fail");
    assert.equal(result.status, 503);
    assert.match(result.error, /ikke aktivert/i);
    assert.equal(harness.emails.length, 0);
    assert.ok(harness.orders.every((order) => order.payment_status !== "completed"));
  });

  it("returns 502 ordre error when Stripe session exists but insertPending throws", async () => {
    const harness = memoryDeps();
    harness.deps.orders.insertPending = async () => {
      throw createOrderInsertFailure({
        code: "",
        message: "TypeError: fetch failed",
        details: "Caused by: ConnectTimeoutError",
      });
    };

    const result = await startCheckoutPayment(
      { ...checkoutInput, paymentProvider: "stripe" },
      harness.deps,
    );

    assert.equal(result.ok, false);
    if (result.ok) throw new Error("expected insert to fail");
    assert.equal(result.status, 502);
    assert.match(result.error, /ordre/i);
    assert.match(result.details ?? "", /fetch failed|ConnectTimeoutError/i);
    assert.equal(harness.emails.length, 0);
    assert.ok(harness.orders.every((order) => order.payment_status !== "completed"));
  });

  it("rejects unknown payment providers without creating an order", async () => {
    const { deps, orders, emails } = memoryDeps();
    const result = await startCheckoutPayment(
      { ...checkoutInput, paymentProvider: "free" },
      deps,
    );

    assert.equal(result.ok, false);
    if (result.ok) throw new Error("expected unknown provider to fail");
    assert.equal(result.status, 400);
    assert.equal(orders.length, 0);
    assert.equal(emails.length, 0);
  });

  it("keeps Vipps first and visually primary, with card as a working secondary option", () => {
    const source = readFileSync(new URL("../app/kasse/page.tsx", import.meta.url), "utf8");
    assert.match(source, /Betal med Vipps/);
    assert.match(source, /Betal med kort/);
    assert.match(source, /handlePayment\("vipps"\)/);
    assert.match(source, /handlePayment\("stripe"\)/);
    assert.match(source, /Anbefalt/);
    assert.ok(source.indexOf("Betal med Vipps") < source.indexOf("Betal med kort"));
    assert.ok(source.indexOf("#FF5B24") < source.indexOf("Betal med kort"));
    assert.match(source, /isCardCheckoutAllowed/);
  });

  it("keeps the checkout form for card, not for the homepage complett Vipps button", () => {
    const kasse = readFileSync(new URL("../app/kasse/page.tsx", import.meta.url), "utf8");
    assert.match(kasse, /Fornavn/);
    assert.match(kasse, /E-post/);
    assert.match(kasse, /Betal med kort/);
    assert.match(kasse, /handlePayment\("stripe"\)/);

    const takk = readFileSync(new URL("../app/takk/page.tsx", import.meta.url), "utf8");
    assert.match(takk, /Nedlastingen er klar/);
    assert.match(takk, /order\.email\.includes\("@"\)/);
  });

  it("persists the requested payment provider instead of hardcoding Vipps", () => {
    const source = readFileSync(new URL("../lib/order-store.ts", import.meta.url), "utf8");
    assert.match(source, /payment_provider:\s*data\.payment_provider/);
    assert.equal(source.includes('payment_provider: "vipps"'), false);
  });

  it("lets the orders API start a Stripe checkout instead of rejecting card", () => {
    const source = readFileSync(new URL("../app/api/orders/route.ts", import.meta.url), "utf8");
    assert.equal(source.includes('paymentProvider !== "vipps"'), false);
    assert.equal(source.includes("CARD_CHECKOUT_DISABLED_MESSAGE"), false);
    assert.match(source, /startProductionCheckout/);
    assert.match(source, /result\.details/);
  });

  it("reads the existing Stripe env names and never treats a missing charge as paid", () => {
    const source = readFileSync(new URL("./stripe.ts", import.meta.url), "utf8");
    assert.match(source, /process\.env\.STRIPE_SECRET_KEY/);
    assert.match(source, /process\.env\.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY/);
    assert.equal(source.includes("payment_status: \"completed\""), false);
    assert.equal(source.includes("payment_status: 'completed'"), false);
  });
});

describe("Stripe payment confirmation", () => {
  async function pendingStripeOrder(harness = memoryDeps()) {
    const started = await startCheckoutPayment(
      { ...checkoutInput, paymentProvider: "stripe" },
      harness.deps,
    );
    assert.equal(started.ok, true);
    return harness;
  }

  it("does not mark the order paid before Stripe confirms payment", async () => {
    const harness = await pendingStripeOrder();
    harness.setSession(stripeSession({ status: "open", payment_status: "unpaid" }));

    const result = await confirmStripePayment({ sessionId: "cs_test_123" }, harness.deps);

    assert.equal(result.ok, false);
    assert.equal(harness.orders[0].payment_status, "pending");
    assert.equal(harness.emails.length, 0);
  });

  it("does not complete or email after an expired or abandoned checkout", async () => {
    const harness = await pendingStripeOrder();
    harness.setSession(stripeSession({ status: "expired", payment_status: "unpaid" }));

    const result = await confirmStripePayment({ sessionId: "cs_test_123" }, harness.deps);

    assert.equal(result.ok, false);
    assert.notEqual(harness.orders[0].payment_status, "completed");
    assert.equal(harness.emails.length, 0);
  });

  it("does not treat no_payment_required as a successful card charge", async () => {
    const harness = await pendingStripeOrder();
    harness.setSession(
      stripeSession({
        status: "complete",
        payment_status: "no_payment_required",
        amount_total: 0,
      }),
    );

    const result = await confirmStripePayment({ sessionId: "cs_test_123" }, harness.deps);

    assert.equal(result.ok, false);
    assert.notEqual(harness.orders[0].payment_status, "completed");
    assert.equal(harness.emails.length, 0);
  });

  it("does not complete a paid Stripe session in the wrong currency", async () => {
    const harness = await pendingStripeOrder();
    harness.setSession(
      stripeSession({
        status: "complete",
        payment_status: "paid",
        amount_total: product.price * 100,
        currency: "usd",
      }),
    );

    const result = await confirmStripePayment({ sessionId: "cs_test_123" }, harness.deps);

    assert.equal(result.ok, false);
    assert.equal(harness.orders[0].payment_status, "pending");
    assert.equal(harness.emails.length, 0);
  });

  it("keeps a paid order on the thank-you page if Stripe status cannot be fetched", async () => {
    const returnSource = readFileSync(
      new URL("../app/api/stripe/return/route.ts", import.meta.url),
      "utf8",
    );
    assert.match(returnSource, /reason === "error"/);
    assert.match(returnSource, /\/takk\?token=/);
  });

  it("marks the order paid and sends the download only after Stripe reports paid", async () => {
    const harness = await pendingStripeOrder();
    harness.setSession(
      stripeSession({
        status: "complete",
        payment_status: "paid",
        amount_total: product.price * 100,
        currency: "nok",
      }),
    );

    const result = await confirmStripePayment({ sessionId: "cs_test_123" }, harness.deps);

    assert.equal(result.ok, true);
    if (!result.ok) throw new Error("expected Stripe confirmation to succeed");
    assert.equal(result.downloadToken, "download-token-test");
    assert.equal(harness.orders[0].payment_status, "completed");
    assert.equal(harness.emails.length, 1);
    assert.equal(harness.emails[0].downloadToken, "download-token-test");
  });

  it("does not send a second download email if Stripe confirmation runs twice", async () => {
    const harness = await pendingStripeOrder();
    harness.setSession(
      stripeSession({
        status: "complete",
        payment_status: "paid",
        amount_total: product.price * 100,
        currency: "nok",
      }),
    );

    await confirmStripePayment({ sessionId: "cs_test_123" }, harness.deps);
    const second = await confirmStripePayment({ sessionId: "cs_test_123" }, harness.deps);

    assert.equal(second.ok, true);
    assert.equal(harness.emails.length, 1);
  });

  it("does not complete when the Stripe amount does not match the order", async () => {
    const harness = await pendingStripeOrder();
    harness.setSession(
      stripeSession({
        status: "complete",
        payment_status: "paid",
        amount_total: 100,
        currency: "nok",
      }),
    );

    const result = await confirmStripePayment({ sessionId: "cs_test_123" }, harness.deps);

    assert.equal(result.ok, false);
    assert.equal(harness.orders[0].payment_status, "pending");
    assert.equal(harness.emails.length, 0);
  });
});

describe("header complete package", () => {
  it("starts Vipps for the complete package without routing through /kasse", () => {
    const item = completePackageCartItem();
    assert.equal(item.id, "komplett");
    assert.equal(item.type, "bundle");
    assert.equal(item.price, KOMPLETT_PRICE);
    assert.match(item.name, /komplett/i);

    const header = readFileSync(new URL("../components/layout/Header.tsx", import.meta.url), "utf8");
    assert.match(header, /KomplettVippsButton/);
    assert.match(header, /Kjøp komplett pakke med Vipps/);
    assert.equal(header.includes("router.push(\"/kasse\")"), false);
    assert.equal(header.includes("buyCompletePackage"), false);
    assert.equal(header.includes("onStarted"), false);
  });

  it("makes the featured complett CTAs a Vipps-orange one-press buy", () => {
    const button = readFileSync(
      new URL("../components/ui/KomplettVippsButton.tsx", import.meta.url),
      "utf8",
    );
    assert.match(button, /#FF5B24/);
    assert.match(button, /Kjøp komplett pakke med Vipps/);
    assert.match(button, /paymentProvider: "vipps"/);
    assert.match(button, /completePackageCartItem/);
    assert.equal(button.includes("firstName"), false);
    assert.equal(button.includes("fornavn"), false);
    assert.equal(button.includes("/kasse"), false);
    assert.match(button, /inFlight/);
    assert.equal(button.includes("onStarted"), false);

    const showcase = readFileSync(
      new URL("../components/sections/BundleShowcase.tsx", import.meta.url),
      "utf8",
    );
    assert.match(showcase, /KomplettVippsButton/);
    assert.match(showcase, /Kjøp komplett pakke med Vipps/);

    const card = readFileSync(new URL("../components/ui/BundleCard.tsx", import.meta.url), "utf8");
    assert.match(card, /KomplettVippsButton/);
    assert.match(card, /Kjøp komplett pakke med Vipps/);

    const vipps = readFileSync(new URL("./vipps.ts", import.meta.url), "utf8");
    assert.match(vipps, /profile:\s*\{\s*scope:\s*input\.profileScope/);
  });
});

describe("Vipps checkout start", () => {
  it("does not mark the order paid or email when storing the pending order fails", async () => {
    const harness = memoryDeps();
    harness.deps.orders.insertPending = async () => {
      throw createOrderInsertFailure({
        code: "",
        message: "TypeError: fetch failed",
        details: "Caused by: Error: getaddrinfo ENOTFOUND example.supabase.co (ENOTFOUND)",
        hint: "",
      });
    };

    const result = await startCheckoutPayment(checkoutInput, harness.deps);

    assert.equal(result.ok, false);
    if (result.ok) throw new Error("expected Vipps start to fail closed");
    assert.equal(result.status, 502);
    assert.match(result.error, /ordre/i);
    assert.equal(result.code, "ENOTFOUND");
    assert.match(result.details ?? "", /fetch failed|ENOTFOUND/i);
    assert.equal(harness.emails.length, 0);
    assert.ok(harness.orders.every((order) => order.payment_status !== "completed"));
  });

  it("preserves a PostgREST SQLSTATE from insertPending", async () => {
    const harness = memoryDeps();
    harness.deps.orders.insertPending = async () => {
      throw createOrderInsertFailure({
        code: "42703",
        message: "column orders.payment_provider does not exist",
        details: "",
        hint: "",
      });
    };

    const result = await startCheckoutPayment(checkoutInput, harness.deps);

    assert.equal(result.ok, false);
    if (result.ok) throw new Error("expected insert to fail");
    assert.equal(result.status, 502);
    assert.equal(result.code, "42703");
    assert.match(result.details ?? "", /payment_provider|42703|does not exist/i);
    assert.equal(harness.emails.length, 0);
    assert.ok(harness.orders.every((order) => order.payment_status !== "completed"));
  });

  it("stores the order as pending and does not email a download link", async () => {
    const { deps, orders, emails, createdPayments } = memoryDeps();
    const result = await startCheckoutPayment(checkoutInput, deps);

    assert.equal(result.ok, true);
    if (!result.ok) throw new Error("expected Vipps checkout to start");
    assert.equal(result.redirectUrl, "https://landing.vipps.no/pay/ord-testref01");
    assert.equal("downloadToken" in result, false);
    assert.equal(orders.length, 1);
    assert.equal(orders[0].payment_status, "pending");
    assert.equal(orders[0].payment_provider, "vipps");
    assert.equal(orders[0].payment_id, "ord-testref01");
    assert.equal(orders[0].amount_nok, product.price);
    assert.equal(orders[0].items[0].price, product.price);
    assert.equal(createdPayments[0].amountOre, product.price * 100);
    assert.equal(createdPayments[0].profileScope, "name email phoneNumber");
    assert.equal(emails.length, 0);
  });

  it("starts Vipps for komplett without email or name", async () => {
    const { deps, orders, emails, createdPayments } = memoryDeps();
    const result = await startCheckoutPayment(
      {
        items: [{ id: "komplett" }],
        paymentProvider: "vipps",
        returnOrigin: "https://www.studentplanlegger.no",
      },
      deps,
    );

    assert.equal(result.ok, true);
    if (!result.ok) throw new Error("expected Vipps checkout to start");
    assert.equal(orders.length, 1);
    assert.equal(orders[0].email, "");
    assert.equal(orders[0].first_name, "");
    assert.equal(orders[0].last_name, "");
    assert.equal(orders[0].payment_status, "pending");
    assert.equal(orders[0].amount_nok, KOMPLETT_PRICE);
    assert.equal(orders[0].items[0].id, "komplett");
    assert.equal(createdPayments[0].amountOre, komplettOre);
    assert.equal(createdPayments[0].profileScope, "name email phoneNumber");
    assert.equal(emails.length, 0);
  });

  it("still requires email and name before Stripe starts", async () => {
    const { deps, orders, emails } = memoryDeps();
    const result = await startCheckoutPayment(
      {
        items: [{ id: "komplett" }],
        paymentProvider: "stripe",
        returnOrigin: "https://www.studentplanlegger.no",
      },
      deps,
    );

    assert.equal(result.ok, false);
    if (result.ok) throw new Error("expected Stripe to require buyer fields");
    assert.equal(result.status, 400);
    assert.match(result.error, /påkrevde felt/i);
    assert.equal(orders.length, 0);
    assert.equal(emails.length, 0);
  });
});

describe("Vipps payment confirmation", () => {
  async function pendingOrder(harness = memoryDeps()) {
    const started = await startCheckoutPayment(checkoutInput, harness.deps);
    assert.equal(started.ok, true);
    return harness;
  }

  it("does not mark the order paid before Vipps confirms the payment", async () => {
    const harness = await pendingOrder();
    harness.setPayment(payment({ state: "CREATED" }));

    const result = await confirmVippsPayment({ reference: "ord-testref01" }, harness.deps);

    assert.equal(result.ok, false);
    assert.equal(harness.orders[0].payment_status, "pending");
    assert.equal(harness.emails.length, 0);
  });

  it("does not complete or email after a cancelled or expired payment", async () => {
    for (const state of ["ABORTED", "EXPIRED", "TERMINATED"] as const) {
      const harness = await pendingOrder();
      harness.setPayment(payment({ state }));

      const result = await confirmVippsPayment({ reference: "ord-testref01" }, harness.deps);

      assert.equal(result.ok, false);
      assert.notEqual(harness.orders[0].payment_status, "completed");
      assert.equal(harness.emails.length, 0);
    }
  });

  it("marks the order paid and sends the download only after Vipps authorizes", async () => {
    const harness = await pendingOrder();
    harness.setPayment(
      payment({
        state: "AUTHORIZED",
        aggregate: {
          authorizedAmount: { currency: "NOK", value: product.price * 100 },
          capturedAmount: { currency: "NOK", value: 0 },
          cancelledAmount: { currency: "NOK", value: 0 },
          refundedAmount: { currency: "NOK", value: 0 },
        },
      }),
    );

    const result = await confirmVippsPayment({ reference: "ord-testref01" }, harness.deps);

    assert.equal(result.ok, true);
    if (!result.ok) throw new Error("expected confirmation to succeed");
    assert.equal(result.downloadToken, "download-token-test");
    assert.equal(harness.orders[0].payment_status, "completed");
    assert.equal(harness.emails.length, 1);
    assert.equal(harness.emails[0].downloadToken, "download-token-test");
    assert.equal(harness.captures.length, 1);
    assert.equal(harness.captures[0].amountOre, product.price * 100);
  });

  it("treats a captured amount as confirmation even if capture is already done", async () => {
    const harness = await pendingOrder();
    harness.setPayment(
      payment({
        state: "AUTHORIZED",
        aggregate: {
          authorizedAmount: { currency: "NOK", value: product.price * 100 },
          capturedAmount: { currency: "NOK", value: product.price * 100 },
          cancelledAmount: { currency: "NOK", value: 0 },
          refundedAmount: { currency: "NOK", value: 0 },
        },
      }),
    );

    const result = await confirmVippsPayment({ reference: "ord-testref01" }, harness.deps);

    assert.equal(result.ok, true);
    assert.equal(harness.orders[0].payment_status, "completed");
    assert.equal(harness.emails.length, 1);
  });

  it("does not send a second download email if confirmation runs twice", async () => {
    const harness = await pendingOrder();
    harness.setPayment(
      payment({
        state: "AUTHORIZED",
        aggregate: {
          authorizedAmount: { currency: "NOK", value: product.price * 100 },
          capturedAmount: { currency: "NOK", value: product.price * 100 },
          cancelledAmount: { currency: "NOK", value: 0 },
          refundedAmount: { currency: "NOK", value: 0 },
        },
      }),
    );

    await confirmVippsPayment({ reference: "ord-testref01" }, harness.deps);
    const second = await confirmVippsPayment({ reference: "ord-testref01" }, harness.deps);

    assert.equal(second.ok, true);
    assert.equal(harness.emails.length, 1);
  });

  it("does not treat AUTHORIZED as paid when Vipps has not reserved the order amount", async () => {
    const harness = await pendingOrder();
    harness.setPayment(
      payment({
        state: "AUTHORIZED",
        aggregate: {
          authorizedAmount: { currency: "NOK", value: 0 },
          capturedAmount: { currency: "NOK", value: 0 },
          cancelledAmount: { currency: "NOK", value: 0 },
          refundedAmount: { currency: "NOK", value: 0 },
        },
      }),
    );

    const result = await confirmVippsPayment({ reference: "ord-testref01" }, harness.deps);

    assert.equal(result.ok, false);
    assert.equal(harness.orders[0].payment_status, "pending");
    assert.equal(harness.emails.length, 0);
  });

  it("keeps a completed order paid if a later Vipps status is expired", async () => {
    const harness = await pendingOrder();
    harness.setPayment(
      payment({
        state: "AUTHORIZED",
        aggregate: {
          authorizedAmount: { currency: "NOK", value: product.price * 100 },
          capturedAmount: { currency: "NOK", value: product.price * 100 },
          cancelledAmount: { currency: "NOK", value: 0 },
          refundedAmount: { currency: "NOK", value: 0 },
        },
      }),
    );
    await confirmVippsPayment({ reference: "ord-testref01" }, harness.deps);
    harness.setPayment(payment({ state: "EXPIRED" }));

    const result = await confirmVippsPayment({ reference: "ord-testref01" }, harness.deps);

    assert.equal(result.ok, true);
    assert.equal(harness.orders[0].payment_status, "completed");
    assert.equal(harness.emails.length, 1);
  });

  it("fills the pending order from Vipps userDetails after authorize", async () => {
    const harness = memoryDeps();
    const started = await startCheckoutPayment(
      {
        items: [{ id: "komplett" }],
        paymentProvider: "vipps",
        returnOrigin: "https://www.studentplanlegger.no",
      },
      harness.deps,
    );
    assert.equal(started.ok, true);
    harness.setPayment(
      payment({
        amount: { currency: "NOK", value: komplettOre },
        state: "AUTHORIZED",
        userDetails: {
          email: "kari@example.com",
          firstName: "Kari",
          lastName: "Hansen",
          mobileNumber: "4712345678",
        },
        aggregate: {
          authorizedAmount: { currency: "NOK", value: komplettOre },
          capturedAmount: { currency: "NOK", value: 0 },
          cancelledAmount: { currency: "NOK", value: 0 },
          refundedAmount: { currency: "NOK", value: 0 },
        },
      }),
    );

    const result = await confirmVippsPayment({ reference: "ord-testref01" }, harness.deps);

    assert.equal(result.ok, true);
    assert.equal(harness.orders[0].email, "kari@example.com");
    assert.equal(harness.orders[0].first_name, "Kari");
    assert.equal(harness.orders[0].last_name, "Hansen");
    assert.equal(harness.emails.length, 1);
    assert.equal(harness.emails[0].email, "kari@example.com");
    assert.equal("phone" in harness.orders[0], false);
  });

  it("fills a completed pending-profile order when Vipps userDetails arrives later", async () => {
    const harness = memoryDeps();
    const started = await startCheckoutPayment(
      {
        items: [{ id: "komplett" }],
        paymentProvider: "vipps",
        returnOrigin: "https://www.studentplanlegger.no",
      },
      harness.deps,
    );
    assert.equal(started.ok, true);
    harness.orders[0].payment_status = "completed";
    harness.setPayment(
      payment({
        amount: { currency: "NOK", value: komplettOre },
        state: "AUTHORIZED",
        userDetails: {
          email: "kari@example.com",
          firstName: "Kari",
          lastName: "Hansen",
        },
        aggregate: {
          authorizedAmount: { currency: "NOK", value: komplettOre },
          capturedAmount: { currency: "NOK", value: komplettOre },
          cancelledAmount: { currency: "NOK", value: 0 },
          refundedAmount: { currency: "NOK", value: 0 },
        },
      }),
    );

    const result = await confirmVippsPayment({ reference: "ord-testref01" }, harness.deps);

    assert.equal(result.ok, true);
    assert.equal(harness.orders[0].email, "kari@example.com");
    assert.equal(harness.orders[0].first_name, "Kari");
    assert.equal(harness.orders[0].last_name, "Hansen");
    assert.equal(harness.emails.length, 1);
    assert.equal(harness.emails[0].email, "kari@example.com");
  });

  it("does not invent buyer fields Vipps omitted", async () => {
    const harness = memoryDeps();
    const started = await startCheckoutPayment(
      {
        items: [{ id: "komplett" }],
        paymentProvider: "vipps",
        returnOrigin: "https://www.studentplanlegger.no",
      },
      harness.deps,
    );
    assert.equal(started.ok, true);
    harness.setPayment(
      payment({
        amount: { currency: "NOK", value: komplettOre },
        state: "AUTHORIZED",
        userDetails: {
          firstName: "Kari",
        },
        aggregate: {
          authorizedAmount: { currency: "NOK", value: komplettOre },
          capturedAmount: { currency: "NOK", value: 0 },
          cancelledAmount: { currency: "NOK", value: 0 },
          refundedAmount: { currency: "NOK", value: 0 },
        },
      }),
    );

    const result = await confirmVippsPayment({ reference: "ord-testref01" }, harness.deps);

    assert.equal(result.ok, true);
    assert.equal(harness.orders[0].first_name, "Kari");
    assert.equal(harness.orders[0].email, "");
    assert.equal(harness.orders[0].last_name, "");
    assert.equal(harness.emails.length, 0);
  });

  it("does not complete when the Vipps amount does not match the order", async () => {
    const harness = await pendingOrder();
    harness.setPayment(
      payment({
        state: "AUTHORIZED",
        amount: { currency: "NOK", value: 100 },
        aggregate: {
          authorizedAmount: { currency: "NOK", value: 100 },
          capturedAmount: { currency: "NOK", value: 100 },
          cancelledAmount: { currency: "NOK", value: 0 },
          refundedAmount: { currency: "NOK", value: 0 },
        },
      }),
    );

    const result = await confirmVippsPayment({ reference: "ord-testref01" }, harness.deps);

    assert.equal(result.ok, false);
    assert.equal(harness.orders[0].payment_status, "pending");
    assert.equal(harness.emails.length, 0);
  });
});

describe("createOrderInsertFailure", () => {
  it("preserves a fetch/network insert failure when PostgREST code is empty", () => {
    const failure = createOrderInsertFailure({
      code: "",
      message: "TypeError: fetch failed",
      details: "Caused by: Error: getaddrinfo ENOTFOUND example.supabase.co (ENOTFOUND)",
      hint: "",
    });
    assert.equal(failure.message, "Kunne ikke opprette ordre");
    assert.equal(failure.code, "ENOTFOUND");
    assert.match(failure.details ?? "", /fetch failed|ENOTFOUND/i);
  });

  it("does not leak bearer tokens or JWTs in details", () => {
    const failure = createOrderInsertFailure({
      code: "",
      message: "TypeError: fetch failed",
      details:
        "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.aaa.bbb and still fetch failed",
    });
    assert.doesNotMatch(failure.details ?? "", /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/);
    assert.doesNotMatch(failure.details ?? "", /Bearer\s+(?!\[redacted\])\S+/);
    assert.match(failure.details ?? "", /Bearer \[redacted\]/);
    assert.match(failure.details ?? "", /fetch failed/i);
  });
});

const instagramCampaign = {
  utm_source: "instagram",
  utm_medium: "social",
  utm_campaign: "komplett",
};

describe("marketing attribution", () => {
  it("stores campaign tags on a pending one-press Vipps komplett order", async () => {
    const { deps, orders, emails } = memoryDeps();
    const result = await startCheckoutPayment(
      {
        items: [{ id: "komplett" }],
        paymentProvider: "vipps",
        campaign: instagramCampaign,
        returnOrigin: "https://www.studentplanlegger.no",
      },
      deps,
    );

    assert.equal(result.ok, true);
    assert.equal(orders[0].items[0].id, "komplett");
    assert.equal(orders[0].amount_nok, KOMPLETT_PRICE);
    assert.equal(orders[0].payment_status, "pending");
    assert.equal(orders[0].utm_source, "instagram");
    assert.equal(orders[0].utm_medium, "social");
    assert.equal(orders[0].utm_campaign, "komplett");
    assert.equal(orders[0].items[0].utm_source, "instagram");
    assert.equal(emails.length, 0);
  });

  it("keeps campaign tags after Vipps fills the buyer profile", async () => {
    const harness = memoryDeps();
    const started = await startCheckoutPayment(
      {
        items: [{ id: "komplett" }],
        paymentProvider: "vipps",
        campaign: instagramCampaign,
        returnOrigin: "https://www.studentplanlegger.no",
      },
      harness.deps,
    );
    assert.equal(started.ok, true);
    harness.setPayment(
      payment({
        amount: { currency: "NOK", value: komplettOre },
        state: "AUTHORIZED",
        userDetails: {
          email: "kari@example.com",
          firstName: "Kari",
          lastName: "Hansen",
        },
        aggregate: {
          authorizedAmount: { currency: "NOK", value: komplettOre },
          capturedAmount: { currency: "NOK", value: 0 },
          cancelledAmount: { currency: "NOK", value: 0 },
          refundedAmount: { currency: "NOK", value: 0 },
        },
      }),
    );

    const result = await confirmVippsPayment({ reference: "ord-testref01" }, harness.deps);

    assert.equal(result.ok, true);
    assert.equal(harness.orders[0].email, "kari@example.com");
    assert.equal(harness.orders[0].utm_source, "instagram");
    assert.equal(harness.orders[0].items[0].utm_source, "instagram");
    assert.equal(harness.orders[0].payment_status, "completed");
    assert.equal(harness.purchases.length, 1);
    assert.equal(harness.purchases[0].utm_source, "instagram");
    assert.equal(harness.purchases[0].amount_nok, KOMPLETT_PRICE);
  });

  it("stores the same tags on a /kasse Stripe start", async () => {
    const { deps, orders, emails } = memoryDeps();
    const result = await startCheckoutPayment(
      {
        ...checkoutInput,
        paymentProvider: "stripe",
        campaign: instagramCampaign,
      },
      deps,
    );

    assert.equal(result.ok, true);
    assert.equal(orders[0].payment_provider, "stripe");
    assert.equal(orders[0].utm_source, "instagram");
    assert.equal(orders[0].items[0].utm_source, "instagram");
    assert.equal(emails.length, 0);
  });

  it("leaves untagged checkouts valid without inventing a source", async () => {
    const { deps, orders, purchases } = memoryDeps();
    const result = await startCheckoutPayment(
      {
        items: [{ id: "komplett" }],
        paymentProvider: "vipps",
        returnOrigin: "https://www.studentplanlegger.no",
      },
      deps,
    );

    assert.equal(result.ok, true);
    assert.equal(orders[0].utm_source, undefined);
    assert.equal("utm_source" in orders[0].items[0], false);
    assert.equal(purchases.length, 0);
  });

  it("does not record a purchase before the order is paid", async () => {
    const harness = memoryDeps();
    await startCheckoutPayment(
      {
        items: [{ id: "komplett" }],
        paymentProvider: "vipps",
        campaign: instagramCampaign,
        returnOrigin: "https://www.studentplanlegger.no",
      },
      harness.deps,
    );
    harness.setPayment(payment({
      amount: { currency: "NOK", value: komplettOre },
      state: "CREATED",
    }));

    const result = await confirmVippsPayment({ reference: "ord-testref01" }, harness.deps);

    assert.equal(result.ok, false);
    assert.equal(harness.orders[0].payment_status, "pending");
    assert.equal(harness.purchases.length, 0);
    assert.equal(harness.orders[0].utm_source, "instagram");
  });

  it("sends stored campaign tags from the Vipps button and /kasse without changing the Vipps-first flow", () => {
    const button = readFileSync(
      new URL("../components/ui/KomplettVippsButton.tsx", import.meta.url),
      "utf8",
    );
    const kasse = readFileSync(new URL("../app/kasse/page.tsx", import.meta.url), "utf8");
    const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
    const ordersApi = readFileSync(new URL("../app/api/orders/route.ts", import.meta.url), "utf8");

    assert.match(button, /currentCampaignTags/);
    assert.match(button, /campaign:/);
    assert.equal(button.includes("firstName"), false);
    assert.match(kasse, /currentCampaignTags/);
    assert.match(kasse, /handlePayment\("stripe"\)/);
    assert.ok(kasse.indexOf("Betal med Vipps") < kasse.indexOf("Betal med kort"));
    assert.match(layout, /CampaignCapture/);
    assert.match(ordersApi, /campaign/);
    assert.match(ordersApi, /CAMPAIGN_COOKIE/);
  });
});

describe("linjeforening discount codes", () => {
  const abakusRow = {
    code: "ABAKUS20",
    association_name: "Abakus, NTNU",
    percent: 20,
    active: true,
    expires_at: "2026-12-31T22:59:00.000Z",
    max_redemptions: null,
    redemption_count: 0,
  };

  function withAbakus(harness = memoryDeps()) {
    const redemptions: string[] = [];
    harness.deps.discounts = {
      async lookup(code) {
        if (code === "ABAKUS20") return { ok: true, row: abakusRow };
        return { ok: false, reason: "invalid" };
      },
      async incrementRedemption(code) {
        redemptions.push(code);
      },
    };
    return { harness, redemptions };
  }

  it("charges Komplett + ABAKUS20 as 19900 øre on Vipps and Stripe", async () => {
    const { harness } = withAbakus();
    const vipps = await startCheckoutPayment(
      {
        items: [{ id: "komplett" }],
        amountNok: 1,
        paymentProvider: "vipps",
        discountCode: "abakus20",
        campaign: instagramCampaign,
        returnOrigin: "https://www.studentplanlegger.no",
      },
      harness.deps,
    );
    assert.equal(vipps.ok, true);
    assert.equal(harness.orders[0].amount_nok, 199);
    assert.equal(harness.orders[0].list_amount_nok, 249);
    assert.equal(harness.orders[0].discount_nok, 50);
    assert.equal(harness.orders[0].discount_code, "ABAKUS20");
    assert.equal(harness.orders[0].utm_source, "instagram");
    assert.equal(harness.orders[0].items[0].utm_source, "instagram");
    assert.equal(harness.createdPayments[0].amountOre, 19900);

    const stripe = withAbakus();
    const started = await startCheckoutPayment(
      {
        ...checkoutInput,
        items: [{ id: "komplett" }],
        amountNok: 1,
        paymentProvider: "stripe",
        discountCode: "ABAKUS20",
      },
      stripe.harness.deps,
    );
    assert.equal(started.ok, true);
    assert.equal(stripe.harness.createdSessions[0].amountOre, 19900);
    assert.equal(stripe.harness.orders[0].amount_nok, 199);
  });

  it("applies 20 percent after the 5-pack and theme-pack math", async () => {
    const five = withAbakus();
    const fiveResult = await startCheckoutPayment(
      {
        items: fiveSingles,
        amountNok: 1,
        paymentProvider: "vipps",
        discountCode: "ABAKUS20",
        returnOrigin: "https://www.studentplanlegger.no",
      },
      five.harness.deps,
    );
    assert.equal(fiveResult.ok, true);
    assert.equal(five.harness.createdPayments[0].amountOre, 7900);

    const theme = withAbakus();
    const themeResult = await startCheckoutPayment(
      {
        items: [{ id: "daglig-pakke" }],
        paymentProvider: "vipps",
        discountCode: "ABAKUS20",
        returnOrigin: "https://www.studentplanlegger.no",
      },
      theme.harness.deps,
    );
    assert.equal(themeResult.ok, true);
    assert.equal(theme.harness.createdPayments[0].amountOre, 11900);
  });

  it("rejects an invalid code with 400 and does not start payment", async () => {
    const { harness } = withAbakus();
    const result = await startCheckoutPayment(
      {
        items: [{ id: "komplett" }],
        paymentProvider: "vipps",
        discountCode: "NEI20",
        returnOrigin: "https://www.studentplanlegger.no",
      },
      harness.deps,
    );
    assert.equal(result.ok, false);
    if (result.ok) throw new Error("expected invalid code to fail");
    assert.equal(result.status, 400);
    assert.match(result.error, /ugyldig/i);
    assert.equal(harness.orders.length, 0);
    assert.equal(harness.createdPayments.length, 0);
  });

  it("keeps full catalog prices when no code is sent", async () => {
    const { deps, orders, createdPayments } = memoryDeps();
    const result = await startCheckoutPayment(
      {
        items: [{ id: "komplett" }],
        paymentProvider: "vipps",
        returnOrigin: "https://www.studentplanlegger.no",
      },
      deps,
    );
    assert.equal(result.ok, true);
    assert.equal(orders[0].amount_nok, KOMPLETT_PRICE);
    assert.equal(orders[0].discount_code, undefined);
    assert.equal(createdPayments[0].amountOre, komplettOre);
  });

  it("increments redemption only after payment completes, and never blocks fulfillment", async () => {
    const { harness, redemptions } = withAbakus();
    await startCheckoutPayment(
      {
        items: [{ id: "komplett" }],
        paymentProvider: "vipps",
        discountCode: "ABAKUS20",
        returnOrigin: "https://www.studentplanlegger.no",
      },
      harness.deps,
    );
    assert.deepEqual(redemptions, []);
    harness.setPayment(
      payment({
        amount: { currency: "NOK", value: 19900 },
        state: "AUTHORIZED",
        userDetails: { email: "kari@example.com", firstName: "Kari", lastName: "Hansen" },
        aggregate: {
          authorizedAmount: { currency: "NOK", value: 19900 },
          capturedAmount: { currency: "NOK", value: 0 },
          cancelledAmount: { currency: "NOK", value: 0 },
          refundedAmount: { currency: "NOK", value: 0 },
        },
      }),
    );
    if (harness.deps.discounts) {
      harness.deps.discounts.incrementRedemption = async () => {
        redemptions.push("throw");
        throw new Error("increment failed");
      };
    }

    const result = await confirmVippsPayment({ reference: "ord-testref01" }, harness.deps);
    assert.equal(result.ok, true);
    assert.equal(harness.orders[0].payment_status, "completed");
    assert.equal(harness.emails.length, 1);
    assert.equal(harness.emails[0].amountNok, 199);
    assert.equal(harness.emails[0].discountCode, "ABAKUS20");
    assert.equal(harness.emails[0].discountNok, 50);
    assert.deepEqual(redemptions, ["throw"]);
  });

  it("sends the stored code from one-press Vipps and has a kasse field without strikethrough", () => {
    const button = readFileSync(
      new URL("../components/ui/KomplettVippsButton.tsx", import.meta.url),
      "utf8",
    );
    const kasse = readFileSync(new URL("../app/kasse/page.tsx", import.meta.url), "utf8");
    const ordersApi = readFileSync(new URL("../app/api/orders/route.ts", import.meta.url), "utf8");
    const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
    const preview = readFileSync(new URL("../app/api/rabattkode/route.ts", import.meta.url), "utf8");

    assert.match(button, /currentDiscountCode/);
    assert.match(button, /discountCode/);
    assert.match(kasse, /Rabattkode/);
    assert.match(kasse, /f\.eks\. ABAKUS20/);
    assert.match(kasse, /Ugyldig kode/);
    assert.match(kasse, /discountCode/);
    assert.equal(kasse.includes("line-through"), false);
    assert.match(ordersApi, /discountCode/);
    assert.match(ordersApi, /DISCOUNT_COOKIE/);
    assert.match(layout, /DiscountCapture/);
    assert.match(preview, /previewCheckoutDiscount/);
  });
});
