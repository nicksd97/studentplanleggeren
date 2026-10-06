-- Linjeforening discount codes + order columns.
-- Idempotent. Run in the Supabase SQL Editor before deploying this feature.
-- Service-role only: anon/authenticated cannot read discount_codes.

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

-- No policies on purpose. Anon/authenticated have no access.
-- The service role bypasses RLS.

INSERT INTO discount_codes (code, association_name, percent, active, expires_at, max_redemptions)
VALUES
  ('ABAKUS20', 'Abakus, NTNU', 20, true, (timestamp '2026-12-31 23:59:00' AT TIME ZONE 'Europe/Oslo'), NULL),
  ('ONLINE20', 'Online, NTNU', 20, true, (timestamp '2026-12-31 23:59:00' AT TIME ZONE 'Europe/Oslo'), NULL),
  ('NABLA20', 'Nabla, NTNU', 20, true, (timestamp '2026-12-31 23:59:00' AT TIME ZONE 'Europe/Oslo'), NULL),
  ('OMEGA20', 'Omega, NTNU', 20, true, (timestamp '2026-12-31 23:59:00' AT TIME ZONE 'Europe/Oslo'), NULL),
  ('SPANSK20', 'Spanskrøret, NTNU', 20, true, (timestamp '2026-12-31 23:59:00' AT TIME ZONE 'Europe/Oslo'), NULL),
  ('TIHLDE20', 'TIHLDE, NTNU', 20, true, (timestamp '2026-12-31 23:59:00' AT TIME ZONE 'Europe/Oslo'), NULL),
  ('SAMFUNDET20', 'Studentersamfundet i Trondheim', 20, true, (timestamp '2026-12-31 23:59:00' AT TIME ZONE 'Europe/Oslo'), NULL),
  ('FFU20', 'Fysisk fagutvalg, UiO', 20, true, (timestamp '2026-12-31 23:59:00' AT TIME ZONE 'Europe/Oslo'), NULL),
  ('PSYFU20', 'PSYFU, UiO', 20, true, (timestamp '2026-12-31 23:59:00' AT TIME ZONE 'Europe/Oslo'), NULL),
  ('OKONOMI20', 'Fagutvalget ved Økonomisk institutt, UiO', 20, true, (timestamp '2026-12-31 23:59:00' AT TIME ZONE 'Europe/Oslo'), NULL),
  ('ISV20', 'Fagutvalget ISV, UiO', 20, true, (timestamp '2026-12-31 23:59:00' AT TIME ZONE 'Europe/Oslo'), NULL),
  ('BISO20', 'BISO nasjonal', 20, true, (timestamp '2026-12-31 23:59:00' AT TIME ZONE 'Europe/Oslo'), NULL),
  ('BISOOSLO20', 'BISO Oslo', 20, true, (timestamp '2026-12-31 23:59:00' AT TIME ZONE 'Europe/Oslo'), NULL),
  ('BISOBERGEN20', 'BISO Bergen', 20, true, (timestamp '2026-12-31 23:59:00' AT TIME ZONE 'Europe/Oslo'), NULL),
  ('REALIST20', 'Bergen Realistforening, UiB', 20, true, (timestamp '2026-12-31 23:59:00' AT TIME ZONE 'Europe/Oslo'), NULL)
ON CONFLICT (code) DO NOTHING;
