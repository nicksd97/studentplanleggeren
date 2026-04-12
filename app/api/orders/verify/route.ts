import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Mangler token' }, { status: 400 });
  }

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('id, email, first_name, items, payment_status, download_count, max_downloads, token_expires_at, created_at')
    .eq('download_token', token)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: 'Ordre ikke funnet' }, { status: 404 });
  }

  return NextResponse.json({
    id: order.id,
    email: order.email,
    firstName: order.first_name,
    items: order.items,
    paymentStatus: order.payment_status,
    downloadCount: order.download_count,
    maxDownloads: order.max_downloads,
    expiresAt: order.token_expires_at,
  });
}
