import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { quote_number, dob_day, dob_month, dob_year } = await req.json();

    if (!quote_number || !dob_day || !dob_month || !dob_year) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: quote_number, dob_day, dob_month, dob_year' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find form1 by quote_number
    const { data: form1Data, error: form1Error } = await supabaseClient
      .from('form1_submissions')
      .select('*')
      .eq('quote_number', quote_number.trim())
      .maybeSingle();

    if (form1Error || !form1Data) {
      return new Response(
        JSON.stringify({ error: 'Quote not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find form2 linked to form1
    const { data: form2Data } = await supabaseClient
      .from('form2_submissions')
      .select('*')
      .eq('form1_submission_id', form1Data.id)
      .maybeSingle();

    if (!form2Data) {
      return new Response(
        JSON.stringify({ error: 'Incomplete quote - no vehicle/driver details found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify DOB
    const enteredDob = `${String(dob_day).padStart(2, '0')}/${String(dob_month).padStart(2, '0')}/${dob_year}`;
    const storedDob = `${(form2Data.dob_day || '').padStart(2, '0')}/${(form2Data.dob_month || '').padStart(2, '0')}/${form2Data.dob_year}`;

    if (enteredDob !== storedDob) {
      return new Response(
        JSON.stringify({ error: 'Date of birth does not match our records' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find form3 linked to form2
    const { data: form3Data } = await supabaseClient
      .from('form3_submissions')
      .select('*')
      .eq('form2_submission_id', form2Data.id)
      .maybeSingle();

    // Check if already bound
    const { data: existingMembership } = await supabaseClient
      .from('memberships')
      .select('membership_number')
      .eq('quote_number', quote_number.trim())
      .maybeSingle();

    return new Response(
      JSON.stringify({
        form1: form1Data,
        form2: form2Data,
        form3: form3Data,
        membership: existingMembership,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in retrieve-quote:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Something went wrong' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
