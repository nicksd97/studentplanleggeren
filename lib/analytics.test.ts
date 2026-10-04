import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { configuredMeasurementId, recordPaidPurchase } from "./analytics";

describe("recordPaidPurchase", () => {
  it("does nothing when no measurement id is configured", async () => {
    const previousId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const previousSecret = process.env.GA_API_SECRET;
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    delete process.env.GA_API_SECRET;

    try {
      assert.equal(configuredMeasurementId(), null);
      await recordPaidPurchase({
        id: "order-1",
        email: "ola@example.com",
        first_name: "Ola",
        last_name: "Nordmann",
        items: [{ id: "komplett", name: "Komplett", price: 349, type: "bundle" }],
        amount_nok: 349,
        payment_provider: "vipps",
        payment_id: "ord-1",
        payment_status: "completed",
        download_token: "token",
        token_expires_at: "2026-10-11T00:00:00.000Z",
        utm_source: "instagram",
      });
    } finally {
      if (previousId === undefined) delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
      else process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = previousId;
      if (previousSecret === undefined) delete process.env.GA_API_SECRET;
      else process.env.GA_API_SECRET = previousSecret;
    }
  });
});
