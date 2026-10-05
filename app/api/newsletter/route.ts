import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { sendLeadMagnetEmail } from "@/lib/email";
import {
  allowNewsletterRequest,
  assertSafeLeadMagnetPath,
  isHoneypot,
  leadMagnetStoragePath,
  normalizeEmail,
} from "@/lib/newsletter";
import { supabaseAdmin } from "@/lib/supabase";

const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 7;

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig forespørsel" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Ugyldig forespørsel" }, { status: 400 });
  }

  const payload = body as { email?: unknown; company?: unknown; website?: unknown };

  if (isHoneypot(payload)) {
    return NextResponse.json({ success: true });
  }

  const email = normalizeEmail(payload.email);
  if (!email) {
    return NextResponse.json({ error: "Ugyldig e-postadresse" }, { status: 400 });
  }

  if (!allowNewsletterRequest(`${clientIp(request)}|${email}`)) {
    return NextResponse.json(
      { error: "For mange forsøk. Prøv igjen senere." },
      { status: 429 },
    );
  }

  const path = leadMagnetStoragePath();
  try {
    assertSafeLeadMagnetPath(path);
  } catch {
    return NextResponse.json(
      { error: "Kunne ikke lage nedlastingslenke" },
      { status: 500 },
    );
  }

  let signedUrl: string | null = null;
  try {
    const { data: signed, error: urlError } = await supabaseAdmin.storage
      .from("products")
      .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);
    signedUrl = signed?.signedUrl ?? null;
    if (urlError || !signedUrl) {
      return NextResponse.json(
        { error: "Kunne ikke lage nedlastingslenke" },
        { status: 500 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Kunne ikke lage nedlastingslenke" },
      { status: 500 },
    );
  }

  const segmentId = process.env.RESEND_LEAD_SEGMENT_ID;
  const apiKey = process.env.RESEND_API_KEY;
  if (!segmentId || !apiKey) {
    return NextResponse.json({ error: "Nyhetsbrev er ikke konfigurert" }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const { error: createError } = await resend.contacts.create({
    email,
    unsubscribed: false,
    segments: [{ id: segmentId }],
  });

  if (createError) {
    const { error: addError } = await resend.contacts.segments.add({
      email,
      segmentId,
    });
    if (addError) {
      return NextResponse.json({ error: "Kunne ikke lagre kontakten" }, { status: 502 });
    }
  }

  try {
    await sendLeadMagnetEmail({ to: email, downloadUrl: signedUrl });
  } catch {
    return NextResponse.json({ error: "Kunne ikke sende e-post" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
