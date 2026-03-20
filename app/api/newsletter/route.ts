import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Ugyldig e-postadresse" },
        { status: 400 }
      );
    }

    // TODO: Beehiiv-integrasjon
    console.log("Newsletter signup:", email);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Ugyldig forespørsel" },
      { status: 400 }
    );
  }
}
