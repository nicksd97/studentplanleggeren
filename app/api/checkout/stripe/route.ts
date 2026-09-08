import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getStripeClient } from '@/lib/stripe';

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

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        email,
        first_name: firstName,
        last_name: lastName || '',
        items,
        amount_nok: amountNok,
        payment_provider: 'stripe',
        payment_status: 'pending',
      })
      .select('id')
      .single();

    if (orderError || !order) {
      console.error('Pending order insert failed:', orderError);
      return NextResponse.json(
        { error: 'Kunne ikke opprette ordre' },
        { status: 500 }
      );
    }

    const origin = request.nextUrl.origin;
    const stripe = getStripeClient();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      client_reference_id: order.id,
      metadata: { order_id: order.id },
      line_items: items.map((item) => ({
        price_data: {
          currency: 'nok',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      })),
      success_url: `${origin}/takk?provider=stripe&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/kasse`,
      locale: 'nb',
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Stripe ga ingen checkout-URL' },
        { status: 500 }
      );
    }

    await supabaseAdmin
      .from('orders')
      .update({ stripe_session_id: session.id, payment_id: session.id })
      .eq('id', order.id);

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Serverfeil' }, { status: 500 });
  }
}
