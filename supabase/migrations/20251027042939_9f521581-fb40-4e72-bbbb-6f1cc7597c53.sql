-- ============================================
-- TABLE 1: third_party_quotes
-- Stores individual third-party insurance quotes from Suncorp
-- ============================================
CREATE TABLE public.third_party_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  -- Vehicle information
  registration_number TEXT NOT NULL,
  registration_state TEXT NOT NULL,
  vehicle_nvic TEXT NOT NULL,
  vehicle_year TEXT NOT NULL,
  vehicle_make TEXT NOT NULL,
  vehicle_family TEXT NOT NULL,
  vehicle_variant TEXT NOT NULL,
  vehicle_body_style TEXT,
  vehicle_transmission TEXT,
  vehicle_drive_type TEXT,
  vehicle_engine_size TEXT,
  
  -- Risk address (where vehicle is garaged)
  risk_address_postcode TEXT NOT NULL,
  risk_address_suburb TEXT NOT NULL,
  risk_address_state TEXT NOT NULL,
  risk_address_street_number TEXT NOT NULL,
  risk_address_street_name TEXT NOT NULL,
  risk_address_street_type TEXT NOT NULL,
  risk_address_unit_number TEXT,
  risk_address_unit_type TEXT,
  risk_address_lurn TEXT NOT NULL,
  risk_address_latitude TEXT,
  risk_address_longitude TEXT,
  
  -- Customer information
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('M', 'F')),
  
  -- Policy details
  policy_start_date DATE NOT NULL,
  primary_usage TEXT NOT NULL,
  km_per_year TEXT NOT NULL,
  current_insurer TEXT NOT NULL,
  sum_insured_type TEXT NOT NULL,
  cover_type TEXT NOT NULL DEFAULT 'THIRD_PARTY',
  
  -- Valuation
  market_value NUMERIC(10, 2),
  agreed_value NUMERIC(10, 2),
  
  -- Pricing breakdown
  base_premium NUMERIC(10, 2) NOT NULL,
  stamp_duty NUMERIC(10, 2) NOT NULL,
  gst NUMERIC(10, 2) NOT NULL,
  total_premium NUMERIC(10, 2) NOT NULL,
  
  -- Suncorp quote reference
  quote_number TEXT NOT NULL,
  quote_reference TEXT NOT NULL,
  
  -- API data for debugging (JSONB for flexibility)
  api_request_payload JSONB,
  api_response_data JSONB,
  
  -- Metadata
  ip_address TEXT,
  user_agent TEXT,
  
  -- Indexes for common queries
  CONSTRAINT unique_quote_number UNIQUE (quote_number)
);

CREATE INDEX idx_third_party_quotes_rego ON public.third_party_quotes(registration_number);
CREATE INDEX idx_third_party_quotes_state ON public.third_party_quotes(registration_state);
CREATE INDEX idx_third_party_quotes_created ON public.third_party_quotes(created_at DESC);
CREATE INDEX idx_third_party_quotes_postcode ON public.third_party_quotes(risk_address_postcode);

-- ============================================
-- TABLE 2: bulk_quote_batches
-- Tracks batch processing sessions
-- ============================================
CREATE TABLE public.bulk_quote_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  batch_name TEXT,
  created_by TEXT DEFAULT 'system' NOT NULL,
  
  -- Processing statistics
  total_records INTEGER NOT NULL,
  successful_records INTEGER DEFAULT 0 NOT NULL,
  failed_records INTEGER DEFAULT 0 NOT NULL,
  
  -- Timing information
  processing_start_time TIMESTAMP WITH TIME ZONE,
  processing_end_time TIMESTAMP WITH TIME ZONE,
  total_processing_time_ms INTEGER,
  
  CONSTRAINT valid_record_counts CHECK (
    successful_records + failed_records <= total_records
  )
);

CREATE INDEX idx_bulk_batches_created ON public.bulk_quote_batches(created_at DESC);

-- ============================================
-- TABLE 3: bulk_quote_processing_logs
-- Detailed audit trail of every API call
-- ============================================
CREATE TABLE public.bulk_quote_processing_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  batch_id UUID REFERENCES public.bulk_quote_batches(id) ON DELETE CASCADE NOT NULL,
  record_id INTEGER NOT NULL,
  record_identifier TEXT NOT NULL,
  
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  action TEXT NOT NULL CHECK (action IN (
    'vehicle_lookup',
    'address_search',
    'address_validate',
    'quote_generation',
    'quote_generation_retry',
    'batch_start',
    'batch_complete',
    'record_start',
    'record_complete'
  )),
  status TEXT NOT NULL CHECK (status IN ('success', 'error')),
  
  api_endpoint TEXT,
  request_payload JSONB,
  response_data JSONB,
  error_message TEXT,
  
  execution_time_ms INTEGER,
  
  CONSTRAINT valid_execution_time CHECK (execution_time_ms >= 0)
);

CREATE INDEX idx_bulk_logs_batch ON public.bulk_quote_processing_logs(batch_id);
CREATE INDEX idx_bulk_logs_record ON public.bulk_quote_processing_logs(batch_id, record_id);
CREATE INDEX idx_bulk_logs_timestamp ON public.bulk_quote_processing_logs(timestamp DESC);
CREATE INDEX idx_bulk_logs_action ON public.bulk_quote_processing_logs(action);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all three tables
ALTER TABLE public.third_party_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_quote_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_quote_processing_logs ENABLE ROW LEVEL SECURITY;

-- Public read access (adjust based on your security requirements)
CREATE POLICY "Allow public read access to third_party_quotes"
ON public.third_party_quotes FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert to third_party_quotes"
ON public.third_party_quotes FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public read access to bulk_quote_batches"
ON public.bulk_quote_batches FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert/update to bulk_quote_batches"
ON public.bulk_quote_batches FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update to bulk_quote_batches"
ON public.bulk_quote_batches FOR UPDATE
TO public
USING (true);

CREATE POLICY "Allow public read access to bulk_quote_processing_logs"
ON public.bulk_quote_processing_logs FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert to bulk_quote_processing_logs"
ON public.bulk_quote_processing_logs FOR INSERT
TO public
WITH CHECK (true);

-- ============================================
-- AUTOMATIC UPDATED_AT TRIGGER
-- ============================================

CREATE TRIGGER update_third_party_quotes_updated_at
BEFORE UPDATE ON public.third_party_quotes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bulk_quote_batches_updated_at
BEFORE UPDATE ON public.bulk_quote_batches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();