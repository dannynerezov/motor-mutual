

## Plan: Remove unnecessary address validation toast

The toast "Address validated - Warning: Coordinates not available" is showing because the coordinate extraction check on line 242 uses a falsy check (`!extractedLatitude || !extractedLongitude`), which fails for valid coordinate values like `0` or when coordinates are stored as strings like `"0"` or nested in an unexpected structure.

### Fix

In `src/components/AddressAutosuggest.tsx`, remove both toast calls (lines 242-250) — the success toast and the warning toast. The green checkmark and "Address validated" text below the input already provides sufficient user feedback. No toast is needed.

### File Modified
- `src/components/AddressAutosuggest.tsx` — remove lines 242-250 (the `if/else` block with both toasts)

