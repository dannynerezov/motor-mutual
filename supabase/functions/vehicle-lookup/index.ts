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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { registrationNumber, state } = await req.json();

    console.log('Vehicle lookup request:', { registrationNumber, state });

    if (!registrationNumber || !state) {
      throw new Error('Registration number and state are required');
    }

    // Validate registration format
    const regPattern = /^[A-Z0-9]{3,8}$/;
    if (!regPattern.test(registrationNumber)) {
      throw new Error('Invalid registration format');
    }

    // Get auth token from environment
    const authToken = Deno.env.get('SUNCORP_VEHICLE_AUTH_TOKEN');
    if (!authToken) {
      throw new Error('Suncorp auth token not configured');
    }

    // Use current date for the API call
    const entryDate = new Date().toISOString().split('T')[0];

    const apiUrl = `https://api.suncorp.com.au/vehicle-search-service/vehicle/rego/${registrationNumber}/details?state=${state}&country=AUS&brand=SUNCORP&channel=WEB&product=CAR&entryDate=${entryDate}`;

    console.log('Calling Suncorp API:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Origin': 'https://motor.suncorp.com.au',
        'Referer': 'https://motor.suncorp.com.au/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'X-Suncorp-Vehicle-Authorization': authToken,
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Suncorp API error:', response.status, errorText);
      throw new Error(`Vehicle lookup failed: ${response.status}`);
    }

    const vehicleData = await response.json();
    console.log('Vehicle data retrieved successfully');
    console.log('Full vehicle valuation data:', JSON.stringify(vehicleData.vehicleValueInfo, null, 2));

    // Attempt to fetch and store vehicle image
    let imageUrl = null;
    const nvic = vehicleData.vehicleDetails?.nvic;

    if (nvic) {
      try {
        const imageSourceUrl = `https://sales-assets.suncorp.com.au/vehicles/nvic/${nvic}.jpg`;
        console.log('Checking for vehicle image:', imageSourceUrl);
        
        // Check if image exists
        const imageCheckResponse = await fetch(imageSourceUrl, { method: 'HEAD' });
        
        if (imageCheckResponse.ok && imageCheckResponse.headers.get('content-type')?.includes('image')) {
          console.log('Vehicle image found, fetching...');
          
          // Fetch the actual image
          const imageResponse = await fetch(imageSourceUrl);
          const imageBlob = await imageResponse.blob();
          const imageBuffer = await imageBlob.arrayBuffer();
          
          // Upload to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabaseClient
            .storage
            .from('vehicle-images')
            .upload(`${nvic}.jpg`, imageBuffer, {
              contentType: 'image/jpeg',
              upsert: true
            });
          
          if (!uploadError && uploadData) {
            // Get public URL
            const { data: urlData } = supabaseClient
              .storage
              .from('vehicle-images')
              .getPublicUrl(`${nvic}.jpg`);
            
            imageUrl = urlData.publicUrl;
            console.log('Vehicle image stored successfully:', imageUrl);
          } else {
            console.log('Failed to upload image:', uploadError);
          }
        } else {
          console.log('No vehicle image available for NVIC:', nvic);
        }
      } catch (imageError) {
        console.log('Failed to fetch vehicle image:', imageError);
        // Don't throw - continue without image
      }
    }

    return new Response(JSON.stringify({ ...vehicleData, imageUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in vehicle-lookup:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to lookup vehicle';
    const errorDetails = error instanceof Error ? error.toString() : String(error);
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
