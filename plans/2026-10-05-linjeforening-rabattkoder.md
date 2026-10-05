# Linjeforening 20 % rabattkoder

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Do not start this plan until Nick says go.** This file is the spec. No feature code in the plan PR.

**Goal:** Let a linjeforening member enter a code such as `ABAKUS20` at checkout so Vipps and Stripe charge 20 % off the **server-priced** cart (after the automatic 5-pack), store the code on the order next to existing UTM tags, and show the discount on the receipt mail.

**Architecture:** Keep `priceCheckoutItems` in `lib/checkout.ts` as the only catalog math (client `amountNok` stays ignored). Add `applyDiscountCode` that looks up a row in a new Supabase `discount_codes` table and returns a new integer `amountNok`. `startCheckoutPayment` re-validates the code on every start; the `/kasse` field is preview-only. Persist `discount_code`, `list_amount_nok`, and `discount_nok` on `orders` without removing UTM-on-items.

**Tech Stack:** Next.js 16 App Router, existing Vipps/Stripe checkout, Supabase (`orders` + new `discount_codes`), node:test.

## Global Constraints

- All public copy stays Norwegian Bokmål. Do not invent reviews or testimonials.
- Catalog list prices stay 39 / 99 / 149 / 249. Do not change `productFileMap` or paid PDF paths.
- Charge amount is computed only on the server. Never trust a client price or a client “code is valid” flag.
- No fake comparison prices, no strikethrough, no “Spar X %” badges on catalog pages.
- Paid PDFs live in Supabase `products` at `planners/<slug>.pdf` (all 25 uploaded). Do not give away the commercial ukeplan as a lead.
- Open a pull request against `master`. Do not merge.
- Do not print a PLAN or STATUS block in the user-facing summary.

## Recommended defaults (Nick can override before go)

| Topic | Recommendation |
|---|---|
| What 20 % applies to | The **whole cart** after 5-pack math (singles, theme packs, Komplett). One code works everywhere. |
| Rounding | Whole kroner: `Math.round(listAmountNok * (100 - percent) / 100)`. `orders.amount_nok` is already `INTEGER`. Komplett 249 → **199**. 5-pack 99 → **79**. Theme 149 → **119**. Single 39 → **31**. |
| Code format | Stored uppercase. Match case-insensitive. Pattern `^[A-ZÆØÅ0-9]{4,20}$` after normalize. Example `ABAKUS20`. |
| Where codes live | Supabase table `discount_codes`. Nick adds rows in the dashboard — **no deploy**. |
| One-press Vipps | Read `?kode=` (same as UTM capture) into a cookie, send it with `KomplettVippsButton`. Empty code = full 249. |
| Invalid code at pay | **Reject** the checkout (400). Do not silently charge full price if a code was sent. |
| Usage cap | Increment `redemption_count` only when payment becomes `completed`, not on pending. |
| Papirmaler mismatch | **Copy fix in a later PR**, do not invent 12 paper PDFs in this build. See investigation below. |

## File map

- Create: `plans/2026-10-05-linjeforening-rabattkoder.md` (this file)
- Create: `scripts/discount-codes.sql` — table + `orders` columns + index
- Create: `lib/discount.ts` — normalize, lookup, apply percent, safe path
- Create: `lib/discount.test.ts`
- Modify: `STATE.md`
- Modify: `lib/checkout.ts` — `StartCheckoutInput.discountCode`; priced result includes list/discount; `amountOre` from discounted `amountNok`
- Modify: `lib/checkout-server.ts` — pass through only (pricing stays in `lib/checkout.ts`)
- Modify: `lib/order-store.ts` — insert/select `discount_code`, `list_amount_nok`, `discount_nok`
- Modify: `lib/email.ts` — receipt line for code + kroner off
- Modify: `app/api/orders/route.ts` — read `body.discountCode` + cookie
- Create: `app/api/rabattkode/route.ts` — preview validate (same lookup, no increment)
- Modify: `app/kasse/page.tsx` — code field + Bokmål valid/invalid + totalt uses preview
- Modify: `components/ui/KomplettVippsButton.tsx` — send stored code
- Modify: `components/analytics/CampaignCapture.tsx` or a sibling `DiscountCapture` — persist `?kode=`
- Modify: `lib/checkout.test.ts`, `lib/order-store.test.ts`, `lib/email.test.ts`
- Do **not** modify `lib/product-files.ts` or catalog list prices

