# 08 — RTL and logical properties

## The rule
The MintHR app supports Arabic (right-to-left). Every component must render correctly when the app runs RTL, **without** direction-specific branches sprinkled through its styles. This is achieved by using React Native's **logical** layout properties and the kit's RTL helpers — components stay direction-agnostic and the framework flips them.

React Native flips the layout when `I18nManager.isRTL` is true (typically set via `I18nManager.forceRTL(true)` + a reload, or driven by the device locale).

## Logical layout props — use these ALWAYS

RN resolves `start`/`end` against the active direction. In LTR `start` = left; in RTL `start` = right — automatically.

Physical (**never** in new code):
`marginLeft` · `marginRight` · `paddingLeft` · `paddingRight` · `left` · `right` · `borderLeftWidth` · `borderRightWidth` · `borderTopLeftRadius` · `borderTopRightRadius`

Logical (**always**):
`marginStart` · `marginEnd` · `paddingStart` · `paddingEnd` · `start` · `end` · `borderStartWidth` · `borderEndWidth` · `borderTopStartRadius` · `borderTopEndRadius` · `borderBottomStartRadius` · `borderBottomEndRadius`

Symmetric props are always fine: `paddingVertical`, `paddingHorizontal`, `marginVertical`, `marginHorizontal`, `gap`, `top`, `bottom`.

```ts
// ❌ physical — breaks in RTL
{ marginLeft: spacing[3], paddingRight: spacing[4] }
// ✅ logical — flips automatically
{ marginStart: spacing[3], paddingEnd: spacing[4] }
```

### Text alignment
- Default body text: `textAlign: 'left'` already follows direction in RN, but prefer leaving it unset so it flows naturally, or use `writingDirection` only when mixing scripts.
- Center stays `textAlign: 'center'` (direction-neutral).

## Two things that stay physical — use the helpers

`marginStart`/`end` cover layout, but two categories don't auto-flip. Use [`src/utils/rtl.ts`](../../src/utils/rtl.ts):

### 1. Directional icons
Chevrons/arrows that mean "next / back / forward" must point the right way. Pick the glyph, don't hardcode:

```tsx
import { forwardChevron, backChevron } from '@minthr-saas/mobile-ui-kit';

<Feather name={forwardChevron()} … />  // chevron-right (LTR) / chevron-left (RTL) — drill-in, next
<Feather name={backChevron()} … />     // chevron-left (LTR) / chevron-right (RTL) — back, previous
```

Direction-neutral glyphs (`chevron-down`, `x`, `plus`, `check`) need no flipping.

### 2. `translateX` animations
Transforms live in physical pixel space and do **not** flip with `I18nManager.isRTL`. Multiply the offset by `rtlSign()` so a panel slides in from its logical edge:

```tsx
import { rtlSign } from '@minthr-saas/mobile-ui-kit';

// Drawer slides in from the trailing edge in both directions
translateX.value = withSpring(open ? 0 : width * rtlSign());
```

`rtlSign()` returns `+1` in LTR, `-1` in RTL. `isRTL()` is also exported if you need the raw boolean.

## Side-anchored overlays

The `Drawer` anchors to the `start` or `end` edge (logical), so an `end`-anchored drawer appears on the right in LTR and the left in RTL — matching user expectation. It combines `end: 0` positioning with a `rtlSign()`-corrected slide. You get this for free by using the kit `Drawer`; if you build a custom side panel, follow the same two-part pattern (logical inset + `rtlSign()` transform).

## Numbers and dates

Most users prefer Latin numerals even in Arabic UI. Force them when needed:

```ts
new Intl.NumberFormat('ar', { numberingSystem: 'latn' }).format(1234); // "1,234"
```

Keep numeric columns aligned with `fontVariant: ['tabular-nums']` regardless of direction.

## Reading direction lazily

The helpers read `I18nManager.isRTL` **per call / per render**, not once at module load, so a forced direction change that takes effect after startup is reflected. Don't cache the value at import time.

## Reviewer checklist

- Grep the diff for `Left`/`Right` in style keys (`marginLeft`, `paddingRight`, `left:`, `right:`, `borderLeftWidth`, `borderTopRightRadius`). Replace with `Start`/`End` equivalents.
- Any directional chevron/arrow uses `forwardChevron()` / `backChevron()` (or is neutral).
- Any `translateX` animation multiplies by `rtlSign()`.
- Flip the app to RTL (`I18nManager.forceRTL(true)` + reload) and eyeball the screen — nothing should overlap, clip, or point the wrong way.
