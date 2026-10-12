-- Email leads and which campaigns each lead has received.
-- Idempotent. Run in the Supabase SQL Editor before deploying this feature.
-- Service-role only: anon/authenticated cannot read leads or lead_campaigns.

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  source text NOT NULL DEFAULT 'gratis-ukeplan',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  created_at timestamptz NOT NULL DEFAULT now(),
  consent_at timestamptz NOT NULL DEFAULT now(),
  consent_source text NOT NULL DEFAULT 'gratis-form',
  unsubscribed boolean NOT NULL DEFAULT false,
  unsubscribed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_leads_source ON leads (source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at);

CREATE TABLE IF NOT EXISTS lead_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads (id) ON DELETE CASCADE,
  campaign text NOT NULL,
  status text NOT NULL,
  sent_at timestamptz,
  enrolled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lead_id, campaign)
);

CREATE INDEX IF NOT EXISTS idx_lead_campaigns_lead_id ON lead_campaigns (lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_campaigns_campaign ON lead_campaigns (campaign);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_campaigns ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE leads FROM PUBLIC;
REVOKE ALL ON TABLE leads FROM anon;
REVOKE ALL ON TABLE leads FROM authenticated;
GRANT ALL ON TABLE leads TO service_role;

REVOKE ALL ON TABLE lead_campaigns FROM PUBLIC;
REVOKE ALL ON TABLE lead_campaigns FROM anon;
REVOKE ALL ON TABLE lead_campaigns FROM authenticated;
GRANT ALL ON TABLE lead_campaigns TO service_role;

-- No policies on purpose. Anon/authenticated have no access.
-- The service role bypasses RLS.
