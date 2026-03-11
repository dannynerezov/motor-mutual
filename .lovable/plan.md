

## Plan: Fix Data Sync Column Mapping

### Root Cause

The `sync-mutual-quotes` edge function has incorrect column mapping:

1. **Benchmark**: The sync fetches `comp_total_annual` from source and copies it into both `comp_total_annual` AND `comp_benchmark_price`. But on the source, `comp_benchmark_price` is the actual benchmark value ($2,688.42) — it's a separate column that's never being fetched.

2. **Mutual Target**: The value is also wrong (1729.82 vs 1638.77), suggesting the source data may have been updated after sync, or there's a similar mapping issue.

### Fix

**`supabase/functions/sync-mutual-quotes/index.ts`** — Two changes:

1. Add `comp_benchmark_price` to the source SELECT query
2. Fix the mapping so `comp_benchmark_price` uses the source's actual `comp_benchmark_price` value (falling back to `comp_total_annual` if null)

```
// Current (broken):
.select("deal_id, comp_total_annual, mutual_target_price, ...")

comp_benchmark_price: q.comp_total_annual,  // WRONG

// Fixed:
.select("deal_id, comp_total_annual, comp_benchmark_price, mutual_target_price, ...")

comp_benchmark_price: q.comp_benchmark_price ?? q.comp_total_annual,  // Correct
```

After deploying, re-run the sync to refresh all 500 records with correct values.

### Files Changed

| File | Change |
|------|--------|
| `supabase/functions/sync-mutual-quotes/index.ts` | Add `comp_benchmark_price` to source SELECT, fix mapping |

