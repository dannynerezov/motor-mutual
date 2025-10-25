-- Create sequence for automatic PDS version numbering
CREATE SEQUENCE IF NOT EXISTS pds_version_seq START 1;

-- Function to auto-generate sequential version numbers
CREATE OR REPLACE FUNCTION public.set_pds_version_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.version_number IS NULL OR NEW.version_number = '' THEN
    NEW.version_number := nextval('pds_version_seq')::text || '.0';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to set version number before insert
DROP TRIGGER IF EXISTS set_version_before_insert ON public.product_disclosure_statements;
CREATE TRIGGER set_version_before_insert
  BEFORE INSERT ON public.product_disclosure_statements
  FOR EACH ROW
  EXECUTE FUNCTION public.set_pds_version_number();

-- Update the deactivate trigger to manage timeline automatically
CREATE OR REPLACE FUNCTION public.deactivate_previous_pds()
RETURNS TRIGGER AS $$
BEGIN
  -- Set NEW.effective_from to current timestamp if not provided
  IF NEW.effective_from IS NULL THEN
    NEW.effective_from := now();
  END IF;

  -- Update all currently active PDSs to set their end time and deactivate
  UPDATE public.product_disclosure_statements
  SET is_active = false,
      effective_until = NEW.effective_from,
      updated_at = now()
  WHERE is_active = true
    AND id != NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;