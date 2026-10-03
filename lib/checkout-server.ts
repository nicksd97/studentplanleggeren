import { randomBytes } from "crypto";
import {
  confirmStripePayment,
  confirmVippsPayment,
  startCheckoutPayment,
  type CheckoutDependencies,
} from "./checkout";
import { sendOrderConfirmation } from "./email";
import { createSupabaseOrderStore } from "./order-store";
import { SITE_ORIGIN } from "./site";
import { createStripeGateway } from "./stripe";
import { generateDownloadToken } from "./tokens";
import { createVippsGateway } from "./vipps";

export function createProductionCheckoutDeps(): CheckoutDependencies {
  return {
    orders: createSupabaseOrderStore(),
    vipps: createVippsGateway(),
    stripe: createStripeGateway(),
    mailer: {
      sendOrderConfirmation,
    },
    now: () => new Date(),
    createReference: () => `ord${randomBytes(16).toString("hex")}`,
    createDownloadToken: generateDownloadToken,
  };
}

export function checkoutOrigin(headers: Headers): string {
  if (process.env.VERCEL_ENV === "production") {
    return SITE_ORIGIN;
  }

  const host = headers.get("x-forwarded-host") || headers.get("host");
  const proto = headers.get("x-forwarded-proto") || "https";
  if (host) {
    return `${proto}://${host}`;
  }

  return SITE_ORIGIN;
}

export async function startProductionCheckout(
  input: Parameters<typeof startCheckoutPayment>[0],
) {
  return startCheckoutPayment(input, createProductionCheckoutDeps());
}

export async function confirmProductionVippsPayment(reference: string) {
  return confirmVippsPayment({ reference }, createProductionCheckoutDeps());
}

export async function confirmProductionStripePayment(sessionId: string) {
  return confirmStripePayment({ sessionId }, createProductionCheckoutDeps());
}
