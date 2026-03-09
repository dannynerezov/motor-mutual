

## Plan: Form1 → Quote Application Multi-Step Flow

### Overview

When "Get My Quote" is pressed on the homepage, it will:
1. Insert a `form1_submissions` record with a generated quote number (e.g. `MCM202603090111`)
2. Redirect to `/apply/:form1Id` — a new multi-step Form 2 application page
3. The application page mirrors the No-Database Webform's 6-page flow using the same field names

### Database Change

Add a `quote_number` column to `form1_submissions` table, auto-generated using the existing `generate_quote_number()` function via a trigger.

```sql
ALTER TABLE form1_submissions ADD COLUMN quote_number text;
-- Trigger to auto-set quote_number on insert
CREATE TRIGGER set_form1_quote_number
  BEFORE INSERT ON form1_submissions
  FOR EACH ROW
  EXECUTE FUNCTION set_quote_number();
```

### File Changes

**1. `src/components/QuoteForm.tsx`**
- After successful `form1_submissions` insert, retrieve the returned `id`
- Navigate to `/apply/${id}`

**2. `src/App.tsx`**
- Add route: `<Route path="/apply/:form1Id" element={<QuoteApplicationPage />} />`

**3. `src/pages/QuoteApplicationPage.tsx`** (new)
- Multi-step form with 6 pages matching the No-Database Webform structure:
  - **Page 1**: Vehicle Usage (`vehicle_usage`, `is_rented`, `is_delivery`, `is_rideshare`, `food_delivery_hours`, `business_usage_type`, `is_refrigerated`)
  - **Page 2**: Contact Details (`first_name`, `last_name`, `gender`, `dob_day/month/year`, `phone`, `email`, `address`, `housing_status`) — pre-filled from Form 1
  - **Page 3**: Driving History (`international_license`, `owner_drives`, `license_type`, `demerit_points`, `claims_made`, `bankruptcy`, `license_suspended`, etc.)
  - **Page 4**: Vehicle Details (`vehicle_registration`, `vehicle_state`, `vehicle_make/model/year`, `market_value`, etc.)
  - **Page 5**: Vehicle Usage Details + Cover Options (`exclude_under_25`, `km_per_year`, `parking_location`, `coverage_level`, `excess_level`, `policy_start_date`, etc.)
  - **Page 6**: Terms & Signature (`privacy_accepted`, `broker_terms_accepted`, `signature`)
- On load: fetch the Form 1 record to pre-fill name, email, phone
- Uses a progress bar and step navigation
- On final submit: insert into `form2_submissions` with `form1_id` reference, show success

**4. Step components** (new files in `src/components/quote-application/`):
- `Step1VehicleUsage.tsx`
- `Step2ContactDetails.tsx`
- `Step3DrivingHistory.tsx`
- `Step4VehicleDetails.tsx`
- `Step5CoverOptions.tsx`
- `Step6TermsSignature.tsx`

Each step uses the **exact same field names** as the `form2_submissions` database columns (snake_case), matching the No-Database Webform's `FormData` interface. This ensures webhook payloads from the other project can insert directly into the same table.

### Form State

A single `formData` state object in `QuoteApplicationPage` with all `form2_submissions` column names. Each step component receives `formData` and an `updateField(field, value)` callback. Validation per step before allowing progression.

### What This Does NOT Include
- No webhook endpoint yet (separate task)
- No signature canvas (can add later)
- No vehicle lookup API integration on this project (the other project handles that)

