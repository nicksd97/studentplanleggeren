import { NextRequest, NextResponse } from "next/server";
import { localizePath } from "@/lib/i18n/config";
import { checkoutOrigin, confirmProductionStripePayment } from "@/lib/checkout-server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const origin = checkoutOrigin(request.headers);
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(`${origin}/kasse?betaling=avbrutt`);
  }

  const result = await confirmProductionStripePayment(sessionId);

  if (result.ok) {
    return NextResponse.redirect(
      `${origin}${localizePath("/takk", result.locale ?? "nb")}?token=${encodeURIComponent(result.downloadToken)}`,
    );
  }

  if (
    (result.reason === "pending" || result.reason === "error") &&
    result.downloadToken
  ) {
    return NextResponse.redirect(
      `${origin}${localizePath("/takk", result.locale ?? "nb")}?token=${encodeURIComponent(result.downloadToken)}`,
    );
  }

  return NextResponse.redirect(
    `${origin}${localizePath("/kasse", result.locale ?? "nb")}?betaling=avbrutt`,
  );
}
