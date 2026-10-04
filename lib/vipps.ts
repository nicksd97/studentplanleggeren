import type { CheckoutDependencies, VippsPayment } from "./checkout";

type VippsEnv = {
  apiUrl: string;
  clientId: string;
  clientSecret: string;
  subscriptionKey: string;
  msn: string;
};

type CachedToken = {
  value: string;
  expiresAt: number;
};

let cachedToken: CachedToken | null = null;

function readVippsEnv(): VippsEnv {
  const apiUrl = process.env.VIPPS_API_URL?.replace(/\/$/, "");
  const clientId = process.env.VIPPS_CLIENT_ID;
  const clientSecret = process.env.VIPPS_CLIENT_SECRET;
  const subscriptionKey = process.env.VIPPS_SUBSCRIPTION_KEY;
  const msn = process.env.VIPPS_MSN;

  if (!apiUrl || !clientId || !clientSecret || !subscriptionKey || !msn) {
    throw new Error("Vipps is not configured");
  }

  return { apiUrl, clientId, clientSecret, subscriptionKey, msn };
}

function systemHeaders(): Record<string, string> {
  return {
    "Vipps-System-Name": "studentplanleggeren",
    "Vipps-System-Version": "0.1.0",
    "Vipps-System-Plugin-Name": "next-epayment",
    "Vipps-System-Plugin-Version": "1.0.0",
  };
}

async function getAccessToken(env: VippsEnv): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const response = await fetch(`${env.apiUrl}/accesstoken/get`, {
    method: "POST",
    headers: {
      client_id: env.clientId,
      client_secret: env.clientSecret,
      "Ocp-Apim-Subscription-Key": env.subscriptionKey,
      "Merchant-Serial-Number": env.msn,
      "Content-Type": "application/json",
    },
    body: "",
  });

  if (!response.ok) {
    throw new Error("Vipps token request failed");
  }

  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!data.access_token) {
    throw new Error("Vipps token missing");
  }

  const lifetimeMs = Math.max(30, (data.expires_in ?? 3600) - 60) * 1000;
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + lifetimeMs,
  };
  return data.access_token;
}

function authHeaders(env: VippsEnv, token: string, idempotencyKey?: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    "Ocp-Apim-Subscription-Key": env.subscriptionKey,
    "Merchant-Serial-Number": env.msn,
    "Content-Type": "application/json",
    ...systemHeaders(),
    ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
  };
}

export function createVippsGateway(): CheckoutDependencies["vipps"] {
  return {
    async createPayment(input) {
      const env = readVippsEnv();
      const token = await getAccessToken(env);
      const response = await fetch(`${env.apiUrl}/epayment/v1/payments`, {
        method: "POST",
        headers: authHeaders(env, token, input.reference),
        body: JSON.stringify({
          amount: { currency: "NOK", value: input.amountOre },
          paymentMethod: { type: "WALLET" },
          reference: input.reference,
          userFlow: "WEB_REDIRECT",
          returnUrl: input.returnUrl,
          paymentDescription: input.description,
          ...(input.profileScope
            ? { profile: { scope: input.profileScope } }
            : {}),
        }),
      });

      if (!response.ok) {
        throw new Error("Vipps create payment failed");
      }

      const data = (await response.json()) as { redirectUrl?: string };
      if (!data.redirectUrl) {
        throw new Error("Vipps redirect URL missing");
      }
      return { redirectUrl: data.redirectUrl };
    },

    async getPayment(reference) {
      const env = readVippsEnv();
      const token = await getAccessToken(env);
      const response = await fetch(
        `${env.apiUrl}/epayment/v1/payments/${encodeURIComponent(reference)}`,
        { headers: authHeaders(env, token) },
      );

      if (!response.ok) {
        throw new Error("Vipps get payment failed");
      }

      return (await response.json()) as VippsPayment;
    },

    async capturePayment(reference, amountOre) {
      const env = readVippsEnv();
      const token = await getAccessToken(env);
      const response = await fetch(
        `${env.apiUrl}/epayment/v1/payments/${encodeURIComponent(reference)}/capture`,
        {
          method: "POST",
          headers: authHeaders(env, token, `${reference}-capture`),
          body: JSON.stringify({
            modificationAmount: { currency: "NOK", value: amountOre },
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Vipps capture failed");
      }

      return (await response.json()) as VippsPayment;
    },
  };
}
