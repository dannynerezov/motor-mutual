-- Add Suncorp Third Party quote columns to quotes table
ALTER TABLE public.quotes
ADD COLUMN third_party_quote_number TEXT,
ADD COLUMN third_party_base_premium NUMERIC,
ADD COLUMN third_party_stamp_duty NUMERIC,
ADD COLUMN third_party_gst NUMERIC,
ADD COLUMN third_party_total_premium NUMERIC,
ADD COLUMN third_party_api_request_payload JSONB,
ADD COLUMN third_party_api_response_data JSONB;

-- Add address columns to named_drivers table for Suncorp API
ALTER TABLE public.named_drivers
ADD COLUMN address_line1 TEXT,
ADD COLUMN address_unit_type TEXT,
ADD COLUMN address_unit_number TEXT,
ADD COLUMN address_street_number TEXT,
ADD COLUMN address_street_name TEXT,
ADD COLUMN address_street_type TEXT,
ADD COLUMN address_suburb TEXT,
ADD COLUMN address_state TEXT,
ADD COLUMN address_postcode TEXT,
ADD COLUMN address_lurn TEXT,
ADD COLUMN address_latitude TEXT,
ADD COLUMN address_longitude TEXT;