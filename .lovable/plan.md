

## Plan: Replace text badges with actual platform logos

### Changes

**1. Copy uploaded logos to `src/assets/`**
- `user-uploads://Uber_logo_2018.png` → `src/assets/platforms/uber-logo.png`
- `user-uploads://DiDi-Logo.png` → `src/assets/platforms/didi-logo.png`
- `user-uploads://Ola-Cabs-Logo.png` → `src/assets/platforms/ola-logo.png`

**2. Update `src/components/home/PlatformLogosStrip.tsx`**
- Remove Bolt entirely
- Replace text badges with `<img>` tags using imported logo assets
- Wrap each logo in an `<a>` anchor linking to the platform's website
- Responsive sizing: ~h-8 on mobile, ~h-10 on desktop
- Grayscale filter at rest, full color on hover
- Keep the "Covers drivers on these platforms" label

### Technical Details

```tsx
import uberLogo from "@/assets/platforms/uber-logo.png";
import didiLogo from "@/assets/platforms/didi-logo.png";
import olaLogo from "@/assets/platforms/ola-logo.png";

const platforms = [
  { name: "Uber", logo: uberLogo, url: "https://www.uber.com" },
  { name: "DiDi", logo: didiLogo, url: "https://www.didiglobal.com" },
  { name: "Ola", logo: olaLogo, url: "https://www.olacabs.com" },
];
```

Each logo rendered as:
```tsx
<a href={p.url} target="_blank" rel="noopener noreferrer">
  <img src={p.logo} alt={p.name} className="h-6 sm:h-8 md:h-10 w-auto grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all" />
</a>
```

### Files
| File | Action |
|------|--------|
| `src/assets/platforms/uber-logo.png` | Copy from upload |
| `src/assets/platforms/didi-logo.png` | Copy from upload |
| `src/assets/platforms/ola-logo.png` | Copy from upload |
| `src/components/home/PlatformLogosStrip.tsx` | Rewrite with logo images |

