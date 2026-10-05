# Linjeforening rabattkoder — plan only

Date: 2026-10-05
Production HEAD: `9ed55b4` (`/gratis` squash-merged)
Branch: `cursor/linjeforening-rabattkoder-plan-e27b`

## Status

Plan written. **No feature code.** Awaits Nick’s go before building checkout codes.

Plan file: `plans/2026-10-05-linjeforening-rabattkoder.md`

`/gratis` is live on master. Paid PDFs are in `products/planners/<slug>.pdf`.

## Locked recommendations in the plan

- 20 % off the **server** cart after 5-pack math. `amount_nok` stays integer (`Math.round`). Komplett 249 → 199.
- Codes in Supabase `discount_codes` so Nick can add `ABAKUS20` without a deploy.
- `?kode=` cookie so one-press Vipps can discount. Invalid code rejects payment.
- UTM tags stay on `items`; new order columns `discount_code`, `list_amount_nok`, `discount_nok`.

## Papirmaler (not in this build)

Komplett delivers 25 planner PDFs only. Copy still promises “12 papirmaler” in `lib/products.ts`, `lib/faq.ts`, `BundleShowcase`, `BundleCard`, `ProdukterStickyBar`. Recommend a later copy-only PR unless Nick has the files.

## Not done

Do not implement codes until Nick says go. Do not merge this plan as if it were the feature.
