

## Plan: Add AFSL 239926 subheader to Verify Licence button

Update the Verify Licence button in both desktop and mobile menus to use a two-line layout (like the National Cover badge), with "Verify Licence" as the main text and "AFSL 239926" as a small subheader.

### Changes in `src/components/Header.tsx`

**Desktop nav (lines 70-72):** Replace the single-line text with a stacked layout:
```tsx
<Shield className="w-4 h-4" />
<div className="flex flex-col leading-tight">
  <span className="font-semibold text-sm">Verify Licence</span>
  <span className="text-xs text-muted-foreground">AFSL 239926</span>
</div>
```

**Mobile menu:** The mobile Verify Licence link already has this two-line layout with "AFSL 239926" — no change needed there.

| File | Change |
|------|--------|
| `src/components/Header.tsx` | Update desktop Verify Licence button to show AFSL subheader |

