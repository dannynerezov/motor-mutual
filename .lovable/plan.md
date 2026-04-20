

## Plan: Update Legal Entity Names and AFSL on PDS Page

### Overview
Update all legal entity references across the PDS page and related components to reflect the new company structure and AFSL number.

### Entity Changes

| Old Name | New Name |
|----------|----------|
| Motor Cover Mutual Limited | MOTOR COVER MUTUAL AUSTRALIA LIMITED |
| Motor Cover Mutual Ltd | MOTOR COVER MUTUAL AUSTRALIA LIMITED |
| Asia Mideast Insurance and Reinsurance Pty Ltd | Static Insurance Pty Ltd |
| National Cover Pty Ltd | MCMA Management Pty Ltd |
| AFSL 239926 | AFSL 543696 |

### Files to Update

| File | Changes |
|------|---------|
| `src/pages/PDSPage.tsx` | Title page, Contact Details, Introduction, Glossary (AMIR, Manager, Mutual), Section 2, Section 9-10, Section 17-20, Remove all ACN numbers |
| `src/components/Footer.tsx` | Product Issuer, AFSL Authorisation, Insurance Broker sections, Remove ACN numbers |
| `src/components/Header.tsx` | AFSL badge text and ASIC verification link (239926 → 543696) |
| `src/components/PDSTableOfContents.tsx` | Section 2 label |
| `src/pages/BrokerPage.tsx` | National Cover → MCMA Management references |

### Detailed Text Changes

**PDSPage.tsx (1334 lines total):**
- Line 28: Title "Motor Cover Mutual Limited" → "MOTOR COVER MUTUAL AUSTRALIA LIMITED"
- Line 31: Remove "ACN [insert]"
- Lines 62-68: Update AFSL Holder block (Asia Mideast → Static, 239926 → 543696, remove ACN)
- Line 75: "Motor Cover Mutual Ltd ACN 692 709 649" → "MOTOR COVER MUTUAL AUSTRALIA LIMITED"
- Line 76: Update Manager and AMIR references, remove ACN numbers
- Line 89: "AMIR" definition (Asia Mideast → Static, 239926 → 543696, remove ACN)
- Line 96: "Manager" definition (National Cover → MCMA Management, remove ACN)
- Line 98: "Mutual" definition (Motor Cover Mutual Ltd ACN → MOTOR COVER MUTUAL AUSTRALIA LIMITED)
- Line 118: Section 2 heading "About Motor Cover Mutual Limited" → "About MOTOR COVER MUTUAL AUSTRALIA LIMITED"
- Line 859: Section 17.5 AFSL Holder (Asia Mideast → Static, 239926 → 543696)
- Lines 279-925+: All remaining references throughout Protection Wording

**Footer.tsx:**
- Line 102-103: Product Issuer (remove ACN 692 709 649)
- Line 107-108: AFSL Authorisation (Asia Mideast → Static, 239926 → 543696, remove ACN)
- Line 112-113: Insurance Broker (National Cover → MCMA Management, remove ABN)
- Line 118: Bottom paragraph entity references

**Header.tsx:**
- Line 70: ASIC verification URL (239926 → 543696)
- Line 73-74: aria-label and title (Asia Mideast → Static)
- Line 80: Badge text "AFSL 239926" → "AFSL 543696"
- Lines 166-174: Mobile menu duplicate references

**PDSTableOfContents.tsx:**
- Line 27: "Section 2 — About Motor Cover Mutual Limited" → "Section 2 — About MOTOR COVER MUTUAL AUSTRALIA LIMITED"

**BrokerPage.tsx:**
- Lines 116-123: Update all National Cover Pty Ltd references to MCMA Management Pty Ltd

