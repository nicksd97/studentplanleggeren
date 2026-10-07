# Klikksporing med Vercel Web Analytics

Date: 2026-10-07
Branch: `cursor/klikksporing-6edf`

## Goal

See what visitors click and where they drop off, from landing to purchase. It is cookie-free (no consent banner) and stores no personal data. Events show up in **Vercel → project → Analytics → Events**.

## Before you look for events

1. **Plan.** Custom events are only available on **Pro and Enterprise** ([Vercel docs](https://vercel.com/docs/analytics/custom-events), [pricing](https://vercel.com/docs/analytics/limits-and-pricing)).
   - **Hobby:** 50,000 events a month, page views only, a 1-month window, no custom events and no UTM reports. The `track()` calls are harmless on Hobby, but nothing shows under Events.
   - **Pro:** custom events are included and billed at $0.03 per 1,000 events (at this traffic it will most likely fit inside the Pro monthly usage credit). Only **2 properties** per event are recorded, with a 12-month window.
   - **Pro + Web Analytics Plus** ($10/month): **8 properties** per event, UTM reports, and a 24-month window.
2. **Enable Web Analytics** in the project (Analytics → Enable), otherwise `/_vercel/insights/*` returns 404 and nothing is collected.
3. **Property count.** Each event's properties are ordered by importance, and the code sends only the first N. N comes from `NEXT_PUBLIC_VA_EVENT_PROPS` (default `2`, max `8`). With Web Analytics Plus, set it to `8` in Vercel's env vars and redeploy. Then `path`, `utm_source` and `utm_campaign` are added to every event.

## Events

The first two properties are what Pro records. Properties in *italics* are only sent when `NEXT_PUBLIC_VA_EVENT_PROPS` > 2. Every event also gets *`path`*, *`utm_source`* and *`utm_campaign`* when the limit allows.

| Event | Fires when | Properties | Code |
|---|---|---|---|
| `cta_click` | Click on any element with `data-cta` (list below) | `cta` | `components/analytics/ClickTracker.tsx` |
| `catalog_view` | `/produkter` opens (all categories or one category) | `category` (`alle`, `daglig`, `ukentlig`, …) | `ProdukterCatalog.tsx` via `TrackView` |
| `product_view` | A product card is at least 60% visible for 1.5 s; once per product per session | `product` (slug), `tier` | `components/ui/ProductCard.tsx` |
| `product_click` | Click on a product card (image, title, text) outside the buy button | `product`, `tier` | `ProductCard.tsx` |
| `add_to_cart` | «Kjøp nå» on a planner or «Kjøp» on a theme bundle (not when it's already in the cart) | `product` (slug/bundle id), `tier` | `ProductCard.tsx`, `BundleShowcase.tsx`, `BundleCard.tsx` |
| `checkout_start` | Vipps or card payment starts. On `/kasse` this is after the form validates; for «Kjøp komplett pakke med Vipps» (header, mobile menu, the bundles section) it's on click | `method` (`vipps`/`kort`), `tier`, *`source`* (`kasse`, `header`, `header_mobil`, `pakker`) | `app/kasse/page.tsx`, `KomplettVippsButton.tsx` |
| `purchase` | `/takk` shows a completed order; once per order | `tier`, `value` (NOK paid). UTM comes from the order, not the session | `app/takk/page.tsx` |
| `download_click` | «Last ned» on a purchased file on `/takk` | `kind` (`kjop`), `product` (file name) | `app/takk/page.tsx` |
| `lead_signup` | The /gratis or front-page form is submitted successfully | `form` (`gratis`/`home`) | `NewsletterSignup.tsx` |
| `lead_signup_error` | The form fails | `form`, `reason` (`ugyldig`, `for_mange`, `server`, `nettverk`) | `NewsletterSignup.tsx` |
| `discount_applied` | A discount code is accepted at checkout; once per code per session | `code` (e.g. `ABAKUS20`), `source` (`manuell` = typed in, `lagret` = from a `?kode=` link or earlier) | `app/kasse/page.tsx` |
| `outbound_click` | A link that leaves the site (social, email, other) | `target` (host, or `epost`), `kind` (`social`/`epost`/`ekstern`) | `ClickTracker.tsx` |

`tier` is one of: `enkelt` (39 kr), `5-pakke` (99 kr, five or more singles in the cart), `tema` (149 kr), `komplett` (249 kr). For a cart it's the highest tier in it.

### `cta` values

| `cta` | Button / link |
|---|---|
| `hero_komplett` | Hero «Se komplett pakke — 249 kr» |
| `hero_produkter` | Hero «Utforsk planleggerne» |
| `pakker_produkter` | Bundles section «Se alle 25 planleggere» |
| `kategori_<slug>` | Category bubbles on the front page (`kategori_daglig`, `kategori_ukentlig`, …) |
| `guide_<slug>` | Guide cards on the front page |
| `nav_planleggere`, `nav_gratis`, `nav_pakker`, `nav_faq` | Header menu (desktop and mobile) |
| `handlekurv_apne` | Cart icon in the header |
| `handlekurv_kasse` | «Gå til kassen» in the cart |
| `handlekurv_produkter` | «Se produkter» in an empty cart |
| `gratis_produkter` | «Se alle planleggerne — fra 39 kr» on /gratis |
| `kasse_tom_produkter` | «Se produkter» on an empty checkout page |

To track a new button: add `data-cta="noe_kort"` to the element. No other code is needed.

## Useful views in Vercel

- **Funnel:** `product_view` → `add_to_cart` → `checkout_start` → `purchase`. Split by `tier` to see where komplett and single planners drop off.
- **Vipps or card:** `checkout_start`, split by `method`.
- **Lead magnet:** `lead_signup` against `lead_signup_error` (split by `reason`).
- **Campaigns:** with Plus and the limit at 8, split any event by `utm_source`/`utm_campaign`. Without Plus, compare page views per day against when you posted the campaign.

## Privacy

- Vercel Web Analytics uses no cookies and stores nothing on the device. Visitors are counted with a daily rotating hash on Vercel's side.
- Events never contain name, email or form fields. As a safety net, `buildEventProps` drops any value containing `@`, and a test scans every `trackEvent` call in checkout, signup and thank-you code.
- **Download tokens.** Every page and event URL is passed through `redactAnalyticsUrl` (in `beforeSend`). Only `utm_*` and `kategori` are kept, so `/takk?token=…` is sent as `/takk`. The redaction is also queued ahead of events that fire before the analytics script loads (verified for `purchase` on `/takk`).
- The campaign tags still come from the existing `lib/attribution.ts` (sessionStorage + `sp_campaign` cookie). That code is unchanged, so UTM on orders works as before.
- `personvern` now describes the anonymous, cookie-free statistics, with Vercel as data processor. «Sist oppdatert» is 7 October 2026.

## Not tracked, and why

- **«Last ned» in the /gratis email.** The email links straight to a signed Supabase URL, so there's no page on our site to count the click. Counting it would need a redirect route, which changes the download/token logic. What is tracked is `lead_signup`, plus visits from the email's other links (`utm_source=epost`).
- **Product pages.** There are none; products are cards in `/produkter`. `catalog_view` + `product_view` (card actually seen) + `product_click` cover this.

## For Nick to check (not changed here)

- `components/analytics/GoogleAnalytics.tsx` loads Google Analytics (with cookies) if `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set. If it is set in production, that conflicts with «ingen sporingscookies» on personvern and would need consent. Remove the env var or add consent.
- `sp_campaign` (a first-party cookie with UTM tags, 30 days) is used to attribute orders to campaigns. It isn't strictly necessary. Consider sessionStorage only, or mention it on personvern.

## Verification

- `npm test`: 138 pass. New in `lib/track-events.test.ts`: tiers, property order and limit, email filter, URL redaction, outbound classification, and wiring.
- `next build` passes. ESLint shows only the existing error in `lib/cart-context.tsx`.
- Browser run (`next dev`, headless Chrome over CDP, with API responses mocked so nothing is sent anywhere): every event above fired with the expected properties at both 2 and 8 properties. `/takk?token=…` and `/produkter?…&token=…` reached Vercel without the token.

## Tasks

- [x] Install `@vercel/analytics`, add `<Analytics />` with `beforeSend` redaction
- [x] `lib/track.ts` / `lib/track-events.ts` + tests
- [x] Events in components and pages
- [x] Personvern
- [x] Verify in browser, `npm test`, `next build`
- [x] STATE.md, PR (not merged)
