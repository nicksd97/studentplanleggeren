import { NextRequest, NextResponse } from "next/server";
import { CARD_CHECKOUT_DISABLED_MESSAGE } from "@/lib/checkout";
import { checkoutOrigin, startProductionCheckout } from "@/lib/checkout-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.paymentProvider !== "vipps") {
      return NextResponse.json({ error: CARD_CHECKOUT_DISABLED_MESSAGE }, { status: 400 });
    }

    const result = await startProductionCheckout({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      items: body.items,
      amountNok: body.amountNok,
      paymentProvider: body.paymentProvider,
      returnOrigin: checkoutOrigin(request.headers),
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ redirectUrl: result.redirectUrl });
  } catch {
    return NextResponse.json({ error: "Serverfeil" }, { status: 500 });
  }
}
