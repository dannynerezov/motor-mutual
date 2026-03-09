

## Plan: Add Oxylabs Proxy Support to suncorp-proxy Edge Function

### Problem
The current `suncorp-proxy` edge function in this project makes direct API calls to Suncorp's address search/validation endpoints. These calls get blocked (403/429/503) because there's no proxy fallback. The other project (No-Database Webform) has a working implementation with Oxylabs residential proxy support using a "direct-first, proxy-fallback" strategy.

### Changes Required

**1. Add OXYLABS secrets to this project**
- Need to add `OXYLABS_USERNAME` and `OXYLABS_PASSWORD` secrets (same credentials as the other project)

**2. Rewrite `supabase/functions/suncorp-proxy/index.ts`**
Replace the current simple proxy with the battle-tested version from the No-Database Webform project. Key additions:

- **Oxylabs proxy client**: `createProxyClient()` using `Deno.createHttpClient` with Australian residential IP geo-targeting and session control
- **Direct-first strategy**: `fetchWithDirectFirst()` — tries direct call with 8s timeout, falls back to proxy with 25s timeout and retries
- **Search strategies**: `generateSearchStrategies()` — tries exact query, truncated postcode, and no-postcode variants
- **Dedicated handlers**: `handleAddressSearch()` and `handleAddressValidate()` with proper error handling and strategy rotation
- **Proxy diagnostics**: `handleProxyDiagnostics()` endpoint for testing proxy connectivity
- **Updated ping**: Returns proxy status info
- **Proper headers**: Includes `user-agent` header for all requests

The existing `vehicleLookup`, `createQuote`, and `updateQuote` actions will also be converted to use the direct-first strategy (matching the other project's implementation).

**3. Update `AddressAutosuggest.tsx`**
Minor update to align the request/response format with the new handler signatures:
- `addressSearch`: Send `{ action: 'addressSearch', payload: { query: searchTerm } }` instead of `{ action: 'addressSearch', searchText: searchTerm }`
- `addressValidate`: Send `{ action: 'addressValidate', payload: { addressData: {...} } }` instead of `{ action: 'addressValidate', address: {...} }`

### Technical Notes
- The proxy uses Oxylabs residential proxies (`pr.oxylabs.io:7777`) with Australian IP targeting (`-cc-au`)
- Session IDs ensure IP consistency within a request batch (`-sessid-{random}-sesstime-10`)
- Vehicle lookup uses a shorter 2s direct timeout since that endpoint consistently hangs on direct calls

