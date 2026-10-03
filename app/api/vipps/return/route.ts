import { NextRequest, NextResponse } from "next/server";
import { checkoutOrigin, confirmProductionVippsPayment } from "@/lib/checkout-server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const origin = checkoutOrigin(request.headers);
  const reference = request.nextUrl.searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(`${origin}/kasse?betaling=avbrutt`);
  }

  const result = await confirmProductionVippsPayment(reference);

  if (result.ok) {
    return NextResponse.redirect(`${origin}/takk?token=${encodeURIComponent(result.downloadToken)}`);
  }

  if (result.reason === "pending" && result.downloadToken) {
    return NextResponse.redirect(`${origin}/takk?token=${encodeURIComponent(result.downloadToken)}`);
  }

  return NextResponse.redirect(`${origin}/kasse?betaling=avbrutt`);
}
