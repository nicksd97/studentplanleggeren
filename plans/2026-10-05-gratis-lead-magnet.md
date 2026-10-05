# Gratis lead magnet (`/gratis` + Resend)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> Nick said go 2026-10-05. Feature code is on this branch. Sample PDF is still not in Supabase until Nick uploads it.

**Goal:** Add an indexable Bokmål landing page at `/gratis` that collects an email, upserts a Resend Contact into segment `lead-gratis-ukeplan`, and sends a lead mail from `Studentplanlegger <hei@studentplanlegger.no>` with a download link to the 1-page GRATIS smakebit PDF — never the commercial `24. Ukentlig Plan.pdf`.

**Architecture:** Keep Resend as the only ESP. Reuse the existing stub `POST /api/newsletter`. Extract validation, honeypot, and rate-limit into `lib/newsletter.ts`. Put all outbound mail behind a shared `EMAIL_FROM` in `lib/email.ts`, and add `sendLeadMagnetEmail`. Generate a Supabase signed URL for the sample at request time; do not attach the PDF and do not put it in `public/`.

**Tech Stack:** Next.js 16 App Router, Resend Node SDK (`resend` — bump from locked 6.10.0 so `contacts.create({ segments })` and `contacts.segments.add` exist), existing Supabase `products` bucket, node:test.

## Global Constraints

- All public copy stays Norwegian Bokmål. Do not invent reviews or testimonials.
- From-address for lead mail: `Studentplanlegger <hei@studentplanlegger.no>` (`SITE_NAME` + `SITE_EMAIL` in `lib/site.ts`). Domain `studentplanlegger.no` is verified in Resend (2026-10-05, eu-west-1).
- Do not change checkout, Vipps, Stripe, webhooks, catalog prices (39 / 99 / 149 / 249), or `productFileMap`.
- Do not give away `planners/ukentlig-plan.pdf` or any copy of `24. Ukentlig Plan.pdf`.
- Drop Beehiiv. No Mailchimp, ConvertKit, Klaviyo, Loops, or Brevo.
- Resend Node SDK returns `{ data, error }` and does **not** throw on API errors. Check `error` explicitly.
- Call Resend only from the server. Never from the browser.
- `RESEND_API_KEY` must be **full-access** (not sending-only), or Contacts/Segments calls return `restricted_api_key`.
- Open a pull request against `master`. Do not merge.
- Do not print a PLAN or STATUS block in the user-facing summary.

## Decisions (locked 2026-10-05)

| Topic | Choice |
|---|---|
| ESP | Resend Contacts + `emails.send`. No Beehiiv. |
| Asset | 1-page AcroForm smakebit `gratis-ukentlig-plan-smakebit.pdf` (GRATIS-banner). |
| Download | Signed URL in the email. No attachment. |
| Storage | Private bucket `products`, object `leads/gratis-ukentlig-plan-smakebit.pdf`. |
| Segment | Dashboard segment named `lead-gratis-ukeplan`; ID in `RESEND_LEAD_SEGMENT_ID`. |
| Opt-in | Single opt-in (form submit = consent). No double opt-in in this build. |
| Homepage form | Same `POST /api/newsletter` (same list + same PDF). Add honeypot. |
| Unsubscribe v1 | Visible mailto in the mail + `/personvern`. No new unsubscribe API. |

## File map

- Create: `plans/2026-10-05-gratis-lead-magnet.md` (this file)
- Create: `app/gratis/page.tsx` — landing page
- Create: `lib/newsletter.ts` — validate, honeypot, rate-limit, contact upsert, signed URL
- Create: `lib/newsletter.test.ts`
- Create: `lib/email.test.ts`
- Modify: `STATE.md`
- Modify: `app/api/newsletter/route.ts` — real handler, drop Beehiiv TODO
- Modify: `lib/email.ts` — shared `EMAIL_FROM`, `sendLeadMagnetEmail`, check `{ error }`
- Modify: `app/personvern/page.tsx` — newsletter/lead purpose (GDPR)
- Modify: `lib/site.ts` — `/gratis` in `indexablePaths`
- Modify: `app/sitemap.ts` — higher priority for `/gratis`
- Modify: `lib/seo.test.ts` — assert `/gratis`
- Modify: `components/sections/NewsletterSignup.tsx` — honeypot; copy that matches the PDF
- Modify: `components/layout/Header.tsx` — nav link Gratis
- Modify: `components/layout/Footer.tsx` — link Gratis
- Modify: `package.json` — bump `resend`; add new test files to the `test` script
- Do **not** add the PDF to git or to `lib/product-files.ts`

