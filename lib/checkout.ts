import {
  attachCampaignTags,
  campaignTagsFromItems,
  parseCampaignTags,
  type CampaignTags,
} from "./attribution";
import { insertFailureResult } from "./order-insert-error";
import {
  alleProdukter,
  FIVE_PACK_PRICE,
  FIVE_PACK_SIZE,
  fivePackCount,
  pakker,
  SINGLE_PRICE,
  singlesAmountNok,
} from "./products";

export function isCardCheckoutAllowed(): boolean {
  return true;
}

export const CARD_CHECKOUT_DISABLED_MESSAGE =
  "Kortbetaling er ikke tilgjengelig ennå. Betal med Vipps.";

export type MoneyAmount = {
  currency: string;
  value: number;
};

export type VippsUserDetails = {
  email?: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
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
  userDetails?: VippsUserDetails;
};

export type VippsBuyerFields = {
  email?: string;
  first_name?: string;
  last_name?: string;
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
} & CampaignTags;

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
} & CampaignTags;

export type CheckoutDependencies = {
  orders: {
    insertPending(data: Omit<OrderRecord, "id">): Promise<OrderRecord>;
    findByPaymentId(paymentId: string): Promise<OrderRecord | null>;
    completeIfPending(id: string): Promise<OrderRecord | null>;
    markCancelled(id: string): Promise<OrderRecord | null>;
    updateBuyerDetails(id: string, details: VippsBuyerFields): Promise<OrderRecord | null>;
  };
  vipps: {
    createPayment(input: {
      reference: string;
      amountOre: number;
      returnUrl: string;
      description: string;
      profileScope?: string;
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
      amountNok: number;
    }): Promise<void>;
  };
  analytics?: {
    recordPurchase(order: OrderRecord): Promise<void>;
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
  campaign?: CampaignTags | Record<string, unknown> | string | null;
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
  let singleCount = 0;
  let bundleAmountNok = 0;

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
      singleCount += 1;
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
      bundleAmountNok += bundle.price;
      continue;
    }
    return { error: "Ukjent produkt" };
  }

  return { items, amountNok: singlesAmountNok(singleCount) + bundleAmountNok };
}

export function cartPricingSummary(rawItems: StartCheckoutInput["items"]) {
  const priced = priceCheckoutItems(rawItems);
  if ("error" in priced) {
    return null;
  }
  const singleCount = priced.items.filter((item) => item.type === "product").length;
  const packs = fivePackCount(singleCount);
  return {
    ...priced,
    singleCount,
    fivePacks: packs,
    fivePackDiscount: packs * (SINGLE_PRICE * FIVE_PACK_SIZE - FIVE_PACK_PRICE),
  };
}

function nonEmptyBuyerField(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

export function buyerDetailsFromVipps(payment: VippsPayment): VippsBuyerFields {
  const details = payment.userDetails;
  if (!details) return {};

  const buyer: VippsBuyerFields = {};
  const email = nonEmptyBuyerField(details.email);
  const firstName = nonEmptyBuyerField(details.firstName);
  const lastName = nonEmptyBuyerField(details.lastName);
  if (email) buyer.email = email;
  if (firstName) buyer.first_name = firstName;
  if (lastName) buyer.last_name = lastName;
  return buyer;
}

function hasValidEmail(email: string): boolean {
  return Boolean(email) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
  if (input.paymentProvider === "stripe") {
    if (!hasValidEmail(email) || !firstName) {
      return { ok: false, status: 400, error: "Mangler påkrevde felt" };
    }
  } else if (email && !hasValidEmail(email)) {
    return { ok: false, status: 400, error: "Mangler påkrevde felt" };
  }

  const priced = priceCheckoutItems(input.items);
  if ("error" in priced) {
    return { ok: false, status: 400, error: priced.error };
  }

  const downloadToken = deps.createDownloadToken();
  const amountOre = priced.amountNok * 100;
  const campaign = parseCampaignTags(input.campaign);
  const pendingOrder = {
    email,
    first_name: firstName,
    last_name: input.lastName?.trim() ?? "",
    items: attachCampaignTags(priced.items, campaign),
    amount_nok: priced.amountNok,
    payment_status: "pending" as const,
    download_token: downloadToken,
    token_expires_at: tokenExpiry(deps.now()).toISOString(),
    ...campaign,
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
      profileScope: "name email phoneNumber",
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
    try {
      const hadEmail = hasValidEmail(order.email);
      const payment = await deps.vipps.getPayment(reference);
      const updated = await applyVippsBuyerDetails(order, payment, deps);
      if (!hadEmail && hasValidEmail(updated.email)) {
        try {
          await deps.mailer.sendOrderConfirmation({
            email: updated.email,
            firstName: updated.first_name,
            items: updated.items,
            downloadToken: updated.download_token,
            amountNok: updated.amount_nok,
          });
        } catch {
          // Payment is already captured/reserved; do not roll back fulfillment.
        }
      }
    } catch {
      return { ok: true, downloadToken: order.download_token };
    }
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
    return finalizePaidOrder(await applyVippsBuyerDetails(order, payment, deps), deps);
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

  return finalizePaidOrder(await applyVippsBuyerDetails(order, payment, deps), deps);
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

  if (hasValidEmail(completed.email)) {
    try {
      await deps.mailer.sendOrderConfirmation({
        email: completed.email,
        firstName: completed.first_name,
        items: completed.items,
        downloadToken: completed.download_token,
        amountNok: completed.amount_nok,
      });
    } catch {
      // Payment is already captured/reserved; do not roll back fulfillment.
    }
  }

  if (deps.analytics) {
    try {
      await deps.analytics.recordPurchase({
        ...completed,
        ...(campaignTagsFromItems(completed.items) ?? {}),
      });
    } catch {
      // Analytics must never block a paid download.
    }
  }

  return { ok: true, downloadToken: completed.download_token };
}

async function applyVippsBuyerDetails(
  order: OrderRecord,
  payment: VippsPayment,
  deps: CheckoutDependencies,
): Promise<OrderRecord> {
  const buyer = buyerDetailsFromVipps(payment);
  if (!buyer.email && !buyer.first_name && !buyer.last_name) {
    return order;
  }

  const updated = await deps.orders.updateBuyerDetails(order.id, buyer);
  return updated ?? order;
}
