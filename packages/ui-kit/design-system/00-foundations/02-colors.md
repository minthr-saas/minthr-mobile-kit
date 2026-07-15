# 02 — Colors

Colors live in [`src/tokens/colors.ts`](../../src/tokens/colors.ts) and ship through the barrel. There are **two layers**:

1. `palette` — the raw color scale (mirrors the web kit's `tokens.css`).
2. `lightColors` / `darkColors` — semantic theme objects that components reference.

**Components never read `palette.*` directly.** They read semantic colors only (`lightColors.brand`, `lightColors.textPrimary`, …), so swapping the active theme later is a one-object change.

```ts
import { palette, lightColors } from '@minthr-saas/mobile-ui-kit';
```

## Philosophy
Brand green is the only decorative color. Everything else is either neutral gray or semantic (success / warning / danger / info) for meaning.

## Brand (green)

The MintHR identity. Used sparingly — primary action, active tab, one selected state, a single highlighted stat.

| `palette.brand` | Hex | Usage |
|---|---|---|
| `50`  | `#E1F5EE` | Light backgrounds (`brandSubtle` — selected tint, chip active) |
| `100` | `#C5E8D6` | Secondary fill |
| `300` | `#7FBCA0` | Borders on light brand backgrounds |
| `500` | `#2C7955` | **Primary** — CTAs, active states, logo (`lightColors.brand`) |
| `600` | `#266C4A` | Pressed / hover on `brand-500` (`lightColors.brandHover`) |
| `700` | `#1F5F3F` | Text on `brand-50` backgrounds (`lightColors.brandStrong`) |
| `900` | `#0E3823` | Darkest text on brand backgrounds |

**Usage rule:** count the green on each screen and keep it to a small handful.

## Neutral gray (warm neutral with a green tint)

The workhorse. These grays carry a subtle green undertone that ties them to `#2C7955`, so the UI reads as cohesively "ours".

| `palette.gray` | Hex | Usage |
|---|---|---|
| `50`  | `#F8FAF8` | Subtle backgrounds (`surfaceSubtle`, pressed rows, section fills) |
| `100` | `#F1F4F1` | Secondary surfaces, disabled fills |
| `200` | `#E5E9E5` | **Default border** (`lightColors.border`) — hairlines everywhere |
| `300` | `#CFD4CE` | Strong border (`borderStrong`) — inputs, secondary buttons |
| `400` | `#AFB5AD` | Disabled text, empty-state icons |
| `500` | `#858A83` | Placeholder text, inactive icons (`textMuted`) |
| `600` | `#5C615A` | Secondary text (`textSecondary`) |
| `700` | `#424643` | Emphasized secondary text |
| `800` | `#2B2E2B` | **Primary text** (`textPrimary`) — warmer than black, feels expensive |

**Never use pure black** (`#000`) or pure white (`#FFF`) for text. Use `textPrimary` and `textInverse`.

## Semantic scales

Each semantic family has a `50` (subtle fill), `500` (base), `700` (text-on-subtle), and `900` (deep) stop.

### success — green, leans brand
Used for "Active", "Approved", "Completed", positive deltas.

| Token | Hex |
|---|---|
| `palette.success[50]`  | `#E1F5EE` |
| `palette.success[500]` | `#1D9E75` |
| `palette.success[700]` | `#0F6E56` |
| `palette.success[900]` | `#063B2F` |

### warning — amber
Used for "Draft", "Pending", "In progress".

| Token | Hex |
|---|---|
| `palette.warning[50]`  | `#FAEEDA` |
| `palette.warning[500]` | `#EF9F27` |
| `palette.warning[700]` | `#854F0B` |
| `palette.warning[900]` | `#2E1600` |

### danger — coral-red
Used for "Rejected", "Inactive", destructive actions, errors.

| Token | Hex |
|---|---|
| `palette.danger[50]`  | `#FCEBEB` |
| `palette.danger[500]` | `#D85A30` |
| `palette.danger[700]` | `#712B13` |
| `palette.danger[900]` | `#2E0A05` |

### info — blue
Used for "New", informational states, tips.

| Token | Hex |
|---|---|
| `palette.info[50]`  | `#E6F1FB` |
| `palette.info[500]` | `#378ADD` |
| `palette.info[700]` | `#0C447C` |
| `palette.info[900]` | `#061325` |

## Semantic theme object (`lightColors`)

This is what components actually consume. Keys are stable; only the values change between themes.

```ts
export const lightColors = {
  // Surfaces
  surfacePage:    '#FDFDFC',        // app background — slightly warm, softer than pure white
  surfacePrimary: '#FFFFFF',        // cards, sheets, rows
  surfaceSubtle:  palette.gray[50], // pressed rows, section fills, disabled

  // Text
  textPrimary:   palette.gray[800],
  textSecondary: palette.gray[600],
  textMuted:     palette.gray[500],
  textInverse:   '#FFFFFF',         // text on brand / danger fills

  // Borders
  border:       palette.gray[200],
  borderStrong: palette.gray[300],

  // Brand
  brand:       palette.brand[500],
  brandHover:  palette.brand[600],  // pressed state
  brandSubtle: palette.brand[50],
  brandStrong: palette.brand[700],
  onBrand:     '#FFFFFF',

  // Semantic (base + subtle fill for each)
  success: palette.success[500], successSubtle: palette.success[50],
  warning: palette.warning[500], warningSubtle: palette.warning[50],
  danger:  palette.danger[500],  dangerSubtle:  palette.danger[50],
  info:    palette.info[500],    infoSubtle:    palette.info[50],
};
```

## Text-on-color rules

On a colored `*Subtle` fill, use the matching `700` stop from the same family. **Never** black or gray on a colored fill.

- Text on `brandSubtle` → `palette.brand[700]`
- Text on `successSubtle` → `palette.success[700]`
- Text on `warningSubtle` → `palette.warning[700]`
- Text on `dangerSubtle` → `palette.danger[700]`
- Text on `infoSubtle` → `palette.info[700]`

On a solid `500` fill (primary/danger buttons, filled badges), use `onBrand` / `textInverse` (`#FFFFFF`).

## Surface hierarchy — 3 layers only

1. **Page** — `surfacePage` (`#FDFDFC`), the scroll background of every screen.
2. **Surface** — `surfacePrimary` (`#FFFFFF`), for `Card`, `BottomSheet`, `Modal`, `ListItem`.
3. **Subtle fill** — `surfaceSubtle` (`gray-50`), for pressed states, grouped section backgrounds, disabled controls.

Never nest more than 3 surface levels — it flattens the hierarchy on a small screen.

## Avatar color palette

`Avatar` renders a deterministic background for users without a photo — the **same** person always gets the **same** color. The hashing and palette live inside [`src/Avatar.tsx`](../../src/Avatar.tsx); don't reinvent it. See [Avatar.md](../04-display/Avatar.md).

## Using colors in a component

```tsx
import { StyleSheet } from 'react-native';
import { lightColors, borders } from '@minthr-saas/mobile-ui-kit';

const styles = StyleSheet.create({
  card: {
    backgroundColor: lightColors.surfacePrimary,
    borderColor: lightColors.border,
    borderWidth: borders.hair,
  },
});
```

Never write a hex literal in component code. If a color you need isn't a semantic token, stop and add it to `lightColors` (with a matching `darkColors` key) rather than inlining it.

## Dark mode

`darkColors` currently **aliases `lightColors`** — the keys exist so components can be written theme-agnostic, but the values are placeholders. Populate real dark values alongside a `useTheme()` hook when dark mode is scheduled. Because every component already reads semantic keys (never `palette.*` or hex), turning on dark mode is a one-object change, not a component-by-component migration.
