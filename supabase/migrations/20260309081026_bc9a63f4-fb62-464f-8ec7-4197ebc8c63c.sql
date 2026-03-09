ALTER TABLE public.form1_submissions ADD COLUMN IF NOT EXISTS quote_number text;

CREATE TRIGGER set_form1_quote_number
  BEFORE INSERT ON public.form1_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_quote_number();