-- Fix the deactivate_previous_pds trigger to avoid violating the valid_date_range constraint
-- We'll only set is_active to false, without touching effective_until

CREATE OR REPLACE FUNCTION public.deactivate_previous_pds()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.is_active = true THEN
    -- Only deactivate other records, don't set effective_until
    UPDATE product_disclosure_statements
    SET is_active = false,
        updated_at = now()
    WHERE is_active = true
      AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$;