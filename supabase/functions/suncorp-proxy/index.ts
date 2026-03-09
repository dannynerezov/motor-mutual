import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Oxylabs Residential Proxies configuration
const OXYLABS_USERNAME = Deno.env.get('OXYLABS_USERNAME');
const OXYLABS_PASSWORD = Deno.env.get('OXYLABS_PASSWORD');

function isProxyEnabled(): boolean {
  return !!(OXYLABS_USERNAME && OXYLABS_PASSWORD);
}

function isProxyApiAvailable(): boolean {
  return typeof (Deno as unknown as { createHttpClient?: unknown }).createHttpClient === 'function';
}

function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

function createProxyClient(): Deno.HttpClient | null {
  if (!isProxyEnabled() || !isProxyApiAvailable()) return null;

  const sessionId = generateSessionId();
  const proxyUsername = `customer-${OXYLABS_USERNAME}-cc-au-sessid-${sessionId}-sesstime-10`;
  
  console.log(`[proxy] Creating client with session: ${sessionId.substring(0, 8)}...`);

  try {
    const client = (Deno as unknown as { 
      createHttpClient: (options: {
        proxy: { url: string; basicAuth: { username: string; password: string } };
      }) => Deno.HttpClient;
    }).createHttpClient({
      proxy: {
        url: "http://pr.oxylabs.io:7777",
        basicAuth: { username: proxyUsername, password: OXYLABS_PASSWORD! },
      },
    });
    console.log('[proxy] ✅ Proxy client created');
    return client;
  } catch (error) {
    console.error('[proxy] Failed to create proxy client:', error);
    return null;
  }
}

// ====================================================================
// Direct First, Proxy Fallback Strategy
// ====================================================================
const DIRECT_TIMEOUT_MS = 8000;
const PROXY_TIMEOUT_MS = 25000;

