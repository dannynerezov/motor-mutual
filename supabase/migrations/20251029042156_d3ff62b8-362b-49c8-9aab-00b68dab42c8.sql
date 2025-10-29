-- Fix search_path security issue for update_manual_quote_requests_updated_at function
-- Drop trigger first
DROP TRIGGER IF EXISTS trigger_update_manual_quote_requests_updated_at ON public.manual_quote_requests;

-- Drop function
DROP FUNCTION IF EXISTS public.update_manual_quote_requests_updated_at();

-- Recreate function with proper search_path
CREATE OR REPLACE FUNCTION public.update_manual_quote_requests_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER trigger_update_manual_quote_requests_updated_at
  BEFORE UPDATE ON public.manual_quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_manual_quote_requests_updated_at();