# Checkout pending-order insert

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Production `/api/orders` can insert a pending catalog order and start Vipps or Stripe without marking the order paid or emailing a download link until the provider confirms the charge.

**Architecture:** Keep charge-then-fulfill. `insertPending` runs before Vipps `createPayment`, and after Stripe session create. Failures in `insertPending` must preserve the thrown message, SQLSTATE, or network error so the cause is visible. Fulfillment (`completeIfPending` + download email) stays only on the confirm routes after Vipps reserved/captured or Stripe `payment_status=paid`.

**Tech Stack:** Next.js 16 App Router, `@supabase/supabase-js` 2.103, Vipps ePayment, Stripe Checkout, node:test.

## Global Constraints

- Do not mark an order paid or send a download email unless Vipps or Stripe confirms the charge.
- Do not complete a live paid checkout on production.
- Do not change, read, or print secrets or env values. Do not rotate keys.
- Do not pass a Vercel team id. Do not change DNS or env values.
- Open a pull request. Do not merge it.
- Do not print a PLAN or STATUS block in the user-facing summary.

## Evidence already collected

- 3 Oct 2026 production `POST https://www.studentplanlegger.no/api/orders` for `daglig-gjennomgang` at 49 kr with `paymentProvider: vipps` returns HTTP 502 `{"error":"Kunne ikke opprette ordre"}` with no `code` (~148ms). Nothing is marked paid. No download email is sent.
- The same catalog POST with `paymentProvider: stripe` returns HTTP 503 `{"error":"Kunne ikke starte kortbetaling"}` (~1.2s). Stripe session create happens before insert; the shared catch currently hides an insert failure behind the Stripe message.
- `GET /api/download?token=fake&file=...` returns 403 in ~7.2s. `GET /api/orders/verify?token=fake` returns 404 in ~7.2s. Those paths treat any `{error}` as not found and do not prove INSERT can reach Supabase.
- `@supabase/postgrest-js` retries GET/HEAD/OPTIONS three times with 1s + 2s + 4s backoff, and converts a fetch throw into `{error:{code:"", message, details, hint}}`. POST is not retried. An empty `code` is therefore consistent with a client fetch throw, but the thrown message / SQLSTATE / network error must be captured from a live request before naming the cause.
- `SUPABASE_SERVICE_ROLE_KEY` is already a `service_role` JWT on development, preview, and production, and is not the anon key. Do not treat a wrong service-role key as the cause unless new evidence says so.

## File map

- Create: `plans/2026-10-03-checkout-insert.md` (this file)
- Create: `STATE.md`
- Create: `lib/order-insert-error.ts` — sanitize and wrap insert failures
- Modify: `lib/order-store.ts` — wrap `{error}` and thrown fetch/PostgREST failures
- Modify: `lib/checkout.ts` — forward sanitized insert details; do not remap Stripe insert failures to the Stripe start message
- Modify: `app/api/orders/route.ts` — return sanitized details; log unexpected throws
- Modify: `lib/checkout.test.ts` — failing tests first for error preservation and unpaid/no-email guarantees
- Modify: `lib/supabase.ts` only if the captured cause is a client construction / fetch wiring bug, not an env value

---

### Task 1: Surface the real insert failure

**Files:**
- Create: `lib/order-insert-error.ts`
- Modify: `lib/order-store.ts`
- Modify: `lib/checkout.ts`
- Modify: `app/api/orders/route.ts`
- Test: `lib/checkout.test.ts`

**Interfaces:**
- Consumes: `startCheckoutPayment`, `createSupabaseOrderStore`
- Produces: `createOrderInsertFailure(error: unknown): Error & { code?: string; details?: string; hint?: string }`, `StartCheckoutResult` may include `details` and `hint`

- [x] **Step 1: Write the failing tests**

