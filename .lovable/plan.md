

## Plan: Replace Rego/State Fields with Contact Fields

### What Changes

Replace the **Vehicle Registration Number** input and **State of Registration** grid in `QuoteForm.tsx` with four contact fields: **First Name**, **Last Name**, **Phone Number**, and **Email Address**.

### New Layout

```text
┌─────────────────────────────────────────┐
│     Get Your Rideshare Quote            │
│     Protect your business on wheels...  │
│     [ Quick • Simple • Transparent ]    │
│                                         │
│  First Name *        Last Name *        │
│  [                ] [                ]  │
│                                         │
│  Phone Number *      Email Address *    │
│  [04...           ] [email@...       ]  │
│                                         │
│  [ ========= Get My Quote ========= ]  │
└─────────────────────────────────────────┘
```

### Implementation Details

**File: `src/components/QuoteForm.tsx`**

1. **Remove**: `registration`, `selectedState`, `vinNumber`, `showManualEntry`, `placeholderText` state variables, the typewriter effect, `AUSTRALIAN_STATES` array, `VehicleDetails`/`VehicleValueInfo`/`VehicleData` interfaces
2. **Remove**: The rego input, state grid, and all associated helper text
3. **Add**: `firstName`, `lastName`, `phone`, `email` state variables
4. **Add**: 2x2 responsive grid (`grid-cols-1 sm:grid-cols-2`) with labeled inputs using existing styling patterns (accent borders, etc.)
5. **Update button**: Disable when any of the 4 fields are empty; change icon from `Car` to `Shield`
6. **Update `handleFindVehicle`** → rename to `handleSubmit`: Insert a row into `form1_submissions` table with the contact details, then navigate or show success
7. **Keep**: All existing card styling, decorative corners, header, ManualQuoteRequestDialog (can remove later), pricing scheme info

### Validation
- Phone: Must start with `04` or `+614`, 10+ digits
- Email: Basic format validation
- Names: Required, trimmed, max 100 chars

### No Other Files Changed
Only `QuoteForm.tsx` is modified.

