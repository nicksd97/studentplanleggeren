import {
  attachCampaignTags,
  campaignTagsFromItems,
  parseCampaignTags,
  type CampaignTags,
} from "./attribution";
import {
  INVALID_DISCOUNT_PREVIEW_MESSAGE,
  applyDiscountCode,
  type DiscountLookup,
  type DiscountStore,
} from "./discount";
import {
  DEFAULT_CURRENCY,
  STRIPE_MINIMUM_MINOR,
  discountedMinor,
  parseCurrency,
  priceMinor,
  type Currency,
} from "./currency";
import { isLocale, localizePath, type Locale } from "./i18n/config";
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

export const INVALID_CURRENCY_MESSAGE = "Ugyldig valuta";
export const VIPPS_NOK_ONLY_MESSAGE = "Vipps kan bare brukes ved betaling i norske kroner (NOK)";

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
  discount_code?: string;
  list_amount_nok?: number;
  discount_nok?: number;
  discount_percent?: number;
  /**
   * Currency the buyer paid in (NOK when absent). For non-NOK orders, amount_nok,
   * list_amount_nok and discount_nok hold the NOK-equivalent of the same cart and discount
   * (from the NOK catalog prices), so NOK reporting stays meaningful; the charged amount is
   * amount_minor in `currency`.
   */
  currency?: Currency;
  /** Charged total in minor units of `currency` (øre for NOK). */
  amount_minor?: number;
  list_amount_minor?: number;
  discount_minor?: number;
  /** Site language at checkout: PDF language and email language. Bokmål when absent. */
  locale?: Locale;
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
      /** Total in minor units of `currency`. */
      amountMinor: number;
      currency: Currency;
      locale: Locale;
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
      discountCode?: string;
      discountNok?: number;
      discountPercent?: number;
      currency?: Currency;
      amountMinor?: number;
      discountMinor?: number;
      locale?: Locale;
    }): Promise<void>;
  };
  discounts?: DiscountStore;
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
  discountCode?: string;
  /** Currency the page showed; validated against lib/currency.ts. Absent means NOK. */
  currency?: unknown;
  /** Page language; anything unknown falls back to Bokmål. */
  locale?: unknown;
  returnOrigin: string;
};

export type StartCheckoutResult =
  | { ok: true; redirectUrl: string }
  | { ok: false; status: number; error: string; code?: string; details?: string };