interface FetchResult {
  response: Response;
  fetchMethod: 'direct' | 'proxy';
  directAttempted: boolean;
  proxyAttempted: boolean;
  directTimeMs?: number;
  proxyTimeMs?: number;
  directError?: string;
  proxyRetries?: number;
}

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number, label: string): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => { controller.abort(); console.log(`[${label}] ⏱️ TIMEOUT after ${timeoutMs}ms`); }, timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function fetchWithDirectFirst(url: string, options: RequestInit = {}, maxProxyRetries = 2, directTimeoutMs = DIRECT_TIMEOUT_MS): Promise<FetchResult> {
  const P = '[suncorp-proxy]';
  
  // STEP 1: Direct fetch
  console.log(`${P} 🚀 DIRECT (${directTimeoutMs}ms timeout): ${url.substring(0, 80)}...`);
  const directStart = Date.now();
  let directError: string | undefined;
  
  try {
    const directResponse = await fetchWithTimeout(url, options, directTimeoutMs, `${P} DIRECT`);
    const directTime = Date.now() - directStart;
    
    if (directResponse.ok) {
      console.log(`${P} ✅ DIRECT SUCCESS in ${directTime}ms`);
      return { response: directResponse, fetchMethod: 'direct', directAttempted: true, proxyAttempted: false, directTimeMs: directTime };
    }
    
    if ([403, 429, 503].includes(directResponse.status)) {
      directError = `HTTP ${directResponse.status} (blocked)`;
      console.log(`${P} ⚠️ DIRECT BLOCKED (${directResponse.status}) in ${directTime}ms`);
    } else if (directResponse.status >= 400 && directResponse.status < 500) {
      console.log(`${P} DIRECT client error ${directResponse.status} in ${directTime}ms - returning as-is`);
      return { response: directResponse, fetchMethod: 'direct', directAttempted: true, proxyAttempted: false, directTimeMs: directTime };
    } else {
      directError = `HTTP ${directResponse.status}`;
      console.log(`${P} ⚠️ DIRECT ${directResponse.status} in ${directTime}ms`);
    }
  } catch (error) {
    const directTime = Date.now() - directStart;
    if (error instanceof Error && error.name === 'AbortError') {
      directError = `TIMEOUT after ${directTimeoutMs}ms`;
      console.log(`${P} ⏱️ DIRECT TIMEOUT after ${directTime}ms`);
    } else {
      directError = error instanceof Error ? error.message : 'Network error';
      console.log(`${P} ⚠️ DIRECT FAILED in ${directTime}ms: ${directError}`);
    }
  }
  
  // STEP 2: Proxy fallback
  if (!isProxyEnabled() || !isProxyApiAvailable()) {
    console.log(`${P} ❌ Proxy not available`);
    return { 
      response: new Response(JSON.stringify({ error: 'Direct blocked and proxy unavailable', directError }), { status: 503, headers: { 'Content-Type': 'application/json' } }),
      fetchMethod: 'direct', directAttempted: true, proxyAttempted: false, directError,
    };
  }
  
  let lastProxyError: Error | null = null;
  const proxyStart = Date.now();
  
  for (let attempt = 1; attempt <= maxProxyRetries; attempt++) {
    const client = createProxyClient();
    if (!client) continue;
    
    console.log(`${P} 🔄 Proxy attempt ${attempt}/${maxProxyRetries}`);
    const proxyController = new AbortController();
    const proxyTimeoutId = setTimeout(() => proxyController.abort(), PROXY_TIMEOUT_MS);
    
    try {
      const proxyResponse = await fetch(url, { ...options, signal: proxyController.signal, /* @ts-ignore */ client });
      clearTimeout(proxyTimeoutId);
      const totalProxyTime = Date.now() - proxyStart;
      console.log(`${P} ✅ PROXY SUCCESS in ${totalProxyTime}ms`);
      return { response: proxyResponse, fetchMethod: 'proxy', directAttempted: true, proxyAttempted: true, directError, proxyTimeMs: totalProxyTime, proxyRetries: attempt };
    } catch (proxyError) {
      clearTimeout(proxyTimeoutId);
      lastProxyError = proxyError as Error;
      if (proxyError instanceof Error && proxyError.name === 'AbortError') continue;
      const msg = String(proxyError).toLowerCase();
      if (msg.includes('authentication') || msg.includes('407')) {
        await new Promise(r => setTimeout(r, 500 * attempt));
        continue;
      }
      break;
    }
  }
  
  const totalTime = Date.now() - proxyStart;
  return {
    response: new Response(JSON.stringify({ error: 'All fetch attempts failed', directError, proxyError: lastProxyError?.message }), { status: 502, headers: { 'Content-Type': 'application/json' } }),
    fetchMethod: 'proxy', directAttempted: true, proxyAttempted: true, directError, proxyTimeMs: totalTime, proxyRetries: maxProxyRetries,
  };
}

// Headers
const getAddressHeaders = () => ({
  'accept': '*/*',
  'content-type': 'application/json',
  'origin': 'https://motor.suncorp.com.au',
  'referer': 'https://motor.suncorp.com.au/',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
});

const getSuncorpHeaders = () => ({
  'accept': 'application/vnd.api+json',
  'content-type': 'application/json',
  'x-client-id': 'sun-motor-ui',
  'x-client-version': '1.0',
  'x-correlation-id': crypto.randomUUID(),
  'x-request-id': crypto.randomUUID(),
  'origin': 'https://motor.suncorp.com.au',
  'referer': 'https://motor.suncorp.com.au/',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
});

// Search strategies for address search
function generateSearchStrategies(originalQuery: string): string[] {
  const strategies: string[] = [originalQuery];
  const postcodeMatch = originalQuery.match(/(\d{4})(?:\s*,?\s*Australia)?$/i);
  if (postcodeMatch) {
    const fullPostcode = postcodeMatch[1];
    strategies.push(originalQuery.replace(new RegExp(fullPostcode + '(?:\\s*,?\\s*Australia)?$', 'i'), fullPostcode.substring(0, 3)));
    strategies.push(originalQuery.replace(new RegExp('\\s*' + fullPostcode + '(?:\\s*,?\\s*Australia)?$', 'i'), '').trim());
  }
  return strategies;
}

