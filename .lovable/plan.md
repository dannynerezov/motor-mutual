

## Plan: Fix hash links to always navigate to homepage sections

**Problem:** Links like `#how-it-works`, `#live-quotes`, `#why-choose-mutual` are relative, so when clicked from `/pds` or `/claims`, they resolve to `/pds#live-quotes` instead of `/#live-quotes`.

**Fix:** Change all three `href` values from relative (`#section`) to absolute (`/#section`) in both desktop and mobile menus.

### Changes — `src/components/Header.tsx`

| Line(s) | Current | New |
|---------|---------|-----|
| 21, 108 | `href="#how-it-works"` | `href="/#how-it-works"` |
| 28, 116 | `href="#live-quotes"` | `href="/#live-quotes"` |
| 35, 124 | `href="#why-choose-mutual"` | `href="/#why-choose-mutual"` |

6 occurrences total (3 desktop + 3 mobile). No other files affected.

