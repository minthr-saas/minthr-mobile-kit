# 05 — Radii, borders, shadows

Three token files: [`radius.ts`](../../src/tokens/radius.ts), [`borders.ts`](../../src/tokens/borders.ts), [`shadows.ts`](../../src/tokens/shadows.ts).

```ts
import { radius, borders, shadows } from '@minthr-saas/mobile-ui-kit';
```

## Corner radii

```ts
export const radius = { none: 0, sm: 4, md: 6, lg: 8, xl: 12, full: 9999 };
```

| Token | px | Usage |
|---|---|---|
| `radius.none` | 0 | Square edges, one-sided accent strips |
| `radius.sm` | 4 | Badges, small pills, tags |
| `radius.md` | 6 | **Default** — buttons, inputs, small cards |
| `radius.lg` | 8 | Cards, list containers, panels |
| `radius.xl` | 12 | Modals, bottom sheets, large hero cards |
| `radius.full` | 9999 | Avatars, circular FAB, dot pills |

**Default is `radius.md`.** When unsure, use it.

**Rule:** outer container gets the larger radius, inner elements equal or smaller — never inverse. Don't mix radii chaotically within one component.

**One-sided borders get `radius.none`.** A left/top accent stripe with rounded corners looks broken.

## Borders

```ts
export const borders = {
  hair:  StyleSheet.hairlineWidth, // ~0.5 on iOS retina, 1 elsewhere — no aliasing
  thin:  1,
  thick: 2,
};
```

| Token | Usage |
|---|---|
| `borders.hair` | **Default** — separates surfaces, divides rows, `Card`/`ListItem` outlines |
| `borders.thin` | Inputs and controls that need to feel tangible; focused field outline |
| `borders.thick` | Selected/active accents, rare emphasis |

### Border colors
- Default: `lightColors.border` (`gray-200`)
- Stronger / focused affordance: `lightColors.borderStrong` (`gray-300`)
- Focused / selected: `lightColors.brand`

### Borderless variants keep a transparent border
So layout doesn't shift when a border appears on focus/selection:

```ts
{ borderWidth: borders.thin, borderColor: 'transparent' } // reserves the space
```

## Shadows — floating overlays ONLY

```ts
export const shadows = { sm, md, lg, drawer };
```

Each token is a single object carrying **both** iOS fields (`shadowColor` / `shadowOffset` / `shadowOpacity` / `shadowRadius`) **and** Android `elevation`. RN ignores the fields that don't apply per platform.

| Token | For |
|---|---|
| `shadows.sm` | Subtle lift — small popovers |
| `shadows.md` | `Menu`, `Tooltip`, `Toast`, `Popover` |
| `shadows.lg` | `Modal`, `BottomSheet` |
| `shadows.drawer` | Side `Drawer` (offset toward the trailing edge) |

### The hard rule (CLAUDE.md Rule 1)
**No shadows on containers.** `Card`, `Button`, `Input`, `Badge`, `ListItem`, `PageHeader` use `borders.hair` + `lightColors.border`. Shadows are reserved for elements that genuinely float above the screen: `Modal`, `BottomSheet`, `Menu`/`Popover`, `Tooltip`, `Toast`, `Drawer`.

### Why borders over shadows
Hairline borders render crisply at any DPI. Shadows get muddy on low-end Android displays, and elevation behaves inconsistently across API levels. In a data-dense app, exactness reads as premium.

### Cross-platform caveat
On Android < API 28, `shadowColor` is ignored and `elevation` produces a default-color shadow. Prefer `md` / `lg` (which look consistent) over hand-tuned values, and always test the overlay on a real Android device.

## Applying them

```tsx
import { StyleSheet } from 'react-native';
import { radius, borders, shadows, lightColors } from '@minthr-saas/mobile-ui-kit';

const styles = StyleSheet.create({
  card: {                            // container → border, no shadow
    borderRadius: radius.lg,
    borderWidth: borders.hair,
    borderColor: lightColors.border,
    backgroundColor: lightColors.surfacePrimary,
  },
  sheet: {                           // floating → shadow
    borderTopStartRadius: radius.xl,
    borderTopEndRadius: radius.xl,
    backgroundColor: lightColors.surfacePrimary,
    ...shadows.lg,
  },
});
```
