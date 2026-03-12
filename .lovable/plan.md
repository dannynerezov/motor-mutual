

## Plan: Fix header menu scroll navigation

**Problem:** `<Link>` components don't trigger native hash scrolling. Three links need fixing, and "Benefits" needs to point to the "Why Choose the Mutual" section on the homepage instead of `/benefits`.

### Changes

**`src/components/Header.tsx`** — Both desktop and mobile menus:

1. **How It Works** — Change `<Link to="/#how-it-works">` to `<a href="#how-it-works">` (target `id="how-it-works"` already exists on `HowItWorksSection`)

2. **Pricing** — Change `<Link to="/#live-quotes">` to `<a href="#live-quotes">` (target `id="live-quotes"` already exists on `LiveQuotesSection`)

3. **Benefits** — Change `<Link to="/benefits">` to `<a href="#why-choose-mutual">` (scrolls to comparison section on homepage)

**`src/pages/Index.tsx`** — Add `id="why-choose-mutual"` to the `<section>` wrapping `<HowItWorksComparison />` (line 21).

| File | Change |
|------|--------|
| `src/components/Header.tsx` | Convert 3 `<Link>` to `<a>` with hash hrefs (desktop + mobile) |
| `src/pages/Index.tsx` | Add `id="why-choose-mutual"` to comparison section |

