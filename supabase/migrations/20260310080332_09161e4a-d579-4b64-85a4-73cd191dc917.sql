
-- Create sequence for membership numbers
CREATE SEQUENCE IF NOT EXISTS membership_number_seq START WITH 10001;

-- Create memberships table
CREATE TABLE public.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form1_submission_id uuid REFERENCES form1_submissions(id),
  form2_submission_id uuid REFERENCES form2_submissions(id),
  form3_submission_id uuid REFERENCES form3_submissions(id),
  membership_number text NOT NULL,
  member_first_name text NOT NULL,
  member_last_name text NOT NULL,
  member_email text,
  member_phone text,
  member_address text,
  member_dob text,
  quote_number text,
  deal_id text,
  vehicle_registration text,
  vehicle_make text,
  vehicle_model text,
  vehicle_year text,
  vehicle_description text,
  coverage_level text,
  base_premium numeric,
  total_annual_premium numeric,
  total_monthly_premium numeric,
  membership_start_date timestamp with time zone NOT NULL,
  membership_end_date timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Public select memberships" ON public.memberships FOR SELECT TO public USING (true);
CREATE POLICY "Public insert memberships" ON public.memberships FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public update memberships" ON public.memberships FOR UPDATE TO public USING (true);

-- Generate membership number function
CREATE OR REPLACE FUNCTION public.generate_membership_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  seq_num INTEGER;
  date_prefix TEXT;
BEGIN
  seq_num := nextval('membership_number_seq');
  date_prefix := to_char(CURRENT_DATE, 'DDMMYYYY');
  RETURN 'MCMPOL' || date_prefix || seq_num::TEXT;
END;
$$;
