# Skeleton

An animated gray placeholder that holds the shape of content while it loads, so the layout doesn't jump when real data arrives.

## Purpose

`Skeleton` is a single pulsing rectangle. You size it (`width` / `height` / `radius`) and compose several of them to mirror the rough shape of the final UI — a title line, two body lines, an avatar circle. It fades its opacity between 0.5 and 1 on a loop. It renders no text and no children; it is purely a visual placeholder. For a spinning "working" indicator use [`Spinner`](./Spinner.md); for determinate progress use [`ProgressBar`](./ProgressBar.md).

## Visual anatomy

```
▓▓▓▓▓▓▓▓▓▓▓▓          ← Skeleton width="60%" height={12}
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    ← Skeleton width="90%" height={12}
▓▓▓▓▓▓▓▓▓▓▓▓▓▓        ← Skeleton width="75%" height={12}

●  ▓▓▓▓▓▓▓             ← circle: Skeleton width={40} height={40} radius={20}
   ▓▓▓▓▓
```

Fill is `palette.gray[100]`; default corner is `radius.sm` (4). Opacity animates 0.5 → 1 → 0.5 on an 800ms-per-leg loop (native driver).

## Sizing

There are no variants or sizes — you compose shapes from four props:

| Prop | Type | Default | Note |
|---|---|---|---|
| `width` | `number \| \`${number}%\`` | `'100%'` | px or a percentage string like `'60%'` |
| `height` | `number` | `12` | px |
| `radius` | `number` | `radius.sm` (4) | pass `20` for a 40px circle; `radius.md` for cards |
| `style` | `ViewStyle` | — | extra layout only |

- **Text line** → small `height` (12–18), default radius.
- **Circle (avatar)** → equal `width`/`height`, `radius` = half of it.
- **Block (image/card)** → large `height`, `radius: radius.md`.

## States

One state: continuously pulsing while mounted. The loop starts on mount and is stopped on unmount. Render Skeletons while `isLoading`, then swap them for the real content — Skeleton itself has no `loading` prop.

## Rules

- **Match the real content's dimensions.** Same widths, same heights, same radii, so hydration doesn't shift the layout. This is the whole point.
- **Fill is `palette.gray[100]`** — no border, no shadow.
- **Vary line widths** (e.g. 60% / 90% / 75%) so a text block reads as prose, not a solid bar.
- **Group with real spacing.** Lay Skeletons out with `spacing[2]`/`spacing[3]` gaps like the real rows.
- **Don't leave it mounted forever.** If a load can fail, fall back to an [`EmptyState`](../04-display/EmptyState.md) or error, not an eternal shimmer.

## Props API

```ts
import type { ViewStyle } from 'react-native';

export interface SkeletonProps {
  width?: number | `${number}%`;   // default '100%'
  height?: number;                 // default 12
  radius?: number;                 // default radius.sm (4)
  style?: ViewStyle;
}
```

`SkeletonProps` does **not** extend `ViewProps` — only these four props are accepted. Exports from the barrel: `Skeleton`, `SkeletonProps` (type).

## Examples

### Text lines
```tsx
import { Skeleton, spacing } from '@minthr-saas/mobile-ui-kit';

<View style={{ gap: spacing[2] }}>
  <Skeleton width="60%" height={12} />
  <Skeleton width="90%" height={12} />
  <Skeleton width="75%" height={12} />
</View>
```

### Avatar + two lines (list row)
```tsx
<View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
  <Skeleton width={40} height={40} radius={20} />
  <View style={{ flex: 1, gap: spacing[2] }}>
    <Skeleton width="60%" height={14} />
    <Skeleton width="40%" height={12} />
  </View>
</View>
```

### Card placeholder
```tsx
import { Card, Skeleton, radius, spacing } from '@minthr-saas/mobile-ui-kit';

<Card>
  <View style={{ gap: spacing[3] }}>
    <Skeleton width="50%" height={18} />
    <Skeleton width="100%" height={12} />
    <Skeleton width="85%" height={12} />
    <Skeleton width="100%" height={140} radius={radius.md} />
  </View>
</Card>
```

### Conditional render
```tsx
{isLoading ? <Skeleton width="70%" height={16} /> : <Text variant="subtitle">{name}</Text>}
```

## When NOT to use

- **A short, indeterminate "working…" spinner** (button submit, pull-to-refresh) → [`Spinner`](./Spinner.md).
- **A known-percentage task (upload, sync)** → [`ProgressBar`](./ProgressBar.md).
- **No data will ever arrive (empty list)** → [`EmptyState`](../04-display/EmptyState.md).
- **A one-off tiny inline wait** — a `Spinner size="sm"` is simpler than shaping skeletons.

## Accessibility

- Skeleton sets `accessibilityRole="none"` and `accessibilityLabel="Loading"`, so it announces as a loading placeholder rather than as decorative geometry, and screen readers don't try to read the gray blocks as content.
- When a whole region is loading, consider setting `accessibilityLiveRegion="polite"` on the container that later holds the real content, so the arrival of data is announced once — don't announce every individual skeleton.
- Keep the placeholder brief; a shimmer that never resolves is worse for assistive tech than a static "Loading" label.
