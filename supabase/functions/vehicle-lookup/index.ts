import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    return new Response(JSON.stringify(vehicleData), {
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
