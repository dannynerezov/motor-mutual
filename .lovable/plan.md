

## Plan: Add Deal ID Search to Submissions Viewer

### What
Add a search input to `/admin/submissions` that filters by Deal ID. When a search is active, Form 2/3/4 tabs show only records linked to the matching Form 1 records (via `form1_submission_id` chain), so you can trace a deal through all stages.

### Implementation (single file: `src/pages/AdminSubmissions.tsx`)

1. **Add search input** above the tabs with a text field for Deal ID and a clear button
2. **Search logic**:
   - When `searchDealId` is empty: fetch all records as today (default behavior)
   - When `searchDealId` has a value: 
     - Form 1: filter by `deal_id` using `.ilike('deal_id', '%searchTerm%')`
     - Form 2: filter by `deal_id` matching the same search term (form2 has its own `deal_id` column)
     - Form 3: filter by `deal_id` matching the same search term (form3 has its own `deal_id` column)
     - Form 4: filter by `deal_id` matching the same search term (form4 has its own `deal_id` column)
   - All four tables have a `deal_id` column, so direct filtering works without needing to chain through IDs
3. **Search triggers**: search on Enter key or button click, with a clear/reset button to return to full view
4. **Visual indicator**: show a badge or message when search is active so user knows results are filtered

### No database changes needed
All tables already have `deal_id` columns.

