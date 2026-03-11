

## Plan: Fix Data Sync to Pull Correct Benchmark and Mutual Target Values

### Root Cause

The source project's `mutual_quotes` table does **not** have a `comp_benchmark_price` column. That column exists on `form3_submissions` in the source. Our sync function tries to SELECT `comp_benchmark_price` from source `mutual_quotes`, gets null (column doesn't exist), and falls back to `comp_total_annual` (1820.86) — which is wrong.

The correct "Benchmark" value ($2,688.42) lives in `form3_submissions.comp_benchmark_price` on the source, keyed by `deal_id`.

For `mutual_target_price`, the source value may have been updated since last sync — a re-sync should pick up the current value (1638.77).

### Changes

**`supabase/functions/sync-mutual-quotes/index.ts`**

1. Remove `comp_benchmark_price` from the source `mutual_quotes` SELECT (it doesn't exist there)
2. In the existing `form3_submissions` fetch (already fetching vehicle data), also SELECT `comp_benchmark_price`
3. Map `comp_benchmark_price` from the form3 data instead of mutual_quotes:
   ```
   comp_benchmark_price: vehicleMap[q.deal_id]?.comp_benchmark_price ?? q.comp_total_annual,
   ```
4. After deploying, re-run sync to refresh all records

### Expected Result for WEB59623
- Market Price: $2,688.42 (from form3_submissions.comp_benchmark_price)
- Mutual Price: $1,638.77 (from mutual_quotes.mutual_target_price — current source value)

### Files Changed

| File | Change |
|------|--------|
| `supabase/functions/sync-mutual-quotes/index.ts` | Pull benchmark from form3_submissions instead of mutual_quotes |

