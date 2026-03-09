
ALTER TABLE form3_submissions
  ADD COLUMN IF NOT EXISTS uw_quote_number text,
  ADD COLUMN IF NOT EXISTS uw_name text,
  ADD COLUMN IF NOT EXISTS uw_base_premium numeric,
  ADD COLUMN IF NOT EXISTS uw_stamp_duty numeric,
  ADD COLUMN IF NOT EXISTS uw_fire_levy numeric,
  ADD COLUMN IF NOT EXISTS uw_gst numeric,
  ADD COLUMN IF NOT EXISTS uw_total_premium numeric;

ALTER TABLE form2_submissions
  ADD COLUMN IF NOT EXISTS form1_submission_id uuid REFERENCES form1_submissions(id);
