-- Clean up pricing_schemes table to match the Excel model
-- Remove columns that are not part of the 4-variable pricing scheme
ALTER TABLE pricing_schemes 
DROP COLUMN IF EXISTS vehicle_value,
DROP COLUMN IF EXISTS base_premium,
DROP COLUMN IF EXISTS increment,
DROP COLUMN IF EXISTS number_increments;

-- Add validation constraints
ALTER TABLE pricing_schemes
ADD CONSTRAINT floor_point_positive CHECK (floor_point > 0),
ADD CONSTRAINT ceiling_greater_than_floor CHECK (ceiling_point > floor_point),
ADD CONSTRAINT prices_positive CHECK (ceiling_price > 0 AND floor_price > 0);