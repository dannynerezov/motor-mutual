import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface VehicleInput {
  state: string;
  registrationNumber: string;
}

interface ProcessingResult {
  id?: string;
  state: string;
  registrationNumber: string;
  status: 'success' | 'failed';
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  marketValue?: number;
  membershipPrice?: number;
  imageExists?: boolean;
  vehicleImageUrl?: string;
  error?: string;
}

// Calculate base premium using pricing scheme
function calculateBasePremium(vehicleValue: number, scheme: any): number {
  const { floor_price, floor_point, ceiling_price, ceiling_point } = scheme;
  
  if (vehicleValue >= ceiling_point) {
    throw new Error(`Vehicle value $${vehicleValue} exceeds ceiling point $${ceiling_point}`);
  }
  
  if (vehicleValue <= floor_point) {
    return floor_price;
  }
  
  const valueRange = ceiling_point - floor_point;
  const priceRange = ceiling_price - floor_price;
  const slope = priceRange / valueRange;
  const premium = floor_price + (slope * (vehicleValue - floor_point));
  
  return Math.round(premium * 100) / 100;
}

async function processVehicle(vehicle: VehicleInput): Promise<ProcessingResult> {
  const { state, registrationNumber } = vehicle;
  
  console.log(`Processing vehicle: ${state} ${registrationNumber}`);
  
  try {
    // Call vehicle-lookup edge function
    const { data: vehicleData, error: lookupError } = await supabaseClient.functions.invoke(
      'vehicle-lookup',
      {
        body: {
          registrationNumber: registrationNumber.toUpperCase(),
          state: state.toUpperCase()
        }
      }
    );
    
    if (lookupError) {
      console.error(`Lookup error for ${registrationNumber}:`, lookupError);
      throw new Error(`Vehicle lookup failed: ${lookupError.message}`);
    }
    
    if (!vehicleData || vehicleData.error) {
      throw new Error(vehicleData?.error || 'Vehicle not found');
    }
    
    // Extract vehicle details
    const vehicleDetails = vehicleData.vehicleDetails || {};
    const valueInfo = vehicleData.vehicleValueInfo || {};
    const imageUrl = vehicleData.imageUrl;
    
    const marketValue = parseFloat(valueInfo.averageRetail || valueInfo.marketValue || '0');
    
    if (!marketValue || marketValue === 0) {
      throw new Error('No valid market value available');
    }
    
    // Get active pricing scheme
    const { data: activeScheme, error: schemeError } = await supabaseClient
      .from('pricing_schemes')
      .select('*')
      .eq('is_active', true)
      .order('valid_from', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (schemeError || !activeScheme) {
      throw new Error('No active pricing scheme found');
    }
    
    // Calculate membership price
    let membershipPrice: number;
    try {
      membershipPrice = calculateBasePremium(marketValue, activeScheme);
    } catch (calcError) {
      throw new Error(`Price calculation failed: ${calcError instanceof Error ? calcError.message : 'Unknown error'}`);
    }
    
    // Check if image exists
    let imageExists = false;
    if (imageUrl) {
      try {
        const imageCheck = await fetch(imageUrl, { method: 'HEAD' });
        imageExists = imageCheck.ok && (imageCheck.headers.get('content-type')?.includes('image') ?? false);
      } catch {
        console.log(`Image check failed for ${registrationNumber}`);
      }
    }
    
    // Insert into database
    const { data: insertedRecord, error: insertError } = await supabaseClient
      .from('sample_vehicle_quotes')
      .insert({
        state: state.toUpperCase(),
        registration_number: registrationNumber.toUpperCase(),
        vehicle_year: parseInt(vehicleDetails.yearOfManufacture || '0') || null,
        vehicle_make: vehicleDetails.make || null,
        vehicle_model: vehicleDetails.model || null,
        vehicle_variant: vehicleDetails.variant || null,
        vehicle_nvic: vehicleDetails.nvic || null,
        vehicle_desc1: vehicleDetails.desc1 || null,
        vehicle_desc2: vehicleDetails.desc2 || null,
        vehicle_body_style: vehicleDetails.bodyStyle || null,
        vehicle_transmission: vehicleDetails.transmission || null,
        vehicle_fuel_type: vehicleDetails.fuelType || null,
        vehicle_series: vehicleDetails.series || null,
        market_value: marketValue,
        retail_price: parseFloat(valueInfo.retail || '0') || null,
        trade_low_price: parseFloat(valueInfo.tradeLow || '0') || null,
        trade_price: parseFloat(valueInfo.trade || '0') || null,
        vehicle_image_url: imageUrl || null,
        image_exists: imageExists,
        calculated_membership_price: membershipPrice,
        pricing_scheme_id: activeScheme.id,
        pricing_scheme_number: activeScheme.scheme_number,
        api_response_data: vehicleData,
        processing_status: 'success',
        processed_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (insertError) {
      // Check if duplicate
      if (insertError.code === '23505') {
        throw new Error('Vehicle already processed');
      }
      throw new Error(`Database insert failed: ${insertError.message}`);
    }
    
    console.log(`Successfully processed ${registrationNumber}`);
    
    return {
      id: insertedRecord.id,
      state: state.toUpperCase(),
      registrationNumber: registrationNumber.toUpperCase(),
      status: 'success',
      vehicleMake: vehicleDetails.make,
      vehicleModel: vehicleDetails.model,
      vehicleYear: parseInt(vehicleDetails.yearOfManufacture || '0') || undefined,
      marketValue,
      membershipPrice,
      imageExists,
      vehicleImageUrl: imageUrl || undefined
    };
    
  } catch (error) {
    console.error(`Failed to process ${registrationNumber}:`, error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Try to insert failed record
    try {
      await supabaseClient
        .from('sample_vehicle_quotes')
        .insert({
          state: state.toUpperCase(),
          registration_number: registrationNumber.toUpperCase(),
          processing_status: 'failed',
          error_message: errorMessage,
          processed_at: new Date().toISOString()
        });
    } catch (insertError) {
      console.error(`Failed to insert error record for ${registrationNumber}:`, insertError);
    }
    
    return {
      state: state.toUpperCase(),
      registrationNumber: registrationNumber.toUpperCase(),
      status: 'failed',
      error: errorMessage
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { vehicles } = await req.json();
    
    if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) {
      throw new Error('No vehicles provided');
    }
    
    console.log(`Processing batch of ${vehicles.length} vehicles`);
    
    const results: ProcessingResult[] = [];
    
    // Process vehicles sequentially with rate limiting
    for (const vehicle of vehicles) {
      const result = await processVehicle(vehicle);
      results.push(result);
      
      // Rate limiting: 500ms delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const summary = {
      total: results.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'failed').length,
      averagePrice: results
        .filter(r => r.status === 'success' && r.membershipPrice)
        .reduce((sum, r) => sum + (r.membershipPrice || 0), 0) / 
        results.filter(r => r.status === 'success' && r.membershipPrice).length || 0
    };
    
    console.log('Batch processing complete:', summary);
    
    return new Response(
      JSON.stringify({ summary, results }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
    
  } catch (error) {
    console.error('Error in process-sample-vehicles:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process vehicles';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
