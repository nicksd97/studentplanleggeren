import { supabaseAdmin } from "./supabase";

export const DISCOUNT_COOKIE = "sp_discount";
export const DISCOUNT_STORAGE_KEY = "sp_discount";
export const INVALID_DISCOUNT_MESSAGE = "Ugyldig eller utløpt rabattkode";
export const INVALID_DISCOUNT_PREVIEW_MESSAGE = "Ugyldig kode";

const CODE_PATTERN = /^[A-ZÆØÅ0-9]{4,20}$/;

export type DiscountRow = {
  code: string;
  association_name: string;
  percent: number;
  active: boolean;
  expires_at: string | null;
  max_redemptions: number | null;
  redemption_count: number;
};

export type DiscountLookup =
  | { ok: true; row: DiscountRow }
  | { ok: false; reason: "invalid" | "missing_table" };

export type AppliedDiscount = {
  ok: true;
  amountNok: number;
  listAmountNok: number;
  discountNok: number;
  percent: number;
  code: string;
  associationName: string;
};

export type ApplyDiscountResult = AppliedDiscount | { ok: false; error: string };

export type DiscountClient = {
  from(table: string): {
    select(columns?: string): {
      eq(column: string, value: string): {
        maybeSingle(): Promise<{ data: unknown; error: unknown }>;
      };
    };
    update(values: Record<string, unknown>): {
      eq(column: string, value: string): PromiseLike<{ data: unknown; error: unknown }>;
    };
  };
};

export type DiscountStore = {
  lookup(code: string, now?: Date): Promise<DiscountLookup>;
  incrementRedemption(code: string): Promise<void>;
};

export function normalizeDiscountCode(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const normalized = input.trim().toUpperCase();
  return CODE_PATTERN.test(normalized) ? normalized : null;
}

export function discountedAmountNok(listAmountNok: number, percent: number): number {
  return Math.round((listAmountNok * (100 - percent)) / 100);
}

export function isDiscountUsable(row: DiscountRow, now: Date): boolean {
  if (!row.active) return false;
  if (row.expires_at && now.getTime() > new Date(row.expires_at).getTime()) {
    return false;
  }
  if (row.max_redemptions != null && row.redemption_count >= row.max_redemptions) {
    return false;
  }
  return true;
}

export function isDiscountTableMissing(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const value = error as { code?: unknown; message?: unknown; details?: unknown; hint?: unknown };
  const code = typeof value.code === "string" ? value.code : "";
  const text = [value.message, value.details, value.hint]
    .filter((part): part is string => typeof part === "string")
    .join(" ");
  if (code === "42P01" || code === "PGRST205") return true;
  return /discount_codes/i.test(text) && /does not exist|not find the table|schema cache/i.test(text);
}

export async function lookupDiscountCode(
  code: string,
  client: DiscountClient,
  now: Date = new Date(),
): Promise<DiscountLookup> {
  try {
    const { data, error } = await client
      .from("discount_codes")
      .select("code, association_name, percent, active, expires_at, max_redemptions, redemption_count")
      .eq("code", code)
      .maybeSingle();

    if (error) {
      return { ok: false, reason: isDiscountTableMissing(error) ? "missing_table" : "invalid" };
    }
    if (!data || typeof data !== "object") {
      return { ok: false, reason: "invalid" };
    }
    const row = data as DiscountRow;
    if (!isDiscountUsable(row, now)) {
      return { ok: false, reason: "invalid" };
    }
    return { ok: true, row };
  } catch (error) {
    return { ok: false, reason: isDiscountTableMissing(error) ? "missing_table" : "invalid" };
  }
}

export async function applyDiscountCode(
  listAmountNok: number,
  rawCode: unknown,
  lookup: (code: string) => Promise<DiscountLookup>,
): Promise<ApplyDiscountResult> {
  const submitted = typeof rawCode === "string" ? rawCode.trim() : rawCode;
  if (submitted == null || submitted === "") {
    return {
      ok: true,
      amountNok: listAmountNok,
      listAmountNok,
      discountNok: 0,
      percent: 0,
      code: "",
      associationName: "",
    };
  }

  const code = normalizeDiscountCode(rawCode);
  if (!code) {
    return { ok: false, error: INVALID_DISCOUNT_MESSAGE };
  }

  const found = await lookup(code);
  if (!found.ok) {
    return { ok: false, error: INVALID_DISCOUNT_MESSAGE };
  }

  const amountNok = discountedAmountNok(listAmountNok, found.row.percent);
  return {
    ok: true,
    amountNok,
    listAmountNok,
    discountNok: listAmountNok - amountNok,
    percent: found.row.percent,
    code: found.row.code,
    associationName: found.row.association_name,
  };
}

export function parseDiscountQuery(input: string | URLSearchParams): string | null {
  const params =
    typeof input === "string"
      ? new URLSearchParams(input.startsWith("?") ? input.slice(1) : input)
      : input;
  return normalizeDiscountCode(params.get("kode"));
}

export function parseDiscountCookie(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return normalizeDiscountCode(decodeURIComponent(value));
  } catch {
    return normalizeDiscountCode(value);
  }
}

export function rememberDiscountCode(code: string): void {
  const normalized = normalizeDiscountCode(code);
  if (!normalized) return;
  try {
    window.sessionStorage.setItem(DISCOUNT_STORAGE_KEY, normalized);
  } catch {
    // Private mode can block storage; the cookie is enough for this visit.
  }
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${DISCOUNT_COOKIE}=${encodeURIComponent(normalized)}; Path=/; Max-Age=2592000; SameSite=Lax${secure}`;
}

export function readStoredDiscountCode(): string | null {
  try {
    const stored = parseDiscountCookie(window.sessionStorage.getItem(DISCOUNT_STORAGE_KEY));
    if (stored) return stored;
  } catch {
    // Fall through to the cookie.
  }
  try {
    const cookie = document.cookie
      .split("; ")
      .find((part) => part.startsWith(`${DISCOUNT_COOKIE}=`));
    if (!cookie) return null;
    return parseDiscountCookie(cookie.slice(DISCOUNT_COOKIE.length + 1));
  } catch {
    return null;
  }
}

export function currentDiscountCode(): string | null {
  try {
    return parseDiscountQuery(window.location.search) ?? readStoredDiscountCode();
  } catch {
    try {
      return parseDiscountQuery(window.location.search);
    } catch {
      return null;
    }
  }
}

export function createSupabaseDiscountStore(
  client: DiscountClient = supabaseAdmin as unknown as DiscountClient,
): DiscountStore {
  return {
    lookup(code, now) {
      return lookupDiscountCode(code, client, now);
    },
    async incrementRedemption(code) {
      try {
        const { data, error } = await client
          .from("discount_codes")
          .select("redemption_count")
          .eq("code", code)
          .maybeSingle();
        if (error || !data || typeof data !== "object") return;
        const current = (data as { redemption_count?: number }).redemption_count ?? 0;
        await client
          .from("discount_codes")
          .update({ redemption_count: current + 1 })
          .eq("code", code);
      } catch {
        // Never block download or mail.
      }
    },
  };
}
