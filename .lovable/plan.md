

## Plan: Create /broker page as quote handoff to National Cover

### Overview
Replace the current `/apply/:form1Id` redirect with a new `/broker` page that serves as a trust-building intermediary before handing the user off to National Cover's website with prefilled URL parameters.

### Changes

**1. Update `src/components/QuoteForm.tsx`**
- After successful DB insert, navigate to `/broker` instead of `/apply/${data.id}`
- Pass form data via URL search params or route state: `navigate('/broker', { state: { firstName, lastName, phone, email } })`

**2. Create `src/pages/BrokerPage.tsx`**
- Read user data from `location.state`
- Professional layout with:
  - **Header section**: "Your Appointed Broker" with National Cover logo (loaded from `https://home.nationalcover.com.au/assets/national-cover-logo-CJHWuDVY.png`)
  - **About blurb**: Concise professional description of National Cover Pty Ltd as the appointed broker and manager for Motor Cover Mutual
  - **Legal details**: National Cover Pty Ltd ABN 74 639 621 480, Australian Financial Services Representative
  - **Contact info**: Phone 07 5346 0149, Address 298 Musgrave Road, Coopers Plains, QLD 4108
  - **Website link**: Link to nationalcover.com.au
  - **Google Reviews widget**: Embed the Birdeye script via `useEffect` to dynamically inject the `<script>` tag and render div
  - **"Proceed to National Cover" button**: Redirects to `https://nationalcover.com.au/quote?fname={firstName}&lname={lastName}&phone={phone}&email={email}&type=Rideshare`
- If no state data (direct navigation), redirect back to `/`

**3. Update `src/App.tsx`**
- Import `BrokerPage` and add route: `<Route path="/broker" element={<BrokerPage />} />`

### Birdeye Widget Embedding
Use a `useEffect` to create and append the script element dynamically since third-party scripts can't be embedded directly in JSX:
```tsx
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://getbirdeye.com.au/embed/v7/169994241801236/11/9876543213011151831216912';
  script.async = true;
  document.body.appendChild(script);
  return () => { document.body.removeChild(script); };
}, []);
```

### URL Parameter Handoff
The "Proceed" button constructs:
```
https://nationalcover.com.au/quote?fname=John&lname=Smith&phone=0412345678&email=john@example.com&type=Rideshare
```
All values encoded with `encodeURIComponent`.

### Files
| File | Action |
|------|--------|
| `src/pages/BrokerPage.tsx` | Create |
| `src/components/QuoteForm.tsx` | Change navigate target to `/broker` with state |
| `src/App.tsx` | Add `/broker` route |