## Env (implementation + Vercel)

Already present (do not rotate, do not log values): `RESEND_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

| Name | Required | Value |
|---|---|---|
| `RESEND_LEAD_SEGMENT_ID` | Yes at go-live | UUID of segment `lead-gratis-ukeplan` |
| `LEAD_MAGNET_STORAGE_PATH` | No | Default `leads/gratis-ukentlig-plan-smakebit.pdf` |

No public PDF URL env. Signed URLs are created per signup.

## PDF storage (ops, before go-live)

**Do this in Supabase, not in git.**

1. Source file: the attached 1-page smakebit (`gratis-ukentlig-plan-smakebit.pdf`). Confirm the first line is `GRATIS SMAKEBIT` and that it is **not** the 2-page commercial `24. Ukentlig Plan.pdf`.
2. Bucket: existing **`products`** (same private bucket as paid planners). Keep it **private**. Paid objects stay under `planners/…`.
3. Object path: **`leads/gratis-ukentlig-plan-smakebit.pdf`**. Never `planners/ukentlig-plan.pdf`.
4. Serve: at `POST /api/newsletter` time, `supabaseAdmin.storage.from("products").createSignedUrl(path, 604800)` (7 days). Put `signedUrl` in the mail. Do not stream the file through Next. Do not attach bytes to Resend.
5. Why signed, not public: matches `/api/download`; the sample is not crawlable as a stable URL on the site; signup still gates the link. The sample is still a 1-page tease if a URL leaks.
6. Why not `public/` in the Next app: bypasses the email form, lands in git, and gets indexed.
7. Why not attachment: Nick asked for a link; attachments are heavier and more spam-prone.
8. If a 7-day signed URL is rejected by Supabase, use the longest allowed TTL and say in the mail that the user can submit the form again on `/gratis`.
9. Fallback Nick may choose instead (not the default): public bucket `marketing` + env `LEAD_MAGNET_PUBLIC_URL`. Only if signed URLs fail in real inboxes. Weaker gate.

Do **not** add `leads/gratis-ukentlig-plan-smakebit.pdf` to `productFileMap` or `bundleFileMap`. Paid checkout must not start delivering the smakebit, and the smakebit path must not be used as the full ukeplan.

## Resend Contacts upsert

Segment name in the dashboard: `lead-gratis-ukeplan`. Store the UUID in `RESEND_LEAD_SEGMENT_ID`. Do not create the segment on every request.

```ts
const { data, error } = await resend.contacts.create({
  email,
  unsubscribed: false,
  segments: [{ id: segmentId }],
});

if (error) {
  const { error: addError } = await resend.contacts.segments.add({
    email,
    segmentId,
  });
  if (addError) return { ok: false as const, error: addError };
}
```

Treat “already exists” as success and still send the PDF (the user wants the file). Combined with the rate limit this is safe. Do not mix deprecated `audienceId` with `segments`.

## Out of scope

- Discount / coupon / ambassadør codes in checkout
- Facebook groups, Page-as-profile posting, LinkedIn DMs, TikTok
- Price changes, Vipps/Stripe/webhook/order-store changes
- Beehiiv or any second ESP
- Giving away the full commercial ukeplan PDF
- Double opt-in, Resend Broadcasts, Automations, Topics
- New unsubscribe HTTP endpoint / List-Unsubscribe one-click URL
- DNS / Domeneshop (already verified)
- Uploading the PDF from CI (Nick or a later ops step)
- Changing OG images
- Merging this plan’s follow-up build without Nick’s go

---

### Task 0: Ops before go-live (Nick / agent with dashboard access)

Not code. Block production signup until these are done. Local tests can mock Resend + Storage.

- [x] **Step 1: Confirm Resend domain** `studentplanlegger.no` is Verified. From-address `hei@studentplanlegger.no` is allowed.
- [ ] **Step 2: Confirm `RESEND_API_KEY` on Vercel is full-access** (Contacts + Emails). If it is sending-only, create a new full-access key and replace the env value. Do not commit the key.
- [ ] **Step 3: Create Resend segment** named exactly `lead-gratis-ukeplan`. Put its UUID in Vercel env `RESEND_LEAD_SEGMENT_ID` (Production + Preview).
- [ ] **Step 4: Upload the smakebit** to Supabase Storage bucket `products`, path `leads/gratis-ukentlig-plan-smakebit.pdf`. Source on this agent: `/home/ubuntu/.cursor/projects/workspace/uploads/gratis-ukentlig-plan-smakebit_3dd0.pdf` (57 KB, GRATIS SMAKEBIT). Confirm the object is not `planners/ukentlig-plan.pdf`.
- [ ] **Step 5: Optional env** `LEAD_MAGNET_STORAGE_PATH=leads/gratis-ukentlig-plan-smakebit.pdf` if you do not want to rely on the code default.

---

### Task 1: Shared from-address and lead mail

**Files:**
- Modify: `lib/email.ts`
- Create: `lib/email.test.ts`
- Modify: `package.json` (`test` script includes `lib/email.test.ts`; bump `resend` to latest 6.x, minimum that documents `contacts.segments`)

**Interfaces:**
- Produces: `EMAIL_FROM` = `` `${SITE_NAME} <${SITE_EMAIL}>` `` → `Studentplanlegger <hei@studentplanlegger.no>`
- Produces: `sendLeadMagnetEmail({ to, downloadUrl }: { to: string; downloadUrl: string }): Promise<void>`
- Consumes: `SITE_NAME`, `SITE_EMAIL`, `SITE_ORIGIN` from `lib/site.ts`
- `sendOrderConfirmation` must use the same `EMAIL_FROM` (sandbox `onboarding@resend.dev` cannot reach real buyers now that the domain is verified)

- [x] **Step 1: Write failing tests** in `lib/email.test.ts`

```ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { EMAIL_FROM } from "./email";