// Handler: Address Search
async function handleAddressSearch(query: string) {
  const searchStrategies = generateSearchStrategies(query);
  console.log(`[addressSearch] ${searchStrategies.length} strategies for: "${query}"`);
  
  for (let i = 0; i < searchStrategies.length; i++) {
    const searchQuery = searchStrategies[i];
    const strategyName = i === 0 ? 'exact' : i === 1 ? 'truncated-postcode' : 'no-postcode';
    const url = `https://api.suncorp.com.au/address-search-service/address/suggestions/v1?isRiskAddress=true&q=${encodeURIComponent(searchQuery)}`;
    
    console.log(`[addressSearch] Strategy ${i + 1} (${strategyName}): "${searchQuery}"`);
    
    try {
      const result = await fetchWithDirectFirst(url, { method: 'GET', headers: getAddressHeaders() });
      
      if (result.response.status === 502 || result.response.status === 503) {
        const errorData = await result.response.json();
        return { success: false, error: 'All fetch attempts failed', details: errorData, fetchMethod: result.fetchMethod };
      }
      if (!result.response.ok) continue;
      
      const responseText = await result.response.text();
      let data;
      try { data = JSON.parse(responseText); } catch { continue; }
      
      const suggestions = data?.data || [];
      if (suggestions.length > 0) {
        console.log(`[addressSearch] ✅ ${suggestions.length} results via ${strategyName}/${result.fetchMethod}`);
        return { success: true, data, strategyUsed: strategyName, fetchMethod: result.fetchMethod, proxyUsed: result.fetchMethod === 'proxy' };
      }
    } catch (error) {
      console.error(`[addressSearch] Strategy ${i + 1} error:`, error);
      continue;
    }
  }
  
  return { success: true, data: { queryString: query, data: [] }, strategyUsed: 'none', fetchMethod: 'none', proxyUsed: false };
}

// Handler: Address Validate
async function handleAddressValidate(addressPayload: Record<string, unknown>) {
  // Support both formats:
  // Old: { address: { country, suburb, postcode, state, addressInFreeForm, streetNumber, streetName, streetType, unitType, unitNumber } }
  // New: { addressData: { streetNumber, streetName, streetType, suburb, postcode, state } }
  
  let requestBody: Record<string, unknown>;
  
  if ('addressData' in addressPayload) {
    // New format from reference project
    const ad = addressPayload.addressData as Record<string, string>;
    const addressLine1 = `${ad.streetNumber || ''} ${ad.streetName || ''} ${ad.streetType || ''}`.trim();
    requestBody = {
      address: {
        country: 'AUS',
        suburb: ad.suburb,
        postcode: ad.postcode,
        state: ad.state,
        addressInFreeForm: { addressLine1 }
      },
      expectedQualityLevels: ['1', '2', '3', '4', '5', '6'],
      addressSuggestionRequirements: { required: true, forAddressQualityLevels: ['3', '4', '5'], howMany: '10' }
    };
  } else if ('address' in addressPayload) {
    // Old format - already has full structure, wrap with quality levels if missing
    const addr = addressPayload.address as Record<string, unknown>;
    
    // If it has streetNumber/streetName but no addressInFreeForm, build it
    if (!addr.addressInFreeForm && addr.streetNumber) {
      const addressLine1 = `${addr.streetNumber || ''} ${addr.streetName || ''} ${addr.streetType || ''}`.trim();
      requestBody = {
        address: {
          country: addr.country || 'AUS',
          suburb: addr.suburb,
          postcode: addr.postcode,
          state: addr.state,
          addressInFreeForm: { addressLine1 },
          ...(addr.unitType ? { unitType: addr.unitType } : {}),
          ...(addr.unitNumber ? { unitNumber: addr.unitNumber } : {}),
        },
        expectedQualityLevels: ['1', '2', '3', '4', '5', '6'],
        addressSuggestionRequirements: { required: true, forAddressQualityLevels: ['3', '4', '5'], howMany: '10' }
      };
    } else {
      // Already has full structure (from ThirdPartyBulk/DriverCard) - use as-is with quality levels
      requestBody = {
        address: addr,
        expectedQualityLevels: (addressPayload as Record<string, unknown>).expectedQualityLevels || ['1', '2', '3', '4', '5', '6'],
        addressSuggestionRequirements: (addressPayload as Record<string, unknown>).addressSuggestionRequirements || { required: true, forAddressQualityLevels: ['3', '4', '5'], howMany: '10' }
      };
    }
  } else {
    throw new Error('Invalid address validate payload: must contain "address" or "addressData"');
  }
  
  const url = 'https://api.suncorp.com.au/address-search-service/address/find/v3';
  console.log('[addressValidate] Using Direct-First strategy');
  
  const result = await fetchWithDirectFirst(url, {
    method: 'POST',
    headers: getAddressHeaders(),
    body: JSON.stringify(requestBody),
  });

  if (result.response.status === 502 || result.response.status === 503) {
    const errorData = await result.response.json();
    return { success: false, error: 'All fetch attempts failed', details: errorData, fetchMethod: result.fetchMethod };
  }

  if (!result.response.ok) {
    const errorText = await result.response.text();
    console.error('[addressValidate] API error:', result.response.status, errorText);
    throw new Error(`Address validation failed: ${result.response.status}`);
  }

  const responseText = await result.response.text();
  let data;
  try { data = JSON.parse(responseText); } catch { throw new Error('Failed to parse address validation response'); }
  
  console.log(`[addressValidate] ✅ Success via ${result.fetchMethod}`);
  return { success: true, data, fetchMethod: result.fetchMethod, proxyUsed: result.fetchMethod === 'proxy' };
}

