-- Create table for storing Suncorp quote details
CREATE TABLE public.suncorp_quote_details (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Suncorp Quote Fields
  suncorp_quote_number text,
  policy_start_date date,
  policy_expiry_date date,
  quote_create_date date,
  
  -- Financial Fields
  market_value numeric,
  sum_insured_type text,
  annual_premium numeric,
  annual_base_premium numeric,
  annual_stamp_duty numeric,
  annual_fsl numeric,
  annual_gst numeric,
  
  -- Address Fields
  street_name text,
  street_number text,
  suburb text,
  state text,
  postcode text,
  
  -- Vehicle Usage Fields
  primary_usage text,
  km_per_year text,
  
  -- Cover Details
  cover_type text,
  standard_excess numeric,
  has_fire_and_theft boolean DEFAULT false,
  
  -- Policy Holder Details
  has_rejected_insurance_or_claims boolean DEFAULT false,
  has_criminal_history boolean DEFAULT false,
  
  -- Unique constraint to prevent duplicates
  UNIQUE(quote_id)
);

-- Enable RLS
ALTER TABLE public.suncorp_quote_details ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read access to suncorp_quote_details"
ON public.suncorp_quote_details
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert to suncorp_quote_details"
ON public.suncorp_quote_details
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update to suncorp_quote_details"
ON public.suncorp_quote_details
FOR UPDATE
TO public
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_suncorp_quote_details_updated_at
BEFORE UPDATE ON public.suncorp_quote_details
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();