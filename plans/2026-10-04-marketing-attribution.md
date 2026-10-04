# Marketing attribution for free channels

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A visitor who arrives with `utm_source`, `utm_medium`, `utm_campaign`, and `utm_content` keeps those values through browsing and through one-press Vipps or `/kasse` card checkout, and the same tags stay on the order from pending insert through profile fill and paid.

**Architecture:** Capture tags from the landing URL into a first-party cookie and `sessionStorage`. The Vipps button and `/kasse` send the stored tags to `POST /api/orders`. Persist them on the existing Supabase `orders.items` JSONB (first line-item extra keys) so no new column or paid database is required. `updateBuyerDetails` only patches name/email and must not wipe tags. If `NEXT_PUBLIC_GA_MEASUREMENT_ID` is already set, record a purchase when the order is actually paid; if it is missing, do nothing and do not block checkout.

**Tech Stack:** Next.js 16 App Router, existing Supabase `orders` table, Vipps one-press buy, Stripe `/kasse`, node:test.

## Global Constraints

- Do not change prices, product ids, payment credentials, or the Vipps-first checkout.
- Do not invent a source. Untagged visits stay valid with empty tags.
- Do not add a new paid database plan. Do not add `orders` columns that would break the live insert.
- Do not create a Google account or print any key. Do not add a fake measurement id.
- Do not complete a live paid checkout. Nothing is charged by the tests.
- Open a pull request. Do not merge it.
- Do not print a PLAN or STATUS block in the user-facing summary.

## Evidence already collected

- Live one-press CTA (`KomplettVippsButton`) POSTs only `{ items: [completePackageCartItem()], paymentProvider: "vipps" }`. Campaign query params never leave the landing URL.
- `/kasse` `handlePayment` POSTs name, email, cart, and provider. No UTM fields.
- `scripts/schema.sql` and `createSupabaseOrderStore` insert `email`, `first_name`, `last_name`, `items`, `amount_nok`, `payment_provider`, `payment_id`, `payment_status`, `download_token`, `token_expires_at`. There is no `utm_*` column. Adding one would 42703 the live insert (same class of failure that blocked a phone column).
- `items` is already JSONB. Extra keys on a catalog line item survive `updateBuyerDetails` (name/email only) and `completeIfPending` (`payment_status` only). Paid orders are countable later with `items->0->>'utm_source'` where `payment_status = 'completed'`.
- Vercel project env names include Stripe, Vipps, Resend, and Supabase. There is no Google Analytics measurement id. Search Console traffic stays untagged unless a campaign param is present.

## File map

- Create: `plans/2026-10-04-marketing-attribution.md` (this file)
- Modify: `STATE.md`
- Create: `lib/attribution.ts` — parse, persist, attach, extract; never invent a source
- Create: `lib/attribution.test.ts`
- Create: `lib/analytics.ts` — optional paid purchase ping; no-op without a measurement id
- Create: `components/analytics/CampaignCapture.tsx`
- Create: `components/analytics/GoogleAnalytics.tsx`
- Modify: `app/layout.tsx`
- Modify: `components/ui/KomplettVippsButton.tsx`
- Modify: `app/kasse/page.tsx`
- Modify: `app/api/orders/route.ts`
- Modify: `lib/checkout.ts` — accept tags on start; keep them through confirm
- Modify: `lib/order-store.ts` — write tags onto `items[0]`, never as unknown columns
- Modify: `lib/checkout-server.ts` — optional analytics hook
- Modify: `app/takk/page.tsx` — client purchase event only when paid and an id exists
- Modify: `lib/checkout.test.ts`
- Modify: `lib/order-store.test.ts`
- Modify: `package.json` test script

---

### Task 1: Parse and persist campaign tags

**Files:**
- Create: `lib/attribution.ts`
- Create: `lib/attribution.test.ts`
- Test: `lib/attribution.test.ts`

**Interfaces:**
- Produces: `CampaignTags`, `parseCampaignTags(input)`, `mergeCampaignTags(incoming, stored)`, `attachCampaignTags(items, tags)`, `campaignTagsFromItems(items)`, `campaignCookieValue(tags)`, `parseCampaignCookie(value)`

- [x] **Step 1: Write the failing tests**

