import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const fileId = request.nextUrl.searchParams.get('file');

  if (!token || !fileId) {
    return NextResponse.json({ error: 'Mangler token eller fil' }, { status: 400 });
  }

  // Look up order by token
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('download_token', token)
    .eq('payment_status', 'completed')
    .single();

  if (error || !order) {
    return NextResponse.json({ error: 'Ugyldig eller utløpt nedlastingslenke' }, { status: 403 });
  }

  // Check expiry
  if (new Date(order.token_expires_at) < new Date()) {
    return NextResponse.json({ error: 'Nedlastingslenken har utløpt' }, { status: 403 });
  }

  // Check download count
  if (order.download_count >= order.max_downloads) {
    return NextResponse.json({ error: 'Maks antall nedlastinger er nådd' }, { status: 403 });
  }

  // Map fileId to actual storage path
  const storagePath = fileId;

  // Generate signed URL (valid for 1 hour)
  const { data: signedUrl, error: urlError } = await supabaseAdmin
    .storage
    .from('products')
    .createSignedUrl(storagePath, 3600);

  if (urlError || !signedUrl) {
    return NextResponse.json({ error: 'Kunne ikke generere nedlastingslenke' }, { status: 500 });
  }

  // Increment download count
  await supabaseAdmin
    .from('orders')
    .update({ download_count: order.download_count + 1 })
    .eq('id', order.id);

  // Redirect to the signed URL
  return NextResponse.redirect(signedUrl.signedUrl);
}
