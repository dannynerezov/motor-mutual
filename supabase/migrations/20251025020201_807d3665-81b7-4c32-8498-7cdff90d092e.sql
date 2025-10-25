-- Fix get_pricing_summary_stats to properly cast median calculation
CREATE OR REPLACE FUNCTION public.get_pricing_summary_stats()
RETURNS TABLE(
  total_locations BIGINT,
  avg_index NUMERIC,
  min_index NUMERIC,
  max_index NUMERIC,
  median_index NUMERIC,
  std_dev NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT,
    AVG(CAST(index_value AS NUMERIC)),
    MIN(CAST(index_value AS NUMERIC)),
    MAX(CAST(index_value AS NUMERIC)),
    CAST(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY CAST(index_value AS NUMERIC)) AS NUMERIC),
    STDDEV(CAST(index_value AS NUMERIC))
  FROM insurance_pricing_data
  WHERE index_value IS NOT NULL 
    AND index_value != ''
    AND index_value ~ '^[0-9]+\.?[0-9]*$';
END;
$function$;

-- Create function to aggregate postcode pricing data
CREATE OR REPLACE FUNCTION public.get_postcode_pricing_analysis()
RETURNS TABLE (
  postcode TEXT,
  state TEXT,
  avg_index NUMERIC,
  min_index NUMERIC,
  max_index NUMERIC,
  location_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    ipd.postcode,
    ipd.state,
    ROUND(AVG(CAST(ipd.index_value AS NUMERIC)), 2) as avg_index,
    ROUND(MIN(CAST(ipd.index_value AS NUMERIC)), 2) as min_index,
    ROUND(MAX(CAST(ipd.index_value AS NUMERIC)), 2) as max_index,
    COUNT(*)::BIGINT as location_count
  FROM insurance_pricing_data ipd
  WHERE ipd.index_value IS NOT NULL 
    AND ipd.index_value != ''
    AND ipd.index_value ~ '^[0-9]+\.?[0-9]*$'
    AND ipd.postcode IS NOT NULL
    AND ipd.postcode != ''
    AND CAST(ipd.index_value AS NUMERIC) > 0
  GROUP BY ipd.postcode, ipd.state
  ORDER BY avg_index DESC;
END;
$function$;