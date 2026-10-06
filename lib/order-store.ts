import { attachCampaignTags, campaignTagsFromItems, parseCampaignTags } from "./attribution";
import type { CheckoutDependencies, CheckoutItem, OrderRecord } from "./checkout";
import { createOrderInsertFailure } from "./order-insert-error";
import { supabaseAdmin } from "./supabase";

const ORDER_COLUMNS =
  "id, email, first_name, last_name, items, amount_nok, payment_provider, payment_id, payment_status, download_token, token_expires_at, discount_code, list_amount_nok, discount_nok, discount_percent";

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
  discount_code?: string | null;
  list_amount_nok?: number | null;
  discount_nok?: number | null;
  discount_percent?: number | null;
};

function mapOrder(row: OrderRow): OrderRecord {
  const tags = campaignTagsFromItems(row.items) ?? {};
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
    ...(row.discount_code ? { discount_code: row.discount_code } : {}),
    ...(row.list_amount_nok != null ? { list_amount_nok: row.list_amount_nok } : {}),
    ...(row.discount_nok != null ? { discount_nok: row.discount_nok } : {}),
    ...(row.discount_percent != null ? { discount_percent: row.discount_percent } : {}),
    ...tags,
  };
}

type OrderClient = Pick<typeof supabaseAdmin, "from">;

export function createSupabaseOrderStore(
  client: OrderClient = supabaseAdmin,
): CheckoutDependencies["orders"] {
  return {
    async insertPending(data) {
      try {
        const tags = campaignTagsFromItems(data.items) ?? parseCampaignTags(data);
        const insert: Record<string, unknown> = {
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          items: attachCampaignTags(data.items, tags),
          amount_nok: data.amount_nok,
          payment_provider: data.payment_provider,
          payment_id: data.payment_id,
          payment_status: "pending",
          download_token: data.download_token,
          token_expires_at: data.token_expires_at,
        };
        if (data.discount_code) {
          insert.discount_code = data.discount_code;
          insert.list_amount_nok = data.list_amount_nok;
          insert.discount_nok = data.discount_nok ?? 0;
          if (data.discount_percent != null) {
            insert.discount_percent = data.discount_percent;
          }
        }

        const { data: order, error } = await client
          .from("orders")
          .insert(insert)
          .select()
          .single();

        if (error || !order) {
          throw createOrderInsertFailure(error ?? new Error("empty insert result"));
        }

        return mapOrder(order as OrderRow);
      } catch (error) {
        if (error instanceof Error && error.message === "Kunne ikke opprette ordre") {
          throw error;
        }
        throw createOrderInsertFailure(error);
      }
    },

    async findByPaymentId(paymentId) {
      const { data, error } = await client
        .from("orders")
        .select(ORDER_COLUMNS)
        .eq("payment_id", paymentId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return mapOrder(data as OrderRow);
    },

    async completeIfPending(id) {
      const { data, error } = await client
        .from("orders")
        .update({ payment_status: "completed" })
        .eq("id", id)
        .eq("payment_status", "pending")
        .select(ORDER_COLUMNS)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return mapOrder(data as OrderRow);
    },

    async markCancelled(id) {
      const { data, error } = await client
        .from("orders")
        .update({ payment_status: "cancelled" })
        .eq("id", id)
        .neq("payment_status", "completed")
        .select(ORDER_COLUMNS)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return mapOrder(data as OrderRow);
    },

    async updateBuyerDetails(id, details) {
      const patch: { email?: string; first_name?: string; last_name?: string } = {};
      if (details.email !== undefined) patch.email = details.email;
      if (details.first_name !== undefined) patch.first_name = details.first_name;
      if (details.last_name !== undefined) patch.last_name = details.last_name;
      if (Object.keys(patch).length === 0) {
        return null;
      }

      const { data, error } = await client
        .from("orders")
        .update(patch)
        .eq("id", id)
        .select(ORDER_COLUMNS)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return mapOrder(data as OrderRow);
    },
  };
}
