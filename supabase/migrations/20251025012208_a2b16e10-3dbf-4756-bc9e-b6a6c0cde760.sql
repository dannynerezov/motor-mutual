-- Function to get summary statistics
CREATE OR REPLACE FUNCTION get_pricing_summary_stats()
RETURNS TABLE (
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
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT,
    AVG(CAST(index_value AS NUMERIC)),
    MIN(CAST(index_value AS NUMERIC)),
    MAX(CAST(index_value AS NUMERIC)),
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY CAST(index_value AS NUMERIC)),
    STDDEV(CAST(index_value AS NUMERIC))
  FROM insurance_pricing_data
  WHERE index_value IS NOT NULL 
    AND index_value != ''
    AND index_value ~ '^[0-9]+\.?[0-9]*$';
END;
$$;

-- Function for state analysis
CREATE OR REPLACE FUNCTION get_state_pricing_analysis()
RETURNS TABLE (
  state TEXT,
  avg_index NUMERIC,
  min_index NUMERIC,
  max_index NUMERIC,
  location_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ipd.state,
    AVG(CAST(ipd.index_value AS NUMERIC)),
    MIN(CAST(ipd.index_value AS NUMERIC)),
    MAX(CAST(ipd.index_value AS NUMERIC)),
    COUNT(*)::BIGINT
  FROM insurance_pricing_data ipd
  WHERE ipd.index_value IS NOT NULL 
    AND ipd.index_value != ''
    AND ipd.index_value ~ '^[0-9]+\.?[0-9]*$'
  GROUP BY ipd.state
  ORDER BY AVG(CAST(ipd.index_value AS NUMERIC)) DESC;
END;
$$;