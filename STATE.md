# Vipps direct buy

Date: 2026-10-04
Production HEAD at branch start: `dff328a` (merge of PR #6)
Branch: `cursor/vipps-direct-buy-ecc8`

## Verified before the change

Hypothesis confirmed:

1. `Kjøp komplett pakke` in the header added `komplett` (349 kr) to the cart and routed to `/kasse`.
2. Featured showcase and `BundleCard` only added the bundle to the cart.
3. `startCheckoutPayment` required email and first name before Vipps `createPayment`.
4. `/kasse` validated name and email before both Vipps and Stripe.
5. Capture type is already handled in code as reserve-then-capture: AUTHORIZED with a matching reserved amount is enough to fulfill; capture is attempted and may be retried.

Vipps profile sharing (official docs, 4 Oct 2026): request `profile.scope`, then read `userDetails` from `GET /epayment/v1/payments/{reference}` after authorize. Fields that actually come back are `email`, `firstName`, `lastName`, `mobileNumber`. A separate Userinfo call is not required for a normal purchase.

The live `orders` table has `email`, `first_name`, `last_name` as `NOT NULL` text. There is no phone column. Pending Vipps rows use empty strings, not invented buyers. After authorize, only returned name and email are written. Phone is present on `userDetails.mobileNumber` but is not persisted, because adding a column would break the live update.

## What this branch changes

- Header, featured showcase, and featured bundle card use a Vipps-orange (`#FF5B24`) button labeled `Kjøp komplett pakke med Vipps`.
- One press POSTs `{ items: [komplett], paymentProvider: "vipps" }` with no name or email.
- `createPayment` requests `profile.scope` of `name email phoneNumber`.
- After authorize, `userDetails` is copied onto the pending order. Missing fields stay empty. Download email is sent only when Vipps (or the `/kasse` form) supplied a real email.
- Stripe on `/kasse` still requires the form and remains the secondary card option.

## Not done

Do not complete a live paid checkout on production. Do not merge.