// Handler: Vehicle Lookup
const VEHICLE_LOOKUP_DIRECT_TIMEOUT_MS = 2000;

async function handleVehicleLookup(registration: string, state: string) {
  const vehicleAuthToken = Deno.env.get('SUNCORP_VEHICLE_AUTH_TOKEN');
  if (!vehicleAuthToken) throw new Error('SUNCORP_VEHICLE_AUTH_TOKEN not configured');
  
  const entryDate = new Date().toISOString().split('T')[0];
  const url = `https://api.suncorp.com.au/vehicle-search-service/vehicle/rego/${encodeURIComponent(registration)}/details?state=${state}&country=AUS&brand=SUNCORP&channel=WEB&product=CAR&entryDate=${entryDate}`;
  
  console.log(`[vehicleLookup] ${registration}, ${state} - Direct-First (${VEHICLE_LOOKUP_DIRECT_TIMEOUT_MS}ms direct timeout)`);
  
  const result = await fetchWithDirectFirst(url, {
    method: 'GET',
    headers: {
      ...getAddressHeaders(),
      'x-suncorp-vehicle-authorization': vehicleAuthToken,
    },
  }, 2, VEHICLE_LOOKUP_DIRECT_TIMEOUT_MS);

  if (result.response.status === 502 || result.response.status === 503) {
    const errorData = await result.response.json();
    return { success: false, error: 'All fetch attempts failed', details: errorData, fetchMethod: result.fetchMethod };
  }
  if (!result.response.ok) {
    const errorText = await result.response.text();
    throw new Error(`Vehicle lookup failed: ${result.response.status}`);
  }

  const data = await result.response.json();
  console.log(`[vehicleLookup] ✅ Success via ${result.fetchMethod}`);
  return { success: true, data, fetchMethod: result.fetchMethod, proxyUsed: result.fetchMethod === 'proxy' };
}

// Handler: Create Quote
async function handleCreateQuote(quotePayload: unknown) {
  if (!quotePayload) throw new Error('quotePayload is required');
  
  const url = 'https://api.suncorp.com.au/pi-motor-quote-api/api/v1/insurance/motor/brands/sun/quotes';
  console.log('[createQuote] Direct-First strategy');
  
  const result = await fetchWithDirectFirst(url, {
    method: 'POST',
    headers: getSuncorpHeaders(),
    body: JSON.stringify(quotePayload),
  });

  if (result.response.status === 502 || result.response.status === 503) {
    const errorData = await result.response.json();
    return { success: false, error: 'All fetch attempts failed', details: errorData, fetchMethod: result.fetchMethod };
  }
  if (!result.response.ok) {
    const errorText = await result.response.text();
    console.error('[createQuote] API error:', result.response.status, errorText);
    
    let errorData;
    try { errorData = JSON.parse(errorText); } catch { errorData = { message: errorText }; }
    return { success: false, error: errorData.message || `API request failed with status ${result.response.status}`, details: errorData, status: result.response.status };
  }

  const data = await result.response.json();
  console.log(`[createQuote] ✅ Success via ${result.fetchMethod}`);
  return { success: true, data, fetchMethod: result.fetchMethod, proxyUsed: result.fetchMethod === 'proxy' };
}