## Why a table, not env/config

Env JSON (`DISCOUNT_CODES=ABAKUS20,ONLINE20`) needs a Vercel env edit and a new deployment to add a forening. A Supabase table lets Nick add `ABAKUS20` in Table Editor in under a minute.

Do not put codes in git. Do not hardcode association names in the app except as seed SQL Nick reviews.

## Schema

Add to `scripts/schema.sql` and ship `scripts/discount-codes.sql` for Nick to run in the SQL editor:

```sql
CREATE TABLE IF NOT EXISTS discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  association_name text NOT NULL,
  percent integer NOT NULL DEFAULT 20 CHECK (percent > 0 AND percent <= 90),
  active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  max_redemptions integer,
  redemption_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes (code);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_code text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS list_amount_nok integer;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_nok integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_orders_discount_code ON orders (discount_code);
```

Nick adds a code without a deploy:

1. Supabase → Table Editor → `discount_codes` → Insert.
2. `code`: `ABAKUS20` (uppercase).
3. `association_name`: `Abakus`.
4. `percent`: `20`.
5. `active`: true.
6. Optional `expires_at`, `max_redemptions`.

Reporting sales per linjeforening: `select discount_code, count(*), sum(amount_nok) from orders where payment_status = 'completed' group by 1;` UTM columns stay on `items` JSON as today (`attachCampaignTags`). Both can be set on the same order (`utm_source=abakus` + `discount_code=ABAKUS20`).

## Pricing algorithm

1. `priced = priceCheckoutItems(items)` — unchanged catalog + 5-pack.
2. If no code: `amountNok = priced.amountNok`, `discount_nok = 0`, `list_amount_nok = priced.amountNok`.
3. If code: `lookupDiscountCode(normalized)`. Invalid / inactive / expired / `redemption_count >= max_redemptions` → error `Ugyldig eller utløpt rabattkode`.
4. `amountNok = Math.round(priced.amountNok * (100 - row.percent) / 100)`.
5. `discount_nok = priced.amountNok - amountNok`.
6. `amountOre = amountNok * 100` for Vipps and Stripe.
7. Confirm paths already compare provider amount to `order.amount_nok` — they keep working if insert stored the discounted total.

Example: Komplett list 249, `ABAKUS20` → charge 19900 øre. Five singles list 99 → charge 7900 øre. Forged client `amountNok: 1` still ignored.

## Checkout UI (Bokmål)

On `/kasse` order summary, above Totalt:

- Label: `Rabattkode`
- Placeholder: `f.eks. ABAKUS20`
- Button: `Bruk`
- Valid: `Kode ABAKUS20 er aktiv — 20 % for Abakus. Du betaler 199 kr.`
- Invalid: `Ugyldig eller utløpt rabattkode.`
- Totalt line shows the **discounted** integer only. Optional second line `Katalogpris 249 kr` in muted text — **no** `line-through`.

Do not show the code field on catalog pages. Do not advertise a public “studentrabatt” on `/` unless Nick asks later.

## One-press Vipps

`KomplettVippsButton` has no form today. Capture `kode` from the query string the same way UTM is captured (`CampaignCapture` + cookie `sp_campaign`). Add `sp_discount` cookie (max 20 chars, normalized). Button POST body includes `discountCode: currentDiscountCode()`.

Ambassador link example: `https://www.studentplanlegger.no/?utm_source=abakus&utm_medium=linjeforening&utm_campaign=komplett&kode=ABAKUS20`

