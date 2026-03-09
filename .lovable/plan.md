

## Plan: Fix Vehicle Lookup Response Parsing

### Problem
The Suncorp vehicle lookup API returns a nested structure:
```json
{
  "vehicleDetails": { "make": "...", "family": "...", "nvic": "...", "year": "...", ... },
  "vehicleValueInfo": { "marketValue": 123, "tradePrice": 456, "retailPrice": 789, ... }
}
```

But `Step4VehicleDetails.tsx` (lines 80-97) treats `data.data` as a flat object and tries `v.vehicles || v.vehicleList || [v]`, then accesses `vehicle.make`, `vehicle.nvic` etc. directly -- all of which are `undefined` because the actual data is nested under `vehicleDetails` and `vehicleValueInfo`.

This is why the screenshot shows "0" (falsy year) and default fun facts.

### Fix

In `Step4VehicleDetails.tsx`, replace the response parsing block (lines 80-123) to correctly extract from `data.data.vehicleDetails` and `data.data.vehicleValueInfo`, matching how the other project parses it:

```
const vehicle = data.data.vehicleDetails;
const valueInfo = data.data.vehicleValueInfo;

const nvic = vehicle.nvic || "";
const make = vehicle.make || "";
const model = vehicle.family || vehicle.model || "";
const year = vehicle.year || "";
const variant = vehicle.variant || "";
const bodyStyle = vehicle.bodyStyle || "";
const transmission = vehicle.transmissionDescription || "";
const series = vehicle.series || "";
const desc1 = `${year} ${make} ${model} ${variant}`.trim();

// Values from vehicleValueInfo
const marketValue = valueInfo?.marketValue || null;
const tradeValue = valueInfo?.tradePrice || valueInfo?.tradeLowPrice || null;
const retailValue = valueInfo?.retailPrice || null;
```

Also update the image URL to use the Suncorp sales-assets URL pattern from the other project:
```
https://sales-assets.suncorp.com.au/vehicles/nvic/${nvic}.jpg
```

### File Modified
- `src/components/quote-application/Step4VehicleDetails.tsx` -- fix response parsing logic

