-- Create RLS policies for pds-documents storage bucket
-- Allow anyone to upload PDFs to the pds-documents bucket
CREATE POLICY "Anyone can upload PDS documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'pds-documents');

-- Allow anyone to read PDS documents
CREATE POLICY "Anyone can read PDS documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'pds-documents');

-- Allow anyone to delete PDS documents (for admin management)
CREATE POLICY "Anyone can delete PDS documents"
ON storage.objects
FOR DELETE
USING (bucket_id = 'pds-documents');

-- Allow anyone to update PDS documents
CREATE POLICY "Anyone can update PDS documents"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'pds-documents');