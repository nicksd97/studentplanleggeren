import { NextRequest, NextResponse } from "next/server";
import { confirmProductionVippsPayment } from "@/lib/checkout-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const reference = typeof body?.reference === "string" ? body.reference : "";

    if (!reference) {
      return NextResponse.json({ error: "Mangler reference" }, { status: 400 });
    }

    const result = await confirmProductionVippsPayment(reference);

    if (result.ok || result.reason === "pending" || result.reason === "cancelled") {
      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ error: result.error }, { status: result.status });
  } catch {
    return NextResponse.json({ error: "Serverfeil" }, { status: 500 });
  }
}
