import { insertFailureResult } from "./order-insert-error";
import { alleProdukter, pakker } from "./products";

export function isCardCheckoutAllowed(): boolean {
  return true;
}

export const CARD_CHECKOUT_DISABLED_MESSAGE =
  "Kortbetaling er ikke tilgjengelig ennå. Betal med Vipps.";

export type MoneyAmount = {
  currency: string;
  value: number;
};

export type VippsPayment = {
  reference: string;
  state: string;
  amount: MoneyAmount;
  aggregate: {
    authorizedAmount: MoneyAmount;
    capturedAmount: MoneyAmount;
    cancelledAmount: MoneyAmount;
    refundedAmount: MoneyAmount;
  };
};

export type StripeCheckoutSession = {
  id: string;
  status: string;
  payment_status: string;
  amount_total: number | null;
  currency: string | null;
};

export type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  type: "product" | "bundle";
};

export type OrderRecord = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  items: CheckoutItem[];
  amount_nok: number;
  payment_provider: string;
  payment_id: string | null;
  payment_status: string;
  download_token: string;
  token_expires_at: string;
};

export type CheckoutDependencies = {
  orders: {
    insertPending(data: Omit<OrderRecord, "id">): Promise<OrderRecord>;
    findByPaymentId(paymentId: string): Promise<OrderRecord | null>;
    completeIfPending(id: string): Promise<OrderRecord | null>;
    markCancelled(id: string): Promise<OrderRecord | null>;
  };
  vipps: {
    createPayment(input: {
      reference: string;
      amountOre: number;
      returnUrl: string;
      description: string;
    }): Promise<{ redirectUrl: string }>;
    getPayment(reference: string): Promise<VippsPayment>;
    capturePayment(reference: string, amountOre: number): Promise<VippsPayment>;
  };
  stripe: {
    createCheckoutSession(input: {
      amountOre: number;
      email: string;
      successUrl: string;
      cancelUrl: string;
      description: string;
    }): Promise<{ id: string; url: string }>;
    getCheckoutSession(sessionId: string): Promise<StripeCheckoutSession>;
  };
  mailer: {
    sendOrderConfirmation(input: {
      email: string;
      firstName: string;
      items: CheckoutItem[];
      downloadToken: string;
    }): Promise<void>;
  };
  now: () => Date;
  createReference: () => string;
  createDownloadToken: () => string;
};

export type StartCheckoutInput = {
  email?: string;
  firstName?: string;
  lastName?: string;
  items?: Array<{ id?: string; name?: string; price?: number; type?: string }>;
  amountNok?: number;
  paymentProvider?: string;
  returnOrigin: string;
};

export type StartCheckoutResult =
  | { ok: true; redirectUrl: string }
  | { ok: false; status: number; error: string; code?: string; details?: string };

export type ConfirmPaymentResult =
  | { ok: true; downloadToken: string }
  | {
      ok: false;
      status: number;
      error: string;
      reason: "pending" | "cancelled" | "mismatch" | "not_found" | "error";
      downloadToken?: string;
    };

export type ConfirmVippsResult = ConfirmPaymentResult;

const FAILED_VIPPS_STATES = new Set(["ABORTED", "EXPIRED", "TERMINATED"]);

export function priceCheckoutItems(
  rawItems: StartCheckoutInput["items"],
): { items: CheckoutItem[]; amountNok: number } | { error: string } {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { error: "Mangler produkter" };
  }

  const items: CheckoutItem[] = [];
  let amountNok = 0;

  for (const raw of rawItems) {
    if (!raw?.id) {
      return { error: "Ukjent produkt" };
    }
    const product = alleProdukter.find((entry) => entry.id === raw.id);
    if (product) {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        type: "product",
      });
      amountNok += product.price;
      continue;
    }
    const bundle = pakker.find((entry) => entry.id === raw.id);
    if (bundle) {
      items.push({
        id: bundle.id,
        name: bundle.name,
        price: bundle.price,
        type: "bundle",
      });
      amountNok += bundle.price;
      continue;
    }
    return { error: "Ukjent produkt" };
  }

  return { items, amountNok };
}

export function isReservedOrCaptured(payment: VippsPayment, expectedOre: number): boolean {
  if (payment.amount?.currency !== "NOK" || payment.amount.value !== expectedOre) {
    return false;
  }
  const authorized = payment.aggregate?.authorizedAmount?.value ?? 0;
  const captured = payment.aggregate?.capturedAmount?.value ?? 0;
  return captured >= expectedOre || (payment.state === "AUTHORIZED" && authorized >= expectedOre);
}

