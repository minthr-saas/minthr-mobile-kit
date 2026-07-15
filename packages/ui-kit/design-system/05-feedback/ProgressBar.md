# ProgressBar

A linear, determinate progress indicator driven by a `value` from 0 to 1 — uploads, sync, quota, multi-step completion.

## Purpose

`ProgressBar` renders a rounded track with a colored fill whose width is `value × 100%`. It is **determinate** — you must know how far along the task is. For an indeterminate "working…" state use [`Spinner`](./Spinner.md); for placeholder loading use [`Skeleton`](./Skeleton.md). It's a display element, not interactive.

## Visual anatomy

```
┌────────────────────────────────────────────┐
│██████████████████                           │  value = 0.5
└────────────────────────────────────────────┘
  track: gray[100], fully rounded, overflow hidden
  fill:  variant color, width = clamp(value,0,1) × 100%
  height default 6 → fill/track radius = height / 2 (pill ends)
```

`value` is clamped to `[0, 1]` internally (`Math.max(0, Math.min(1, value))`), so out-of-range inputs are safe. Both track and fill get `borderRadius: height / 2`, giving pill-shaped ends at any height.

## Variants

`variant` (default `'default'`) colors the fill only; the track is always `palette.gray[100]`:

| Variant | Fill color | Use for |
|---|---|---|
| `default` **(default)** | `lightColors.brand` | Neutral / in-progress completion |
| `success` | `lightColors.success` | Completed, healthy |
| `warning` | `lightColors.warning` | Approaching a limit |
| `danger` | `lightColors.danger` | Over limit / failed |

## Sizes

No named sizes — `height` is a raw number (default `6`). The corner radius derives from it, so the bar stays a pill at any thickness. Keep it in the 4–8 range for a standard row; use larger only for a hero meter.

## States

- ProgressBar has no pressed/disabled state — it reflects `value`.
- **0** → empty track. **1** → full fill. It does not animate itself; drive `value` over time from the parent (e.g. a `setInterval` or a real upload callback) to show motion.

## Rules

- **`value` is 0–1, not 0–100.** 50% is `0.5`. The component clamps, but pass the right scale.
- **Track is `palette.gray[100]`, fill is a semantic token** (Rule 3) — never a hex.
- **No shadow, no border** (Rule 1); it's a flat track with `overflow: 'hidden'`.
- **Pick the variant by meaning, not decoration** — green for done, amber near a cap, red for failure. Most bars are `default` (brand).
- **Pair it with a number label** when precision matters — render your own `Text` (e.g. "60%") beside it; ProgressBar shows no text.
- **Full width by default** — the track is `width: '100%'`; constrain it via the parent, not the component.

## Props API

```ts
import type { ViewProps } from 'react-native';

export type ProgressVariant = 'default' | 'success' | 'warning' | 'danger';

export interface ProgressBarProps extends ViewProps {
  /** 0 to 1, clamped. */
  value: number;              // required
  variant?: ProgressVariant;  // default 'default'
  height?: number;            // default 6
  // ...all ViewProps (style, testID, …)
}
```

Exports from the barrel: `ProgressBar`, `ProgressVariant`.

## Examples

### Basic
```tsx
import { ProgressBar } from '@minthr-saas/mobile-ui-kit';

<ProgressBar value={0.5} />
```

### Variants
```tsx
<ProgressBar value={0.6} variant="default" />
<ProgressBar value={0.6} variant="success" />
<ProgressBar value={0.6} variant="warning" />
<ProgressBar value={0.6} variant="danger" />
```

### With a value label
```tsx
import { ProgressBar, Text, spacing } from '@minthr-saas/mobile-ui-kit';

<View style={{ gap: spacing[2] }}>
  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    <Text variant="caption" tone="muted">Sync progress</Text>
    <Text variant="caption" tone="muted">{Math.round(value * 100)}%</Text>
  </View>
  <ProgressBar value={value} />
</View>
```

### Driven over time
```tsx
const [v, setV] = useState(0);
useEffect(() => {
  const id = setInterval(() => setV((p) => (p >= 1 ? 0 : Math.min(1, p + 0.05))), 250);
  return () => clearInterval(id);
}, []);

<ProgressBar value={v} variant="success" height={8} />
```

## When NOT to use

- **The task duration is unknown / indeterminate** → [`Spinner`](./Spinner.md).
- **Content placeholder while a screen loads** → [`Skeleton`](./Skeleton.md).
- **A multi-step wizard position** → a [`Stepper`](../07-navigation/Stepper.md), not a raw percentage bar.
- **A pass/fail count or category breakdown** → a chart or a set of [`Badge`](../04-display/Badge.md)s, not a single bar.

## Accessibility

- The track sets `accessibilityRole="progressbar"` and `accessibilityValue={{ now, min: 0, max: 100 }}` where `now = Math.round(clamped * 100)` — so assistive tech announces the percentage. You don't need to add these yourself.
- Note the component spreads `{...rest}` **after** its own `accessibilityRole`/`accessibilityValue`, so passing your own `accessibilityValue` (e.g. to phrase progress differently) will override the derived one — do so intentionally.
- Add an `accessibilityLabel` naming what is progressing ("Upload") when the surrounding text doesn't already say it.
