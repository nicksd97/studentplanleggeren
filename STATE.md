# Linjeforening rabattkoder — implemented

Date: 2026-10-06
Branch: `cursor/linjeforening-rabattkoder-plan-e27b`
PR: #12

## Status

Feature built on the plan branch. Nick approved the defaults (20 % whole cart after 5-pack, whole kroner, Supabase table, invalid code rejects payment, `?kode=` + one-press Vipps, `discount_code` on the order, UTM untouched).

SQL Nick must run in the Supabase SQL Editor before deploy:

`supabase/migrations/2026-10-06-discount-codes.sql`

That file creates `discount_codes` (RLS on, service-role only, no anon read), adds order columns, and seeds the 15 linjeforening codes (20 %, active, expires 2026-12-31 23:59 Europe/Oslo, no usage cap).

If the table is missing: a submitted code is treated as invalid (`Ugyldig kode` in the field; payment with a code is rejected). Checkout without a code still uses catalog prices.

## Papirmaler

Komplett copy now matches delivery: 25 planner PDFs only. Removed “12 papirmaler (prikket, rutenett og linjert)” from catalog, FAQ/JSON-LD, BundleShowcase, BundleCard, and ProdukterStickyBar. Print FAQ and Vane Tracker “rutenett” are unchanged.

## Not done

Do not merge until Nick has run the SQL and reviewed the PR.
