-- Create pricing schemes table
CREATE TABLE public.pricing_schemes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scheme_number INTEGER NOT NULL,
  vehicle_value NUMERIC NOT NULL,
  base_premium NUMERIC NOT NULL,
  floor_price NUMERIC NOT NULL,
  floor_point NUMERIC NOT NULL,
  ceiling_price NUMERIC NOT NULL,
  ceiling_point NUMERIC NOT NULL,
  increment NUMERIC NOT NULL,
  number_increments INTEGER NOT NULL,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sequence for scheme numbers
CREATE SEQUENCE IF NOT EXISTS pricing_scheme_number_seq START WITH 1;

-- Enable RLS
ALTER TABLE public.pricing_schemes ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Anyone can view pricing schemes"
  ON public.pricing_schemes
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert pricing schemes"
  ON public.pricing_schemes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update pricing schemes"
  ON public.pricing_schemes
  FOR UPDATE
  USING (true);

-- Create function to set scheme number
CREATE OR REPLACE FUNCTION public.set_pricing_scheme_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.scheme_number IS NULL THEN
    NEW.scheme_number := nextval('pricing_scheme_number_seq');
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to auto-set scheme number
CREATE TRIGGER set_pricing_scheme_number_trigger
BEFORE INSERT ON public.pricing_schemes
FOR EACH ROW
EXECUTE FUNCTION public.set_pricing_scheme_number();

-- Create function to deactivate previous schemes
CREATE OR REPLACE FUNCTION public.deactivate_previous_pricing_schemes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Set valid_until for all currently active schemes
  UPDATE public.pricing_schemes
  SET is_active = false,
      valid_until = NEW.valid_from
  WHERE is_active = true
    AND id != NEW.id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-deactivate previous schemes
CREATE TRIGGER deactivate_previous_schemes_trigger
AFTER INSERT ON public.pricing_schemes
FOR EACH ROW
EXECUTE FUNCTION public.deactivate_previous_pricing_schemes();

-- Create function to update updated_at
CREATE TRIGGER update_pricing_schemes_updated_at
BEFORE UPDATE ON public.pricing_schemes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();