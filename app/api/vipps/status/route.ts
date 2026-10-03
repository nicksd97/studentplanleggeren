import { NextRequest, NextResponse } from "next/server";
import {
  confirmProductionStripePayment,
  confirmProductionVippsPayment,
} from "@/lib/checkout-server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Mangler token" }, { status: 400 });
  }

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("payment_id, payment_status, payment_provider")
    .eq("download_token", token)
    .maybeSingle();

  if (error || !order) {
    return NextResponse.json({ error: "Ordre ikke funnet" }, { status: 404 });
  }

  if (order.payment_status === "completed") {
    return NextResponse.json({ paymentStatus: "completed" });
  }

  if (!order.payment_id) {
    return NextResponse.json({ paymentStatus: order.payment_status });
  }

  const result =
    order.payment_provider === "stripe"
      ? await confirmProductionStripePayment(order.payment_id)
      : await confirmProductionVippsPayment(order.payment_id);
  if (result.ok) {
    return NextResponse.json({ paymentStatus: "completed" });
  }
  if (result.reason === "cancelled") {
    return NextResponse.json({ paymentStatus: "cancelled" });
  }
  return NextResponse.json({ paymentStatus: order.payment_status });
}