## Mail

`sendOrderConfirmation` already takes `amountNok`. When `discountNok > 0`, add before Totalt:

`Rabatt ABAKUS20 (−20 %) — −50 kr`

Then `Totalt — 199 kr`. No strikethrough. Extend the mailer input; checkout tests already record `amountNok`.

## Tests (must fail first)

- Unknown / inactive / expired / exhausted code → error, full-price path unused
- `abakus20` equals `ABAKUS20`
- Komplett + 20 % → Vipps and Stripe `amountOre === 19900`
- Five singles + 20 % → `7900` (5-pack first, then 20 %)
- Theme 149 + 20 % → `11900`
- Client `amountNok: 1` + valid code still charges the server discount of catalog, not 1
- Invalid code + items → 400, no Vipps/Stripe session
- Empty code → current 249 / 99 / 39 behavior
- `insertPending` body contains `discount_code`, `list_amount_nok`, `discount_nok` and still attaches UTM on `items[0]`
- Email HTML contains `ABAKUS20` and the charged total
- No new `line-through` in `app/kasse/page.tsx`

## Investigation: Komplett vs “12 papirmaler” (do not change in the discount build)

`bundleFileMap.komplett` is `Object.values(productFileMap).flat()` — **25 planner PDFs only**. There is no paper-template path, no dotted/grid/line SKU, and no calendar extra. After purchase, `/takk` lists whatever `getFilesForItems` returns, so a Komplett buyer gets 25 files, not 37.

The site **promises more than it delivers** in these exact places:

| Location | Copy |
|---|---|
| `lib/products.ts` Komplett `description` | `Alle 25 planleggere + 12 papirmaler. …` — also used as JSON-LD Product description |
| `lib/faq.ts` “Hva er inkludert i den komplette pakken?” | `… pluss 12 papirmaler (prikket, rutenett og linjert i ulike størrelser).` — also FAQPage JSON-LD on `/` |
| `components/sections/BundleShowcase.tsx` `includes` | `"12 papirmaler"` |
| `components/ui/BundleCard.tsx` featured checklist | `"12 papirmaler"` |
| `components/sections/ProdukterStickyBar.tsx` | `Alle 25 fyllbare PDF-er + 12 papirmaler` |

Not a false 12-template claim (print, not a bonus SKU):

- `components/sections/DeviceShowcase.tsx` — “skriv ut på papir”
- `lib/faq.ts` — “Kan jeg skrive ut planleggerne?”
- `lib/guides.ts` / Vane Tracker — “rutenett” as the habit-tracker layout

**Proposed fix (later PR, pick one):**

1. **Recommended:** Drop the 12-papirmaler claim everywhere above. Komplett = 25 fyllbare planleggere. Update FAQ + JSON-LD in the same PR so Google stops repeating the extra 12.
2. Only if Nick actually has 12 paper PDFs: upload to `products/planners/` (or `products/paper/`) and add them to `bundleFileMap.komplett` — never invent files.

Do **not** mix that copy/file change into the discount-code implementation unless Nick explicitly says to.

---

### Task 0: Nick before go

- [ ] Confirm or override the defaults table (whole-cart 20 %, `Math.round`, `?kode=` on one-press).
- [ ] Send the first code list (`code` + `association_name`). Do not invent foreninger.
- [ ] Run `scripts/discount-codes.sql` on production Supabase after the feature PR exists.
- [ ] Decide papirmaler follow-up: copy-only (recommended) vs deliver real PDFs.

---

### Task 1: Discount math and lookup (pure)

**Files:**
- Create: `lib/discount.ts`, `lib/discount.test.ts`
- Modify: `package.json` `test` script

**Interfaces:**
- `normalizeDiscountCode(input: unknown): string | null`
- `discountedAmountNok(listAmountNok: number, percent: number): number` — `Math.round`
- `isDiscountUsable(row, now): boolean` — active, not expired, under cap
- Lookup takes a client (`from("discount_codes")`) so tests mock it

