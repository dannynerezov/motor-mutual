-- Fix security linter warnings by setting search_path on functions

-- Update deactivate_previous_pds function
CREATE OR REPLACE FUNCTION deactivate_previous_pds()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE product_disclosure_statements
    SET is_active = false,
        effective_until = NEW.effective_from,
        updated_at = now()
    WHERE is_active = true
      AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update get_active_pds function
CREATE OR REPLACE FUNCTION get_active_pds()
RETURNS SETOF product_disclosure_statements AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM product_disclosure_statements
  WHERE is_active = true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;