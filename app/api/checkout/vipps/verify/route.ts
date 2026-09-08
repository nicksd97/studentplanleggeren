import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getVippsPayment, captureVippsPayment } from '@/lib/vipps';
import { finalizePendingOrder } from '@/lib/orders';

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get('reference');
  if (!reference) {
    return NextResponse.json({ error: 'Mangler reference' }, { status: 400 });
  }

  try {
    const { data: existing, error: lookupError } = await supabaseAdmin
      .from('orders')
      .select(
        'id, email, first_name, items, amount_nok, payment_status, download_token, token_expires_at'
      )
      .eq('id', reference)
      .eq('payment_provider', 'vipps')
      .single();

    if (lookupError || !existing) {
      return NextResponse.json({ error: 'Ordre ikke funnet' }, { status: 404 });
    }

    if (existing.payment_status !== 'completed') {
      const payment = await getVippsPayment(reference);

      if (payment.state === 'AUTHORIZED') {
        await captureVippsPayment(reference, existing.amount_nok);
      } else if (payment.state !== 'CAPTURED') {
        return NextResponse.json(
          { error: 'Betalingen er ikke fullført', state: payment.state },
          { status: 402 }
        );
      }
    }

    const finalized = await finalizePendingOrder(existing);
    return NextResponse.json(finalized);
  } catch (err) {
    console.error('Vipps verify error:', err);
    return NextResponse.json({ error: 'Serverfeil' }, { status: 500 });
  }
}
