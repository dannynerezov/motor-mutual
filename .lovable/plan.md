

## Plan: Rewrite Section 15 — Excess Structure

Replace the current Section 15 in `src/pages/PDSPage.tsx` (lines 723–778) with new provisions based on the supplied source material, adapted to The Mutual's terminology. No cross-references to other PDS section/clause numbers will be included.

### New structure for Section 15

**15.1 What an Excess Is**
- An Excess is the amount payable by the Member per Incident before the Mutual will consider a claim or pay any benefits.
- Each separate Incident requires its own claim and its own Excess (e.g. damage to the rear from one event and damage to the front from a separate event are two Incidents, each with its own Excess).

**15.2 Amount Payable**
- The Basic Excess amount is shown on the Member's Certificate of Cover.
- **Young driver loading:** an additional **$1,000** applies if the driver was under 25 at the time of the Incident.
- **Hail or flood:** an additional **$2,000** applies on top of the Basic Excess for Hail or Flood Incidents.

**15.3 Late-Reporting Excess Penalties**
Where a claim is lodged after the Incident, the Excess is multiplied as follows:
- More than 30 days after the Incident → **3× the Certificate Excess**
- 6 to 12 months after the Incident → **5× the Certificate Excess**
- More than 12 months after the Incident → **10× the Certificate Excess**

Late notification may also result in increased Excesses being applied if the claim is accepted.

**15.4 How and When the Excess Is Paid**
- The Excess is payable regardless of fault.
- It must be paid in full before any claim is considered or any benefits (including repair costs, legal costs, and associated costs) are paid.
- It is usually collected when the claim is first lodged.
- If the claim is not accepted, the Excess is refunded.
- The Mutual may refuse to cover legal or other costs that arise from delay in paying the Excess.

**15.5 Not-At-Fault Refunds**
Where the Member is not at fault, the Excess may be refunded once all of the Mutual's costs have been recovered from the at-fault party. Any such refund is at the **Board's absolute discretion** and is not automatic.

**15.6 Effect of Excess on Contribution**
The chosen Excess level affects the Member's Contribution: a higher Excess generally results in a lower Contribution, and a lower Excess in a higher Contribution.

**15.7 Excess and Total Loss Settlements**
Where a claim is settled as a Total Loss, any unpaid Excess will be deducted from the settlement amount, alongside any unpaid Contribution.

**15.8 Contribution to Repair Costs (Separate from Excess)**
Separate from the Excess, Members may also be asked to contribute to repair costs for items affected by wear and tear, neglect, rust, corrosion, or pre-existing damage. This is an additional out-of-pocket payment that sits alongside the Excess.

**15.9 Discretion to Waive or Vary**
The Board may waive, reduce, or vary any Excess at its absolute discretion. No waiver creates a precedent or entitlement for future claims.

### File
| File | Change |
|------|--------|
| `src/pages/PDSPage.tsx` | Replace existing Section 15 (lines 723–778) with the new 9-subsection structure above |

### Out of scope
- No changes to Section 9 (Claims Lodgement), Section 13 (Claims Settlement), or the Glossary — although those sections logically connect to Excess provisions, this plan is scoped only to Section 15 as requested.
- No changes to the Table of Contents (Section 15 label remains "Excess Structure").