// Handler: Update Quote
async function handleUpdateQuote(quoteNumber: string, quotePayload: unknown) {
  if (!quoteNumber) throw new Error('quoteNumber is required');
  
  const url = `https://api.suncorp.com.au/pi-motor-quote-api/api/v1/insurance/motor/brands/sun/quotes/${quoteNumber}`;
  console.log(`[updateQuote] Updating ${quoteNumber} - Direct-First strategy`);
  
  const result = await fetchWithDirectFirst(url, {
    method: 'PUT',
    headers: getSuncorpHeaders(),
    body: JSON.stringify(quotePayload),
  });

  if (result.response.status === 502 || result.response.status === 503) {
    const errorData = await result.response.json();
    return { success: false, error: 'All fetch attempts failed', details: errorData };
  }
  if (!result.response.ok) {
    const errorText = await result.response.text();
    throw new Error(`Quote update failed: ${result.response.status} - ${errorText}`);
  }

  const data = await result.response.json();
  console.log(`[updateQuote] ✅ Success via ${result.fetchMethod}`);
  return { success: true, data, fetchMethod: result.fetchMethod, proxyUsed: result.fetchMethod === 'proxy' };
}

// Handler: Proxy Diagnostics
async function handleProxyDiagnostics() {
  const proxyEnabled = isProxyEnabled();
  const proxyApiAvailable = isProxyApiAvailable();
  
  if (!proxyEnabled || !proxyApiAvailable) {
    return { success: false, proxyEnabled, proxyApiAvailable, proxyType: 'Oxylabs Residential Proxies' };
  }

  const client = createProxyClient();
  if (!client) return { success: false, proxyEnabled: true, proxyApiAvailable: true, error: 'Failed to create client' };

  try {
    const response = await fetch('https://ip.oxylabs.io/location', { /* @ts-ignore */ client });
    const text = await response.text();
    let locationData: Record<string, string> = {};
    try { locationData = JSON.parse(text); } catch {}
    return { success: response.ok, proxyEnabled: true, proxyApiAvailable: true, proxyType: 'Oxylabs Residential Proxies', ip: locationData.ip, location: text.substring(0, 500) };
  } catch (error) {
    return { success: false, proxyEnabled: true, proxyApiAvailable: true, error: error instanceof Error ? error.message : 'Unknown' };
  }
}

// ====================================================================
// Main handler - backward compatible with all existing callers
// ====================================================================
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action, payload, ...params } = body;
    
    console.log(`[suncorp-proxy] Action: ${action}`);

    let result;

    switch (action) {
      case 'ping':
        result = { 
          success: true, 
          message: 'pong (Direct-First mode)',
          proxyEnabled: isProxyEnabled(),
          proxyApiAvailable: isProxyApiAvailable(),
          strategy: 'direct-first-proxy-fallback',
          timestamp: Date.now(),
        };
        break;

      case 'proxyDiagnostics':
        result = await handleProxyDiagnostics();
        break;

      case 'addressSearch': {
        // Support: { query }, { searchText }, { payload: { query } }
        const query = payload?.query || params.query || params.searchText;
        if (!query) throw new Error('query/searchText is required for addressSearch');
        result = await handleAddressSearch(query);
        break;
      }

      case 'addressValidate': {
        // Support: { address: {...} }, { payload: { addressData: {...} } }
        const validatePayload = payload || params;
        result = await handleAddressValidate(validatePayload);
        break;
      }

      case 'vehicleLookup': {
        // Support: { registrationNumber, state }, { payload: { registration, state } }
        const reg = payload?.registration || params.registrationNumber;
        const st = payload?.state || params.state;
        if (!reg || !st) throw new Error('registration/registrationNumber and state are required');
        result = await handleVehicleLookup(reg, st);
        break;
      }

      case 'createQuote': {
        // Support: { quotePayload: {...} }, { payload: { quoteData: {...} } }
        const qp = params.quotePayload || payload?.quoteData || payload?.quotePayload;
        result = await handleCreateQuote(qp);
        break;
      }

      case 'updateQuote': {
        // Support: { quoteNumber, quotePayload }, { payload: { quoteId, quoteData } }
        const qn = params.quoteNumber || payload?.quoteId;
        const qpay = params.quotePayload || payload?.quoteData;
        result = await handleUpdateQuote(qn, qpay);
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('[suncorp-proxy] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
