

## Plan: Homepage Conversion Optimizations (8 Changes)

### 1. Hero CTA urgency line
**File:** `src/components/QuoteForm.tsx`
- Add a subtle urgency line below the "Get My Quote" button: "Rates reviewed daily — lock in today's price"
- Small text with a Clock icon, pulsing accent dot to draw attention

### 2. Hero stat bar — larger, explained inline
**File:** `src/components/home/HeroSection.tsx`
- Increase the 3 stat cards: bigger text (text-lg for value, text-sm for label), higher contrast (use solid bg-accent/20 backgrounds instead of bg-primary-foreground/5)
- Add a brief inline explanation to each stat so they're self-explanatory at a glance

### 3. "Best Value" tag on Live Quotes table
**File:** `src/components/home/LiveQuotesSection.tsx`
- Rename section from "Live Quotes Database" to "Live Market Comparisons"
- Add a green "Best Value" Badge next to the Mutual Price in every row where mutual < market
- Add a summary line above the table: "The Mutual beat the market in X% of comparisons"

### 4. Price Analytics — full-width interactive treatment
**File:** `src/components/home/PriceAnalyticsSection.tsx`
- Remove the `max-w-3xl` constraint, make it full-width (`max-w-6xl`)
- Increase bar heights from `h-6` to `h-8`, larger labels (`text-sm` to `text-base`)
- Add a savings percentage badge next to each row
- Add a prominent savings summary stat at the top of each tab view

### 5. Comparison table — simplify to 5 rows
**File:** `src/components/home/HowItWorksComparison.tsx`
- Reduce from 9 rows to 5 key differentiators: Pricing, Third-Party Cover, Claims Speed, Regulation, and Repair Control
- Bold checkmarks, cleaner layout

### 6. Sticky mobile CTA
**File:** `src/pages/Index.tsx`
- Add a sticky bottom bar (visible on scroll, mobile only) with "Get a Quote" button that scrolls to top / navigates to the hero form
- Uses `fixed bottom-0` with `md:hidden`, appears after scrolling past the hero

### 7. "The Mutual" brand reinforcement
**Files:** `src/components/home/HeroSection.tsx`, `src/components/home/CompetitivePricingSection.tsx`, `src/components/home/LiveQuotesSection.tsx`, `src/components/home/PriceAnalyticsSection.tsx`
- Replace generic "we/our" language with "The Mutual" throughout all homepage sections
- e.g. "Mutual Price" column becomes "The Mutual's Price", section copy uses "The Mutual" consistently

### 8. Rideshare platform logos strip
**File:** Create `src/components/home/PlatformLogosStrip.tsx`
- Add a "Covers drivers on these platforms" strip with Uber, DiDi, Ola, and Bolt logos
- Use official logo URLs or text-based styled badges as fallback
- Place it in `Index.tsx` between HeroSection and HowItWorksSection
- Clean horizontal layout with subtle grey logos, small "Covers drivers on" label

### File Summary
| File | Action |
|------|--------|
| `src/components/QuoteForm.tsx` | Add urgency line below CTA |
| `src/components/home/HeroSection.tsx` | Enlarge stat bar, brand language |
| `src/components/home/LiveQuotesSection.tsx` | Rename section, add "Best Value" tags, brand language |
| `src/components/home/PriceAnalyticsSection.tsx` | Full-width, larger bars, brand language |
| `src/components/home/HowItWorksComparison.tsx` | Reduce to 5 rows |
| `src/components/home/CompetitivePricingSection.tsx` | Brand language updates |
| `src/components/home/PlatformLogosStrip.tsx` | Create new - platform logos |
| `src/pages/Index.tsx` | Add sticky mobile CTA + PlatformLogosStrip |

