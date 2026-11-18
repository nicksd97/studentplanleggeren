import { NextRequest, NextResponse } from 'next/server';
import { expectedCharge, type OrderRecord } from '@/lib/checkout';
import { orderMetaFromItems } from '@/lib/order-store';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Mangler token' }, { status: 400 });
  }

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    // "*" so this works before and after the currency/locale migration.
    .select('*')
    .eq('download_token', token)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: 'Ordre ikke funnet' }, { status: 404 });
  }

  const meta = orderMetaFromItems(order.items) ?? {};
  const charge = expectedCharge({
    ...(order as OrderRecord),
    currency: order.currency ?? meta.currency,
    amount_minor: order.amount_minor ?? meta.amount_minor,
  });

  return NextResponse.json({
    id: order.id,
    email: order.email,
    firstName: order.first_name,
    items: order.items,
    amountNok: order.amount_nok,
    currency: charge.currency,
    amountMinor: charge.amountMinor,
    locale: order.locale ?? meta.locale ?? 'nb',
    paymentStatus: order.payment_status,
    downloadCount: order.download_count,
    maxDownloads: order.max_downloads,
    expiresAt: order.token_expires_at,
  });
}
