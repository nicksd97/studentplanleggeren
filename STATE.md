# New catalog prices

Date: 2026-10-05
Production HEAD at branch start: `1dfe836` (campaign tags on Vipps and card)
Branch: `cursor/new-prices-9dc4`

## Verified before the change

- Every single was 49 kr. Theme packs were already 149 kr. Komplett was 349 kr with a 1225 kr strikethrough and a “Spar 71%” badge.
- `priceCheckoutItems` ignored client-sent prices but summed catalog list prices with no 5-pack.
- How-it-works still said “fra 79” / “pakker fra 249”. Hero and product CTAs said 349 kr.
- OG images (`cover.png`, hero showcase) have no baked-in prices.

## What this branch changes

- Singles 39 kr, theme packs 149 kr, komplett 249 kr. Fake comparison prices removed.
- Automatic 5-pack: every complete group of 5 singles is 99 kr. Leftovers stay 39 kr. Theme packs and komplett are not counted into the five. There is no purchasable `fem-pakke` SKU.
- Cart, kasse, email receipts, and `/takk` analytics use the charged total from `priceCheckoutItems`.
- Copy, FAQ, guides, metadata, and JSON-LD Offer prices (including a 5-pack Offer at 99 kr) match the new list.
- One-press Vipps for komplett still POSTs `{ items: [komplett], paymentProvider: "vipps" }` plus campaign tags. Untagged stays `campaign: null`.

## Verified on this branch

- `npm test`: 83/83 pass. `next build` succeeds.
- Headless Chrome against local `next dev`, no charge: homepage 249 kr, no 349/1225/strikethrough. `/produkter` 39 kr and 99 kr copy. Five singles → cart and `/kasse` totalt 99 kr. Vipps POST body `amountNok: 99` with the five product ids. Six singles → cart 138 kr. One-press komplett POST `price: 249`. Local insert returns the usual unpaid “Kunne ikke opprette ordre” because Supabase is unset.
- Guide `planlegg-studiedagen` mentions 39 kr, not 49.

## Not done

Do not complete a live paid checkout on production. Do not merge.
