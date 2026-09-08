import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createVippsPayment } from '@/lib/vipps';

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, items, amountNok } = body as {
      email?: string;
      firstName?: string;
      lastName?: string;
      items?: CartItem[];
      amountNok?: number;
    };

    if (!email || !firstName || !items || items.length === 0 || !amountNok) {
      return NextResponse.json(
        { error: 'Mangler påkrevde felt' },
        { status: 400 }
      );
    }

    const reference = randomUUID();

    const { error: orderError } = await supabaseAdmin.from('orders').insert({
      id: reference,
      email,
      first_name: firstName,
      last_name: lastName || '',
      items,
      amount_nok: amountNok,
      payment_provider: 'vipps',
      payment_id: reference,
      payment_status: 'pending',
    });

    if (orderError) {
      console.error('Pending order insert failed:', orderError);
      return NextResponse.json(
        { error: 'Kunne ikke opprette ordre' },
        { status: 500 }
      );
    }

    const origin = request.nextUrl.origin;
    const description =
      items.length === 1
        ? items[0].name
        : `Studentplanlegger (${items.length} produkter)`;

    let payment;
    try {
      payment = await createVippsPayment({
        reference,
        amountNok,
        returnUrl: `${origin}/takk?provider=vipps&reference=${reference}`,
        description: description.slice(0, 100),
      });
    } catch (err) {
      console.error('Vipps create payment error:', err);
      return NextResponse.json(
        { error: 'Kunne ikke starte Vipps-betaling' },
        { status: 502 }
      );
    }

    return NextResponse.json({ checkoutUrl: payment.redirectUrl });
  } catch (err) {
    console.error('Vipps checkout error:', err);
    return NextResponse.json({ error: 'Serverfeil' }, { status: 500 });
  }
}
