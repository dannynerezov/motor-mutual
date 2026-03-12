

## Plan: Update Main Menu Links and Navigation

### Changes to `src/components/Header.tsx`

**1. Navigation link updates (desktop + mobile):**

| Current | New Label | New Target |
|---------|-----------|------------|
| How It Works → `/#how-it-works` | **How It Works** (unchanged) | Scroll to HowItWorksSection (need to add `id` to that section) |
| Values (dropdown) | **Pricing** (simple link, no dropdown) | `/#live-quotes` (scroll to LiveQuotesSection) |
| Benefits → `/benefits` | **Why Choose the Mutual?** | `/benefits` (same page, new label) |
| Claims → `/claims` | **Claims** (unchanged) | unchanged |

**2. Remove Google Reviews button** — replace with a "Brokered by National Cover" element:
- Tasteful pill/badge style similar to current Google reviews button
- Text: "Brokered by National Cover" with a subtle broker icon
- Links to: `https://getbirdeye.com.au/national-cover-insurance-brokers-169994241801236`
- Opens in new tab

**3. Update Verify Licence link:**
- URL changes to: `https://service.asic.gov.au/search/EntityDetail?LicenceNumber=239926&PermissionType=Australian%20financial%20services%20licensees&licenceName=ASIA%20MIDEAST%20INSURANCE%20AND%20REINSURANCE%20PTY%20LTD`
- Keep the Shield icon and "Verify Licence" text
- Add tooltip or subtitle: "AFSL 239926"

### Changes to `src/components/home/HowItWorksSection.tsx`
- Add `id="how-it-works"` to the section element

### Changes to `src/components/home/LiveQuotesSection.tsx`
- Add `id="live-quotes"` to the section element

### Files Changed

| File | Change |
|------|--------|
| `src/components/Header.tsx` | Update nav links, replace Google Reviews with National Cover broker badge, update ASIC URL, update mobile menu to match |
| `src/components/home/HowItWorksSection.tsx` | Add `id="how-it-works"` |
| `src/components/home/LiveQuotesSection.tsx` | Add `id="live-quotes"` |

