import { NextRequest, NextResponse } from "next/server";
import { confirmProductionStripePayment } from "@/lib/checkout-server";

const HANDLED_EVENTS = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "checkout.session.expired",
]);

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      type?: unknown;
      data?: { object?: { id?: unknown; object?: unknown } };
    };
    const eventType = typeof body?.type === "string" ? body.type : "";
    if (eventType && !HANDLED_EVENTS.has(eventType)) {
      return NextResponse.json({ received: true });
    }

    const objectType = body?.data?.object?.object;
    if (objectType && objectType !== "checkout.session") {
      return NextResponse.json({ received: true });
    }

    const sessionId = typeof body?.data?.object?.id === "string" ? body.data.object.id : "";

    if (!sessionId) {
      return NextResponse.json({ received: true });
    }

    const result = await confirmProductionStripePayment(sessionId);

    if (
      result.ok ||
      result.reason === "pending" ||
      result.reason === "cancelled" ||
      result.reason === "mismatch"
    ) {
      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ error: result.error }, { status: result.status });
  } catch {
    return NextResponse.json({ error: "Serverfeil" }, { status: 500 });
  }
}
