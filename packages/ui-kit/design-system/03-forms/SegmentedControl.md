# SegmentedControl

A compact row of mutually-exclusive segments for switching between a small set of views or modes — the iOS-native "pick one, inline" control.

## Purpose

`SegmentedControl` is for **switching the current view/mode** among 2–4 short options that live on the same screen: list vs. calendar, "My requests / Team requests", day/week/month. It reads as one pill with the active segment lifted onto a white surface. Unlike a [`RadioGroup`](./Radio.md) (a form answer you submit), a segmented control changes what's shown *right now*. It's generic over the option value type (`<T extends string>`), so `value`/`onChange` stay strongly typed.

## Visual anatomy

```
┌─────────────────────────────────────────┐  ← track: gray-100, radius.md, 2pt padding
│ ┌───────────┐                             │
│ │  Active   │   Inactive     Inactive     │
│ └───────────┘                             │
└─────────────────────────────────────────┘
     ↑ selected segment: surfacePrimary + hairline border, label medium
       segment gap = 2 · segment padding = spacing[1]+2 / spacing[3]
```

The track is a `gray-100` pill; the selected segment floats on a `surfacePrimary` chip with a hairline border. Labels only — no icons, no descriptions.

## Sizes

One size. Segment height comes from `paddingVertical: spacing[1] + 2` (≈6pt) plus the `caption` line, giving a compact control. There is no `sm`/`md`/`lg` axis.

## Layout

- **`fullWidth` (default `true`)** — the track stretches (`alignSelf: 'stretch'`) and every segment gets `flex: 1`, so segments share width equally. This is the norm inside forms and headers.
- **`fullWidth={false}`** — the track hugs its content (`alignSelf: 'flex-start'`) and segments size to their labels. Use when the control sits inline next to other content.

## States

- **Selected** — `surfacePrimary` chip, `border` hairline, label `tone="primary"` at `fontWeight.medium` (`'500'`).
- **Unselected** — transparent segment, label `tone="secondary"`, `fontWeight.regular`.
- **Disabled** — the whole track dims to `opacity: 0.5` and every segment stops responding (`disabled` is passed to each `Pressable`). Disabling individual segments is not supported.

## Rules

- **2–4 segments, short labels.** One or two words each ("List", "Calendar", "My team"). Five+ segments cramp on a phone — use [`Select`](./Select.md) or [`Tabs`](../07-navigation/Tabs.md) instead.
- **Labels only, sentence case** (Rule 5). No icons, no counts, no badges — the component renders a single `Text` per segment.
- **Selected = surface + hairline, not brand fill.** The active state is a lifted white chip (Rule 1: hairline border, no shadow) with a `medium`-weight label — restraint, not a green block.
- **Track is `palette.gray[100]`**, radius `md`, 2pt inner padding and 2pt gap; the chip radius is `radius.sm + 2`. These are fixed — don't restyle the track.
- **It's a switch, not a submit.** Changing a segment should update the view immediately in `onChange`; never pair it with a separate "Apply" button.
- **Tap target** — the compact height can fall under 44pt; give the control room and rely on `fullWidth` segments so each target is wide (Rule 10).

## Props API

```ts
import type { ViewProps } from 'react-native';

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string = string> extends ViewProps {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  fullWidth?: boolean;   // default true
  // style, accessibility*, … from ViewProps
}
```

Both `SegmentedControl` and the `SegmentedOption` type are named exports. Because it extends `ViewProps`, you can pass `style` to the outer track.

## Examples

### View switcher (full width)
```tsx
import { useState } from 'react';
import { SegmentedControl } from '@minthr-saas/mobile-ui-kit';

const [view, setView] = useState<'list' | 'calendar'>('list');

<SegmentedControl
  value={view}
  onChange={setView}
  options={[
    { value: 'list', label: 'List' },
    { value: 'calendar', label: 'Calendar' },
  ]}
/>
```

### Inline, content-width
```tsx
<SegmentedControl
  fullWidth={false}
  value={scope}
  onChange={setScope}
  options={[
    { value: 'mine', label: 'My requests' },
    { value: 'team', label: 'Team' },
  ]}
/>
```

### Typed values driving a query
```tsx
type Range = 'day' | 'week' | 'month';
const [range, setRange] = useState<Range>('week');

<SegmentedControl<Range>
  value={range}
  onChange={setRange}
  options={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ]}
/>
```

### Disabled while loading
```tsx
<SegmentedControl value={tab} onChange={setTab} disabled={loading} options={tabs} />
```

## When NOT to use

- **A form answer you submit** (leave type, contract) → [`RadioGroup`](./Radio.md).
- **More than ~4 options, or long labels** → [`Select`](./Select.md), or [`Tabs`](../07-navigation/Tabs.md) for full-width page sections.
- **On / off** → [`Switch`](./Switch.md).
- **Filtering a list by facets** → [`FilterBar`](../03-forms/FilterBar.md).
- **Navigating between screens** → [`Tabs`](../07-navigation/Tabs.md) or the bottom tab bar, not a segmented control.

## Accessibility

- Each segment is a `Pressable` with `accessibilityRole="button"` and `accessibilityState={{ selected, disabled }}`, so the active segment is announced as selected.
- The segment `label` is its accessible name; keep labels meaningful out of context.
- When disabled, every segment reports `disabled` in `accessibilityState` and ignores presses.
- The control does not manage focus order beyond source order; keep `options` in reading order.
