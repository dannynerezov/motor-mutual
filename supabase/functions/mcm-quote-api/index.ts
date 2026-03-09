import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function generateQuoteNumber(): string {
  const now = new Date();
  const datePrefix = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `MCM${datePrefix}${rand}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const body = await req.json();
    const { action } = body;

    if (action === 'create_form1') {
      const quoteNumber = generateQuoteNumber();
      const { data, error } = await supabase
        .from('form1_submissions')
        .insert({
          deal_id: body.deal_id || null,
          first_name: body.first_name || null,
          last_name: body.last_name || null,
          email: body.email || null,
          phone: body.phone || null,
          insurance_type: body.insurance_type || 'Rideshare',
          channel: body.channel || 'api',
          quote_number: quoteNumber,
          submission_status: 'received',
          how_can: body.how_can || 'New Quote',
          notes: body.notes || null,
          partner_name: body.partner_name || null,
        })
        .select('id, quote_number')
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, form1_id: data.id, quote_number: data.quote_number }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'create_form2') {
      if (!body.form1_submission_id) {
        return new Response(
          JSON.stringify({ error: 'form1_submission_id is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const insertData: Record<string, unknown> = {
        form1_submission_id: body.form1_submission_id,
        deal_id: body.deal_id || null,
        submission_status: 'received',
        // Contact
        first_name: body.first_name || null,
        last_name: body.last_name || null,
        email: body.email || null,
        phone: body.phone || null,
        gender: body.gender || null,
        dob_day: body.dob_day || null,
        dob_month: body.dob_month || null,
        dob_year: body.dob_year || null,
        address: body.address || null,
        address_suncorp_validated: body.address_suncorp_validated || null,
        housing_status: body.housing_status || null,
        // Vehicle
        vehicle_usage: body.vehicle_usage || null,
        vehicle_registration: body.vehicle_registration || null,
        vehicle_state: body.vehicle_state || null,
        vehicle_make: body.vehicle_make || null,
        vehicle_model: body.vehicle_model || null,
        vehicle_year: body.vehicle_year || null,
        vehicle_nvic: body.vehicle_nvic || null,
        vehicle_variant: body.vehicle_variant || null,
        vehicle_body_style: body.vehicle_body_style || null,
        vehicle_description: body.vehicle_description || null,
        vehicle_transmission: body.vehicle_transmission || null,
        vehicle_series: body.vehicle_series || null,
        vehicle_image_url: body.vehicle_image_url || null,
        vehicle_identification_method: body.vehicle_identification_method || null,
        market_value: body.market_value != null ? Number(body.market_value) : null,
        trade_value: body.trade_value != null ? Number(body.trade_value) : null,
        retail_value: body.retail_value != null ? Number(body.retail_value) : null,
        // Driving
        license_type: body.license_type || null,
        international_license: body.international_license || null,
        international_years: body.international_years || null,
        owner_drives: body.owner_drives || null,
        all_drivers_2_years: body.all_drivers_2_years || null,
        age_received_license: body.age_received_license || null,
        demerit_points: body.demerit_points || null,
        claims_made: body.claims_made || null,
        claims_count: body.claims_count || null,
        claims_list: body.claims_list || null,
        bankruptcy: body.bankruptcy || null,
        license_suspended: body.license_suspended || null,
        criminal_offences: body.criminal_offences || null,
        insurance_declined: body.insurance_declined || null,
        claim_denied_fraud: body.claim_denied_fraud || null,
        // Usage
        is_rented: body.is_rented ?? null,
        is_delivery: body.is_delivery ?? null,
        is_rideshare: body.is_rideshare ?? null,
        is_refrigerated: body.is_refrigerated ?? null,
        food_delivery_hours: body.food_delivery_hours || null,
        business_usage_type: body.business_usage_type || null,
        exclude_under_25: body.exclude_under_25 || null,
        rideshare_delivery: body.rideshare_delivery || null,
        purchase_type: body.purchase_type || null,
        first_owner: body.first_owner || null,
        continuously_insured: body.continuously_insured || null,
        is_financed: body.is_financed || null,
        finance_company: body.finance_company || null,
        is_modified: body.is_modified || null,
        modification_details: body.modification_details || null,
        security: body.security || null,
        undamaged_roadworthy: body.undamaged_roadworthy || null,
        days_per_week_work: body.days_per_week_work || null,
        km_per_year: body.km_per_year || null,
        peak_times: body.peak_times || null,
        parking_location: body.parking_location || null,
        parking_address: body.parking_address || null,
        // Cover
        policy_start_date: body.policy_start_date || null,
        coverage_level: body.coverage_level || null,
        excess_level: body.excess_level || null,
        sum_insured_type: body.sum_insured_type || null,
        agreed_value: body.agreed_value != null ? Number(body.agreed_value) : null,
        // Other
        previously_insured: body.previously_insured || null,
        current_insurer: body.current_insurer || null,
        current_premium: body.current_premium || null,
        current_cover: body.current_cover || null,
        current_excess: body.current_excess || null,
        customer_type: body.customer_type || null,
        company_name: body.company_name || null,
        abn: body.abn || null,
        quote_type: body.quote_type || null,
        nominated_drivers_list: body.nominated_drivers_list || null,
      };

      const { data, error } = await supabase
        .from('form2_submissions')
        .insert(insertData)
        .select('id')
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, form2_id: data.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'create_form3') {
      if (!body.form2_submission_id) {
        return new Response(
          JSON.stringify({ error: 'form2_submission_id is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const membershipFee = body.membership_fee != null ? Number(body.membership_fee) : null;

      const insertData: Record<string, unknown> = {
        form2_submission_id: body.form2_submission_id,
        deal_id: body.deal_id || null,
        submission_status: 'received',
        // MCM pricing - membership fee goes to base_premium
        base_premium: membershipFee,
        stamp_duty: 0,
        fire_levy: 0,
        gst: 0,
        insurer_total: membershipFee,
        // Underwriter (third party property damage) fields
        uw_quote_number: body.uw_quote_number || null,
        uw_name: body.uw_name || null,
        uw_base_premium: body.uw_base_premium != null ? Number(body.uw_base_premium) : null,
        uw_stamp_duty: body.uw_stamp_duty != null ? Number(body.uw_stamp_duty) : null,
        uw_fire_levy: body.uw_fire_levy != null ? Number(body.uw_fire_levy) : null,
        uw_gst: body.uw_gst != null ? Number(body.uw_gst) : null,
        uw_total_premium: body.uw_total_premium != null ? Number(body.uw_total_premium) : null,
        // Vehicle info (optional pass-through)
        vehicle_rego: body.vehicle_rego || null,
        vehicle_make: body.vehicle_make || null,
        vehicle_model: body.vehicle_model || null,
        vehicle_year: body.vehicle_year || null,
        vehicle_value: body.vehicle_value != null ? Number(body.vehicle_value) : null,
        agreed_value: body.agreed_value != null ? Number(body.agreed_value) : null,
        // Policy info
        insurance_type: body.insurance_type || 'Rideshare',
        policy_type: body.policy_type || null,
        policy_coverage: body.policy_coverage || null,
        policy_start_date: body.policy_start_date || null,
        policy_description: body.policy_description || null,
        product: body.product || null,
        insurer_reference: body.insurer_reference || null,
        // Excess
        standard_excess: body.standard_excess != null ? Number(body.standard_excess) : null,
        customer_excess: body.customer_excess != null ? Number(body.customer_excess) : null,
        excess_cashback: body.excess_cashback != null ? Number(body.excess_cashback) : null,
        form2_excess_level: body.form2_excess_level || null,
        // Totals
        total_annual_premium: body.total_annual_premium != null ? Number(body.total_annual_premium) : null,
        total_monthly_premium: body.total_monthly_premium != null ? Number(body.total_monthly_premium) : null,
        brokerage_fee: body.brokerage_fee != null ? Number(body.brokerage_fee) : null,
        broker_fee_total: body.broker_fee_total != null ? Number(body.broker_fee_total) : null,
        processing_fee: body.processing_fee != null ? Number(body.processing_fee) : null,
        // Other
        quote_agent: body.quote_agent || null,
        age_restriction: body.age_restriction || null,
        named_drivers: body.named_drivers || null,
        policy_extras: body.policy_extras || null,
      };

      const { data, error } = await supabase
        .from('form3_submissions')
        .insert(insertData)
        .select('id')
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, form3_id: data.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use: create_form1, create_form2, or create_form3' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('MCM Quote API error:', error);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