describe("email from-address", () => {
  it("sends as hei@studentplanlegger.no, never the Resend sandbox", () => {
    assert.equal(EMAIL_FROM, "Studentplanlegger <hei@studentplanlegger.no>");
    assert.equal(EMAIL_FROM.includes("onboarding@resend.dev"), false);
  });
});
```

Also add a source-scan (same style as `lib/seo.test.ts`) that `lib/email.ts` contains `sendLeadMagnetEmail`, subject `Gratis ukentlig plan-smakebit`, the phrases `GRATIS SMAKEBIT` and `ikke hele produktet`, a `/produkter` shop CTA, `hei@studentplanlegger.no` avmelding, and `/personvern`, and that it does **not** contain `onboarding@resend.dev` or `Beehiiv`.

- [x] **Step 2: Run the new tests and confirm they fail**

```bash
node --experimental-strip-types --import ./scripts/register-ts-tests.mjs --test lib/email.test.ts
```

Expected: FAIL (`EMAIL_FROM` not exported / sandbox from still present).

- [x] **Step 3: Implement `lib/email.ts`**

Keep the existing HTML layout (sans-serif, max-width 560px, `#6c5ce7` button). Shared helpers:

```ts
import { Resend } from "resend";
import { SITE_EMAIL, SITE_NAME, SITE_ORIGIN } from "./site";

export const EMAIL_FROM = `${SITE_NAME} <${SITE_EMAIL}>`;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  return new Resend(apiKey);
}

async function sendHtmlEmail({
  to,
  subject,
  html,
  idempotencyKey,
}: {
  to: string;
  subject: string;
  html: string;
  idempotencyKey?: string;
}) {
  const resend = getResendClient();
  const { error } = await resend.emails.send(
    { from: EMAIL_FROM, to, subject, html },
    idempotencyKey ? { idempotencyKey } : undefined,
  );
  if (error) throw new Error(error.message);
}
```

`sendOrderConfirmation`: same body as today, but `from: EMAIL_FROM` via `sendHtmlEmail`. Keep subject `Takk for kjøpet! Her er nedlastingslenken din`.

`sendLeadMagnetEmail`:

- Subject: `Gratis ukentlig plan-smakebit`
- Idempotency key: `lead-magnet/${to.toLowerCase()}` (24h Resend window)
- H1: `Her er smakebiten din`
- Body (Bokmål): thank them; this is a **GRATIS SMAKEBIT** / **ikke hele produktet**; button `Last ned smakebiten` → `downloadUrl`; explain fillable PDF, Adobe Reader recommended; shop CTA link to `${SITE_ORIGIN}/produkter` mentioning live prices 39 kr / 5-pakke 99 kr / temapakke 149 kr / Komplett 249 kr; avmelding via `${SITE_EMAIL}`; personvern link `${SITE_ORIGIN}/personvern`; footer `Studentplanlegger.no · NSD Drift`
- Do not attach files. Do not mention Beehiiv.

