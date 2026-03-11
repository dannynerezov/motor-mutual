

## Plan: Improve Live Quotes Table

### Problem
Vehicle details are missing because the sync function only pulls from `mutual_quotes` on the source — it doesn't fetch vehicle info from `form3_submissions`. The local `form3_submissions` table likely has no matching `deal_id` records.

### Changes

**1. Database Migration — Add vehicle columns to `mutual_quotes`**

Add `vehicle_make`, `vehicle_model`, `vehicle_year` columns (all text, nullable) to `mutual_quotes` so vehicle info is stored alongside pricing data.

**2. Update `sync-mutual-quotes` Edge Function**

After fetching `mutual_quotes` from source, also fetch `form3_submissions` from the source DB using the same `deal_id` list. Merge vehicle_make, vehicle_model, vehicle_year into each record before upserting.

**3. Update `LiveQuotesSection.tsx`**

- Remove the second query to local `form3_submissions` — vehicle data now comes directly from `mutual_quotes`
- Rename "Benchmark Price" → "Market Price", remove `line-through` class
- Rename "Mutual Target" → "Mutual Price"
- Add "Ref#" column showing `deal_id` for verification
- Simplify data fetching to a single query

### Files Changed

| File | Change |
|------|--------|
| Migration SQL | Add vehicle_make/model/year to mutual_quotes |
| `supabase/functions/sync-mutual-quotes/index.ts` | Fetch source form3_submissions, merge vehicle info |
| `src/components/home/LiveQuotesSection.tsx` | Column renames, add Ref#, remove strikethrough, simplify query |

