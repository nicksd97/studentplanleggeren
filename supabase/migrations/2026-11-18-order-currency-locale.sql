-- Local currency for card checkout, and the buyer's site language.
-- Idempotent. Run in the Supabase SQL Editor before or with the deploy.
--
-- currency           Currency the order was charged in (NOK, SEK, DKK, EUR, GBP, USD).
-- amount_minor       Charged total in minor units of `currency` (øre, öre, cents, pence).
-- list_amount_minor  List price before a discount code, in minor units of `currency`.
-- discount_minor     Discount in minor units of `currency`.
-- locale             Site language at checkout (nb, en, de, sv, da, es, fr): PDF and email language.
--
-- amount_nok / list_amount_nok / discount_nok keep their meaning for NOK orders. For other
-- currencies they hold the NOK-equivalent of the same cart and discount at NOK catalog prices,
-- so revenue reporting in NOK still works; what was actually charged is amount_minor.
--
-- Until this runs, the app stores orders without these columns (exactly as before) and keeps
-- currency, amount_minor and locale of non-NOK / non-Bokmål orders in items[0].order_meta.

ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'NOK';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS amount_minor integer;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS list_amount_minor integer;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_minor integer;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'nb';

-- Backfill: existing orders are NOK.
UPDATE orders SET amount_minor = amount_nok * 100 WHERE amount_minor IS NULL;
UPDATE orders
SET list_amount_minor = list_amount_nok * 100, discount_minor = discount_nok * 100
WHERE list_amount_nok IS NOT NULL AND list_amount_minor IS NULL;

-- Orders stored before the migration with items[0].order_meta: move the values into columns.
UPDATE orders
SET
  currency = COALESCE(items->0->'order_meta'->>'currency', currency),
  amount_minor = COALESCE((items->0->'order_meta'->>'amount_minor')::integer, amount_minor),
  list_amount_minor = COALESCE((items->0->'order_meta'->>'list_amount_minor')::integer, list_amount_minor),
  discount_minor = COALESCE((items->0->'order_meta'->>'discount_minor')::integer, discount_minor),
  locale = COALESCE(items->0->'order_meta'->>'locale', locale)
WHERE jsonb_typeof(items) = 'array' AND items->0 ? 'order_meta';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_currency_check') THEN
    ALTER TABLE orders ADD CONSTRAINT orders_currency_check
      CHECK (currency IN ('NOK', 'SEK', 'DKK', 'EUR', 'GBP', 'USD'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_locale_check') THEN
    ALTER TABLE orders ADD CONSTRAINT orders_locale_check
      CHECK (locale IN ('nb', 'en', 'de', 'sv', 'da', 'es', 'fr'));
  END IF;
END $$;
