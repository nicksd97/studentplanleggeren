interface VippsConfig {
  apiUrl: string;
  clientId: string;
  clientSecret: string;
  subscriptionKey: string;
  msn: string;
}

function getConfig(): VippsConfig {
  const apiUrl = process.env.VIPPS_API_URL;
  const clientId = process.env.VIPPS_CLIENT_ID;
  const clientSecret = process.env.VIPPS_CLIENT_SECRET;
  const subscriptionKey = process.env.VIPPS_SUBSCRIPTION_KEY;
  const msn = process.env.VIPPS_MSN;
  if (!apiUrl || !clientId || !clientSecret || !subscriptionKey || !msn) {
    throw new Error('Vipps environment variables are not fully set');
  }
  return { apiUrl, clientId, clientSecret, subscriptionKey, msn };
}

function vippsHeaders(cfg: VippsConfig, accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
    'Ocp-Apim-Subscription-Key': cfg.subscriptionKey,
    'Merchant-Serial-Number': cfg.msn,
    'Vipps-System-Name': 'studentplanlegger',
    'Vipps-System-Version': '1.0.0',
    'Vipps-System-Plugin-Name': 'studentplanlegger-checkout',
    'Vipps-System-Plugin-Version': '1.0.0',
    'Content-Type': 'application/json',
  };
}

let tokenCache: { token: string; expiresAt: number } | null = null;
const TOKEN_SAFETY_MARGIN_MS = 60_000;

export async function getVippsAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + TOKEN_SAFETY_MARGIN_MS) {
    return tokenCache.token;
  }

  const cfg = getConfig();
  const res = await fetch(`${cfg.apiUrl}/accesstoken/get`, {
    method: 'POST',
    headers: {
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      'Ocp-Apim-Subscription-Key': cfg.subscriptionKey,
      'Merchant-Serial-Number': cfg.msn,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Vipps access token failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as {
    access_token: string;
    expires_in?: string | number;
  };
  const expiresInSec =
    typeof data.expires_in === 'string'
      ? Number(data.expires_in)
      : data.expires_in ?? 3600;
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + expiresInSec * 1000,
  };
  return data.access_token;
}

export interface CreatePaymentInput {
  reference: string;
  amountNok: number;
  returnUrl: string;
  description: string;
}

export interface CreatePaymentResult {
  redirectUrl: string;
  reference: string;
}

export async function createVippsPayment(
  input: CreatePaymentInput
): Promise<CreatePaymentResult> {
  const cfg = getConfig();
  const accessToken = await getVippsAccessToken();

  const body = {
    amount: {
      value: Math.round(input.amountNok * 100),
      currency: 'NOK',
    },
    paymentMethod: { type: 'WALLET' },
    reference: input.reference,
    returnUrl: input.returnUrl,
    userFlow: 'WEB_REDIRECT',
    paymentDescription: input.description,
  };

  const res = await fetch(`${cfg.apiUrl}/epayment/v1/payments`, {
    method: 'POST',
    headers: {
      ...vippsHeaders(cfg, accessToken),
      'Idempotency-Key': `${input.reference}-create`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Vipps create payment failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as { redirectUrl: string; reference: string };
  return { redirectUrl: data.redirectUrl, reference: data.reference };
}

export interface VippsPaymentStatus {
  reference: string;
  state:
    | 'CREATED'
    | 'AUTHORIZED'
    | 'TERMINATED'
    | 'EXPIRED'
    | 'ABORTED'
    | 'CAPTURED';
  amount: { value: number; currency: string };
  aggregate?: {
    authorizedAmount?: { value: number };
    capturedAmount?: { value: number };
  };
}

export async function getVippsPayment(
  reference: string
): Promise<VippsPaymentStatus> {
  const cfg = getConfig();
  const accessToken = await getVippsAccessToken();
  const res = await fetch(
    `${cfg.apiUrl}/epayment/v1/payments/${encodeURIComponent(reference)}`,
    {
      method: 'GET',
      headers: vippsHeaders(cfg, accessToken),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Vipps get payment failed: ${res.status} ${text}`);
  }
  return (await res.json()) as VippsPaymentStatus;
}

export async function captureVippsPayment(
  reference: string,
  amountNok: number
): Promise<void> {
  const cfg = getConfig();
  const accessToken = await getVippsAccessToken();
  const res = await fetch(
    `${cfg.apiUrl}/epayment/v1/payments/${encodeURIComponent(reference)}/capture`,
    {
      method: 'POST',
      headers: {
        ...vippsHeaders(cfg, accessToken),
        'Idempotency-Key': `${reference}-capture`,
      },
      body: JSON.stringify({
        modificationAmount: {
          value: Math.round(amountNok * 100),
          currency: 'NOK',
        },
      }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Vipps capture failed: ${res.status} ${text}`);
  }
}
