import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const { customer, vehicles, totals, firstVehicle } = await req.json();

    console.log('Create quote request:', { 
      customerEmail: customer.email, 
      vehicleCount: vehicles.length 
    });

    // Step 1: Find or create customer
    let customerId;
    
    const { data: existingCustomer, error: selectError } = await supabaseClient
      .from('customers')
      .select('*')
      .eq('email', customer.email)
      .maybeSingle();

    if (selectError) {
      console.error('Error checking for existing customer:', selectError);
      throw selectError;
    }

    if (existingCustomer) {
      console.log('Using existing customer:', existingCustomer.id);
      customerId = existingCustomer.id;
    } else {
      console.log('Creating new customer');
      const { data: newCustomer, error: insertError } = await supabaseClient
        .from('customers')
        .insert([customer])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating customer:', insertError);
        throw insertError;
      }

      customerId = newCustomer.id;
      console.log('Created new customer:', customerId);
    }

    // Step 2: Create quote
    console.log('Creating quote for customer:', customerId);
    const { data: quote, error: quoteError } = await supabaseClient
      .from('quotes')
      .insert({
        customer_id: customerId,
        quote_reference: `QT-${Date.now()}`,
        registration_number: firstVehicle.registration,
        vehicle_make: firstVehicle.make,
        vehicle_model: firstVehicle.model,
        vehicle_year: firstVehicle.year,
        vehicle_nvic: firstVehicle.nvic || null,
        vehicle_value: firstVehicle.value,
        membership_price: firstVehicle.membershipPrice,
        total_base_price: totals.base,
        total_final_price: totals.final,
        status: 'pending',
      })
      .select()
      .single();

    if (quoteError) {
      console.error('Error creating quote:', quoteError);
      throw quoteError;
    }

    console.log('Quote created:', quote.id);

    // Step 3: Insert all vehicles
    const vehicleInserts = vehicles.map((v: any) => ({
      quote_id: quote.id,
      registration_number: v.registration,
      vehicle_make: v.make,
      vehicle_model: v.model,
      vehicle_year: v.year,
      vehicle_nvic: v.nvic || null,
      vehicle_value: v.value,
      selected_coverage_value: v.selectedValue,
      vehicle_image_url: v.imageUrl || null,
      base_price: v.membershipPrice,
    }));

    const { error: vehicleError } = await supabaseClient
      .from('quote_vehicles')
      .insert(vehicleInserts);

    if (vehicleError) {
      console.error('Error creating quote vehicles:', vehicleError);
      throw vehicleError;
    }

    console.log(`Created ${vehicles.length} vehicle records`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        quoteId: quote.id, 
        customerId 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in create-quote:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to create quote',
        details: error 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
