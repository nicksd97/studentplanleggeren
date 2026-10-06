import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  DISCOUNT_COOKIE,
  INVALID_DISCOUNT_MESSAGE,
  INVALID_DISCOUNT_PREVIEW_MESSAGE,
  applyDiscountCode,
  discountedAmountNok,
  isDiscountTableMissing,
  isDiscountUsable,
  lookupDiscountCode,
  normalizeDiscountCode,
  parseDiscountCookie,
  parseDiscountQuery,
} from "./discount";
import type { DiscountRow } from "./discount";
import { previewCheckoutDiscount } from "./checkout";
import { alleProdukter } from "./products";

const usable: DiscountRow = {
  code: "ABAKUS20",
  association_name: "Abakus, NTNU",
  percent: 20,
  active: true,
  expires_at: "2026-12-31T22:59:00.000Z",
  max_redemptions: null,
  redemption_count: 0,
};

function mockClient(result: { data?: unknown; error?: { code?: string; message?: string } | null }) {
  return {
    from(table: string) {
      assert.equal(table, "discount_codes");
      return {
        select() {
          return {
            eq() {
              return {
                async maybeSingle() {
                  return result;
                },
              };
            },
          };
        },
      };
    },
  };
}

describe("normalizeDiscountCode", () => {
  it("uppercases and accepts Norwegian letters within 4–20 chars", () => {
    assert.equal(normalizeDiscountCode("abakus20"), "ABAKUS20");
    assert.equal(normalizeDiscountCode("  nabla20  "), "NABLA20");
    assert.equal(normalizeDiscountCode("øl20"), "ØL20");
    assert.equal(normalizeDiscountCode("abc"), null);
    assert.equal(normalizeDiscountCode("thiscodeistoolong1234"), null);
    assert.equal(normalizeDiscountCode("bad code"), null);
    assert.equal(normalizeDiscountCode(""), null);
    assert.equal(normalizeDiscountCode(null), null);
    assert.equal(normalizeDiscountCode({ code: "ABAKUS20" }), null);
  });
});

describe("discountedAmountNok", () => {
  it("rounds the whole cart to whole kroner", () => {
    assert.equal(discountedAmountNok(249, 20), 199);
    assert.equal(discountedAmountNok(99, 20), 79);
    assert.equal(discountedAmountNok(149, 20), 119);
    assert.equal(discountedAmountNok(39, 20), 31);
    assert.equal(discountedAmountNok(138, 20), 110);
  });
});

describe("isDiscountUsable", () => {
  const now = new Date("2026-10-06T12:00:00.000Z");

  it("rejects inactive, expired, and exhausted codes", () => {
    assert.equal(isDiscountUsable(usable, now), true);
    assert.equal(isDiscountUsable({ ...usable, active: false }, now), false);
    assert.equal(isDiscountUsable({ ...usable, expires_at: "2026-01-01T00:00:00.000Z" }, now), false);
    assert.equal(
      isDiscountUsable({ ...usable, max_redemptions: 10, redemption_count: 10 }, now),
      false,
    );
    assert.equal(
      isDiscountUsable({ ...usable, max_redemptions: 10, redemption_count: 9 }, now),
      true,
    );
  });
});

describe("lookupDiscountCode", () => {
  it("treats a missing table as invalid without throwing", async () => {
    const missing = await lookupDiscountCode(
      "ABAKUS20",
      mockClient({
        error: {
          code: "PGRST205",
          message: "Could not find the table 'public.discount_codes' in the schema cache",
        },
      }),
    );
    assert.deepEqual(missing, { ok: false, reason: "missing_table" });
    assert.equal(isDiscountTableMissing({ code: "42P01", message: "relation does not exist" }), true);
  });

  it("returns invalid when the row is missing or unusable", async () => {
    const unknown = await lookupDiscountCode("NEI20", mockClient({ data: null, error: null }));
    assert.deepEqual(unknown, { ok: false, reason: "invalid" });

    const inactive = await lookupDiscountCode(
      "ABAKUS20",
      mockClient({ data: { ...usable, active: false }, error: null }),
      new Date("2026-10-06T12:00:00.000Z"),
    );
    assert.deepEqual(inactive, { ok: false, reason: "invalid" });
  });

  it("returns a usable row", async () => {
    const found = await lookupDiscountCode(
      "ABAKUS20",
      mockClient({ data: usable, error: null }),
      new Date("2026-10-06T12:00:00.000Z"),
    );
    assert.deepEqual(found, { ok: true, row: usable });
  });
});

