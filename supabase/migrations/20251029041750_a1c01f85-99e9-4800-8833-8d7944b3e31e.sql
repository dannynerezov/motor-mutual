-- Create manual_quote_requests table
CREATE TABLE IF NOT EXISTS public.manual_quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Customer Information
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  
  -- Vehicle Information
  registration_number TEXT NOT NULL,
  state_of_registration TEXT NOT NULL,
  vin_number TEXT,
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_year INTEGER,
  additional_vehicle_info TEXT,
  
  -- Request Details
  error_message TEXT,
  request_notes TEXT,
  
  -- Status Tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'in_progress', 'quote_sent', 'completed', 'cancelled')),
  
  -- Admin Management
  admin_notes TEXT,
  contacted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  assigned_to TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies (allow anonymous inserts for form submissions, restrict reads/updates to authenticated users)
ALTER TABLE public.manual_quote_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (submit manual quote request)
CREATE POLICY "Allow public inserts" ON public.manual_quote_requests
  FOR INSERT
  WITH CHECK (true);

-- Allow all operations for authenticated users (admin panel)
CREATE POLICY "Allow authenticated full access" ON public.manual_quote_requests
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Create index for faster status filtering
CREATE INDEX idx_manual_quote_requests_status ON public.manual_quote_requests(status);
CREATE INDEX idx_manual_quote_requests_created_at ON public.manual_quote_requests(created_at DESC);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_manual_quote_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_manual_quote_requests_updated_at
  BEFORE UPDATE ON public.manual_quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_manual_quote_requests_updated_at();