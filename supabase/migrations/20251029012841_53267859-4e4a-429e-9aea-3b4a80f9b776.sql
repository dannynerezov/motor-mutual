-- Make date_of_birth nullable to allow progressive form filling
-- This allows the initial driver record to be created with null values
-- User fills in details progressively through the form
ALTER TABLE named_drivers 
ALTER COLUMN date_of_birth DROP NOT NULL;