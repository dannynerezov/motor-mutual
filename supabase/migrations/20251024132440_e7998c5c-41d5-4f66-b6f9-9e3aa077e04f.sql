-- Create vehicle images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-images', 'vehicle-images', true);

-- Allow public read access to vehicle images
CREATE POLICY "Public read access for vehicle images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'vehicle-images');

-- Allow service role to insert vehicle images
CREATE POLICY "Service role can insert vehicle images"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'vehicle-images');