- [ ] **Step 1: Write failing tests** for normalize, 249→199, 99→79, 39→31, 149→119, inactive/expired/exhausted
- [ ] **Step 2: Confirm they fail**
- [ ] **Step 3: Implement `lib/discount.ts`**
- [ ] **Step 4: `npm test` green for the new file**
- [ ] **Step 5: Commit** `feat: discount code normalize and 20 percent math`

---

### Task 2: Server checkout charges the discounted øre

**Files:**
- Modify: `lib/checkout.ts` — `StartCheckoutInput.discountCode?: string`; after `priceCheckoutItems`, apply lookup; store list/discount on the pending order
- Modify: `lib/checkout.test.ts`
- Modify: `lib/order-store.ts` / `lib/order-store.test.ts` — persist the three new columns
- Create: `scripts/discount-codes.sql`

`CheckoutDependencies.discounts.lookup(code)` (or pass a function) so tests do not hit Supabase.

- [ ] **Step 1: Failing tests** — Komplett+ABAKUS20 Vipps/Stripe 19900; five singles 7900; forged client price ignored; bad code 400; UTM still on items
- [ ] **Step 2: Confirm they fail**
- [ ] **Step 3: Wire apply + insert columns**
- [ ] **Step 4: Increment `redemption_count` in `completeIfPending` (or a dedicated store method called after successful confirm). Failure to increment must not block download/email.**
- [ ] **Step 5: Tests green. Commit** `feat: charge linjeforening discount on Vipps and Stripe`

---

### Task 3: `/kasse` field, preview API, one-press `?kode=`

**Files:**
- Create: `app/api/rabattkode/route.ts`
- Modify: `app/kasse/page.tsx`, `app/api/orders/route.ts`, `components/ui/KomplettVippsButton.tsx`
- Create or modify capture helper next to `lib/attribution.ts` (`DISCOUNT_COOKIE = "sp_discount"`)

Preview POST `{ code, items }` → `{ ok: true, amountNok, listAmountNok, discountNok, percent, associationName }` or `{ ok: false, error }`. Checkout POST still looks up the code itself.

- [ ] **Step 1: Add the kasse field and Bokmål messages (no strikethrough)**
- [ ] **Step 2: Persist `?kode=` and send it from one-press Vipps**
- [ ] **Step 3: Commit** `feat: checkout rabattkode field and kode query capture`

---

### Task 4: Order mail

**Files:**
- Modify: `lib/email.ts`, `lib/email.test.ts`
- Modify: mailer call sites in `lib/checkout.ts` to pass `{ amountNok, discountCode, discountNok }`

- [ ] **Step 1: Failing source-scan / unit test for ABAKUS20 and charged total**
- [ ] **Step 2: Implement the extra receipt line**
- [ ] **Step 3: Commit** `feat: show linjeforening discount on order email`

---

### Task 5: Manual test (no live charge unless Nick asks)

- [ ] `npm test` and `next build`
- [ ] Seed one code in local/preview Supabase
- [ ] `/kasse` with Komplett: invalid code message; valid code totalt 199; Vipps POST `amountOre: 19900`
- [ ] Five singles + code → 79; six singles list 138 → `Math.round(138 * 0.8) = 110`
- [ ] One-press with `?kode=ABAKUS20` → 19900; without code → 24900
- [ ] Completed order has `discount_code` + UTM tags; mail shows the discount
- [ ] `git diff` has no `line-through` and no catalog price edits
- [ ] Papirmaler copy still unchanged unless Nick added that follow-up

## Out of scope

- Changing 39 / 99 / 149 / 249 list prices
- Stripe Coupons / Vipps native promo APIs
- Public homepage “studentrabatt” campaign
- Inventing paper-template PDFs
- Facebook / TikTok / ambassadør outreach
- Merging without Nick’s go
