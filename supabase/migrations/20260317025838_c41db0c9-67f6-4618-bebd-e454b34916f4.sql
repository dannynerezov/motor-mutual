
-- ============================================
-- SECURITY FIX: Lock down SELECT policies on sensitive tables
-- Replace public SELECT (true) with authenticated-only SELECT
-- Keep INSERT policies open for public form submissions
-- ============================================

-- 1. form1_submissions
DROP POLICY IF EXISTS "Public select form1" ON public.form1_submissions;
CREATE POLICY "Authenticated select form1" ON public.form1_submissions
  FOR SELECT TO authenticated USING (true);

-- Also restrict UPDATE to authenticated
DROP POLICY IF EXISTS "Public update form1" ON public.form1_submissions;
CREATE POLICY "Authenticated update form1" ON public.form1_submissions
  FOR UPDATE TO authenticated USING (true);

-- 2. form2_submissions
DROP POLICY IF EXISTS "Public select form2" ON public.form2_submissions;
CREATE POLICY "Authenticated select form2" ON public.form2_submissions
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Public update form2" ON public.form2_submissions;
CREATE POLICY "Authenticated update form2" ON public.form2_submissions
  FOR UPDATE TO authenticated USING (true);

-- 3. form3_submissions
DROP POLICY IF EXISTS "Public select form3" ON public.form3_submissions;
CREATE POLICY "Authenticated select form3" ON public.form3_submissions
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Public update form3" ON public.form3_submissions;
CREATE POLICY "Authenticated update form3" ON public.form3_submissions
  FOR UPDATE TO authenticated USING (true);

-- 4. form4_submissions
DROP POLICY IF EXISTS "Public select form4" ON public.form4_submissions;
CREATE POLICY "Authenticated select form4" ON public.form4_submissions
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Public update form4" ON public.form4_submissions;
CREATE POLICY "Authenticated update form4" ON public.form4_submissions
  FOR UPDATE TO authenticated USING (true);

-- 5. memberships
DROP POLICY IF EXISTS "Public select memberships" ON public.memberships;
CREATE POLICY "Authenticated select memberships" ON public.memberships
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Public update memberships" ON public.memberships;
CREATE POLICY "Authenticated update memberships" ON public.memberships
  FOR UPDATE TO authenticated USING (true);

-- 6. customers
DROP POLICY IF EXISTS "Anyone can view customers" ON public.customers;
CREATE POLICY "Authenticated select customers" ON public.customers
  FOR SELECT TO authenticated USING (true);

-- 7. quotes
DROP POLICY IF EXISTS "Anyone can view their quotes" ON public.quotes;
CREATE POLICY "Authenticated select quotes" ON public.quotes
  FOR SELECT TO authenticated USING (true);

-- 8. mutual_quotes
DROP POLICY IF EXISTS "Public read access to mutual_quotes" ON public.mutual_quotes;
CREATE POLICY "Authenticated select mutual_quotes" ON public.mutual_quotes
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Public update to mutual_quotes" ON public.mutual_quotes;
CREATE POLICY "Authenticated update mutual_quotes" ON public.mutual_quotes
  FOR UPDATE TO authenticated USING (true);

-- 9. suncorp_quote_details
DROP POLICY IF EXISTS "Allow public read access to suncorp_quote_details" ON public.suncorp_quote_details;
CREATE POLICY "Authenticated select suncorp_quote_details" ON public.suncorp_quote_details
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow public update to suncorp_quote_details" ON public.suncorp_quote_details;
CREATE POLICY "Authenticated update suncorp_quote_details" ON public.suncorp_quote_details
  FOR UPDATE TO authenticated USING (true);

-- 10. third_party_quotes
DROP POLICY IF EXISTS "Allow public read access to third_party_quotes" ON public.third_party_quotes;
CREATE POLICY "Authenticated select third_party_quotes" ON public.third_party_quotes
  FOR SELECT TO authenticated USING (true);

-- 11. claims
DROP POLICY IF EXISTS "Anyone can view claims" ON public.claims;
CREATE POLICY "Authenticated select claims" ON public.claims
  FOR SELECT TO authenticated USING (true);

-- 12. policies
DROP POLICY IF EXISTS "Anyone can view policies" ON public.policies;
CREATE POLICY "Authenticated select policies" ON public.policies
  FOR SELECT TO authenticated USING (true);

-- 13. named_drivers - restrict to authenticated
DROP POLICY IF EXISTS "Anyone can manage named drivers" ON public.named_drivers;
CREATE POLICY "Authenticated manage named_drivers" ON public.named_drivers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- Keep public insert for named drivers if needed during quote flow
CREATE POLICY "Public insert named_drivers" ON public.named_drivers
  FOR INSERT TO public WITH CHECK (true);

-- 14. bulk_quote_batches - admin data
DROP POLICY IF EXISTS "Allow public read access to bulk_quote_batches" ON public.bulk_quote_batches;
CREATE POLICY "Authenticated select bulk_quote_batches" ON public.bulk_quote_batches
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow public insert/update to bulk_quote_batches" ON public.bulk_quote_batches;
CREATE POLICY "Authenticated insert bulk_quote_batches" ON public.bulk_quote_batches
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update to bulk_quote_batches" ON public.bulk_quote_batches;
CREATE POLICY "Authenticated update bulk_quote_batches" ON public.bulk_quote_batches
  FOR UPDATE TO authenticated USING (true);

-- 15. bulk_quote_processing_logs
DROP POLICY IF EXISTS "Allow public read access to bulk_quote_processing_logs" ON public.bulk_quote_processing_logs;
CREATE POLICY "Authenticated select bulk_quote_processing_logs" ON public.bulk_quote_processing_logs
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow public insert to bulk_quote_processing_logs" ON public.bulk_quote_processing_logs;
CREATE POLICY "Authenticated insert bulk_quote_processing_logs" ON public.bulk_quote_processing_logs
  FOR INSERT TO authenticated WITH CHECK (true);
