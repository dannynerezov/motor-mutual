
CREATE TABLE public.mutual_quotes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id text UNIQUE NOT NULL,
  comp_total_annual numeric,
  comp_benchmark_price numeric,
  mutual_target_price numeric,
  mutual_membership_price numeric,
  tppd_winning_premium numeric,
  tppd_winning_quote_ref text,
  tppd_winning_insurer text,
  tppd_status text DEFAULT 'pending',
  vehicle_state text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.mutual_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to mutual_quotes"
  ON public.mutual_quotes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public insert to mutual_quotes"
  ON public.mutual_quotes
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public update to mutual_quotes"
  ON public.mutual_quotes
  FOR UPDATE
  TO public
  USING (true);