function tokenExpiry(now: Date): Date {
  const expiry = new Date(now);
  expiry.setDate(expiry.getDate() + 7);
  return expiry;
}

function stripeStartFailureMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (/cannot currently make live charges|account is not activated|charges_enabled/i.test(message)) {
    return "Kortbetaling kan ikke belastes ennå. Stripe-kontoen er ikke aktivert.";
  }
  return "Kunne ikke starte kortbetaling";
}

function paymentDescription(items: CheckoutItem[]): string {
  if (items.length === 1) {
    return items[0].name.slice(0, 100);
  }
  return `Studentplanlegger (${items.length} produkter)`.slice(0, 100);
}

export async function startCheckoutPayment(
  input: StartCheckoutInput,
  deps: CheckoutDependencies,
): Promise<StartCheckoutResult> {
  if (input.paymentProvider !== "vipps" && input.paymentProvider !== "stripe") {
    return {
      ok: false,
      status: 400,
      error: "Ugyldig betalingsmetode",
    };
  }

  const email = input.email?.trim() ?? "";
  const firstName = input.firstName?.trim() ?? "";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !firstName) {
    return { ok: false, status: 400, error: "Mangler påkrevde felt" };
  }

  const priced = priceCheckoutItems(input.items);
  if ("error" in priced) {
    return { ok: false, status: 400, error: priced.error };
  }

  const downloadToken = deps.createDownloadToken();
  const amountOre = priced.amountNok * 100;
  const pendingOrder = {
    email,
    first_name: firstName,
    last_name: input.lastName?.trim() ?? "",
    items: priced.items,
    amount_nok: priced.amountNok,
    payment_status: "pending" as const,
    download_token: downloadToken,
    token_expires_at: tokenExpiry(deps.now()).toISOString(),
  };

  if (input.paymentProvider === "stripe") {
    let session: { id: string; url: string };
    try {
      session = await deps.stripe.createCheckoutSession({
        amountOre,
        email,
        successUrl: `${input.returnOrigin}/api/stripe/return?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${input.returnOrigin}/kasse?betaling=avbrutt`,
        description: paymentDescription(priced.items),
      });
      if (!session.id || !session.url) {
        return { ok: false, status: 503, error: "Kunne ikke starte kortbetaling" };
      }
    } catch (error) {
      return { ok: false, status: 503, error: stripeStartFailureMessage(error) };
    }

    try {
      await deps.orders.insertPending({
        ...pendingOrder,
        payment_provider: "stripe",
        payment_id: session.id,
      });
    } catch (error) {
      return {
        ok: false,
        status: 502,
        error: "Kunne ikke opprette ordre",
        ...insertFailureResult(error),
      };
    }
    return { ok: true, redirectUrl: session.url };
  }

  const reference = deps.createReference();
  try {
    await deps.orders.insertPending({
      ...pendingOrder,
      payment_provider: "vipps",
      payment_id: reference,
    });
  } catch (error) {
    return {
      ok: false,
      status: 502,
      error: "Kunne ikke opprette ordre",
      ...insertFailureResult(error),
    };
  }

  try {
    const payment = await deps.vipps.createPayment({
      reference,
      amountOre,
      returnUrl: `${input.returnOrigin}/api/vipps/return?reference=${encodeURIComponent(reference)}`,
      description: paymentDescription(priced.items),
    });
    return { ok: true, redirectUrl: payment.redirectUrl };
  } catch {
    return { ok: false, status: 502, error: "Kunne ikke starte Vipps-betaling" };
  }
}

