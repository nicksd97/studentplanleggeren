import { campaignTagsFromItems } from "./attribution";
import type { OrderRecord } from "./checkout";

export function configuredMeasurementId(): string | null {
  const value = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
  if (!value || !/^[A-Z][A-Z0-9]{0,3}-[A-Z0-9]{4,32}$/i.test(value)) {
    return null;
  }
  return value;
}

export async function recordPaidPurchase(order: OrderRecord): Promise<void> {
  const measurementId = configuredMeasurementId();
  if (!measurementId || order.payment_status !== "completed") {
    return;
  }

  const apiSecret = process.env.GA_API_SECRET?.trim();
  if (!apiSecret) {
    return;
  }

  const tags = campaignTagsFromItems(order.items) ?? {
    utm_source: order.utm_source,
    utm_medium: order.utm_medium,
    utm_campaign: order.utm_campaign,
    utm_content: order.utm_content,
  };

  void fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: order.id,
        events: [
          {
            name: "purchase",
            params: {
              transaction_id: order.id,
              value: order.amount_nok,
              currency: "NOK",
              ...tags,
            },
          },
        ],
      }),
    },
  ).catch(() => {
    // Never block fulfillment because analytics is unavailable.
  });
}
