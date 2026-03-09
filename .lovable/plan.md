

## Plan: Overhaul Quote Application Steps

This is a large set of UI/UX changes across the multi-step quote application form. Here is the breakdown:

### 1. Step 1 - Auto-select Rideshare & Skip (Step1VehicleUsage.tsx)
- Auto-set `vehicle_usage` to "Rideshare" on mount
- Auto-advance to step 2 after a brief delay (or immediately)
- Disable/grey out all non-Rideshare options visually
- The step essentially becomes a pass-through

### 2. Step 2 - Contact Details (Step2ContactDetails.tsx)

**Gender as icon buttons**: Replace the Select dropdown with two styled buttons showing universal Male (♂) and Female (♀) symbols side by side.

**DOB on same line as Gender**: Arrange Gender and DOB fields on a single horizontal row (Gender left, DOB right) using a responsive grid.

**Address with Suncorp autosuggest**: Replace the plain text Input with the existing `AddressAutosuggest` component already in this project. Wire `onAddressSelect` to format and store the full address string in `formData.address`.

**Hide Housing Status**: Remove or conditionally hide the housing_status field.

### 3. Step 3 - Driving History (Step3DrivingHistory.tsx)

**Claims list like the other project**: When `claims_made === "Yes"`, show a structured claims list (max 3 claims) instead of just a count field. Each claim has:
- Claim Description (Select from: "At fault with excess", "Other excess claim", "No excess claim", "Windscreen", "Natural hazard")
- Date (Month + Year selectors)
- Remove button

Add "+ Add Another Claim" button. Store as JSON string in `claims_list` field. Auto-initialize first claim when "Yes" selected. Show dialog if user tries to add more than 3.

### 4. Step 4 - Vehicle Details (Step4VehicleDetails.tsx)

**Suncorp rego lookup**: Add a "Lookup Vehicle" button. When clicked, call `suncorp-proxy` edge function with `action: 'vehicleLookup'` using the rego + state. On success, auto-populate make, model, year, NVIC, variant, body style, description, market/trade/retail values. Show a success card with vehicle image (from Suncorp NVIC image URL). Show interesting facts about the car (year manufactured, body style, etc.) in a fun info card.

**Vehicle not registered button**: Allow manual entry if rego lookup fails or vehicle is unregistered.

### 5. Step 5 - Vehicle Usage Details (Step5VehicleUsageDetails.tsx)

**Hide these fields**:
- `rideshare_delivery` (Is the car used for ridesharing...)
- `days_per_week_work`
- `km_per_year`
- `peak_times`
- `parking_location`

Keep only: `exclude_under_25`, `undamaged_roadworthy`, and vehicle condition/finance questions.

### 6. Step 6 - Cover Options (Step6CoverOptions.tsx)

**Hide**: `coverage_level`, `excess_level` selectors. Keep policy extras and roadside assistance visible.

### 7. Step 7 - Terms & Signature (Step7TermsSignature.tsx)

**Replace entire content** with a "Contact National Cover" message page instead of declarations/checkboxes. Show:
- A branded message card with phone number and email
- "Your application has been saved. To complete your quote, please contact National Cover directly."
- Contact details and business hours
- The submit button text changes to "Complete & Contact National Cover"

### Files Modified
- `src/components/quote-application/Step1VehicleUsage.tsx`
- `src/components/quote-application/Step2ContactDetails.tsx`
- `src/components/quote-application/Step3DrivingHistory.tsx`
- `src/components/quote-application/Step4VehicleDetails.tsx`
- `src/components/quote-application/Step5VehicleUsageDetails.tsx`
- `src/components/quote-application/Step6CoverOptions.tsx`
- `src/components/quote-application/Step7TermsSignature.tsx`
- `src/pages/QuoteApplicationPage.tsx` (auto-skip step 1 logic)

### No Database Changes
All changes are frontend-only. The existing `form2_submissions` schema already supports all these fields.

