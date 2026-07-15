# Tag

A pill-shaped chip the **user** applies — a selected filter, an assigned label, a keyword — and can optionally remove.

## Purpose

`Tag` represents a user-owned value: a filter that is currently on, a label attached to a record, a skill on a profile. It is a fully-rounded pill with a semantic fill and, when you pass `onRemove`, a trailing `×` button to clear it. It extends `ViewProps`, so `style` and `accessibility*` forward to the root `View`.

`Tag` and [`Badge`](./Badge.md) look similar but mean different things — see **Tag vs Badge** below. For a whole filtering surface (trigger + active chips + clear-all) use [`FilterBar`](../03-forms/FilterBar.md).

## Visual anatomy

```
   ╭──────────────────────╮
   │ Design       ✕        │   label + optional remove button
   ╰──────────────────────╯
    ↕ paddingVertical: spacing[1]   ↔ paddingHorizontal: spacing[2]
    radius.full (pill)   gap: spacing[1]   label = fontSize.sm
    ✕ = Feather "x" size 12, hitSlop 8, label "Remove {label}"
```

The pill is `alignSelf: 'flex-start'`; the label is single-line (`numberOfLines={1}`). The `×` only renders when `onRemove` is supplied, and it takes the label's color.

## Variants

Six semantic variants — the **same palette as [`Badge`](./Badge.md)** (`*Subtle` fill + family `700` text):

| `variant` | Fill | Text |
|---|---|---|
| `neutral` | `surfaceSubtle` | `textSecondary` | **Default** |
| `brand` | `brandSubtle` | `brand[700]` |
| `success` | `successSubtle` | `success[700]` |
| `warning` | `warningSubtle` | `warning[700]` |
| `danger` | `dangerSubtle` | `danger[700]` |
| `info` | `infoSubtle` | `info[700]` |

One size. Removable and non-removable tags share the same dimensions; the `×` sits inside the existing pill.

## States

- **Static** — no `onRemove`; a read-only label the user assigned.
- **Removable** — `onRemove` provided; the trailing `×` is a `Pressable` with `hitSlop: 8`. Pressing it fires `onRemove` (the tag does not remove itself — you drop it from state).

## Tag vs Badge

They share the six-variant palette but are **not** interchangeable:

| | [`Badge`](./Badge.md) | `Tag` |
|---|---|---|
| Owner | System (reflects state) | User (applies / removes) |
| Shape | `radius.sm` soft rectangle | `radius.full` pill |
| Text | `fontSize.xs` (11) | `fontSize.sm` (12) |
| Vertical padding | `2` | `spacing[1]` (4) |
| Interactive | Never | Optional `×` via `onRemove` |
| Leading glyph | `dot` or `icon` | — |

Rule of thumb: if the app decides it, it's a Badge; if the user decides it, it's a Tag.

## Rules

- **`onRemove` drops from state, it does not self-destruct.** The tag stays mounted until you stop rendering it — the handler is where you update your array of active tags.
- **Sentence case, short** (Rule 5) — a label, a name, a keyword. Long values truncate to one line rather than wrapping.
- **Pill shape is load-bearing.** `radius.full` is what visually says "removable value" vs. Badge's status rectangle — don't override the `borderRadius`.
- **No border, no shadow** (Rule 1); the subtle fill separates it.
- **The remove `×` inherits the variant color** and already ships a `hitSlop: 8`. In dense tag rows keep ≥8pt between pills so the hit areas don't collide (Rule 10).

## Props API

```ts
import type { ViewProps } from 'react-native';

export type TagVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

export interface TagProps extends ViewProps {
  label: string;              // required
  variant?: TagVariant;       // default 'neutral'
  onRemove?: () => void;      // when set, renders the trailing "×" button
  // style, accessibilityLabel, testID, … from ViewProps
}
```

Sibling export: `TagVariant`. There is no `icon` or `dot` prop (that's [`Badge`](./Badge.md)); the only optional adornment is the remove button, controlled by `onRemove`.

## Examples

### Static labels
```tsx
import { Tag } from '@minthr-saas/mobile-ui-kit';

<Tag label="Remote" variant="info" />
<Tag label="Full-time" variant="brand" />
```

### Removable filter chips (managed with state)
```tsx
import { useState } from 'react';
import { View } from 'react-native';
import { Tag, spacing } from '@minthr-saas/mobile-ui-kit';

const [filters, setFilters] = useState(['Engineering', 'Casablanca', 'Active']);

<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
  {filters.map((f) => (
    <Tag
      key={f}
      label={f}
      variant="neutral"
      onRemove={() => setFilters((prev) => prev.filter((x) => x !== f))}
    />
  ))}
</View>
```

### Semantic removable tag
```tsx
<Tag label="Overdue" variant="danger" onRemove={() => clearOverdue()} />
```

## When NOT to use

- **A system status the user can't change** ("Active", "Draft") → [`Badge`](./Badge.md).
- **A complete filtering UI** (trigger + active chips + clear-all) → [`FilterBar`](../03-forms/FilterBar.md).
- **Choosing one of a few options** → [`SegmentedControl`](../03-forms/SegmentedControl.md).
- **Selecting from a long list** → [`MultiSelect`](../03-forms/MultiSelect.md) or [`Combobox`](../03-forms/Combobox.md).

## Accessibility

- The tag container is a `View`; its `label` is read by the screen reader.
- When `onRemove` is set, the `×` is a `Pressable` that already ships `accessibilityRole="button"` and `accessibilityLabel="Remove {label}"`, so it announces correctly without extra work.
- The `×` relies on `hitSlop: 8` to enlarge a 12pt glyph — fine in isolation, but in tight tag clusters space the pills so the target reaches toward 44×44pt and adjacent hit areas don't overlap (Rule 10).
