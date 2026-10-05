# New catalog prices and 5-pack

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Charge Nick's new prices everywhere (UI, server-side Vipps/Stripe amounts, metadata and JSON-LD), drop fake comparison prices, and offer any 5 single planners for 99 kr.

**Architecture:** Keep catalog prices as the only source of truth. `priceCheckoutItems` already ignores client-sent amounts; extend it so every complete group of 5 singles costs `FIVE_PACK_PRICE` (99 kr) and leftover singles stay at `SINGLE_PRICE` (39 kr). Bundles (theme 149, komplett 249) are unchanged except for the komplett list price. Cart, kasse, email, and analytics read that same charged total. Do not add a purchasable `fem-pakke` bundle id — posting that id with no product list would fulfill nothing for 99 kr.

**Tech Stack:** Next.js App Router, existing Vipps/Stripe checkout, Supabase `orders`, node:test.

## Global Constraints

- All public copy stays Norwegian Bokmål. Do not invent reviews or testimonials.
- Do not change Vercel env vars, Vipps or Stripe keys, webhooks, or DNS.
- Do not complete a live paid checkout. Nothing is charged by the tests.
- Campaign/UTM tags and the one-press Vipps komplett button must keep working.
- No strikethrough, no fake "before" price, no "Spar 71%" badge.
- Theme/study packs stay 149 kr.
- Open a pull request against master. Do not merge.
- Do not print a PLAN or STATUS block in the user-facing summary.

## 5-pack choice

Automatic cart pricing, not a separate "velg 5" wizard.

- 1–4 singles: 39 kr each.
- Every 5 singles: 99 kr for that group. 6 singles = 138 kr. 10 singles = 198 kr.
- Theme packs and komplett stay fixed bundle prices and are not mixed into the 5-count.

Why this, not a selector: the cart already lets the buyer pick any singles, checkout already re-prices from ids, and fulfillment already uses those ids. A new bundle SKU would need chosen product ids or it could be paid without delivering five files. Applying 99 kr to *any* 5-or-more count would make 25 singles cheaper than komplett.

## File map

- Create: `plans/2026-10-05-new-prices.md` (this file)
- Modify: `STATE.md`
- Modify: `lib/products.ts` — 39 / 149 / 249, pricing constants, drop `originalPrice`
- Modify: `lib/checkout.ts` — 5-pack on `priceCheckoutItems`; email gets charged total
- Modify: `lib/cart-context.tsx` — cart total uses server pricing
- Modify: `lib/email.ts` — receipt total is the charged amount
- Modify: `lib/json-ld.ts` / `app/page.tsx` — Offer prices; 5-pack Offer
- Modify: `lib/catalog.ts`, `lib/faq.ts`, `lib/guides.ts` — stale price copy
- Modify: UI sections/cards/kasse/sticky bar — no strikethrough, new copy
- Modify: `app/api/orders/verify/route.ts`, `app/takk/page.tsx` — charged amount
- Modify: tests (`lib/checkout.test.ts`, `lib/seo.test.ts`, others)

---

### Task 1: Catalog prices and 5-pack math

**Files:**
- Modify: `lib/products.ts`
- Modify: `lib/checkout.ts`
- Test: `lib/checkout.test.ts`, `lib/seo.test.ts`

**Interfaces:**
- Produces: `SINGLE_PRICE` 39, `FIVE_PACK_SIZE` 5, `FIVE_PACK_PRICE` 99, `THEME_PACK_PRICE` 149, `KOMPLETT_PRICE` 249, `singlesAmountNok(count)`, `priceCheckoutItems` amount includes 5-pack

- [ ] **Step 1: Write failing tests** for catalog prices, 5-pack groups, forged client prices, theme+singles mix, and rejected unknown ids
- [ ] **Step 2: Run the new tests and confirm they fail**
- [ ] **Step 3: Update catalog and `priceCheckoutItems`**
- [ ] **Step 4: Run tests and confirm they pass**

---

### Task 2: Charge, cart, email, and analytics use the same total

**Files:**
- Modify: `lib/cart-context.tsx`
- Modify: `lib/email.ts`
- Modify: `lib/checkout.ts` mailer input
- Modify: `app/kasse/page.tsx`
- Modify: `components/ui/CartPanel.tsx`
- Modify: `app/api/orders/verify/route.ts`
- Modify: `app/takk/page.tsx`
- Test: `lib/checkout.test.ts`

- [ ] **Step 1: Write failing tests** that Vipps/Stripe `amountOre` for 5 singles is 9900 and komplett is 24900, including campaign-tagged one-press
- [ ] **Step 2: Confirm they fail if not already covered**
- [ ] **Step 3: Cart/kasse/email/takk read charged total; no originalPrice savings**
- [ ] **Step 4: Confirm one-press Vipps and UTM tags still work**

---

### Task 3: Remove fake anchors and fix site copy

**Files:**
- Modify: `components/ui/BundleCard.tsx`
- Modify: `components/sections/BundleShowcase.tsx`
- Modify: `components/sections/ProdukterStickyBar.tsx`
- Modify: `components/sections/Hero.tsx`
- Modify: `components/sections/HowItWorks.tsx`
- Modify: `components/sections/ProductGrid.tsx`
- Modify: `components/sections/Bundles.tsx`
- Modify: `components/sections/ProdukterCatalog.tsx`
- Modify: `lib/catalog.ts`, `lib/faq.ts`, `lib/guides.ts`, `lib/json-ld.ts`, `app/page.tsx`
- Test: `lib/seo.test.ts`

- [ ] **Step 1: Write failing source assertions** — no `line-through`, no `1225`, no `Spar 71%`, no `fra 79`
- [ ] **Step 2: Confirm they fail**
- [ ] **Step 3: Update copy and JSON-LD. OG images have no baked-in prices.**
- [ ] **Step 4: Confirm they pass**

---

### Task 4: Verify, commit, and open the PR

- [ ] **Step 1: Run the full test script and a production build**
- [ ] **Step 2: Browser-check home, /produkter, cart 5-pack, /kasse total, and one-press Vipps POST amount. Do not charge.**
- [ ] **Step 3: Update STATE.md and tick this plan**
- [ ] **Step 4: Commit, push, and open a draft PR. Do not merge.**
