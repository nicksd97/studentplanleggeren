import { NextRequest, NextResponse } from "next/server";
import { previewCheckoutDiscount } from "@/lib/checkout";
import { createSupabaseDiscountStore } from "@/lib/discount";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { code?: unknown; items?: unknown };
    const discounts = createSupabaseDiscountStore();
    const result = await previewCheckoutDiscount(
      Array.isArray(body.items) ? body.items : [],
      body.code,
      (code) => discounts.lookup(code),
    );

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ ok: false, error: "Ugyldig kode" }, { status: 400 });
  }
}
