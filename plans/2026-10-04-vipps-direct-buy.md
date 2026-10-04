# Vipps direct buy for komplett pakke

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** One press on the full-package button starts Vipps for `komplett` (349 kr) without a name/email form, then the pending order is filled from the buyer details Vipps actually returns.

**Architecture:** Keep charge-then-fulfill. Vipps `insertPending` may run with empty customer fields. `createPayment` requests `profile.scope` of `name email phoneNumber`. After AUTHORIZED, `GET /epayment/v1/payments/{reference}` `userDetails` is copied onto the order. Stripe on `/kasse` stays a working secondary option and still requires the form.

**Tech Stack:** Next.js 16 App Router, Vipps ePayment profile sharing, Stripe Checkout, node:test.

## Global Constraints

- Do not change prices, product ids, or payment credentials.
- Do not print secrets or env values.
- Do not invent customer data. Empty pending fields are placeholders, not fake buyers.
- Do not mark an order paid or send a download email unless Vipps or Stripe confirms the charge.
- Do not complete a live paid checkout on production.
- Open a pull request. Do not merge it.
- Do not print a PLAN or STATUS block in the user-facing summary.

## Evidence already collected

- Header `Kjøp komplett pakke` calls `addItem(completePackageCartItem())` then `router.push("/kasse")`.
- Bundle showcase and featured `BundleCard` add `komplett` to the cart only.
- `startCheckoutPayment` returns 400 `Mangler påkrevde felt` unless email and first name are present, for both Vipps and Stripe.
- `/kasse` validates fornavn, etternavn, epost, and epostBekreft before either provider.
- Official Vipps profile sharing (retrieved 4 Oct 2026): request `profile.scope`, then read `userDetails` (`email`, `firstName`, `lastName`, `mobileNumber`) from `GET /epayment/v1/payments/{reference}` after authorize. A separate Userinfo call is not required for a normal purchase.
- `orders` has `email`, `first_name`, `last_name` as `TEXT NOT NULL`. There is no phone column. Persist name and email only; do not invent a phone column that would break the live insert.

## File map

- Create: `plans/2026-10-04-vipps-direct-buy.md` (this file)
- Modify: `STATE.md`
- Modify: `lib/checkout.ts` — optional Vipps buyer fields; apply `userDetails` on confirm
- Modify: `lib/vipps.ts` — send `profile.scope`
- Modify: `lib/order-store.ts` — update buyer fields that Vipps actually returned
- Modify: `lib/checkout.test.ts` — failing tests first
- Create: `components/ui/KomplettVippsButton.tsx` — Vipps-orange one-press buy
- Modify: `components/layout/Header.tsx`
- Modify: `components/sections/BundleShowcase.tsx`
- Modify: `components/ui/BundleCard.tsx`
- Keep: `app/kasse/page.tsx` Stripe button and form

---

### Task 1: Allow Vipps start without a personal-info form

**Files:**
- Modify: `lib/checkout.ts`
- Modify: `lib/vipps.ts`
- Test: `lib/checkout.test.ts`

**Interfaces:**
- Consumes: `startCheckoutPayment`, `createVippsGateway`
- Produces: Vipps start with empty `email` / `first_name` / `last_name`; `createPayment` includes `profileScope: "name email phoneNumber"`

- [x] **Step 1: Write the failing tests**

```ts
it("starts Vipps for komplett without email or name", async () => {
  const { deps, orders, emails, createdPayments } = memoryDeps();
  const result = await startCheckoutPayment(
    {
      items: [{ id: "komplett" }],
      paymentProvider: "vipps",
      returnOrigin: "https://www.studentplanlegger.no",
    },
    deps,
  );
  assert.equal(result.ok, true);
  assert.equal(orders[0].email, "");
  assert.equal(orders[0].first_name, "");
  assert.equal(orders[0].amount_nok, 349);
  assert.equal(orders[0].items[0].id, "komplett");
  assert.equal(createdPayments[0].profileScope, "name email phoneNumber");
  assert.equal(emails.length, 0);
});

it("still requires email and name before Stripe starts", async () => {
  const { deps, orders } = memoryDeps();
  const result = await startCheckoutPayment(
    {
      items: [{ id: "komplett" }],
      paymentProvider: "stripe",
      returnOrigin: "https://www.studentplanlegger.no",
    },
    deps,
  );
  assert.equal(result.ok, false);
  assert.equal(result.status, 400);
  assert.equal(orders.length, 0);
});
```

- [x] **Step 2: Run the new tests and confirm they fail for the missing behavior**

Run: `node --experimental-strip-types --import ./scripts/register-ts-tests.mjs --test lib/checkout.test.ts`

- [x] **Step 3: Implement optional Vipps buyer fields and profile scope**

- [x] **Step 4: Run tests and confirm they pass**

---

### Task 2: Fill the order from Vipps userDetails after authorize

**Files:**
- Modify: `lib/checkout.ts`
- Modify: `lib/order-store.ts`
- Test: `lib/checkout.test.ts`

**Interfaces:**
- Consumes: `confirmVippsPayment`, `GET` payment `userDetails`
- Produces: `buyerDetailsFromVipps(payment)`, `orders.updateBuyerDetails(id, fields)`

- [x] **Step 1: Write the failing tests**

Copy only fields present on `userDetails`. Do not invent email, name, or phone. If email arrives, send the download to that address. If email is still empty after authorize, complete the paid order without emailing.

- [x] **Step 2: Run the new tests and confirm they fail**

- [x] **Step 3: Apply returned buyer details before finalize**

- [x] **Step 4: Run tests and confirm they pass**

---

### Task 3: Make the komplett button the Vipps action

**Files:**
- Create: `components/ui/KomplettVippsButton.tsx`
- Modify: `components/layout/Header.tsx`
- Modify: `components/sections/BundleShowcase.tsx`
- Modify: `components/ui/BundleCard.tsx`
- Test: `lib/checkout.test.ts`

**Interfaces:**
- Consumes: `POST /api/orders` with `{ items: [completePackageCartItem()], paymentProvider: "vipps" }`
- Produces: Vipps-orange (`#FF5B24`) Bokmål label that starts payment immediately

- [x] **Step 1: Write source tests for the Vipps-orange one-press button**

Header, showcase, and featured card must not route `Kjøp komplett pakke` through `/kasse` or a name/email form.

- [x] **Step 2: Confirm the old /kasse-routing test fails**

- [x] **Step 3: Implement the shared button and wire the three CTAs**

- [x] **Step 4: Confirm `/kasse` still has working Stripe as secondary**

Existing kasse tests stay green: `Betal med Vipps` first, `Betal med kort` second, `handlePayment("stripe")` present.

---

### Task 4: Verify, commit, and open the PR

- [x] **Step 1: Run the full test script and a production build**
- [x] **Step 2: Browser-check the button and `/kasse` card option**
- [x] **Step 3: Update STATE.md and tick this plan**
- [x] **Step 4: Commit, push, and open a draft PR. Do not merge.**
