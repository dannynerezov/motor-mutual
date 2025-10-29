-- Create the sample_vehicle_quotes table
CREATE TABLE IF NOT EXISTS public.sample_vehicle_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Input data
  state TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  
  -- Vehicle identification (from Suncorp API via vehicle-lookup function)
  vehicle_year INTEGER,
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_variant TEXT,
  vehicle_nvic TEXT,
  vehicle_desc1 TEXT,
  vehicle_desc2 TEXT,
  vehicle_body_style TEXT,
  vehicle_transmission TEXT,
  vehicle_fuel_type TEXT,
  vehicle_series TEXT,
  
  -- Valuation data (from Suncorp API)
  market_value NUMERIC,
  retail_price NUMERIC,
  trade_low_price NUMERIC,
  trade_price NUMERIC,
  
  -- Image data (from vehicle-lookup function)
  vehicle_image_url TEXT,
  image_exists BOOLEAN DEFAULT false,
  
  -- Pricing calculation (using active pricing scheme)
  calculated_membership_price NUMERIC,
  pricing_scheme_id UUID REFERENCES public.pricing_schemes(id) ON DELETE SET NULL,
  pricing_scheme_number INTEGER,
  
  -- Processing metadata
  api_response_data JSONB,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'success', 'failed')),
  error_message TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- Prevent duplicate entries for same vehicle
  CONSTRAINT unique_state_registration UNIQUE(state, registration_number)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_sample_vehicle_quotes_status 
  ON public.sample_vehicle_quotes(processing_status);

CREATE INDEX IF NOT EXISTS idx_sample_vehicle_quotes_state_rego 
  ON public.sample_vehicle_quotes(state, registration_number);

CREATE INDEX IF NOT EXISTS idx_sample_vehicle_quotes_pricing_scheme 
  ON public.sample_vehicle_quotes(pricing_scheme_id);

CREATE INDEX IF NOT EXISTS idx_sample_vehicle_quotes_created_at 
  ON public.sample_vehicle_quotes(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.sample_vehicle_quotes ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public read access
CREATE POLICY "Allow public read access to sample_vehicle_quotes"
  ON public.sample_vehicle_quotes
  FOR SELECT
  USING (true);

-- RLS Policy: Allow public insert
CREATE POLICY "Allow public insert to sample_vehicle_quotes"
  ON public.sample_vehicle_quotes
  FOR INSERT
  WITH CHECK (true);

-- RLS Policy: Allow public update
CREATE POLICY "Allow public update to sample_vehicle_quotes"
  ON public.sample_vehicle_quotes
  FOR UPDATE
  USING (true);

-- RLS Policy: Allow public delete
CREATE POLICY "Allow public delete to sample_vehicle_quotes"
  ON public.sample_vehicle_quotes
  FOR DELETE
  USING (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_sample_vehicle_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_sample_vehicle_quotes_updated_at
  BEFORE UPDATE ON public.sample_vehicle_quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_sample_vehicle_quotes_updated_at();

-- Add comment for documentation
COMMENT ON TABLE public.sample_vehicle_quotes IS 
  'Stores processed vehicle quotes from bulk registration processing. Used for building sample database and analysis.';