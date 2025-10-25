-- Create function to get suburb-level pricing data for a specific state
CREATE OR REPLACE FUNCTION public.get_state_suburbs(state_filter TEXT)
RETURNS TABLE (
  suburb TEXT,
  postcode TEXT,
  avg_index NUMERIC,
  min_index NUMERIC,
  max_index NUMERIC,
  location_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    ipd.suburb,
    ipd.postcode,
    ROUND(AVG(CAST(ipd.index_value AS NUMERIC)), 2) as avg_index,
    ROUND(MIN(CAST(ipd.index_value AS NUMERIC)), 2) as min_index,
    ROUND(MAX(CAST(ipd.index_value AS NUMERIC)), 2) as max_index,
    COUNT(*)::BIGINT as location_count
  FROM insurance_pricing_data ipd
  WHERE ipd.state = state_filter
    AND ipd.index_value IS NOT NULL 
    AND ipd.index_value != ''
    AND ipd.index_value ~ '^[0-9]+\.?[0-9]*$'
    AND ipd.suburb IS NOT NULL
    AND ipd.suburb != ''
    AND CAST(ipd.index_value AS NUMERIC) > 0
  GROUP BY ipd.suburb, ipd.postcode
  ORDER BY avg_index ASC;
END;
$function$;