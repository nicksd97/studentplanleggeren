import Stripe from "stripe";
import type { CheckoutDependencies, StripeCheckoutSession } from "./checkout";

type StripeEnv = {
  secretKey: string;
};

function readStripeEnv(): StripeEnv {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!secretKey || !publishableKey) {
    throw new Error("Stripe is not configured");
  }

  return { secretKey };
}

function createStripeClient(secretKey: string): Stripe {
  return new Stripe(secretKey);
}

function mapSession(session: Stripe.Checkout.Session): StripeCheckoutSession {
  return {
    id: session.id,
    status: session.status ?? "open",
    payment_status: session.payment_status,
    amount_total: session.amount_total,
    currency: session.currency,
  };
}

export function createStripeGateway(): CheckoutDependencies["stripe"] {
  return {
    async createCheckoutSession(input) {
      const env = readStripeEnv();
      const stripe = createStripeClient(env.secretKey);
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        locale: "nb",
        payment_method_types: ["card"],
        customer_email: input.email,
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "nok",
              unit_amount: input.amountOre,
              product_data: {
                name: input.description,
              },
            },
          },
        ],
      });

      if (!session.url) {
        throw new Error("Stripe checkout URL missing");
      }

      return { id: session.id, url: session.url };
    },

    async getCheckoutSession(sessionId) {
      const env = readStripeEnv();
      const stripe = createStripeClient(env.secretKey);
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return mapSession(session);
    },
  };
}
