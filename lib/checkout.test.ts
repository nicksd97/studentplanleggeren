import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  confirmVippsPayment,
  isCardCheckoutAllowed,
  startCheckoutPayment,
} from "./checkout";
import type { CheckoutDependencies, OrderRecord, VippsPayment } from "./checkout";
import { alleProdukter } from "./products";

const product = alleProdukter[0];
assert.ok(product);

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

function memoryDeps(vippsPayment: VippsPayment | null = null) {
  const orders: OrderRecord[] = [];
  let nextPayment: VippsPayment | null = vippsPayment;
  const emails: Array<{ email: string; downloadToken: string }> = [];
  const createdPayments: Array<{ reference: string; amountOre: number }> = [];
  const captures: Array<{ reference: string; amountOre: number }> = [];

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
    },
    vipps: {
      async createPayment(input) {
        createdPayments.push({
          reference: input.reference,
          amountOre: input.amountOre,
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
    mailer: {
      async sendOrderConfirmation(input) {
        emails.push({ email: input.email, downloadToken: input.downloadToken });
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
    createdPayments,
    captures,
    setPayment(value: VippsPayment | null) {
      nextPayment = value;
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

describe("card checkout", () => {
  it("is disabled so the card button cannot complete an unpaid order", () => {
    assert.equal(isCardCheckoutAllowed(), false);
  });

  it("does not create a completed order when card checkout is requested", async () => {
    const { deps, orders, emails } = memoryDeps();
    const result = await startCheckoutPayment(
      { ...checkoutInput, paymentProvider: "stripe" },
      deps,
    );

    assert.equal(result.ok, false);
    if (result.ok) throw new Error("expected card checkout to fail");
    assert.equal(result.status, 400);
    assert.match(result.error, /kort/i);
    assert.equal(orders.length, 0);
    assert.equal(emails.length, 0);
  });

  it("keeps the card button from calling the shared unpaid checkout handler", () => {
    const source = readFileSync(new URL("../app/kasse/page.tsx", import.meta.url), "utf8");
    assert.match(source, /Betal med kort/);
    assert.equal(source.includes('handlePayment("stripe")'), false);
    assert.equal(source.includes("handlePayment('stripe')"), false);
    assert.match(source, /isCardCheckoutAllowed/);
  });
});

describe("Vipps checkout start", () => {
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
