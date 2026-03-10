

## Plan: Create Submissions Viewer Page

### What
A new `/admin/submissions` page with 4 tabs (Form 1, Form 2, Form 3, Form 4) showing records from each `formX_submissions` table in a sortable table view with auto-refresh.

### Implementation

1. **Create `src/pages/AdminSubmissions.tsx`**
   - Uses Tabs component with 4 tabs: Form 1, Form 2, Form 3, Form 4
   - Each tab fetches from its respective table using `supabase.from('formX_submissions').select('*').order('created_at', { ascending: false })`
   - Display key columns in a table:
     - **Form 1**: id, deal_id, quote_number, first_name, last_name, email, insurance_type, channel, submission_status, created_at
     - **Form 2**: id, deal_id, form1_submission_id, first_name, last_name, vehicle_registration, vehicle_make, vehicle_model, vehicle_year, submission_status, created_at
     - **Form 3**: id, deal_id, form2_submission_id, base_premium, stamp_duty, gst, total_annual_premium, uw_quote_number, uw_name, submission_status, created_at
     - **Form 4**: id, deal_id, form3_submission_id, customer_first_name, vehicle_rego, payment_method, submission_status, created_at
   - Auto-refresh every 10 seconds so new records appear while testing from the other project
   - Show record count badge on each tab

2. **Add route in `src/App.tsx`**
   - `/admin/submissions` → `AdminSubmissions`

3. **Add nav link on AdminPage**
   - Button/link to navigate to `/admin/submissions`

### Files
- **Create**: `src/pages/AdminSubmissions.tsx`
- **Edit**: `src/App.tsx` (add route)
- **Edit**: `src/pages/AdminPage.tsx` (add link)

