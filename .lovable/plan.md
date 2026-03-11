

## Plan: Connect Live Quotes Section to Real Data

### The Data Problem
The data you want lives in the `mutual_quotes` table, which exists only in the [No-Database Webform](/projects/c66a07aa-56fb-46ec-9cbc-31971191d1b5) project's database -- not in this project's database. Key columns needed:
- `comp_total_annual` or `comp_benchmark_price` = **Benchmark Price**
- `mutual_target_price` = **Mutual Target** (comp_total_annual * 0.9)
- `tppd_winning_quote_ref` = indicates a completed TPPD quote
- `vehicle_state`, `deal_id`, `created_at`

Vehicle details (make/model/year) are already in this project's `form3_submissions` table, linked by `deal_id`.

### Step 1: Create `mutual_quotes` table (DB migration)
Create the table in this project's database, matching the other project's schema. Key columns:

| Column | Type | Purpose |
|--------|------|---------|
| `deal_id` | text (PK/unique) | Links to form3_submissions |
| `comp_total_annual` | numeric | Competitor total price |
| `comp_benchmark_price` | numeric | Benchmark price |
| `mutual_target_price` | numeric | Mutual's target (90% of benchmark) |
| `mutual_membership_price` | numeric | Membership fee portion |
| `tppd_winning_premium` | numeric | Winning TPPD premium |
| `tppd_winning_quote_ref` | text | Completed quote reference |
| `tppd_winning_insurer` | text | Winning insurer |
| `tppd_status` | text | Status (completed/pending) |
| `vehicle_state` | text | State |
| `created_at` / `updated_at` | timestamptz | Timestamps |

RLS: public SELECT (this is public-facing pricing data, no PII).

### Step 2: Rewrite `LiveQuotesSection.tsx`
Replace mockup data with live database query:

- **Query**: `mutual_quotes` joined with `form3_submissions` on `deal_id` to get vehicle details
- **Filter**: Only rows where `tppd_winning_quote_ref IS NOT NULL` (completed quotes)
- **Display** (most recent 100):
  - Col 1: Date (formatted from `created_at`)
  - Col 2: Vehicle (year + make + model from form3)
  - Col 3: State badge
  - Col 4: Benchmark Price (`comp_benchmark_price` or `comp_total_annual`)
  - Col 5: Mutual Target (`mutual_target_price`)
  - Col 6: Saving (benchmark - mutual target, calculated)
- **Filters**: Keep make/state dropdowns, populated dynamically from the data
- **Pagination**: Show 20 per page with load-more or pagination

### Step 3: Live Stats Counters
Replace hardcoded stats with real calculations:
- **Quotes Compared**: COUNT where `tppd_winning_quote_ref IS NOT NULL`
- **Avg Annual Saving**: AVG(benchmark - mutual_target)
- **Below Market Rate**: percentage where `mutual_target_price < comp_benchmark_price`
- **APRA Cover Included**: keep at 100% (static fact)

### Step 4: Data Sync (next step after this)
The table will be empty initially. To populate it, we'll need to either:
- Have the other project's edge functions write to both databases
- Create a sync edge function that pulls from the other project
- Manual CSV import

This gets the infrastructure in place so once data flows in, the homepage updates automatically.

### Files Changed
| File | Change |
|------|--------|
| Migration SQL | Create `mutual_quotes` table |
| `src/components/home/LiveQuotesSection.tsx` | Full rewrite: Supabase query, dynamic filters, real stats |

