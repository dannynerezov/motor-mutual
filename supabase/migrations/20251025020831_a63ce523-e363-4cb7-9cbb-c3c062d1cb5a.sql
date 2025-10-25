-- Create paginated function for suburb pricing analysis
CREATE OR REPLACE FUNCTION public.get_suburb_pricing_analysis_paginated(
  limit_rows INTEGER DEFAULT 1000,
  offset_rows INTEGER DEFAULT 0
)
RETURNS TABLE(
  suburb TEXT,
  state TEXT,
  postcode TEXT,
  avg_index NUMERIC,
  min_index NUMERIC,
  max_index NUMERIC,
  location_count BIGINT,
  total_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  RETURN QUERY
  WITH aggregated AS (
    SELECT 
      ipd.suburb,
      ipd.state,
      ipd.postcode,
      ROUND(AVG(CAST(ipd.index_value AS NUMERIC)), 2) as avg_index,
      ROUND(MIN(CAST(ipd.index_value AS NUMERIC)), 2) as min_index,
      ROUND(MAX(CAST(ipd.index_value AS NUMERIC)), 2) as max_index,
      COUNT(*)::BIGINT as location_count
    FROM insurance_pricing_data ipd
    WHERE ipd.index_value IS NOT NULL 
      AND ipd.index_value != ''
      AND ipd.index_value ~ '^[0-9]+\.?[0-9]*$'
      AND ipd.suburb IS NOT NULL
      AND ipd.suburb != ''
      AND CAST(ipd.index_value AS NUMERIC) > 0
    GROUP BY ipd.suburb, ipd.state, ipd.postcode
  )
  SELECT 
    a.suburb,
    a.state,
    a.postcode,
    a.avg_index,
    a.min_index,
    a.max_index,
    a.location_count,
    COUNT(*) OVER() as total_count
  FROM aggregated a
  ORDER BY a.avg_index DESC
  LIMIT limit_rows
  OFFSET offset_rows;
END;
$function$;