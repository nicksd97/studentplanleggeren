-- Language and currency of each email lead, so the sample email and welcome series can follow
-- the subscriber's language. Idempotent. Run in the Supabase SQL Editor before or with the deploy.
--
-- locale    Site language at signup (nb, en, de, sv, da, es, fr). NULL for leads stored before
--           this migration and for the Resend backfill.
-- currency  Currency the subscriber saw prices in (NOK, SEK, DKK, EUR, GBP, USD), or NULL.
--
-- Until this runs, signups are stored without these columns (the app retries without them).

ALTER TABLE leads ADD COLUMN IF NOT EXISTS locale text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS currency text;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'leads_locale_check') THEN
    ALTER TABLE leads ADD CONSTRAINT leads_locale_check
      CHECK (locale IS NULL OR locale IN ('nb', 'en', 'de', 'sv', 'da', 'es', 'fr'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'leads_currency_check') THEN
    ALTER TABLE leads ADD CONSTRAINT leads_currency_check
      CHECK (currency IS NULL OR currency IN ('NOK', 'SEK', 'DKK', 'EUR', 'GBP', 'USD'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_leads_locale ON leads (locale);
