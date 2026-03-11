

## Homepage Redesign Plan

### What We're Building
A complete redesign of `src/pages/Index.tsx` inspired by the mockup's structure, adapted to this project's existing components and Tailwind/shadcn system. The key shift: reframe MCM as **"Australia's Most Competitively Priced Rideshare Cover"** with emphasis on beating market pricing, APRA-backed third-party cover, and live pricing data.

### Sections (top to bottom)

1. **Hero** — Navy gradient background (like mockup). Left: bold headline with orange accent ("Competitively Priced"), subtitle about market monitoring + APRA cover, trust badges. Right: existing `QuoteForm` component (keep as-is, it works).

2. **How It Works** — 3-card grid with orange top-bar accent. Steps: Enter Vehicle Details → See Beating-Market Price → Drive Protected. Clean, minimal cards.

3. **Competitive Pricing Philosophy** — 4-card grid (2x2). Cards: Daily Competitor Monitoring, APRA Third-Party Cover Included (dark/accent card), Best of Both Worlds, No Discrimination. Each with feature bullet lists.

4. **Comparison Table** — Dark navy background. Reuse existing `HowItWorksComparison` component but update content to match the mockup's rows (Pricing Model, Third-Party Cover, Regulatory Protection, Vehicle Value Pricing, Price Matching, Rideshare Coverage, Claims Process, Typical Annual Cost).

5. **Live Quotes Database** — Mockup table with vehicle/state filters. Use **mockup data** for now (as you said, will link to live data from the other project later). Show 6 sample rows with Market Price vs Mutual Price and savings. Summary stats cards below (quotes compared, avg saving, % below market, APRA cover).

6. **Price Analytics** — Tabbed view (By Make/Value/Age/Usage/State). Horizontal bar charts showing Mutual vs Market pricing per vehicle model. Mockup data, visual placeholders.

7. **APRA Trust Strip** — Horizontal bar with navy background, 5 trust items (APRA-regulated, AFCA access, $20M cover, daily monitoring, AFSL details).

8. **Claims Section** — Split layout. Left: 3 feature cards (Report, Dispute, Fast Payment). Right: 4-step vertical timeline (Notify → Assess → Decide → Resolve).

9. **Footer** — Keep existing `Footer` component.

### Files Changed

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Complete rewrite with new section structure |
| `src/components/home/HeroSection.tsx` | New — hero with gradient bg + quote form |
| `src/components/home/HowItWorksSection.tsx` | New — 3-card grid |
| `src/components/home/CompetitivePricingSection.tsx` | New — 4-card philosophy grid |
| `src/components/home/LiveQuotesSection.tsx` | New — mockup table + filters + summary stats |
| `src/components/home/PriceAnalyticsSection.tsx` | New — tabbed bar charts with mockup data |
| `src/components/home/APRATrustStrip.tsx` | New — horizontal trust bar |
| `src/components/home/ClaimsSection.tsx` | New — features + timeline |
| `src/components/home/HowItWorksComparison.tsx` | Update rows to match mockup comparison content |

### Design Decisions
- Keep existing Header and Footer components (they work well)
- Keep existing QuoteForm component in the hero (it submits to form1_submissions — functional)
- Use Tailwind classes matching the mockup's navy/orange palette via existing CSS variables
- All pricing data in Live Quotes and Analytics sections will be hardcoded mockup data for now
- Remove the old Fairness/Transparency/Reliability sections — the new competitive pricing and comparison sections serve the same purpose more effectively
- Mobile responsive throughout using existing breakpoint patterns

