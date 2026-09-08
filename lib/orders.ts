import { supabaseAdmin } from '@/lib/supabase';
import { generateDownloadToken, getTokenExpiry } from '@/lib/tokens';
import { sendOrderConfirmation } from '@/lib/email';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  type: string;
}

export interface PendingOrderRow {
  id: string;
  email: string;
  first_name: string;
  items: OrderItem[];
  payment_status: string;
  download_token: string | null;
  token_expires_at: string | null;
}

export interface FinalizedOrder {
  downloadToken: string;
  expiresAt: string;
}

// Atomically transitions a pending order to completed, generates a download token,
// and sends the confirmation email exactly once. Safe to call concurrently — the
// `payment_status = pending` guard on the UPDATE picks one winner; the loser
// re-reads the persisted token so the customer always gets the real one.
export async function finalizePendingOrder(
  existing: PendingOrderRow
): Promise<FinalizedOrder> {
  if (
    existing.payment_status === 'completed' &&
    existing.download_token &&
    existing.token_expires_at
  ) {
    return {
      downloadToken: existing.download_token,
      expiresAt: existing.token_expires_at,
    };
  }

  const downloadToken = generateDownloadToken();
  const tokenExpiresAt = getTokenExpiry();

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('orders')
    .update({
      payment_status: 'completed',
      download_token: downloadToken,
      token_expires_at: tokenExpiresAt.toISOString(),
    })
    .eq('id', existing.id)
    .eq('payment_status', 'pending')
    .select('id');

  if (updateError) {
    throw new Error(`Order finalize failed: ${updateError.message}`);
  }

  if (updated && updated.length === 1) {
    sendOrderConfirmation({
      email: existing.email,
      firstName: existing.first_name,
      items: existing.items,
      downloadToken,
    }).catch((err) => console.error('Failed to send confirmation email:', err));

    return { downloadToken, expiresAt: tokenExpiresAt.toISOString() };
  }

  const { data: refetched, error: refetchError } = await supabaseAdmin
    .from('orders')
    .select('download_token, token_expires_at')
    .eq('id', existing.id)
    .single();

  if (
    refetchError ||
    !refetched?.download_token ||
    !refetched?.token_expires_at
  ) {
    throw new Error('Order finalize race recovery failed');
  }

  return {
    downloadToken: refetched.download_token,
    expiresAt: refetched.token_expires_at,
  };
}
