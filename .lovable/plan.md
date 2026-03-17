

## Security Issue: Public RLS Policies Expose All Data

### The Problem

The anon key is **not** the vulnerability -- it's always public (embedded in your frontend JavaScript bundle). Anyone can extract it from browser dev tools. This is by design.

The real issue is your **Row-Level Security (RLS) policies**. Every sensitive table currently has:

```sql
Policy: "Public select form1"
Command: SELECT
Using Expression: true   -- ← This means ANYONE can read ALL rows
```

This applies to: `form1_submissions`, `form2_submissions`, `form3_submissions`, `form4_submissions`, `memberships`, `mutual_quotes`, `quotes`, `customers`, and more.

With `true` as the policy expression, any anonymous user with the public key can read every record.

### The Fix

We need to lock down SELECT policies on sensitive tables so only **authenticated** users can read data, while keeping INSERT open for the public-facing forms.

**Tables that need SELECT restricted to authenticated users:**
- `form1_submissions` — contains customer PII (name, email, phone)
- `form2_submissions` — contains detailed personal + vehicle data
- `form3_submissions` — contains pricing/quote details
- `form4_submissions` — contains confirmation + payment info
- `memberships` — contains member PII
- `customers` — contains customer PII
- `mutual_quotes` — contains deal data
- `quotes` — contains quote data
- `suncorp_quote_details` — contains quote details
- `third_party_quotes` — contains quote data

**Tables that can stay public SELECT** (non-sensitive reference data):
- `insurance_pricing_data` — public pricing index data
- `pricing_schemes` — public pricing config
- `sample_vehicle_quotes` — sample/demo data
- `product_disclosure_statements` — public PDS documents

**Frontend changes needed:**
- `RetrieveQuotePage.tsx` queries form1/form2/form3 by quote number — this needs to work for unauthenticated users retrieving their own quote. We'll solve this by creating a **backend function** (edge function) that looks up a quote by quote number and returns only that specific record, rather than giving broad table access.
- `QuoteForm.tsx` only does INSERT (no change needed)
- `QuoteApplicationPage.tsx` reads form1 by ID — same approach, use edge function or pass data via URL params
- `AdminSubmissions.tsx` — admin page, requires authentication (already should be behind auth)

### Implementation Steps

1. **Create a database migration** to replace the public SELECT policies on all sensitive tables with `auth.role() = 'authenticated'` policies
2. **Create an edge function** `retrieve-quote` that accepts a quote number and returns the matching form1/form2/form3 data (so unauthenticated users can still retrieve their quote)
3. **Update `RetrieveQuotePage.tsx`** to call the edge function instead of querying tables directly
4. **Update `QuoteApplicationPage.tsx`** to use the edge function or pass form1 data through state rather than re-querying

### Files Changed
| File | Action |
|------|--------|
| Database migration | Drop public SELECT, add authenticated-only SELECT on ~10 tables |
| `supabase/functions/retrieve-quote/index.ts` | New edge function for quote lookup by number |
| `src/pages/RetrieveQuotePage.tsx` | Call edge function instead of direct table queries |
| `src/pages/QuoteApplicationPage.tsx` | Use edge function or route state for form1 data |

