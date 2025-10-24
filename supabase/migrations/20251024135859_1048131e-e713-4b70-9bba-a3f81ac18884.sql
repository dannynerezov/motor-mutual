-- Fix search_path for generate_quote_number function
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  seq_num INTEGER;
  date_prefix TEXT;
BEGIN
  seq_num := nextval('quote_number_seq');
  date_prefix := to_char(CURRENT_DATE, 'YYYYMMDD');
  RETURN 'MCM' || date_prefix || LPAD(seq_num::TEXT, 4, '0');
END;
$$;

-- Fix search_path for set_quote_number function
CREATE OR REPLACE FUNCTION set_quote_number()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.quote_number IS NULL OR NEW.quote_number = '' THEN
    NEW.quote_number := generate_quote_number();
  END IF;
  RETURN NEW;
END;
$$;