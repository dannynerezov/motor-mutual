-- Drop existing function if it exists and recreate with correct return type
DROP FUNCTION IF EXISTS public.get_state_pricing_analysis();

-- Create function to get state-level pricing analysis with accurate statistics
CREATE OR REPLACE FUNCTION public.get_state_pricing_analysis()
RETURNS TABLE (
  state TEXT,
  suburb_count BIGINT,
  location_count BIGINT,
  avg_index NUMERIC,
  min_index NUMERIC,
  max_index NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    ipd.state,
    COUNT(DISTINCT ipd.suburb)::BIGINT as suburb_count,
    COUNT(*)::BIGINT as location_count,
    ROUND(AVG(CAST(ipd.index_value AS NUMERIC)), 1) as avg_index,
    ROUND(MIN(CAST(ipd.index_value AS NUMERIC)), 1) as min_index,
    ROUND(MAX(CAST(ipd.index_value AS NUMERIC)), 1) as max_index
  FROM insurance_pricing_data ipd
  WHERE ipd.index_value IS NOT NULL 
    AND ipd.index_value != ''
    AND ipd.index_value ~ '^[0-9]+\.?[0-9]*$'
    AND ipd.state IS NOT NULL
    AND ipd.state != ''
  GROUP BY ipd.state
  ORDER BY avg_index ASC;
END;
$function$;