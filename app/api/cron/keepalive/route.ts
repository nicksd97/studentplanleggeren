import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Cheap read that hits PostgREST so the Supabase project registers activity.
    const { error } = await supabaseAdmin
      .from("orders")
      .select("id", { count: "exact", head: true });

    if (error) {
      console.error("Keepalive query error:", error.message);
      return NextResponse.json({ ok: false, error: "Serverfeil" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    console.error("Keepalive API error:", message);
    return NextResponse.json({ ok: false, error: "Serverfeil" }, { status: 500 });
  }
}
