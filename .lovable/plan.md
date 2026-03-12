

## Plan: Redesign /broker page based on HTML reference

The uploaded HTML has several strong design ideas worth adopting. Here's what I'll implement, keeping the existing Header and Footer:

### 1. Dark hero band at top
Replace the current plain text header with a dark navy gradient hero band featuring:
- Orange pill badge "Your Appointed Broker"
- Headline: "You're in good hands with **National Cover**" (orange emphasis)
- Subtitle paragraph
- Decorative radial gradient orbs (CSS pseudo-elements via inline styles or Tailwind)

### 2. Elevated broker card overlapping the hero
Restructure the broker info into a single card that overlaps the hero (negative margin-top):
- **Top section**: Logo box + company name + description + colored regulation tags (ABN in green, AFSL Rep in blue, AFCA Member in orange)
- **Bottom section**: 2-column grid with Phone/Address and Website cells, styled with uppercase labels

### 3. Reviews section with rating summary + review cards grid
Replace the Birdeye widget embed with a styled reviews block:
- Large "5.0" rating number + stars + review count + Google badge
- 3-column grid of review cards (1-col on mobile) with avatar, name, platform, stars, text
- Keep the Birdeye script for the actual widget, but add the visual summary header above it

### 4. Security bar
Add a blue-tinted security notice bar: "Your details will be securely passed to National Cover... No spam — ever." with a lock icon

### 5. Dark CTA block with trust row
Replace the current gradient button with a dark navy CTA block:
- Persuasive copy line
- Large orange rounded CTA button
- Trust row underneath: "AFCA supervised", "No obligation quote", "256-bit encrypted", "Response within 2 hrs"

### 6. Fade-in animations
Add simple CSS animations (fadeUp) to the broker card, reviews block, and CTA block

### File Changes
| File | Action |
|------|--------|
| `src/pages/BrokerPage.tsx` | Full rewrite of the page content (keep Header/Footer, keep state/redirect logic) |

### Technical Approach
- Use Tailwind classes for all styling (no raw CSS file needed)
- Use existing UI primitives (Card, Button, Badge) where appropriate
- Keep the `nationalCoverLogo` import and existing redirect logic
- Responsive: stack broker card sections and review cards on mobile
- The Birdeye widget script stays as-is for real reviews; the static review cards serve as visual fallback/complement

