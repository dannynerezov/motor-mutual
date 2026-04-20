

## Plan: Remove AMIR Contact Details from PDS

Remove the outdated AFSL Holder contact line from the PDS title page.

**File:** `src/pages/PDSPage.tsx`

**Change:**
```tsx
// Line 65 - REMOVE entire line:
- <p>Email: info@amir.com.au | Post: PO Box 1678, North Sydney NSW 2059</p>
```

The AFSL Holder block will then only show:
- Static Insurance Pty Ltd
- AFS Licence No. 543696

