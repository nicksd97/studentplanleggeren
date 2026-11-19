import { NextRequest, NextResponse } from 'next/server';
import { downloadLocale, isOrderFile, signLocalizedPath } from '@/lib/downloads';
import { orderMetaFromItems } from '@/lib/order-store';
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

  // `file` is a storage path; only files of the products in this order are allowed.
  if (!isOrderFile(fileId, order.items)) {
    return NextResponse.json({ error: 'Filen hører ikke til denne ordren' }, { status: 403 });
  }

  // Deliver the PDF in the page's (or order's) language, falling back to Bokmål.
  const locale = downloadLocale(
    request.nextUrl.searchParams.get('lang'),
    order.locale ?? orderMetaFromItems(order.items)?.locale,
  );

  // Generate signed URL (valid for 1 hour)
  const signed = await signLocalizedPath(fileId, locale, async (path) => {
    const { data, error: urlError } = await supabaseAdmin
      .storage
      .from('products')
      .createSignedUrl(path, 3600);
    return urlError || !data ? null : data.signedUrl;
  });

  if (!signed) {
    return NextResponse.json({ error: 'Kunne ikke generere nedlastingslenke' }, { status: 500 });
  }

  // Increment download count
  await supabaseAdmin
    .from('orders')
    .update({ download_count: order.download_count + 1 })
    .eq('id', order.id);

  // Redirect to the signed URL
  return NextResponse.redirect(signed.url);
}
