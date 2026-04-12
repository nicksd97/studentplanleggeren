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

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: only service role can insert/update (via API routes)
CREATE POLICY "Service role full access" ON orders
  FOR ALL USING (true) WITH CHECK (true);