```ts
it("keeps only present utm fields and does not invent a source", () => {
  assert.deepEqual(
    parseCampaignTags({
      utm_source: "instagram",
      utm_medium: "social",
      utm_campaign: "komplett",
      utm_content: "bio",
    }),
    {
      utm_source: "instagram",
      utm_medium: "social",
      utm_campaign: "komplett",
      utm_content: "bio",
    },
  );
  assert.equal(parseCampaignTags({}), null);
  assert.equal(parseCampaignTags({ utm_source: "  " }), null);
  assert.equal(parseCampaignTags({ source: "google" }), null);
});

it("prefers a new tagged landing URL and otherwise keeps stored tags", () => {
  const stored = parseCampaignTags({ utm_source: "instagram", utm_medium: "social" });
  assert.deepEqual(
    mergeCampaignTags(parseCampaignTags({ utm_source: "tiktok", utm_medium: "social" }), stored),
    { utm_source: "tiktok", utm_medium: "social" },
  );
  assert.deepEqual(mergeCampaignTags(null, stored), stored);
});
```

- [x] **Step 2: Run the new tests and confirm they fail**
- [x] **Step 3: Implement parse/merge/attach/extract without inventing a source**
- [x] **Step 4: Run tests and confirm they pass**

---

### Task 2: Store tags on the pending order and keep them through profile fill

**Files:**
- Modify: `lib/checkout.ts`
- Modify: `lib/order-store.ts`
- Modify: `app/api/orders/route.ts`
- Test: `lib/checkout.test.ts`, `lib/order-store.test.ts`

**Interfaces:**
- Consumes: `parseCampaignTags`, `attachCampaignTags`
- Produces: `StartCheckoutInput.campaign`; pending insert writes tags onto `items[0]`; `updateBuyerDetails` does not clear them

- [x] **Step 1: Write the failing tests**

Vipps one-press with Instagram tags stores them on the pending `komplett` order. Completing the order after `userDetails` arrive keeps the same tags. Stripe `/kasse` start stores the same tags. An untagged start has no `utm_source`. The PostgREST insert body has no top-level `utm_*` column.

- [x] **Step 2: Run the new tests and confirm they fail**
- [x] **Step 3: Thread tags through start, insert, and confirm**
- [x] **Step 4: Run tests and confirm they pass**

---

### Task 3: Keep tags in the browser and send them with Vipps and card

**Files:**
- Create: `components/analytics/CampaignCapture.tsx`
- Modify: `app/layout.tsx`
- Modify: `components/ui/KomplettVippsButton.tsx`
- Modify: `app/kasse/page.tsx`
- Test: `lib/checkout.test.ts` source assertions

**Interfaces:**
- Consumes: landing `?utm_*`, cookie `sp_campaign`, `sessionStorage`
- Produces: POST body `campaign` plus cookie fallback in the orders route

- [x] **Step 1: Write source tests that the Vipps button and `/kasse` send stored tags and still omit name/email on one-press**
- [x] **Step 2: Confirm they fail**
- [x] **Step 3: Capture on layout; send from both checkout entry points**
- [x] **Step 4: Confirm one-press stays Vipps-orange and `/kasse` card stays secondary**

---

### Task 4: Record a paid purchase only if a measurement id already exists

**Files:**
- Create: `lib/analytics.ts`
- Create: `components/analytics/GoogleAnalytics.tsx`
- Modify: `lib/checkout.ts` / `lib/checkout-server.ts`
- Modify: `app/layout.tsx`
- Modify: `app/takk/page.tsx`
- Test: `lib/checkout.test.ts`

**Interfaces:**
- Consumes: `process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID` if present
- Produces: `recordPaidPurchase(order)` after `completeIfPending`; no-op and no throw when the id is missing

- [x] **Step 1: Write failing tests for paid-only recording with the same source, and for a no-op when no id is configured**
- [x] **Step 2: Confirm they fail**
- [x] **Step 3: Wire the optional hook. Do not add a fake id.**
- [x] **Step 4: Confirm unpaid and untagged paths still succeed**

---

### Task 5: Verify, commit, and open the PR

- [x] **Step 1: Run the full test script and a production build**
- [x] **Step 2: Browser-check a tagged landing → Vipps POST and an untagged `/kasse` card POST. Do not charge.**
- [x] **Step 3: Update STATE.md and tick this plan**
- [x] **Step 4: Commit, push, and open a draft PR. Do not merge.**
