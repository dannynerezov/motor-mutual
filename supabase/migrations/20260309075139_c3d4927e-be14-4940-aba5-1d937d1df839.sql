
-- =============================================
-- TABLE 1: form1_submissions (Initial contact/enquiry)
-- =============================================
CREATE TABLE public.form1_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  how_can text,
  insurance_type text,
  support_type text,
  home_insurance_type text,
  enquiry_description text,
  claim_description text,
  previously_insured text,
  price_target text,
  insurance_expiry text,
  insurance_expiry_day text,
  insurance_expiry_month text,
  insurance_expiry_year text,
  first_name text,
  last_name text,
  phone text,
  email text,
  attachments jsonb,
  channel text,
  user_field text,
  notes text,
  renewal text,
  contact_type text,
  cc_email text,
  partner_name text,
  deal_id text,
  ip_address text,
  user_agent text,
  submission_status text DEFAULT 'received'
);

ALTER TABLE public.form1_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert form1" ON public.form1_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select form1" ON public.form1_submissions FOR SELECT USING (true);
CREATE POLICY "Public update form1" ON public.form1_submissions FOR UPDATE USING (true);
CREATE TRIGGER update_form1_updated_at BEFORE UPDATE ON public.form1_submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- TABLE 2: form2_submissions (Full quote application)
-- =============================================
CREATE TABLE public.form2_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  customer_type text,
  company_name text,
  abn text,
  abn_duration text,
  deal_id text,
  user_field text,
  cc_email text,
  domain_alias text,
  vehicle_usage text,
  is_rented boolean,
  is_delivery boolean,
  is_rideshare boolean,
  food_delivery_hours text,
  business_usage_type text,
  is_refrigerated boolean,
  first_name text,
  last_name text,
  gender text,
  dob_day text,
  dob_month text,
  dob_year text,
  phone text,
  email text,
  address text,
  address_suncorp_validated text,
  housing_status text,
  international_license text,
  international_years text,
  owner_drives text,
  license_type text,
  all_drivers_2_years text,
  age_received_license text,
  demerit_points text,
  claims_made text,
  claims_count text,
  claims_list jsonb,
  bankruptcy text,
  license_suspended text,
  criminal_offences text,
  insurance_declined text,
  claim_denied_fraud text,
  vehicle_registration text,
  vehicle_state text,
  is_vehicle_unregistered boolean,
  vehicle_make text,
  vehicle_model text,
  vehicle_year text,
  h_plate text,
  vehicle_nvic text,
  vehicle_variant text,
  vehicle_body_style text,
  vehicle_description text,
  vehicle_transmission text,
  vehicle_series text,
  market_value numeric,
  trade_value numeric,
  retail_value numeric,
  vehicle_image_url text,
  vehicle_identification_method text,
  add_more_vehicles text,
  exclude_under_25 text,
  rideshare_delivery text,
  purchase_type text,
  first_owner text,
  continuously_insured text,
  is_financed text,
  finance_company text,
  is_modified text,
  modification_details text,
  security text,
  undamaged_roadworthy text,
  days_per_week_work text,
  km_per_year text,
  peak_times text,
  parking_location text,
  parking_address text,
  policy_start_date text,
  coverage_level text,
  excess_level text,
  policy_extras text,
  roadside_assistance text,
  sum_insured_type text,
  agreed_value numeric,
  nominated_drivers_list jsonb,
  quote_type text,
  better_quote_target_insurer text,
  better_quote_target_price text,
  better_quote_evidence_url text,
  better_quote_calculated_price text,
  previously_insured text,
  which_insurer text,
  current_insurer text,
  current_premium text,
  current_cover text,
  current_excess text,
  privacy_accepted boolean,
  broker_terms_accepted boolean,
  home_insurance_opt_in boolean,
  signature text,
  ip_address text,
  user_agent text,
  submission_status text DEFAULT 'received'
);

ALTER TABLE public.form2_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert form2" ON public.form2_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select form2" ON public.form2_submissions FOR SELECT USING (true);
CREATE POLICY "Public update form2" ON public.form2_submissions FOR UPDATE USING (true);
CREATE TRIGGER update_form2_updated_at BEFORE UPDATE ON public.form2_submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- TABLE 3: form3_submissions (Quote issued)
-- =============================================
CREATE TABLE public.form3_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  form2_submission_id uuid REFERENCES public.form2_submissions(id),
  quote_agent text,
  deal_id text,
  insurance_type text,
  policy_description text,
  insurer_quotation_url text,
  product text,
  policy_start_date text,
  insurer_reference text,
  policy_type text,
  policy_coverage text,
  agreed_value numeric,
  vehicle_rego text,
  vehicle_make text,
  vehicle_model text,
  vehicle_year text,
  standard_excess numeric,
  excess_cashback numeric,
  customer_excess numeric,
  form2_excess_level text,
  vehicle_value numeric,
  additional_vehicles text,
  named_drivers jsonb,
  policy_extras jsonb,
  overseas_licences text,
  age_restriction text,
  brokerage_fee numeric,
  base_premium numeric,
  fire_levy numeric,
  uw_levy numeric,
  stamp_duty numeric,
  gst numeric,
  insurer_total numeric,
  broker_fee_total numeric,
  processing_fee numeric,
  total_annual_premium numeric,
  total_monthly_premium numeric,
  difference_monthly_to_yearly numeric,
  ip_address text,
  user_agent text,
  submission_status text DEFAULT 'received'
);

ALTER TABLE public.form3_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert form3" ON public.form3_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select form3" ON public.form3_submissions FOR SELECT USING (true);
CREATE POLICY "Public update form3" ON public.form3_submissions FOR UPDATE USING (true);
CREATE TRIGGER update_form3_updated_at BEFORE UPDATE ON public.form3_submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- TABLE 4: form4_submissions (Quote accepted)
-- =============================================
CREATE TABLE public.form4_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  form3_submission_id uuid REFERENCES public.form3_submissions(id),
  deal_id text,
  policy_type text,
  policy_coverage text,
  standard_excess numeric,
  customer_excess numeric,
  vehicle_rego text,
  vehicle_make text,
  vehicle_model text,
  vehicle_year text,
  insurance_type text,
  additional_vehicles text,
  total_annual_premium numeric,
  total_monthly_premium numeric,
  policy_start_date text,
  customer_first_name text,
  customer_last_name text,
  customer_email text,
  customer_phone text,
  vehicle_usage text,
  vehicle_image_url text,
  vehicle_value numeric,
  vehicle_state text,
  underwriter text,
  details_confirmed boolean,
  terms_accepted boolean,
  payment_method text,
  confirmation_choice text,
  change_request_text text,
  change_request_category text,
  ip_address text,
  user_agent text,
  submission_status text DEFAULT 'received'
);

ALTER TABLE public.form4_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert form4" ON public.form4_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select form4" ON public.form4_submissions FOR SELECT USING (true);
CREATE POLICY "Public update form4" ON public.form4_submissions FOR UPDATE USING (true);
CREATE TRIGGER update_form4_updated_at BEFORE UPDATE ON public.form4_submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- Enable Realtime
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.form1_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.form2_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.form3_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.form4_submissions;
