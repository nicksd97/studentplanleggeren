# Marketing attribution

Date: 2026-10-04
Production HEAD at branch start: `2d7dbfa` (Vipps one-press buy)
Branch: `cursor/marketing-attribution-18c8`

## Verified before the change

Hypothesis confirmed:

1. `KomplettVippsButton` POSTs `{ items: [komplett], paymentProvider: "vipps" }` with no campaign tags. Landing `?utm_*` never reaches `/api/orders`.
2. `/kasse` card and Vipps POSTs send name, email, cart, and provider only.
3. The live `orders` table matches `scripts/schema.sql`: no `utm_*` column. `items` is JSONB. Adding a new column would break the pending insert (same reason a phone column was rejected).
4. `updateBuyerDetails` patches only `email` / `first_name` / `last_name`. Extra keys on `items` survive profile fill and `completeIfPending`.
5. No Google Analytics measurement id is configured. Search Console / untagged Google search must stay sourceless.

Paid orders remain countable later from the existing table:

```sql
SELECT items->0->>'utm_source' AS source, count(*)
FROM orders
WHERE payment_status = 'completed'
GROUP BY 1;
```

## What this branch changes

- Landing `utm_source`, `utm_medium`, `utm_campaign`, and `utm_content` are stored in cookie `sp_campaign` and `sessionStorage` and sent with Vipps one-press and `/kasse` card.
- The same tags are written onto `orders.items[0]` at pending insert. Untagged checkouts omit them. No source is invented.
- Vipps `userDetails` fill does not wipe tags.
- If `NEXT_PUBLIC_GA_MEASUREMENT_ID` is later set, a purchase is recorded when the order is actually paid. Missing id does not block checkout.

## Not done

Do not complete a live paid checkout on production. Do not merge.
