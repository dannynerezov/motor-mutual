-- Create table for insurance pricing data by location
CREATE TABLE public.insurance_pricing_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_address TEXT NOT NULL,
  index_value TEXT,
  street TEXT,
  suburb TEXT,
  state TEXT NOT NULL,
  postcode TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.insurance_pricing_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read (for public display)
CREATE POLICY "Anyone can view pricing data" 
ON public.insurance_pricing_data 
FOR SELECT 
USING (true);

-- Create policy to allow anyone to insert (will add auth later)
CREATE POLICY "Anyone can insert pricing data" 
ON public.insurance_pricing_data 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to delete (for admin cleanup)
CREATE POLICY "Anyone can delete pricing data" 
ON public.insurance_pricing_data 
FOR DELETE 
USING (true);

-- Create index for faster lookups by postcode and state
CREATE INDEX idx_pricing_postcode ON public.insurance_pricing_data(postcode);
CREATE INDEX idx_pricing_state ON public.insurance_pricing_data(state);
CREATE INDEX idx_pricing_suburb ON public.insurance_pricing_data(suburb);