- [x] **Step 4: Run tests and confirm they pass**

```bash
npm test
```

Expected: existing suite still green, plus `lib/email.test.ts`.

- [x] **Step 5: Commit** `feat: shared Resend from-address and lead-magnet mail`

---

### Task 2: Newsletter helpers (validate, honeypot, rate-limit, signed URL, contact)

**Files:**
- Create: `lib/newsletter.ts`
- Create: `lib/newsletter.test.ts`
- Modify: `package.json` `test` script to include `lib/newsletter.test.ts`

**Interfaces:**
- Produces: `NEWSLETTER_SEGMENT_NAME` = `"lead-gratis-ukeplan"`
- Produces: `DEFAULT_LEAD_MAGNET_STORAGE_PATH` = `"leads/gratis-ukentlig-plan-smakebit.pdf"`
- Produces: `normalizeEmail(input: unknown): string | null` — trim, lower-case, require `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` (same idea as `/kasse`)
- Produces: `isHoneypot(body: { company?: unknown; website?: unknown }): boolean` — true if `company` or `website` is a non-empty string
- Produces: `allowNewsletterRequest(key: string, now?: number): boolean` — in-memory Map, **5** hits per key per **3600000** ms. Key = `${ip}|${email}`
- Produces: `leadMagnetStoragePath(): string` — `process.env.LEAD_MAGNET_STORAGE_PATH ?? DEFAULT_LEAD_MAGNET_STORAGE_PATH`
- Produces: `assertSafeLeadMagnetPath(path: string): void` — throw if path includes `ukentlig-plan.pdf` without `smakebit`, or equals any `productFileMap` value, or starts with `planners/`
- Consumes later: Resend + `supabaseAdmin` from the route (keep I/O in the route or in functions that accept clients so tests stay mocks)

- [x] **Step 1: Write failing tests** covering:

  - valid `Name@Gmail.com` → `name@gmail.com`
  - missing / no `@` / no dot-TLD → `null`
  - honeypot empty → false; `company: "http://spam"` → true; `website: "x"` → true
  - 5 allows then 6th deny for the same key; a different key still allowed
  - default storage path is `leads/gratis-ukentlig-plan-smakebit.pdf`
  - `assertSafeLeadMagnetPath("planners/ukentlig-plan.pdf")` throws
  - `assertSafeLeadMagnetPath("leads/gratis-ukentlig-plan-smakebit.pdf")` does not throw

- [x] **Step 2: Run them and confirm they fail**
- [x] **Step 3: Implement `lib/newsletter.ts`**

Rate limit is process-local on purpose (light). Fluid Compute may reuse the instance; it is not a global firewall. Honeypot is the main bot filter.

```ts
const WINDOW_MS = 60 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map<string, number[]>();

export function allowNewsletterRequest(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}
```

Do not log the raw email address.

- [x] **Step 4: Run `lib/newsletter.test.ts` and `npm test`**
- [x] **Step 5: Commit** `feat: newsletter validation, honeypot, and rate limit`

---

### Task 3: `POST /api/newsletter`

**Files:**
- Modify: `app/api/newsletter/route.ts`
- Consumes: `lib/newsletter.ts`, `sendLeadMagnetEmail`, `supabaseAdmin`, `new Resend(process.env.RESEND_API_KEY)` in the route (do not export the email helper’s private client)

**Behavior:**

1. Parse JSON. If `isHoneypot(body)`, return `{ success: true }` with **200** and do nothing else (do not tip off bots).
2. `normalizeEmail(body.email)` — else `{ error: "Ugyldig e-postadresse" }` 400.
3. Client IP: first hop of `x-forwarded-for`, else `x-real-ip`, else `"unknown"`.
4. If `!allowNewsletterRequest(`${ip}|${email}`)`, return `{ error: "For mange forsøk. Prøv igjen senere." }` 429.
5. `assertSafeLeadMagnetPath(leadMagnetStoragePath())`.
6. Signed URL via `supabaseAdmin.storage.from("products").createSignedUrl(path, 604800)`. On failure: `{ error: "Kunne ikke lage nedlastingslenke" }` 500.
7. Upsert Resend contact into `RESEND_LEAD_SEGMENT_ID` (see algorithm above). If env missing: 500 `"Nyhetsbrev er ikke konfigurert"`.
8. `await sendLeadMagnetEmail({ to: email, downloadUrl: signedUrl.signedUrl })`. On throw: 502 `{ error: "Kunne ikke sende e-post" }`.
9. Return `{ success: true }`.
10. Delete the Beehiiv TODO and the `console.log("Newsletter signup:", email)`.

