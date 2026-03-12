

## Plan: Add Internal Dispute Resolution Subsection to Section 7

### Overview
Update Section 7 — Complaints to include a new subsection on Internal Dispute Resolution (IDR) before the existing External Dispute Resolution section. This will document the IDR process as required by Australian financial services law.

### Changes Required

**File: `src/pages/PDSPage.tsx`**

Update the Section 7 content (lines 211-223) to insert a new subsection:

#### Current Structure:
```
Section 7 — Complaints
├── Intro paragraphs
└── 7.1 External dispute resolution
```

#### New Structure:
```
Section 7 — Complaints
├── Intro paragraphs
├── 7.1 Internal Dispute Resolution (NEW)
│   ├── Statutory obligation statement (s912A(1)(g))
│   └── 4-Step IDR Process
│       ├── Step 1: Lodge Your Complaint
│       ├── Step 2: Acknowledgement
│       ├── Step 3: Investigation
│       └── Step 4: Resolution & Outcome
└── 7.2 External dispute resolution (renumbered from 7.1)
```

### Content to Add

**7.1 Internal Dispute Resolution**

The subsection will include:

1. **Statutory Acknowledgement**: A statement explaining that the Mutual maintains an internal dispute resolution procedure in compliance with section 912A(1)(g) of the Corporations Act 2001 (Cth), which requires financial services licensees to have adequate arrangements for handling complaints.

2. **4-Step IDR Process** (summarised from the screenshot):

   - **Step 1 — Lodge Your Complaint**: Contact details required (name, contact info, clear explanation, desired outcome, supporting evidence). Available channels: phone, email, helpdesk, or in writing.

   - **Step 2 — Acknowledgement**: Complaint acknowledged within one business day (verbally or in writing), with a reference number provided for tracking.

   - **Step 3 — Investigation**: A dedicated Customer Relations Specialist will investigate, review policies and documentation, contact member if additional information is required, and consult with relevant departments or third parties as needed.

   - **Step 4 — Resolution & Outcome**: Written decision with findings, clear reasons if complaint not upheld, details of any remedial action, and information about external dispute resolution options if unsatisfied.

### Technical Details

- **Location**: Insert between lines 216 and 217 (after the intro paragraphs, before current 7.1)
- **Renumber**: Current "7.1 External dispute resolution" becomes "7.2 External dispute resolution"
- **Styling**: Use existing h3 for main subsection heading, h4 for step headings, and ul/li for bullet points
- **Add section ID**: `id="section-7-1"` for the IDR subsection to support TOC navigation

### Optional Enhancement

Consider updating the Table of Contents component (`PDSTableOfContents.tsx`) to include a reference to the new IDR subsection if granular navigation is desired.