export type ConfirmPaymentResult =
  | { ok: true; downloadToken: string; locale?: Locale }
  | {
      ok: false;
      status: number;
      error: string;
      reason: "pending" | "cancelled" | "mismatch" | "not_found" | "error";
      downloadToken?: string;
      locale?: Locale;
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

/**
 * List price of priced items in `currency`, in minor units, from the fixed price table:
 * the same 5-pack rule as NOK (every five singles cost one 5-pack), bundles at their own price.
 */
export function itemsAmountMinor(items: Pick<CheckoutItem, "type" | "price">[], currency: Currency): number {
  let singleCount = 0;
  let total = 0;
  for (const item of items) {
    if (item.type === "product") {
      singleCount += 1;
    } else {
      total += priceMinor(item.price, currency);
    }
  }
  const packs = fivePackCount(singleCount);
  const remainder = singleCount - packs * FIVE_PACK_SIZE;
  return (
    total +
    packs * priceMinor(FIVE_PACK_PRICE, currency) +
    remainder * priceMinor(SINGLE_PRICE, currency)
  );
}

/** Cart total in minor units of `currency`, or null if the cart has unknown items. */
export function cartAmountMinor(rawItems: StartCheckoutInput["items"], currency: Currency): number | null {
  const priced = priceCheckoutItems(rawItems);
  return "error" in priced ? null : itemsAmountMinor(priced.items, currency);
}

/** Currency from a request: absent/empty means NOK (older clients), unknown values are rejected. */
export function checkoutCurrency(value: unknown): Currency | null {
  if (value === undefined || value === null || value === "") return DEFAULT_CURRENCY;
  return parseCurrency(value);
}

/** Amounts for one order in its currency, all computed on the server. */
export type OrderAmounts = {
  currency: Currency;
  listMinor: number;
  amountMinor: number;
  discountMinor: number;
};

/** Applies a percent discount (0 for none) to the cart's list price in `currency`. */
export function orderAmounts(items: CheckoutItem[], currency: Currency, percent: number): OrderAmounts {
  const listMinor = itemsAmountMinor(items, currency);
  const amountMinor = percent > 0 ? discountedMinor(listMinor, percent, currency) : listMinor;
  return { currency, listMinor, amountMinor, discountMinor: listMinor - amountMinor };
}

export async function previewCheckoutDiscount(
  rawItems: StartCheckoutInput["items"],
  rawCode: unknown,
  lookup: (code: string) => Promise<DiscountLookup>,
  rawCurrency?: unknown,
) {
  const priced = priceCheckoutItems(rawItems);
  if ("error" in priced) {
    return { ok: false as const, error: priced.error };
  }
  const currency = checkoutCurrency(rawCurrency);
  if (!currency) {
    return { ok: false as const, error: INVALID_DISCOUNT_PREVIEW_MESSAGE };
  }

  const applied = await applyDiscountCode(priced.amountNok, rawCode, lookup);
  if (!applied.ok) {
    return { ok: false as const, error: INVALID_DISCOUNT_PREVIEW_MESSAGE };
  }
  const amounts = orderAmounts(priced.items, currency, applied.percent);

  return {
    ok: true as const,
    amountNok: applied.amountNok,
    listAmountNok: applied.listAmountNok,
    discountNok: applied.discountNok,
    percent: applied.percent,
    associationName: applied.associationName,
    code: applied.code,
    currency,
    amountMinor: amounts.amountMinor,
    listAmountMinor: amounts.listMinor,
    discountMinor: amounts.discountMinor,
  };
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

/**
 * What the payment provider must have charged for this order. Orders from before multi-currency
 * (or stored without the new columns) are NOK and use amount_nok.
 */
export function expectedCharge(order: OrderRecord): { currency: Currency; amountMinor: number } {
  const currency = order.currency ?? "NOK";
  if (currency === "NOK" || order.amount_minor == null) {
    return { currency: "NOK", amountMinor: order.amount_nok * 100 };
  }
  return { currency, amountMinor: order.amount_minor };
}

/** Order-confirmation mail input, in the order's currency and language. */
function confirmationMail(order: OrderRecord, fallback?: OrderRecord) {
  const discountCode = order.discount_code ?? fallback?.discount_code;
  return {
    email: order.email,
    firstName: order.first_name,
    items: order.items,
    downloadToken: order.download_token,
    amountNok: order.amount_nok,
    discountCode,
    discountNok: order.discount_nok ?? fallback?.discount_nok,
    discountPercent: order.discount_percent ?? fallback?.discount_percent,
    currency: order.currency ?? fallback?.currency,
    amountMinor: order.amount_minor ?? fallback?.amount_minor,
    discountMinor: order.discount_minor ?? fallback?.discount_minor,
    locale: order.locale ?? fallback?.locale,
  };
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

  const currency = checkoutCurrency(input.currency);
  if (!currency) {
    return { ok: false, status: 400, error: INVALID_CURRENCY_MESSAGE };
  }
  if (input.paymentProvider === "vipps" && currency !== "NOK") {
    return { ok: false, status: 400, error: VIPPS_NOK_ONLY_MESSAGE };
  }
  const locale: Locale = isLocale(input.locale) ? input.locale : "nb";

  const priced = priceCheckoutItems(input.items);
  if ("error" in priced) {
    return { ok: false, status: 400, error: priced.error };
  }

  const applied = await applyDiscountCode(
    priced.amountNok,
    input.discountCode,
    async (code) => {
      if (!deps.discounts) return { ok: false as const, reason: "invalid" as const };
      return deps.discounts.lookup(code);
    },
  );
  if (!applied.ok) {
    return { ok: false, status: 400, error: applied.error };
  }

  // Amounts come only from the server's price table; client prices and amounts are ignored.
  // NOK keeps the original whole-krone computation (amount_nok × 100).
  const amounts =
    currency === "NOK"
      ? {
          currency,
          listMinor: applied.listAmountNok * 100,
          amountMinor: applied.amountNok * 100,
          discountMinor: applied.discountNok * 100,
        }
      : orderAmounts(priced.items, currency, applied.percent);
  if (input.paymentProvider === "stripe" && amounts.amountMinor < STRIPE_MINIMUM_MINOR[currency]) {
    return { ok: false, status: 400, error: "Kunne ikke starte kortbetaling" };
  }

  const downloadToken = deps.createDownloadToken();
  const amountOre = applied.amountNok * 100;
  const campaign = parseCampaignTags(input.campaign);
  const pendingOrder = {
    email,
    first_name: firstName,
    last_name: input.lastName?.trim() ?? "",
    items: attachCampaignTags(priced.items, campaign),
    amount_nok: applied.amountNok,
    payment_status: "pending" as const,
    download_token: downloadToken,
    token_expires_at: tokenExpiry(deps.now()).toISOString(),
    ...(applied.code
      ? {
          discount_code: applied.code,
          list_amount_nok: applied.listAmountNok,
          discount_nok: applied.discountNok,
          discount_percent: applied.percent,
        }
      : {}),
    currency,
    amount_minor: amounts.amountMinor,
    ...(applied.code
      ? { list_amount_minor: amounts.listMinor, discount_minor: amounts.discountMinor }
      : {}),
    locale,
    ...campaign,
  };

  if (input.paymentProvider === "stripe") {
    let session: { id: string; url: string };
    try {
      session = await deps.stripe.createCheckoutSession({
        amountMinor: amounts.amountMinor,
        currency,
        locale,
        email,
        successUrl: `${input.returnOrigin}/api/stripe/return?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${input.returnOrigin}${localizePath("/kasse", locale)}?betaling=avbrutt`,
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
          await deps.mailer.sendOrderConfirmation(confirmationMail(updated));
        } catch {
          // Payment is already captured/reserved; do not roll back fulfillment.
        }
      }
    } catch {
      return { ok: true, downloadToken: order.download_token, locale: order.locale };
    }
    return { ok: true, downloadToken: order.download_token, locale: order.locale };
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
      locale: order.locale,
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
      locale: order.locale,
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
      locale: order.locale,
    };
  }

  if (!isReservedOrCaptured(payment, expectedOre)) {
    return {
      ok: false,
      status: 409,
      error: "Betalingen er ikke bekreftet ennå",
      reason: "pending",
      downloadToken: order.download_token,
      locale: order.locale,
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
    return { ok: true, downloadToken: order.download_token, locale: order.locale };
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
      locale: order.locale,
    };
  }

  // Compare against what was stored at checkout: the order's own currency and minor amount.
  const expected = expectedCharge(order);
  const currency = session.currency?.toUpperCase() ?? "";
  const paidMatchingAmount =
    session.payment_status === "paid" &&
    currency === expected.currency &&
    session.amount_total === expected.amountMinor;

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
      locale: order.locale,
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
      locale: order.locale,
    };
  }

  return {
    ok: false,
    status: 409,
    error: "Betalingen er ikke bekreftet ennå",
    reason: "pending",
    downloadToken: order.download_token,
    locale: order.locale,
  };
}

async function finalizePaidOrder(
  order: OrderRecord,
  deps: CheckoutDependencies,
): Promise<ConfirmPaymentResult> {
  if (order.payment_status === "completed") {
    return { ok: true, downloadToken: order.download_token, locale: order.locale };
  }

  const completed = await deps.orders.completeIfPending(order.id);
  if (!completed) {
    const latest = await deps.orders.findByPaymentId(order.payment_id ?? "");
    if (latest?.payment_status === "completed") {
      return { ok: true, downloadToken: latest.download_token, locale: latest.locale };
    }
    return {
      ok: false,
      status: 409,
      error: "Betalingen er ikke bekreftet ennå",
      reason: "pending",
      downloadToken: order.download_token,
      locale: order.locale,
    };
  }

  const discountCode = completed.discount_code ?? order.discount_code;
  if (discountCode) {
    try {
      await deps.discounts?.incrementRedemption(discountCode);
    } catch {
      // Redemption count is reporting-only; never block download or mail.
    }
  }

  if (hasValidEmail(completed.email)) {
    try {
      await deps.mailer.sendOrderConfirmation(confirmationMail(completed, order));
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

  return { ok: true, downloadToken: completed.download_token, locale: completed.locale };
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
