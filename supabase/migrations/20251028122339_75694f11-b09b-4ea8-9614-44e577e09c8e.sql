-- Add address_gnaf_data column to quotes table to store GNAF data
ALTER TABLE public.quotes 
ADD COLUMN IF NOT EXISTS address_gnaf_data JSONB;

-- Verify vehicle_variant column exists in quote_vehicles table
ALTER TABLE public.quote_vehicles 
ADD COLUMN IF NOT EXISTS vehicle_variant TEXT;

-- Add helpful comment
COMMENT ON COLUMN public.quotes.address_gnaf_data IS 'Stores geocoded national address file data from address validation for Suncorp API';
COMMENT ON COLUMN public.quote_vehicles.vehicle_variant IS 'Vehicle variant/trim level (e.g., VTi-L)';