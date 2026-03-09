

## Plan: Replace DOB Inputs with Select Dropdowns

### What Changes

Replace the three numeric `<Input>` fields for Day/Month/Year with three `<Select>` dropdown components matching the uploaded reference image.

### Implementation in `Step2ContactDetails.tsx`

**Remove** (lines 63-69): The current `<Input>` fields with `/` separators.

**Replace with** three `<Select>` components in a `flex gap-2` row:

1. **Day** — Select with options 1-31, placeholder "Day"
2. **Month** — Select with options January-December (display name, value stored as "1"-"12"), placeholder "Month"  
3. **Year** — Select with options from current year minus 18 down to current year minus 99, placeholder "Year"

Each select updates the corresponding `dob_day`, `dob_month`, `dob_year` field via `updateField`. Uses the existing `Select`/`SelectContent`/`SelectItem`/`SelectTrigger`/`SelectValue` components already imported in the project.

### Files Modified
- `src/components/quote-application/Step2ContactDetails.tsx` only