export async function confirmVippsPayment(
  input: { reference: string },
  deps: CheckoutDependencies,
): Promise<ConfirmVippsResult> {
  const reference = input.reference?.trim();
  if (!reference) {
    return {
      ok: false,
      status: 400,
      error: "Mangler betalingsreferanse",
      reason: "not_found",
    };
  }

  const order = await deps.orders.findByPaymentId(reference);
  if (!order) {
    return { ok: false, status: 404, error: "Ordre ikke funnet", reason: "not_found" };
  }

  if (order.payment_status === "completed") {
    return { ok: true, downloadToken: order.download_token };
  }

  let payment: VippsPayment;
  try {
    payment = await deps.vipps.getPayment(reference);
  } catch {
    return {
      ok: false,
      status: 502,
      error: "Kunne ikke hente betalingsstatus",
      reason: "error",
      downloadToken: order.download_token,
    };
  }

  const expectedOre = order.amount_nok * 100;
  const captured = payment.aggregate?.capturedAmount?.value ?? 0;
  if (payment.amount?.currency === "NOK" && captured >= expectedOre && payment.amount.value === expectedOre) {
    return finalizePaidOrder(order, deps);
  }

  if (payment.amount?.currency !== "NOK" || payment.amount.value !== expectedOre) {
    return {
      ok: false,
      status: 409,
      error: "Beløpet stemmer ikke",
      reason: "mismatch",
      downloadToken: order.download_token,
    };
  }

  if (FAILED_VIPPS_STATES.has(payment.state)) {
    await deps.orders.markCancelled(order.id);
    return {
      ok: false,
      status: 409,
      error: "Betalingen ble avbrutt",
      reason: "cancelled",
      downloadToken: order.download_token,
    };
  }

  if (!isReservedOrCaptured(payment, expectedOre)) {
    return {
      ok: false,
      status: 409,
      error: "Betalingen er ikke bekreftet ennå",
      reason: "pending",
      downloadToken: order.download_token,
    };
  }

  if ((payment.aggregate?.capturedAmount?.value ?? 0) < expectedOre) {
    try {
      await deps.vipps.capturePayment(reference, expectedOre);
    } catch {
      // AUTHORIZED is enough to fulfill; capture can be retried later.
    }
  }

  return finalizePaidOrder(order, deps);
}

export async function confirmStripePayment(
  input: { sessionId: string },
  deps: CheckoutDependencies,
): Promise<ConfirmPaymentResult> {
  const sessionId = input.sessionId?.trim();
  if (!sessionId) {
    return {
      ok: false,
      status: 400,
      error: "Mangler betalingsreferanse",
      reason: "not_found",
    };
  }

  const order = await deps.orders.findByPaymentId(sessionId);
  if (!order) {
    return { ok: false, status: 404, error: "Ordre ikke funnet", reason: "not_found" };
  }

  if (order.payment_status === "completed") {
    return { ok: true, downloadToken: order.download_token };
  }

  let session: StripeCheckoutSession;
  try {
    session = await deps.stripe.getCheckoutSession(sessionId);
  } catch {
    return {
      ok: false,
      status: 502,
      error: "Kunne ikke hente betalingsstatus",
      reason: "error",
      downloadToken: order.download_token,
    };
  }

  const expectedOre = order.amount_nok * 100;
  const currency = session.currency?.toLowerCase() ?? "";
  const paidMatchingAmount =
    session.payment_status === "paid" &&
    currency === "nok" &&
    session.amount_total === expectedOre;

  if (paidMatchingAmount) {
    return finalizePaidOrder(order, deps);
  }

  if (session.payment_status === "paid") {
    return {
      ok: false,
      status: 409,
      error: "Beløpet stemmer ikke",
      reason: "mismatch",
      downloadToken: order.download_token,
    };
  }

  if (
    session.status === "expired" ||
    (session.status === "complete" && session.payment_status !== "paid")
  ) {
    await deps.orders.markCancelled(order.id);
    return {
      ok: false,
      status: 409,
      error: "Betalingen ble avbrutt",
      reason: "cancelled",
      downloadToken: order.download_token,
    };
  }

  return {
    ok: false,
    status: 409,
    error: "Betalingen er ikke bekreftet ennå",
    reason: "pending",
    downloadToken: order.download_token,
  };
}

async function finalizePaidOrder(
  order: OrderRecord,
  deps: CheckoutDependencies,
): Promise<ConfirmPaymentResult> {
  if (order.payment_status === "completed") {
    return { ok: true, downloadToken: order.download_token };
  }

  const completed = await deps.orders.completeIfPending(order.id);
  if (!completed) {
    const latest = await deps.orders.findByPaymentId(order.payment_id ?? "");
    if (latest?.payment_status === "completed") {
      return { ok: true, downloadToken: latest.download_token };
    }
    return {
      ok: false,
      status: 409,
      error: "Betalingen er ikke bekreftet ennå",
      reason: "pending",
      downloadToken: order.download_token,
    };
  }

  try {
    await deps.mailer.sendOrderConfirmation({
      email: completed.email,
      firstName: completed.first_name,
      items: completed.items,
      downloadToken: completed.download_token,
    });
  } catch {
    // Payment is already captured/reserved; do not roll back fulfillment.
  }

  return { ok: true, downloadToken: completed.download_token };
}
