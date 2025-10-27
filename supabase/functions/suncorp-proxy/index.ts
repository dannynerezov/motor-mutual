import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();
    
    console.log(`[Suncorp Proxy] Action: ${action}`);

    const baseUrl = 'https://api.suncorp.com.au';
    
    // Handle ping action for connection testing
    if (action === 'ping') {
      console.log('[Ping] Connection test - returning success');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'pong',
          timestamp: Date.now()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get auth tokens from environment
    const vehicleAuthToken = Deno.env.get('SUNCORP_VEHICLE_AUTH_TOKEN');
    if (!vehicleAuthToken && action === 'vehicleLookup') {
      throw new Error('SUNCORP_VEHICLE_AUTH_TOKEN not configured');
    }

    let endpoint = '';
    let method = 'GET';
    let body = null;
    let headers: Record<string, string> = {
      'accept': '*/*',
      'origin': 'https://motor.suncorp.com.au',
      'referer': 'https://motor.suncorp.com.au/',
    };

    // Route based on action
    switch (action) {
      case 'vehicleLookup': {
        const { registrationNumber, state } = params;
        const entryDate = new Date().toISOString().split('T')[0]; // Today's date in yyyy-MM-dd
        
        const queryParams = new URLSearchParams({
          state: state,
          country: 'AUS',
          brand: 'SUNCORP',
          channel: 'WEB',
          product: 'CAR',
          entryDate: entryDate
        });
        
        endpoint = `/vehicle-search-service/vehicle/rego/${registrationNumber}/details?${queryParams}`;
        method = 'GET';
        headers['x-suncorp-vehicle-authorization'] = vehicleAuthToken!;
        console.log(`[Vehicle Lookup] Rego: ${registrationNumber}, State: ${state}`);
        break;
      }

      case 'addressSearch': {
        const { query } = params;
        const queryParams = new URLSearchParams({
          isRiskAddress: 'true',
          q: query
        });
        
        endpoint = `/address-search-service/address/suggestions/v1?${queryParams}`;
        method = 'GET';
        console.log(`[Address Search] Query: ${query}`);
        break;
      }

      case 'addressValidate': {
        const { address } = params;
        endpoint = '/address-search-service/address/find/v3';
        method = 'POST';
        headers['content-type'] = 'application/json; charset=utf-8';
        body = JSON.stringify({
          address: address,
          expectedQualityLevels: ['1', '2', '3', '4', '5', '6'],
          addressSuggestionRequirements: {
            required: true,
            forAddressQualityLevels: ['3', '4', '5'],
            howMany: '10'
          }
        });
        console.log(`[Address Validate] Suburb: ${address.suburb}, Postcode: ${address.postcode}`);
        break;
      }

      case 'createQuote': {
        const { quotePayload } = params;
        endpoint = '/pi-motor-quote-api/api/v1/insurance/motor/brands/sun/quotes';
        method = 'POST';
        headers = {
          'accept': 'application/vnd.api+json',
          'content-type': 'application/json',
          'x-client-id': 'sun-motor-ui',
          'x-client-version': '1.0',
          'x-correlation-id': crypto.randomUUID(),
          'x-request-id': crypto.randomUUID(),
          'origin': 'https://motor.suncorp.com.au',
          'referer': 'https://motor.suncorp.com.au/',
        };
        body = JSON.stringify(quotePayload);
        console.log(`[Create Quote] Starting quote creation`);
        break;
      }

      case 'updateQuote': {
        const { quoteNumber, quotePayload } = params;
        if (!quoteNumber) {
          throw new Error('quoteNumber is required for updateQuote action');
        }
        endpoint = `/pi-motor-quote-api/api/v1/insurance/motor/brands/sun/quotes/${quoteNumber}`;
        method = 'PUT';
        headers = {
          'accept': 'application/vnd.api+json',
          'content-type': 'application/json',
          'x-client-id': 'sun-motor-ui',
          'x-client-version': '1.0',
          'x-correlation-id': crypto.randomUUID(),
          'x-request-id': crypto.randomUUID(),
          'origin': 'https://motor.suncorp.com.au',
          'referer': 'https://motor.suncorp.com.au/',
        };
        body = JSON.stringify(quotePayload);
        console.log(`[Update Quote] Updating quote: ${quoteNumber}`);
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Make API call to Suncorp
    const apiUrl = `${baseUrl}${endpoint}`;
    console.log(`[API Call] ${method} ${apiUrl}`);
    
    const startTime = Date.now();
    const response = await fetch(apiUrl, {
      method,
      headers,
      ...(body && { body }),
    });
    
    const executionTime = Date.now() - startTime;
    console.log(`[API Response] Status: ${response.status}, Time: ${executionTime}ms`);

    // Get response text first for debugging
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error(`[API Error] Status: ${response.status}, Body: ${responseText.substring(0, 500)}`);
      
      // Try to parse error response
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }
      
      return new Response(
        JSON.stringify({
          success: false,
          error: errorData.message || `API request failed with status ${response.status}`,
          details: errorData,
          status: response.status
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse successful response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('[Parse Error]', e);
      data = { raw: responseText };
    }

    console.log(`[Success] Action: ${action} completed in ${executionTime}ms`);

    return new Response(
      JSON.stringify({
        success: true,
        data,
        executionTime
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('[Suncorp Proxy Error]', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
        stack: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
