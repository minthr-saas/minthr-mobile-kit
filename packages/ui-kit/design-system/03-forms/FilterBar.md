# FilterBar

A compact bar that opens a filter picker and shows the currently-applied filters as removable chips, with a "Clear all" escape hatch.

## Purpose

Lists and directories accumulate filters (status, department, date range). On mobile there's no room for a persistent web-style filter rail, so `FilterBar` collapses the whole concern into one row: a **"Filter" trigger** on the start edge, then a horizontally scrollable strip of **active-filter chips**, then a **"Clear all"** reset.

It is a *presentational* container — it does **not** own filter state or render the picker UI. You wire `onAdd` to open a [`BottomSheet`](../06-overlays/BottomSheet.md) (or [`Menu`](../06-overlays/Menu.md)) of options, and you pass the resulting selections back down as the `filters` array. Each chip is a removable [`Tag`](../04-display/Tag.md); removing one calls that filter's own `onRemove`.

## Visual anatomy

```
┌──────────────────────────────────────────────────────────┐
│ [⚲ Filter]  ‹trigger›  [Active ✕][Draft ✕][HR ✕] →  Clear all │
└──────────────────────────────────────────────────────────┘
    ↑ onAdd        ↑ slot   ↑ scrollable Tag strip      ↑ onClearAll
```

Container: `surfacePrimary`, `borders.hair` + `border`, `radius.md`, `spacing[2]` padding. The chip strip is a horizontal `ScrollView` (no scrollbar). "Filter" button and "Clear all" only render when their handler is supplied; "Clear all" additionally requires at least one active filter.

## Anatomy / behavior

- **Add button** — renders only if `onAdd` is passed. A `Feather` `filter` icon (14, `textPrimary`) + "Filter" label. Pressed state fills `surfaceSubtle`.
- **`trigger` slot** — an optional `ReactNode` you drop next to the add button for a secondary picker (e.g. a sort menu trigger).
- **Chip strip** — renders only when `filters.length > 0`. Each `ActiveFilter` becomes a `Tag variant="brand"` with an `x` remove affordance.
- **Clear all** — renders only when there are filters **and** `onClearAll` is passed. A `caption`, `tone="brand"`, medium-weight pressable with `hitSlop`.

There are **no size or variant axes** — `FilterBar` is a single layout.

## States

- **Empty** (`filters` is `[]`) — only the "Filter" trigger (and any `trigger` slot) show; the chip strip and "Clear all" are hidden.
- **Active** — chips scroll horizontally; "Clear all" appears.

## Rules

- **Chips are always `brand`.** The active-filter Tag is hard-coded to `variant="brand"` — the one place brand tint signals "a filter is on". Don't try to recolor chips per category.
- **Labels are sentence case, short.** A chip reads `Department: HR` or `Active`, not a sentence. Keep them to a value or `Facet: value`.
- **`key` must be stable and unique** per active filter — it's the React list key and the identity you match on when removing.
- **The bar doesn't manage state.** Keep the source-of-truth filter set in the screen; derive `filters` from it and rebuild `onRemove`/`onClearAll` to mutate that state.
- **No shadow** (Rule 1) — the bar is separated by `borders.hair`, like every other container.
- **Tap targets** — the remove `x` inside each `Tag` carries `hitSlop`; "Clear all" adds `hitSlop={6}`. Keep the bar's own row height comfortable by not overstuffing the `trigger` slot.

## Props API

```ts
import type { ViewProps } from 'react-native';

interface ActiveFilter {
  key: string;            // stable unique id — React key + remove identity
  label: string;          // chip text, sentence case
  onRemove: () => void;   // called when the chip's ✕ is pressed
}

interface FilterBarProps extends ViewProps {
  filters: readonly ActiveFilter[];   // applied filters, each a removable Tag
  onClearAll?: () => void;            // shows "Clear all" when set + filters exist
  trigger?: React.ReactNode;          // slot for extra picker triggers (e.g. sort)
  onAdd?: () => void;                 // shows the "Filter" button; open a sheet/menu
  // style, testID, accessibility* … from ViewProps
}
```

Both `ActiveFilter` and `FilterBarProps` are exported. `FilterBar` renders [`Tag`](../04-display/Tag.md) internally — you don't pass Tags yourself.

## Examples

### Directory filter with a sheet picker
```tsx
import { useState } from 'react';
import { FilterBar } from '@minthr-saas/mobile-ui-kit';

const [status, setStatus] = useState<string | null>('active');
const [dept, setDept] = useState<string | null>(null);

const filters = [
  status && { key: 'status', label: `Status: ${status}`, onRemove: () => setStatus(null) },
  dept && { key: 'dept', label: `Dept: ${dept}`, onRemove: () => setDept(null) },
].filter(Boolean) as { key: string; label: string; onRemove: () => void }[];

<FilterBar
  filters={filters}
  onAdd={openFilterSheet}
  onClearAll={() => { setStatus(null); setDept(null); }}
/>
```

### Empty state (no filters applied)
```tsx
// Only the "Filter" trigger shows; no chips, no "Clear all".
<FilterBar filters={[]} onAdd={openFilterSheet} />
```

### With a secondary trigger slot (sort)
```tsx
import { Feather } from '@expo/vector-icons';
import { FilterBar, IconButton, lightColors } from '@minthr-saas/mobile-ui-kit';

<FilterBar
  filters={activeFilters}
  onAdd={openFilterSheet}
  onClearAll={clearAll}
  trigger={
    <IconButton
      icon="sliders"
      variant="ghost"
      size="sm"
      accessibilityLabel="Sort"
      onPress={openSortMenu}
    />
  }
/>
```

## When NOT to use

- **A single free-text search** → [`SearchBar`](./SearchBar.md), not a filter bar.
- **Picking one value inline** (a lone dropdown) → [`Select`](./Select.md) or [`SegmentedControl`](./SegmentedControl.md).
- **Choosing many tags with autocomplete inside a form** → [`MultiSelect`](./MultiSelect.md) or [`Combobox`](./Combobox.md).
- **Rendering read-only status chips that aren't removable** → use [`Tag`](../04-display/Tag.md) or [`Badge`](../04-display/Badge.md) directly.

## Accessibility

- The "Filter" button is a `Pressable` with `accessibilityRole="button"` and `accessibilityLabel="Add filter"`.
- "Clear all" is a `Pressable` with `accessibilityRole="button"` and `accessibilityLabel="Clear all filters"`.
- Each chip's remove control (from [`Tag`](../04-display/Tag.md)) is labelled `Remove {label}` automatically.
- Give any node you pass into `trigger` its own `accessibilityLabel` — `IconButton` requires one.
