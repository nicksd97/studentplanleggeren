import { NextRequest, NextResponse } from "next/server";
import { confirmProductionStripePayment } from "@/lib/checkout-server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      data?: { object?: { id?: unknown } };
    };
    const sessionId = typeof body?.data?.object?.id === "string" ? body.data.object.id : "";

    if (!sessionId) {
      return NextResponse.json({ error: "Mangler session_id" }, { status: 400 });
    }

    const result = await confirmProductionStripePayment(sessionId);

    if (result.ok || result.reason === "pending" || result.reason === "cancelled") {
      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ error: result.error }, { status: result.status });
  } catch {
    return NextResponse.json({ error: "Serverfeil" }, { status: 500 });
  }
}