```ts
it("preserves a PostgREST SQLSTATE from insertPending", async () => {
  const harness = memoryDeps();
  harness.deps.orders.insertPending = async () => {
    throw createOrderInsertFailure({
      code: "42703",
      message: "column orders.payment_provider does not exist",
      details: "",
      hint: "",
    });
  };
  const result = await startCheckoutPayment(checkoutInput, harness.deps);
  assert.equal(result.ok, false);
  if (result.ok) throw new Error("expected insert to fail");
  assert.equal(result.status, 502);
  assert.equal(result.code, "42703");
  assert.match(result.details ?? "", /payment_provider|42703|does not exist/i);
  assert.equal(harness.emails.length, 0);
});

it("preserves a fetch/network insert failure when PostgREST code is empty", async () => {
  const failure = createOrderInsertFailure({
    code: "",
    message: "TypeError: fetch failed",
    details: "Caused by: Error: getaddrinfo ENOTFOUND example.supabase.co (ENOTFOUND)",
    hint: "",
  });
  assert.equal(failure.message, "Kunne ikke opprette ordre");
  assert.equal(failure.code, "ENOTFOUND");
  assert.match(failure.details ?? "", /fetch failed|ENOTFOUND/i);
});

it("returns 502 ordre error when Stripe session exists but insertPending throws", async () => {
  const harness = memoryDeps();
  harness.deps.orders.insertPending = async () => {
    throw createOrderInsertFailure({
      code: "",
      message: "TypeError: fetch failed",
      details: "Caused by: ConnectTimeoutError",
    });
  };
  const result = await startCheckoutPayment(
    { ...checkoutInput, paymentProvider: "stripe" },
    harness.deps,
  );
  assert.equal(result.ok, false);
  if (result.ok) throw new Error("expected insert to fail");
  assert.equal(result.status, 502);
  assert.match(result.error, /ordre/i);
  assert.equal(harness.emails.length, 0);
  assert.ok(harness.orders.every((order) => order.payment_status !== "completed"));
});
```

- [x] **Step 2: Run the new tests and confirm they fail for the missing behavior**

Run: `node --experimental-strip-types --import ./scripts/register-ts-tests.mjs --test lib/checkout.test.ts`

- [x] **Step 3: Implement `createOrderInsertFailure` and forward sanitized fields**

Keep JWTs, bearer tokens, and env values out of `details`. Prefer a Postgres/PostgREST code when present. If `code` is empty, lift a network code from `details` / `cause` (`ENOTFOUND`, `ECONNREFUSED`, `UND_ERR_CONNECT_TIMEOUT`, `UND_ERR_SOCKET`).

- [x] **Step 4: Run tests and confirm they pass**

- [x] **Step 5: Commit, push, and open or update the draft PR**

---

### Task 2: Name the cause from a non-fulfilling request

**Files:**
- Modify: `STATE.md`
- Modify: `plans/2026-10-03-checkout-insert.md` (tick this task once the cause is named)

- [x] **Step 1: POST a catalog item to the preview `/api/orders` (vipps, 49 kr, `daglig-gjennomgang`)**

Do not follow a Vipps or Stripe redirect. Do not pay. Confirm the response still does not complete or email.

Preview SSO blocked POST (`401` / MCP bypass `403`). The same non-paying catalog POST was made to production and to a local PostgREST mock instead.

- [x] **Step 2: Record the evidence**

Write the thrown message, SQLSTATE, or network error into `STATE.md`. Guessing is not allowed.

- [x] **Step 3: Commit the STATE update**

---

### Task 3: Fix the named cause and prove a pending insert

**Files:**
- Modify: whichever file the evidence points to (`lib/supabase.ts`, `lib/order-store.ts`, and/or `scripts/schema.sql` as a documented migration only)
- Test: `lib/checkout.test.ts`

- [x] **Step 1: Write or extend a failing test that encodes the named cause**

- [x] **Step 2: Implement only that fix**

If the evidence is a missing/wrong env value, name the env var and stop. Do not invent a value.

- [x] **Step 3: Prove pending insert with a request that does not complete payment or send email**

Vipps: pending row + redirect URL, or a 502 that is no longer the insert failure (must not be paid).
Stripe: session start after pending insert, or a Stripe-not-activated message. Failed/cancelled/abandoned paths stay unpaid.

- [x] **Step 4: Commit, push, and update the draft PR. Do not merge.**
