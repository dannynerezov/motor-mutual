-- Add new vehicle information fields to quote_vehicles table
ALTER TABLE quote_vehicles
ADD COLUMN IF NOT EXISTS state_of_registration TEXT,
ADD COLUMN IF NOT EXISTS vehicle_desc1 TEXT,
ADD COLUMN IF NOT EXISTS vehicle_desc2 TEXT,
ADD COLUMN IF NOT EXISTS vehicle_series TEXT,
ADD COLUMN IF NOT EXISTS vehicle_body_style TEXT,
ADD COLUMN IF NOT EXISTS vehicle_transmission TEXT,
ADD COLUMN IF NOT EXISTS vehicle_fuel_type TEXT;