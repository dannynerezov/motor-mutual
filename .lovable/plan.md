

## Plan: Fix form1_submissions INSERT failing with 401

**Root cause:** Line 40 in `QuoteForm.tsx` does `.select("id").single()` after the INSERT. This triggers a SELECT query on `form1_submissions`, which now requires authentication (per the RLS lockdown). Unauthenticated users can INSERT but can no longer SELECT back the result.

**Fix:** The returned `id` isn't used — the navigate on line 43 only passes the form field values, not the inserted row's ID. Simply remove `.select("id").single()` from the insert chain.

**File:** `src/components/QuoteForm.tsx` line 40

**Change:**
```tsx
// Before
}).select("id").single();

// After
});
```

One line change, one file.

