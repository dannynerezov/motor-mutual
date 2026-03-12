

## Plan: Update Price Analytics with Live Database Data

### Problem
The Price Analytics section uses hardcoded data. We need to replace it with real aggregated data from `mutual_quotes`. For the "By Value" tab, we need vehicle value data which exists on the source project's `form3_submissions.vehicle_value` but isn't synced yet.

### Changes

**1. Database Migration — Add `vehicle_value` to `mutual_quotes`**
Add a nullable numeric `vehicle_value` column.

**2. Update `sync-mutual-quotes` Edge Function**
Include `vehicle_value` in the `form3_submissions` SELECT and map it into each record. The existing `vehicleMap` already fetches from source form3 — just add the column.

**3. Re-sync data**
Trigger the sync function to backfill vehicle values for all 500 records.

**4. Update `PriceAnalyticsSection.tsx`**
Replace hardcoded arrays with a `useEffect` that queries `mutual_quotes` and aggregates:
- **By Make**: Top 5 makes by count, showing avg `comp_benchmark_price` vs avg `mutual_target_price`
- **By Value**: Group by vehicle value ranges ($10k–15k, $15k–25k, etc.), avg market vs mutual
- **By State**: Group by `vehicle_state`, avg market vs mutual

Add loading state. Keep the existing bar chart UI unchanged.

### Files Changed

| File | Change |
|------|--------|
| Migration SQL | Add `vehicle_value` numeric column to `mutual_quotes` |
| `supabase/functions/sync-mutual-quotes/index.ts` | Add `vehicle_value` to form3 SELECT and record mapping |
| `src/components/home/PriceAnalyticsSection.tsx` | Fetch + aggregate from `mutual_quotes`, replace hardcoded data |

