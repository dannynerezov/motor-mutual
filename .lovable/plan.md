
## Plan: Add "Download PDF" button to PDS page

### Goal
Add a "Download PDF" button in the top-right of the PDS content area (above the "MOTOR COVER MUTUAL AUSTRALIA LIMITED" title, below the site header) that generates and downloads a properly formatted PDF of the PDS content.

### Approach
Use **client-side PDF generation** with `html2pdf.js` (wraps html2canvas + jsPDF). This captures the rendered PDS DOM with existing styles (from `PDSPage.module.css`), preserving headings, sections, callout boxes, and typography.

Why client-side:
- The PDS is static rendered content already styled for print-like layout (max-width 850px, serif-friendly sizing).
- No server round-trip needed.
- Preserves existing CSS styling automatically.

### Changes

**1. Add dependency**
- `html2pdf.js` (single package, includes html2canvas + jsPDF)

**2. `src/pages/PDSPage.tsx`**
- Add a `ref` on the PDS document container (the `<div className={styles.pdsDocument}>` element).
- Add a sticky/positioned "Download PDF" button in the top-right of the content area, above the title page block, below the site header (within the page layout, not the global header).
- Button uses existing `Button` component with `Download` icon from `lucide-react`.
- On click: dynamically import `html2pdf.js`, hide the button + TOC sidebar temporarily, generate PDF with options:
  - Filename: `Motor-Cover-Mutual-Australia-PDS.pdf`
  - Format: A4
  - Margins: 10mm
  - `pagebreak: { mode: ['css', 'legacy'], before: '.page-break-before' }` so each "Part" heading starts on a new page.
- Show loading state on button while generating ("Generating…").

**3. `src/pages/PDSPage.module.css`**
- Add `.downloadButtonWrapper` for positioning (right-aligned, margin below site header, above title page).
- Add a `.noPrint` class applied to the button + TOC so they're excluded from the captured DOM via temporary `display: none` toggle during generation.
- Add `@media print` rules to hide the button and TOC if user uses browser print as fallback.

### Layout sketch
```text
┌─ Site Header ───────────────────────────────┐
├─────────────────────────────────────────────┤
│  [TOC sidebar]   │      [Download PDF] ← NEW │
│                  │  ┌────────────────────┐   │
│                  │  │ MOTOR COVER MUTUAL │   │
│                  │  │ AUSTRALIA LIMITED  │   │
│                  │  │ (title page)       │   │
│                  │  └────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Out of scope
- Server-side PDF rendering (Puppeteer edge function) — only needed if client-side output quality is insufficient; can revisit.
- Custom PDF table of contents with clickable links inside the PDF.
- Splitting per-section downloads.
