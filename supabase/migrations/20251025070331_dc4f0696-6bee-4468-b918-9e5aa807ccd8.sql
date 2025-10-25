-- Create storage bucket for PDS documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('pds-documents', 'pds-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Create product_disclosure_statements table
CREATE TABLE product_disclosure_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_number TEXT NOT NULL UNIQUE,
  pdf_file_path TEXT NOT NULL,
  pdf_file_name TEXT NOT NULL,
  pdf_file_size INTEGER NOT NULL,
  
  -- Version metadata
  effective_from TIMESTAMP WITH TIME ZONE NOT NULL,
  effective_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT false,
  
  -- Extracted content from AI analysis
  full_content JSONB NOT NULL,
  summary TEXT,
  key_benefits JSONB,
  coverage_details JSONB,
  exclusions JSONB,
  conditions JSONB,
  
  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  uploaded_by TEXT,
  
  -- Constraints
  CONSTRAINT valid_version_number CHECK (version_number ~ '^\d+\.\d+$'),
  CONSTRAINT valid_date_range CHECK (effective_until IS NULL OR effective_until > effective_from)
);

-- Enable RLS
ALTER TABLE product_disclosure_statements ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX idx_pds_active ON product_disclosure_statements(is_active) WHERE is_active = true;
CREATE INDEX idx_pds_effective_dates ON product_disclosure_statements(effective_from, effective_until);
CREATE INDEX idx_pds_version ON product_disclosure_statements(version_number);

-- Trigger to auto-deactivate previous versions
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_deactivate_previous_pds
  BEFORE INSERT OR UPDATE ON product_disclosure_statements
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION deactivate_previous_pds();

-- Function to get active PDS
CREATE OR REPLACE FUNCTION get_active_pds()
RETURNS SETOF product_disclosure_statements AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM product_disclosure_statements
  WHERE is_active = true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
CREATE POLICY "Public read access to active PDS"
ON product_disclosure_statements FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Admin full access to PDS"
ON product_disclosure_statements FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Storage RLS Policies
CREATE POLICY "Public read access to PDS documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'pds-documents');

CREATE POLICY "Admin upload access to PDS documents"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'pds-documents');

CREATE POLICY "Admin delete access to PDS documents"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'pds-documents');