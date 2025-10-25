-- Add pricing_scheme_id column to quotes table
ALTER TABLE quotes 
ADD COLUMN pricing_scheme_id uuid REFERENCES pricing_schemes(id);

-- Add index for faster lookups
CREATE INDEX idx_quotes_pricing_scheme ON quotes(pricing_scheme_id);

-- Add comment for documentation
COMMENT ON COLUMN quotes.pricing_scheme_id IS 'References the pricing scheme used to calculate this quote';