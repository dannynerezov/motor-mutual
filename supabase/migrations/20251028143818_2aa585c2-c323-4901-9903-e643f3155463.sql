-- Add trade_low_price and retail_price columns to quote_vehicles table
ALTER TABLE quote_vehicles 
ADD COLUMN IF NOT EXISTS trade_low_price NUMERIC,
ADD COLUMN IF NOT EXISTS retail_price NUMERIC;