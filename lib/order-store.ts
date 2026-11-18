import { attachCampaignTags, campaignTagsFromItems, parseCampaignTags } from "./attribution";
import type { CheckoutDependencies, CheckoutItem, OrderRecord } from "./checkout";
import { parseCurrency } from "./currency";
import { isLocale } from "./i18n/config";
import { createOrderInsertFailure, isMissingCurrencyColumnError } from "./order-insert-error";
import { supabaseAdmin } from "./supabase";

// "*" rather than a column list, so reads keep working whether or not the currency/locale
// migration (supabase/migrations/2026-11-18-order-currency-locale.sql) has been applied.
const ORDER_COLUMNS = "*";

/**
 * Where currency, charged amount and language go when the orders table doesn't have the
 * currency/locale columns yet: a small object on the first item, next to the campaign tags.
 * Readers that only look at id/name/price/type ignore it.
 */
export const ORDER_META_KEY = "order_meta";

export type OrderMeta = {
  currency?: string;
  amount_minor?: number;
  list_amount_minor?: number;
  discount_minor?: number;
  locale?: string;
};

export function orderMetaFromItems(items: unknown): OrderMeta | null {
  if (!Array.isArray(items) || items.length === 0) return null;
  const meta = (items[0] as Record<string, unknown> | null)?.[ORDER_META_KEY];
  return meta && typeof meta === "object" ? (meta as OrderMeta) : null;
}

function attachOrderMeta<T extends object>(items: T[], meta: OrderMeta): T[] {
  if (items.length === 0) return items;
  return items.map((item, index) => (index === 0 ? { ...item, [ORDER_META_KEY]: meta } : item));
}

function numberOrUndefined(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

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
  currency?: string | null;
  amount_minor?: number | null;
  list_amount_minor?: number | null;
  discount_minor?: number | null;
  locale?: string | null;
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
    ...currencyFields(row),
    ...tags,
  };
}

/** Currency, minor amounts and language from the columns, or from item metadata as fallback. */
function currencyFields(row: OrderRow): Partial<OrderRecord> {
  const meta = orderMetaFromItems(row.items) ?? {};
  const fields: Partial<OrderRecord> = {};
  const currency = parseCurrency(row.currency) ?? parseCurrency(meta.currency);
  if (currency) fields.currency = currency;
  const amountMinor = numberOrUndefined(row.amount_minor) ?? numberOrUndefined(meta.amount_minor);
  if (amountMinor !== undefined) fields.amount_minor = amountMinor;
  const listMinor =
    numberOrUndefined(row.list_amount_minor) ?? numberOrUndefined(meta.list_amount_minor);
  if (listMinor !== undefined) fields.list_amount_minor = listMinor;
  const discountMinor =
    numberOrUndefined(row.discount_minor) ?? numberOrUndefined(meta.discount_minor);
  if (discountMinor !== undefined) fields.discount_minor = discountMinor;
  const locale = isLocale(row.locale) ? row.locale : isLocale(meta.locale) ? meta.locale : undefined;
  if (locale) fields.locale = locale;
  return fields;
}

type OrderClient = Pick<typeof supabaseAdmin, "from">;

export function createSupabaseOrderStore(
  client: OrderClient = supabaseAdmin,
): CheckoutDependencies["orders"] {
  // Set once an insert shows the currency/locale columns are missing, to skip the failing try.
  let legacyColumnsOnly = false;
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

        const currency = data.currency ?? "NOK";
        const locale = data.locale ?? "nb";
        const extended: Record<string, unknown> = {
          ...insert,
          currency,
          amount_minor: data.amount_minor ?? data.amount_nok * 100,
          locale,
        };
        if (data.discount_code && data.list_amount_minor != null) {
          extended.list_amount_minor = data.list_amount_minor;
          extended.discount_minor = data.discount_minor ?? 0;
        }

        const insertRow = async (row: Record<string, unknown>) =>
          client.from("orders").insert(row).select().single();

        let result = legacyColumnsOnly ? null : await insertRow(extended);
        if (!result || (result.error && isMissingCurrencyColumnError(result.error))) {
          // The currency/locale migration isn't applied yet: store the order exactly as before,
          // and keep currency/amount/language for non-default orders in the items metadata.
          legacyColumnsOnly = true;
          const legacy = { ...insert };
          if (currency !== "NOK" || locale !== "nb") {
            const meta: OrderMeta = { locale };
            if (currency !== "NOK") {
              meta.currency = currency;
              meta.amount_minor = extended.amount_minor as number;
              if (extended.list_amount_minor != null) {
                meta.list_amount_minor = extended.list_amount_minor as number;
                meta.discount_minor = extended.discount_minor as number;
              }
            }
            legacy.items = attachOrderMeta(insert.items as object[], meta);
          }
          result = await insertRow(legacy);
        }

        const { data: order, error } = result;
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
