-- Create quote_vehicles table for multiple vehicles per quote
CREATE TABLE public.quote_vehicles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  registration_number text NOT NULL,
  vehicle_make text NOT NULL,
  vehicle_model text NOT NULL,
  vehicle_year integer NOT NULL,
  vehicle_nvic text,
  vehicle_value numeric NOT NULL,
  selected_coverage_value numeric NOT NULL,
  vehicle_image_url text,
  base_price numeric NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on quote_vehicles
ALTER TABLE public.quote_vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert quote vehicles"
ON public.quote_vehicles
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can view quote vehicles"
ON public.quote_vehicles
FOR SELECT
TO public
USING (true);

-- Create named_drivers table
CREATE TABLE public.named_drivers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  driver_name text NOT NULL,
  date_of_birth date NOT NULL,
  claims_count integer NOT NULL DEFAULT 0 CHECK (claims_count >= 0 AND claims_count <= 3),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on named_drivers
ALTER TABLE public.named_drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage named drivers"
ON public.named_drivers
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Add new columns to quotes table
ALTER TABLE public.quotes 
  ADD COLUMN quote_number text UNIQUE,
  ADD COLUMN total_base_price numeric,
  ADD COLUMN total_final_price numeric,
  ADD COLUMN claim_loading_percentage numeric DEFAULT 0;

-- Create sequence for quote numbers
CREATE SEQUENCE quote_number_seq START 1;

-- Function to generate sequential quote numbers
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TEXT AS $$
DECLARE
  seq_num INTEGER;
  date_prefix TEXT;
BEGIN
  seq_num := nextval('quote_number_seq');
  date_prefix := to_char(CURRENT_DATE, 'YYYYMMDD');
  RETURN 'MCM' || date_prefix || LPAD(seq_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger function to auto-set quote number
CREATE OR REPLACE FUNCTION set_quote_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quote_number IS NULL OR NEW.quote_number = '' THEN
    NEW.quote_number := generate_quote_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate quote numbers on insert
CREATE TRIGGER trigger_set_quote_number
  BEFORE INSERT ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION set_quote_number();