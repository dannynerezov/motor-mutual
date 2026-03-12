

## Plan: Add PDS link to main menu

Add a "PDS" navigation link in `src/components/Header.tsx` pointing to `/pds`, in both desktop and mobile menus. Place it after "Claims".

### Changes

**`src/components/Header.tsx`**:
- **Desktop nav**: Add a new `<Link to="/pds">PDS</Link>` after the Claims link, using the same styling as other nav items.
- **Mobile nav**: Add a matching PDS link with `FileText` icon (already imported) after Claims in the mobile menu.

