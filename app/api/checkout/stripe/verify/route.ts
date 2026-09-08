import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getStripeClient } from '@/lib/stripe';
import { finalizePendingOrder } from '@/lib/orders';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ error: 'Mangler session_id' }, { status: 400 });
  }

  try {
    const { data: existing, error: lookupError } = await supabaseAdmin
      .from('orders')
      .select(
        'id, email, first_name, items, payment_status, download_token, token_expires_at'
      )
      .eq('stripe_session_id', sessionId)
      .single();

    if (lookupError || !existing) {
      return NextResponse.json({ error: 'Ordre ikke funnet' }, { status: 404 });
    }

    if (existing.payment_status !== 'completed') {
      const stripe = getStripeClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== 'paid') {
        return NextResponse.json(
          { error: 'Betalingen er ikke fullført', status: session.payment_status },
          { status: 402 }
        );
      }
    }

    const finalized = await finalizePendingOrder(existing);
    return NextResponse.json(finalized);
  } catch (err) {
    console.error('Stripe verify error:', err);
    return NextResponse.json({ error: 'Serverfeil' }, { status: 500 });
  }
}
