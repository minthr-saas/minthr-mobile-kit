# Spinner

A circular, indeterminate loading indicator with an optional caption — for "working…" states where you can't measure progress.

## Purpose

`Spinner` wraps React Native's `ActivityIndicator` with kit token colors, a discrete size scale, and an optional `label` rendered beneath it. Use it for indeterminate waits (submitting a form, fetching a screen, refreshing). For a known percentage use [`ProgressBar`](./ProgressBar.md); for a content-shaped placeholder use [`Skeleton`](./Skeleton.md).

## Visual anatomy

```
      ◜◝
     ◟  ◞      ← ActivityIndicator (size="small", scaled)
    Loading…   ← optional label (caption, secondary), gap = spacing[2]
```

The underlying indicator is always `ActivityIndicator size="small"`; the size scale is applied via a `transform: [{ scale }]`. Root is centered (`alignItems`/`justifyContent: 'center'`) with a `spacing[2]` gap to the label.

## Sizes

`size` (default `'md'`) scales the small indicator:

| Size | Scale | Use for |
|---|---|---|
| `sm` | `0.75` | Inline / inside a button, dense rows |
| `md` **(default)** | `1` | Standard inline loading |
| `lg` | `1.4` | Full-screen / centered page loader |

## Tones

`tone` (default `'brand'`) sets the indicator color:

| Tone | Color | Use on |
|---|---|---|
| `brand` **(default)** | `lightColors.brand` | Light surfaces |
| `neutral` | `lightColors.textMuted` | Quiet / secondary loading |
| `inverse` | `lightColors.textInverse` | On a brand/dark fill (e.g. inside a primary button) |

## States

One state: spinning while mounted. Mount it while loading, unmount when done. There is no "paused" or "error" state — swap it for the result or an error UI when the wait ends.

## Rules

- **Indeterminate only.** If you know the percentage, that's a [`ProgressBar`](./ProgressBar.md).
- **Match `tone` to the surface** — `inverse` on brand/danger fills, `brand` on light, `neutral` when it should recede.
- **`label` is `Text variant="caption" tone="secondary"`** — sentence case, short ("Loading…", "Syncing"). Optional; omit for a bare spinner.
- **Colors are tokens** (Rule 3) — never pass a hex `color`.
- **Don't over-scale.** Stick to `sm`/`md`/`lg`; the scale is tuned so the stroke stays crisp.
- **For an async button**, drop a `<Spinner size="sm" tone="inverse" />` in as the `Button`'s `leftIcon` and disable it (see [`Button`](../02-actions/Button.md)).

## Props API

```ts
import type { ViewProps } from 'react-native';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerTone = 'brand' | 'neutral' | 'inverse';

export interface SpinnerProps extends ViewProps {
  size?: SpinnerSize;   // default 'md'
  tone?: SpinnerTone;   // default 'brand'
  /** Optional label rendered below the spinner. */
  label?: string;
  // ...all ViewProps (style, testID, …)
}
```

Exports from the barrel: `Spinner`, `SpinnerSize`, `SpinnerTone`.

## Examples

### Sizes
```tsx
import { Spinner } from '@minthr-saas/mobile-ui-kit';

<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
```

### Tones (inverse on a brand fill)
```tsx
import { Spinner, lightColors, spacing } from '@minthr-saas/mobile-ui-kit';

<Spinner tone="brand" />
<Spinner tone="neutral" />
<View style={{ backgroundColor: lightColors.brand, padding: spacing[3], borderRadius: 8 }}>
  <Spinner tone="inverse" />
</View>
```

### With a caption
```tsx
<Spinner label="Loading…" />
<Spinner size="lg" label="Syncing" />
```

### Centered full-screen loader
```tsx
<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  <Spinner size="lg" label="Loading your dashboard" />
</View>
```

## When NOT to use

- **A known-percentage task** → [`ProgressBar`](./ProgressBar.md).
- **A screen's worth of content loading** where layout stability matters → [`Skeleton`](./Skeleton.md).
- **Pull-to-refresh** → the platform refresh control (see [`PullToRefresh`](../08-layout/PullToRefresh.md)), not a manual Spinner.
- **A permanent empty state** → [`EmptyState`](../04-display/EmptyState.md).

## Accessibility

- `ActivityIndicator` exposes an indeterminate busy state to the OS automatically. Add an `accessibilityLabel` (via `...rest`) naming what's loading when there's no visible `label`, e.g. `accessibilityLabel="Loading dashboard"`.
- For a full-screen or blocking wait, announce it with `AccessibilityInfo.announceForAccessibility('Loading…')` or wrap the region in `accessibilityLiveRegion="polite"`, so a screen-reader user hears that work is in progress.
- Keep spins short-lived; if a wait may exceed a few seconds, prefer a determinate `ProgressBar` so users hear real progress.