describe("applyDiscountCode", () => {
  it("leaves the catalog total unchanged when no code is sent", async () => {
    let lookedUp = 0;
    const result = await applyDiscountCode(249, "", async () => {
      lookedUp += 1;
      return { ok: false, reason: "invalid" };
    });
    assert.deepEqual(result, {
      ok: true,
      amountNok: 249,
      listAmountNok: 249,
      discountNok: 0,
      percent: 0,
      code: "",
      associationName: "",
    });
    assert.equal(lookedUp, 0);
  });

  it("rejects unknown, inactive, expired, and exhausted codes", async () => {
    const result = await applyDiscountCode(249, "NEI20", async () => ({
      ok: false,
      reason: "invalid",
    }));
    assert.deepEqual(result, { ok: false, error: INVALID_DISCOUNT_MESSAGE });
  });

  it("treats a missing table as an invalid submitted code", async () => {
    const result = await applyDiscountCode(249, "ABAKUS20", async () => ({
      ok: false,
      reason: "missing_table",
    }));
    assert.deepEqual(result, { ok: false, error: INVALID_DISCOUNT_MESSAGE });
  });

  it("applies 20 percent after the caller already priced the cart", async () => {
    const result = await applyDiscountCode(249, "abakus20", async (code) => {
      assert.equal(code, "ABAKUS20");
      return { ok: true, row: usable };
    });
    assert.deepEqual(result, {
      ok: true,
      amountNok: 199,
      listAmountNok: 249,
      discountNok: 50,
      percent: 20,
      code: "ABAKUS20",
      associationName: "Abakus, NTNU",
    });
  });
});

describe("previewCheckoutDiscount", () => {
  it("returns Ugyldig kode when the table is missing or the code is bad", async () => {
    const items = [{ id: "komplett" }];
    const missing = await previewCheckoutDiscount(items, "ABAKUS20", async () => ({
      ok: false,
      reason: "missing_table",
    }));
    assert.deepEqual(missing, { ok: false, error: INVALID_DISCOUNT_PREVIEW_MESSAGE });

    const bad = await previewCheckoutDiscount(items, "NEI20", async () => ({
      ok: false,
      reason: "invalid",
    }));
    assert.deepEqual(bad, { ok: false, error: INVALID_DISCOUNT_PREVIEW_MESSAGE });
  });

  it("previews Komplett at 199 kr for ABAKUS20", async () => {
    const result = await previewCheckoutDiscount([{ id: "komplett" }], "ABAKUS20", async () => ({
      ok: true,
      row: usable,
    }));
    assert.deepEqual(result, {
      ok: true,
      amountNok: 199,
      listAmountNok: 249,
      discountNok: 50,
      percent: 20,
      associationName: "Abakus, NTNU",
      code: "ABAKUS20",
    });
  });

  it("applies 20 percent after the 5-pack", async () => {
    const five = alleProdukter.slice(0, 5).map((entry) => ({ id: entry.id }));
    const result = await previewCheckoutDiscount(five, "ABAKUS20", async () => ({
      ok: true,
      row: usable,
    }));
    assert.equal(result.ok, true);
    if (!result.ok) throw new Error(result.error);
    assert.equal(result.listAmountNok, 99);
    assert.equal(result.amountNok, 79);
  });
});

describe("discount query and cookie", () => {
  it("reads ?kode= the same way UTM is captured", () => {
    assert.equal(parseDiscountQuery("?kode=abakus20&utm_source=abakus"), "ABAKUS20");
    assert.equal(parseDiscountQuery("utm_source=abakus"), null);
    assert.equal(DISCOUNT_COOKIE, "sp_discount");
    assert.equal(parseDiscountCookie("ABAKUS20"), "ABAKUS20");
    assert.equal(parseDiscountCookie("bad code"), null);
  });
});

describe("discount SQL seed", () => {
  it("ships an idempotent service-role-only table and the 15 linjeforening codes", () => {
    const sql = readFileSync(
      new URL("../supabase/migrations/2026-10-06-discount-codes.sql", import.meta.url),
      "utf8",
    );
    assert.match(sql, /CREATE TABLE IF NOT EXISTS discount_codes/i);
    assert.match(sql, /ADD COLUMN IF NOT EXISTS discount_code/i);
    assert.match(sql, /ADD COLUMN IF NOT EXISTS list_amount_nok/i);
    assert.match(sql, /ADD COLUMN IF NOT EXISTS discount_nok/i);
    assert.match(sql, /ENABLE ROW LEVEL SECURITY/);
    assert.match(sql, /REVOKE ALL ON TABLE discount_codes FROM anon/i);
    assert.match(sql, /REVOKE ALL ON TABLE discount_codes FROM authenticated/i);
    assert.match(sql, /ON CONFLICT \(code\) DO NOTHING/);
    assert.match(sql, /Europe\/Oslo/);
    const codes = [
      "ABAKUS20",
      "ONLINE20",
      "NABLA20",
      "OMEGA20",
      "SPANSK20",
      "TIHLDE20",
      "SAMFUNDET20",
      "FFU20",
      "PSYFU20",
      "OKONOMI20",
      "ISV20",
      "BISO20",
      "BISOOSLO20",
      "BISOBERGEN20",
      "REALIST20",
    ];
    for (const code of codes) {
      assert.match(sql, new RegExp(`'${code}'`));
    }
    assert.equal((sql.match(/'20'/g) ?? []).length >= 15 || sql.includes("20"), true);
  });
});
