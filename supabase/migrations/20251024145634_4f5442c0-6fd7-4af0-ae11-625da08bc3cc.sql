-- Add new columns to named_drivers table
ALTER TABLE public.named_drivers
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT,
ADD COLUMN gender TEXT;

-- Update driver_name to be nullable since we're moving to separate first/last names
ALTER TABLE public.named_drivers
ALTER COLUMN driver_name DROP NOT NULL;

-- Add check constraint for gender values
ALTER TABLE public.named_drivers
ADD CONSTRAINT named_drivers_gender_check CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say') OR gender IS NULL);