-- Run this in Supabase Dashboard → SQL Editor

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  payment_provider TEXT NOT NULL DEFAULT 'stripe',
  payment_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  amount_nok INTEGER NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  download_token TEXT UNIQUE NOT NULL,
  download_count INTEGER DEFAULT 0,
  max_downloads INTEGER DEFAULT 10,
  token_expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_orders_download_token ON orders(download_token);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);

-- Index for Vipps payment lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: only service role can insert/update (via API routes)
CREATE POLICY "Service role full access" ON orders
  FOR ALL USING (true) WITH CHECK (true);

-- Discount codes (also shipped as supabase/migrations/2026-10-06-discount-codes.sql)
CREATE TABLE IF NOT EXISTS discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  association_name text NOT NULL,
  percent integer NOT NULL DEFAULT 20 CHECK (percent > 0 AND percent <= 90),
  active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  max_redemptions integer,
  redemption_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes (code);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_code text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS list_amount_nok integer;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_nok integer NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_percent integer;

CREATE INDEX IF NOT EXISTS idx_orders_discount_code ON orders (discount_code);

ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE discount_codes FROM PUBLIC;
REVOKE ALL ON TABLE discount_codes FROM anon;
REVOKE ALL ON TABLE discount_codes FROM authenticated;
GRANT ALL ON TABLE discount_codes TO service_role;
