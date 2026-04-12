import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateDownloadToken, getTokenExpiry } from '@/lib/tokens';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, items, amountNok, paymentProvider, paymentId } = body;

    if (!email || !firstName || !items || !amountNok) {
      return NextResponse.json({ error: 'Mangler påkrevde felt' }, { status: 400 });
    }

    const downloadToken = generateDownloadToken();
    const tokenExpiresAt = getTokenExpiry();

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .insert({
        email,
        first_name: firstName,
        last_name: lastName || '',
        items,
        amount_nok: amountNok,
        payment_provider: paymentProvider || 'stripe',
        payment_id: paymentId || null,
        payment_status: 'completed',
        download_token: downloadToken,
        token_expires_at: tokenExpiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Order creation error:', error);
      return NextResponse.json({ error: 'Kunne ikke opprette ordre' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      downloadToken,
      expiresAt: tokenExpiresAt.toISOString(),
    });
  } catch (err) {
    console.error('Order API error:', err);
    return NextResponse.json({ error: 'Serverfeil' }, { status: 500 });
  }
}
