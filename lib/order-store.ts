import { supabaseAdmin } from "./supabase";
import type { CheckoutDependencies, CheckoutItem, OrderRecord } from "./checkout";

type OrderRow = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  items: CheckoutItem[];
  amount_nok: number;
  payment_provider: string;
  payment_id: string | null;
  payment_status: string;
  download_token: string;
  token_expires_at: string;
};

function mapOrder(row: OrderRow): OrderRecord {
  return {
    id: row.id,
    email: row.email,
    first_name: row.first_name,
    last_name: row.last_name,
    items: row.items,
    amount_nok: row.amount_nok,
    payment_provider: row.payment_provider,
    payment_id: row.payment_id,
    payment_status: row.payment_status,
    download_token: row.download_token,
    token_expires_at: row.token_expires_at,
  };
}

export function createSupabaseOrderStore(): CheckoutDependencies["orders"] {
  return {
    async insertPending(data) {
      const { data: order, error } = await supabaseAdmin
        .from("orders")
        .insert({
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          items: data.items,
          amount_nok: data.amount_nok,
          payment_provider: "vipps",
          payment_id: data.payment_id,
          payment_status: "pending",
          download_token: data.download_token,
          token_expires_at: data.token_expires_at,
        })
        .select(
          "id, email, first_name, last_name, items, amount_nok, payment_provider, payment_id, payment_status, download_token, token_expires_at",
        )
        .single();

      if (error || !order) {
        throw new Error("Kunne ikke opprette ordre");
      }

      return mapOrder(order as OrderRow);
    },

    async findByPaymentId(paymentId) {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .select(
          "id, email, first_name, last_name, items, amount_nok, payment_provider, payment_id, payment_status, download_token, token_expires_at",
        )
        .eq("payment_id", paymentId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return mapOrder(data as OrderRow);
    },

    async completeIfPending(id) {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .update({ payment_status: "completed" })
        .eq("id", id)
        .eq("payment_status", "pending")
        .select(
          "id, email, first_name, last_name, items, amount_nok, payment_provider, payment_id, payment_status, download_token, token_expires_at",
        )
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return mapOrder(data as OrderRow);
    },

    async markCancelled(id) {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .update({ payment_status: "cancelled" })
        .eq("id", id)
        .neq("payment_status", "completed")
        .select(
          "id, email, first_name, last_name, items, amount_nok, payment_provider, payment_id, payment_status, download_token, token_expires_at",
        )
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return mapOrder(data as OrderRow);
    },
  };
}
