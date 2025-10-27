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
    
    console.log(`[Suncorp Proxy] Action: ${action}`, params);

    // Get auth token from environment
    const authToken = Deno.env.get('SUNCORP_API_TOKEN');
    if (!authToken) {
      throw new Error('SUNCORP_API_TOKEN not configured');
    }

    const baseUrl = 'https://pf-api.suncorp.com.au';
    let endpoint = '';
    let method = 'GET';
    let body = null;
    let headers: Record<string, string> = {
      'accept': 'application/json',
      'authorization': `Bearer ${authToken}`,
      'content-type': 'application/json',
    };

    // Route based on action
    switch (action) {
      case 'vehicleLookup': {
        const { registrationNumber, state, entryDate } = params;
        endpoint = `/motor/vehicle/v2/vehicle?registrationNumber=${registrationNumber}&state=${state}&entryDate=${entryDate}`;
        method = 'GET';
        console.log(`[Vehicle Lookup] Rego: ${registrationNumber}, State: ${state}`);
        break;
      }

      case 'addressSearch': {
        const { query } = params;
        const encodedQuery = encodeURIComponent(query);
        endpoint = `/address/v1/addresses?freeTextAddress=${encodedQuery}&maxNumberOfResults=10`;
        method = 'GET';
        console.log(`[Address Search] Query: ${query}`);
        break;
      }

      case 'addressValidate': {
        const { payload } = params;
        endpoint = '/address/v1/address';
        method = 'POST';
        body = JSON.stringify(payload);
        console.log(`[Address Validate] Payload:`, payload);
        break;
      }

      case 'generateQuote': {
        const { payload } = params;
        endpoint = '/motor/motor-ci/v7/quotes/';
        method = 'POST';
        body = JSON.stringify(payload);
        console.log(`[Generate Quote] Starting quote generation`);
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
      console.error(`[API Error] Status: ${response.status}, Body: ${responseText}`);
      
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

    console.log(`[Success] Action: ${action} completed successfully`);

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