Use `NextRequest` so headers are available. Do not change other `/api/*` routes.

Check Resend `{ error }` on contact calls. Do not wrap SDK errors as success.

- [x] **Step 1: Implement the route** as a thin orchestrator (logic already tested in `lib/newsletter.ts`)
- [x] **Step 2: Confirm there is no `Beehiiv` string in `app/` or `lib/`**
- [x] **Step 3: Commit** `feat: store newsletter leads in Resend and send smakebit link`

---

### Task 4: `/gratis` landing page + form wiring

**Files:**
- Create: `app/gratis/page.tsx`
- Modify: `components/sections/NewsletterSignup.tsx`
- Modify: `components/layout/Header.tsx` — `{ label: "Gratis", href: "/gratis" }` in `navLinks` (desktop + mobile)
- Modify: `components/layout/Footer.tsx` — Info list, before Personvern: `<Link href="/gratis">Gratis smakebit</Link>`

Read `node_modules/next/dist/docs/` for App Router `page.tsx` / `metadata` before writing. Heed deprecation notices. Default Node runtime (no `runtime = 'edge'`).

**Page structure** (match guides: `Header`, `main` with `min-h-screen bg-brand-cream pt-28 pb-20`, `Footer`):

- `export const metadata = pageMeta({ title, description, path: "/gratis" })`
  - Title: `Gratis ukentlig plan-smakebit — Studentplanlegger`
  - Description (≥70 chars): `Last ned en gratis fyllbar ukeplan-smakebit. Én side til å prøve formatet — ikke hele produktet. Full ukeplan fra 39 kr.`
- Hero kicker: `GRATIS SMAKEBIT`
- H1: `Last ned gratis ukentlig plan-smakebit`
- Lead: one short paragraph — fillable PDF, one page, not the full planner.
- Three bullets, for example:
  1. Fyllbare felt (mål, prioriteringer, mandag–onsdag)
  2. Samme visning som de betalte planleggerne
  3. Full ukeplan og 24 andre PDF-er i nettbutikken
- Email form: extend `NewsletterSignup` with props (`heading`, `subheading`, `buttonLabel`, `successMessage`, `consentHtml`, `variant: "home" | "gratis"`) and render it on `/gratis`. Do not add a third form component. Fields: `email` (required), honeypot `company` hidden (`tabIndex={-1}`, `autoComplete="off"`, `aria-hidden`, CSS `absolute left-[-9999px]` — not `type="hidden"`). POST body: `{ email, company }`.
- Consent line with link to `/personvern`: `Ved å sende inn samtykker du til at vi lagrer e-posten din for å sende smakebiten og jevnlige studietips. Les personvernerklæringen.`
- Success: `Takk! Sjekk innboksen — smakebiten er på vei.`
- Error / 429: show the API `error` string, fallback `Noe gikk galt. Prøv igjen.`
- Shop CTA after the form: Button to `/produkter` — `Se alle planleggerne — fra 39 kr`. Secondary text may mention Komplett 249 kr. Do not invent discounts.
- Do not embed or link the PDF on the page. The only download is the email link.

Homepage `NewsletterSignup` (dark band): keep it posting to the same API so both surfaces share the list. Update copy so it does not promise “tips” without the PDF: heading `Gratis ukentlig plan-smakebit`, button `Send meg smakebiten`, microcopy with `/personvern`. Include the same honeypot field.

- [x] **Step 1: Add `/gratis` page + metadata**
- [x] **Step 2: Wire honeypot on both forms; Header + Footer links**
- [x] **Step 3: Commit** `feat: add /gratis lead-magnet landing page`

---

### Task 5: Personvern (GDPR)

**Files:**
- Modify: `app/personvern/page.tsx`

Set `Sist oppdatert` to the implementation day in Bokmål (same pattern as `12. april 2026`).

Add a section **Nyhetsbrev og gratis smakebit** (after «Hvilke opplysninger vi samler inn» or inside it):

