import { NextRequest, NextResponse } from "next/server";
import {
  CAMPAIGN_COOKIE,
  mergeCampaignTags,
  parseCampaignCookie,
  parseCampaignTags,
} from "@/lib/attribution";
import { checkoutOrigin, startProductionCheckout } from "@/lib/checkout-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const campaign = mergeCampaignTags(
      parseCampaignTags(body.campaign ?? body),
      parseCampaignCookie(request.cookies.get(CAMPAIGN_COOKIE)?.value),
    );
    const result = await startProductionCheckout({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      items: body.items,
      amountNok: body.amountNok,
      paymentProvider: body.paymentProvider,
      campaign,
      returnOrigin: checkoutOrigin(request.headers),
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.error,
          ...(result.code ? { code: result.code } : {}),
          ...(result.details ? { details: result.details } : {}),
        },
        { status: result.status },
      );
    }

    return NextResponse.json({ redirectUrl: result.redirectUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    console.error("Order API error:", message);
    return NextResponse.json({ error: "Serverfeil" }, { status: 500 });
  }
}
