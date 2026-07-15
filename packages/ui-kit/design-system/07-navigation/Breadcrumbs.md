# Breadcrumbs

A horizontally scrollable trail of the current location through nested screens, joined by chevron separators.

## Purpose

`Breadcrumbs` renders `items` as a single scrollable row: each entry is a text label, separated by a forward chevron. Every item except the last can carry an `onPress` to navigate back up the tree; the **last item is the current page** — medium weight, `tone="primary"`, and never pressable.

Mobile idiom: the trail lives in a horizontal `ScrollView`, so a deep path scrolls sideways instead of wrapping or clipping on a narrow screen. Use it sparingly — on mobile a single [`PageHeader`](./PageHeader.md) back chevron is usually enough; reach for breadcrumbs only when the nesting is genuinely several levels deep and worth showing.

## Visual anatomy

```
 Workspace  ›  Reports  ›  2026  ›  Q2  ›  Engagement  ›  Engineering team
 └ secondary, pressable ┘        …           └ current: primary, '500', not pressable ┘
 →→→ scrolls horizontally when the trail overflows →→→
```

Separator = `Feather` `forwardChevron()`, `size={12}`, `color={lightColors.textMuted}`, `marginHorizontal: 2`. Items are spaced with `gap: spacing[1]`; the row is vertically centered.

## Variants / Sizes / States

- **No `variant` / `size`** — one presentation.
- **Item states:**
  - *Link* (not last, has `onPress`) — wrapped in a `Pressable` with `hitSlop={6}`, `caption` / `tone="secondary"`.
  - *Static* (not last, no `onPress`) — plain `View`, same secondary styling, no press feedback.
  - *Current* (last item) — `tone="primary"`, `fontWeight: '500'`, `numberOfLines={1}`, no press handler even if `onPress` is set.

## Rules

- **The last item is always the current page** — it is rendered non-interactive regardless of whether `onPress` was passed. Don't try to make the trailing crumb tappable.
- **Chevron uses `forwardChevron()`** (`chevron-right` in LTR, `chevron-left` in RTL) — the separator points in the reading direction and flips automatically for Arabic. Never hardcode `chevron-right`.
- **Labels are single-line and sentence case.** Each crumb is `numberOfLines={1}`; keep labels short so the trail stays scannable.
- **Trail scrolls, never wraps.** The horizontal `ScrollView` (with `showsHorizontalScrollIndicator={false}`) means deep trails scroll — do not force-wrap.
- **No shadow / no separator line** — it's inline chrome; the chevrons carry the structure.

## Props API

```ts
import type { ViewProps } from 'react-native';

interface BreadcrumbItem {
  label: string;
  onPress?: () => void;   // ignored on the last (current) item
}

interface BreadcrumbsProps extends ViewProps {
  items: readonly BreadcrumbItem[];
  // style + rest of ViewProps forward onto the horizontal ScrollView
}
```

Sibling export: `BreadcrumbItem`. `style` and remaining `ViewProps` are applied to the underlying `ScrollView`.

## Examples

### Two levels
```tsx
import { Breadcrumbs } from '@minthr-saas/mobile-ui-kit';
import { useRouter } from 'expo-router';

const router = useRouter();

<Breadcrumbs
  items={[
    { label: 'Workspace', onPress: () => router.push('/workspace') },
    { label: 'Settings' },
  ]}
/>
```

### Drilling into a record
```tsx
<Breadcrumbs
  items={[
    { label: 'Workspace', onPress: () => router.push('/') },
    { label: 'People', onPress: () => router.push('/people') },
    { label: 'Sara Boudia' },
  ]}
/>
```

### Deep trail (scrolls horizontally)
```tsx
<Breadcrumbs
  items={[
    { label: 'Workspace', onPress: goWorkspace },
    { label: 'Reports', onPress: goReports },
    { label: '2026', onPress: goYear },
    { label: 'Q2', onPress: goQuarter },
    { label: 'Engagement', onPress: goSurvey },
    { label: 'Engineering team' },
  ]}
/>
```

## When NOT to use

- **A simple one-level "go back"** → the back chevron on [`PageHeader`](./PageHeader.md) is the mobile-preferred pattern.
- **Switching between peer views on one screen** → [`Tabs`](./Tabs.md).
- **An ordered, numbered flow** → [`Stepper`](./Stepper.md).
- **Top-level app navigation** → [`BottomTabBar`](./BottomTabBar.md). The web `NavRail`/`Sidebar` do not exist in this kit.

## Accessibility

- Pressable crumbs currently do not set `accessibilityRole`; add `accessibilityRole="link"` (or `"button"`) per interactive item when wiring navigation so screen readers announce them as actionable. The `hitSlop={6}` widens the small text target toward the 44pt minimum — pair it with adequate row height.
- The current (last) crumb is plain text, correctly non-interactive, so the reader won't offer a dead activation.
- Because the trail scrolls horizontally, keep the most important levels (root and current) recognizable from their labels alone.
- RTL: the chevron direction flips via `forwardChevron()` and the `ScrollView` flows start-to-end automatically.
