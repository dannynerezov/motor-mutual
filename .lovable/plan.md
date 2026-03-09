

## Plan: Create MCM Quote Integration Endpoint

### Overview

Create a single edge function `mcm-quote-api` that handles creating form1, form2, and form3 records via separate actions. The other project calls this endpoint sequentially to build a complete Motor Cover Mutual quote.

### Flow

```text
Other Project                          This Project (MCM)
─────────────                          ──────────────────
1. POST /mcm-quote-api                 
   action: "create_form1"         →    Insert form1_submissions
   (deal_id, customer info)       ←    Return { form1_id, quote_number }

2. POST /mcm-quote-api                 
   action: "create_form2"         →    Insert form2_submissions  
   (form1_id, vehicle, driver)    ←    Return { form2_id }

3. POST /mcm-quote-api                 
   action: "create_form3"         →    Insert form3_submissions
   (form2_id, pricing data)       ←    Return { form3_id }
```

### Database Migration

Add underwriter fields to `form3_submissions`:

```sql
ALTER TABLE form3_submissions
  ADD COLUMN IF NOT EXISTS uw_quote_number text,
  ADD COLUMN IF NOT EXISTS uw_name text,
  ADD COLUMN IF NOT EXISTS uw_base_premium numeric,
  ADD COLUMN IF NOT EXISTS uw_stamp_duty numeric,
  ADD COLUMN IF NOT EXISTS uw_fire_levy numeric,
  ADD COLUMN IF NOT EXISTS uw_gst numeric,
  ADD COLUMN IF NOT EXISTS uw_total_premium numeric;
```

Also add `form1_submission_id` to `form2_submissions` for proper linking:

```sql
ALTER TABLE form2_submissions
  ADD COLUMN IF NOT EXISTS form1_submission_id uuid REFERENCES form1_submissions(id);
```

### Edge Function: `supabase/functions/mcm-quote-api/index.ts`

Single endpoint with `action` field in the JSON body:

- **`create_form1`**: Accepts `deal_id`, `first_name`, `last_name`, `email`, `phone`, `insurance_type`, `channel`. Inserts into `form1_submissions` with auto-generated `quote_number` (from the existing `generate_quote_number()` DB function -- but that's on the `quotes` table trigger, so we'll generate one in the edge function using format `MCM-YYYYMMDD-XXXX`). Returns `form1_id` and `quote_number`.

- **`create_form2`**: Accepts `form1_submission_id`, `deal_id`, and all customer/vehicle/driving fields. Inserts into `form2_submissions`. Returns `form2_id`.

- **`create_form3`**: Accepts `form2_submission_id`, `deal_id`, membership fee (mapped to `base_premium`), `stamp_duty` = 0, `fire_levy` = 0, `gst` = 0, plus underwriter fields: `uw_quote_number`, `uw_name`, `uw_base_premium`, `uw_stamp_duty`, `uw_fire_levy`, `uw_gst`. Inserts into `form3_submissions`. Returns `form3_id`.

**Config**: Add `[functions.mcm-quote-api]` with `verify_jwt = false` to `supabase/config.toml`.

### Endpoint URL

```
https://ajwtlemiupyquwmhzxqi.supabase.co/functions/v1/mcm-quote-api
```

### Integration Prompt for Other Project

A detailed prompt will be provided covering:
- Endpoint URL and request format for each of the 3 actions
- Complete field mappings from the other project's data model to MCM's form1/form2/form3 fields
- Expected responses and error handling
- Sequential flow: create_form1 → get quote_number → create_form2 → get form2_id → create_form3

### Files to Create/Modify

1. **Create** `supabase/functions/mcm-quote-api/index.ts` -- the edge function
2. **Modify** `supabase/config.toml` -- add function config (but this file is auto-managed, so just add the entry)
3. **Migration** -- add underwriter columns to form3_submissions, add form1_submission_id to form2_submissions

