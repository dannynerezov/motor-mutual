
## Plan: Replace "AMIR" with "Static" in PDS page

### Scope
Replace all 40 occurrences of the acronym `AMIR` with `Static` throughout `src/pages/PDSPage.tsx`. This aligns the abbreviation with the new entity name (Static Insurance Pty Ltd).

### Specific changes

**Glossary entry (line 89):**
- Before: `<strong>AMIR</strong> Static Insurance Pty Ltd AFSL no. 543696.`
- After: `<strong>Static</strong> Static Insurance Pty Ltd AFSL no. 543696.`

**Introduction (line 76):**
- `...as an authorised representative of Static Insurance Pty Ltd AFSL no. 543696 (AMIR)...` → `...(Static)...`

**All other body references** (Sections 2, 7, 9–10, 17–20, etc.):
- Every standalone use of `AMIR` (e.g. "AMIR, as the AFSL holder", "ASIC supervises AMIR", "The Manager is an authorised representative of AMIR") → replace with `Static`.

**Email (line 65):** Leave `info@amir.com.au` unchanged — it's an email address, not the acronym. Will confirm after approval if you want this updated too.

### Files
| File | Change |
|------|--------|
| `src/pages/PDSPage.tsx` | Global word-boundary replace of `AMIR` → `Static` (≈40 occurrences), excluding the email address `info@amir.com.au` |

### Out of scope
No other files contain `AMIR` references. Footer, Header, TOC, BrokerPage already use the new entity names without the AMIR acronym.