- Vi samler **e-postadresse** når du sender inn skjemaet på `/gratis` eller forsiden.
- **Formål:** sende den gratis ukeplan-smakebiten og jevnlige e-poster med studietips / produktinfo.
- **Rettslig grunnlag:** samtykke (skjemainnsending). Du kan trekke samtykket når som helst.
- **Behandlingsansvarlig:** Studentplanlegger Davidson, org.nr 937416156.
- **Databehandler:** Resend (e-postutsending og kontaktliste). Ordre fortsetter hos Supabase.
- **Lagring:** i Resend Contacts, segment `lead-gratis-ukeplan`, til du ber om sletting/avmelding eller ikke lenger er relevant.
- **Avmelding:** svar til `hei@studentplanlegger.no` med ønske om avmelding, eller bruk lenken i e-posten når den finnes.
- Rettigheter: innsyn, retting, sletting, klage til Datatilsynet — already listed; mention they also apply to newsletter data.

Update «Hvilke opplysninger vi samler inn» so it is not purchase-only.

Keep «Vi selger eller deler aldri … for markedsføringsformål». Resend is a processor, not a buyer of the list.

Do not claim “ingen e-postmarkedsføring” anywhere — that would contradict this feature.

- [x] **Step 1: Update copy**
- [x] **Step 2: Commit** `docs: disclose newsletter and lead-magnet processing`

---

### Task 6: Sitemap / indexablePaths

**Files:**
- Modify: `lib/site.ts` — add `"/gratis"` to `indexablePaths()` (with the other marketing URLs, before `/personvern`)
- Modify: `app/sitemap.ts` — `path === "/gratis"` → `priority: 0.7` (above legal 0.4, below home 1 / produkter 0.8)
- Modify: `lib/seo.test.ts` — `assert.ok(paths.includes("/gratis"))`; still omit `/kasse`, `/takk`, `/api`

Do not add `/gratis` to `robotsDisallow`.

- [x] **Step 1: Write the failing seo assertion**
- [x] **Step 2: Add the path and sitemap priority**
- [x] **Step 3: `npm test` green**
- [x] **Step 4: Commit** `feat: index /gratis in sitemap`

---

### Task 7: Manual test checklist (do before asking Nick to merge the build)

Use a real inbox you control. Prefer `delivered@resend.dev` only for Resend-dashboard delivery checks; a real mailbox is required to open the PDF link.

- [x] `npm test` passes
- [x] `next build` succeeds
- [x] `/gratis` renders Bokmål hero, 3 bullets, form, `/personvern` link, shop CTA; no PDF iframe/direct file link
- [x] Header «Gratis» and footer «Gratis smakebit» reach `/gratis`
- [x] Homepage band still submits to `/api/newsletter`
- [x] Invalid email → 400, form error
- [x] Honeypot filled → 200, **no** new Resend contact, **no** email
- [ ] Valid signup → 200, success message
- [ ] Resend dashboard: contact exists, in segment `lead-gratis-ukeplan`, not unsubscribed
- [ ] Mail arrives **From** `Studentplanlegger <hei@studentplanlegger.no>` (not `onboarding@resend.dev`)
- [ ] Subject `Gratis ukentlig plan-smakebit`
- [ ] Button/link opens the **smakebit** (GRATIS-banner, 1 page). Confirm it is **not** `24. Ukentlig Plan.pdf` / not 2 pages / not 318 fields
- [x] Repeat submit hits rate limit (429) after 5/hour from the same IP+email
- [x] `/personvern` mentions newsletter purpose, Resend, avmelding
- [x] `https://www.studentplanlegger.no/sitemap.xml` (preview URL) lists `/gratis`
- [x] `/kasse` still 39 / 99 / 149 / 249; Vipps/Stripe code untouched (`git diff` has no checkout/price files)
- [x] Paid download of `planners/ukentlig-plan.pdf` still works for a test order **or** confirm `productFileMap` unchanged
- [x] Do not complete a live paid checkout unless Nick asks

---

## Implementation notes for the next agent

- Branch from latest `master`. Do not implement on this plan-only branch unless Nick says to continue here.
- Prices in UI copy must stay 39 / 99 / 149 / 249.
- Idempotency key `lead-magnet/${email}` means a second successful send to the same address within 24 hours returns the original Resend response without another mail. That is acceptable.
- If `contacts.create` fails because the API key cannot manage contacts, stop and tell Nick — do not silently `console.log` the email.
- Next.js 16: this page is a static `page.tsx` with a client form island. No `params` Promise needed.
- Do not add `vercel.ts` or new Vercel Marketplace products; Resend and Supabase are already in the stack.
