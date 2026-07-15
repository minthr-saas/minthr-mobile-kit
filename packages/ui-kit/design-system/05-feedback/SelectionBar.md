# SelectionBar

A floating pill that rises from the bottom when items are selected — showing the count and the bulk actions you can run on them, plus a clear button.

## Purpose

`SelectionBar` is the bulk-actions affordance for multi-select lists and grids. When `count > 0` it springs up, centered near the bottom, showing a count pill, a label, a row of `actions`, and an optional clear (`×`). When `count` drops to 0 it animates out and unmounts. It is source-agnostic — you own the selection state and pass the count and handlers. For a single floating action use [`FAB`](../02-actions/FAB.md); for per-row actions use [`SwipeableRow`](../08-layout/SwipeableRow.md).

## Visual anatomy

```
        ┌──────────────────────────────────────────────┐
        │ (3) Selected │ ⬇ Export   🗑 Delete │ × │       ← floats: shadows.lg
        └──────────────────────────────────────────────┘
          count pill    │  actions row       │ clear
          (brand, 22px) divider          divider
   position: absolute · bottom = spacing[6] · alignSelf center
   height 40 · borderRadius 9999 (full pill) · border hair · surfacePrimary
```

The count pill is a 22×22 brand circle with the number in `onBrand`, `tabular-nums`. Sections are separated by hairline vertical dividers (18px tall). The whole bar enters with a spring on `translateY` (80→0) + fade, and reverses out when the count hits 0.

## Anatomy of an action

Each entry in `actions` is a `SelectionBarAction`: a `label`, an optional Feather `icon`, an `onPress`, an optional `variant` (`'default'` | `'danger'`), and optional `disabled`.

- **`default`** — icon + label in `textPrimary`; pressed fill `surfaceSubtle`.
- **`danger`** — icon + label in `lightColors.danger`; pressed fill `dangerSubtle`.
- **`disabled`** — `opacity: 0.5`, press suppressed.

Icons are Feather at `size={14}`, colored to match the label (`danger` or `textPrimary`).

## States

- **Hidden** — `count <= 0` → renders `null` (after animating out).
- **Visible** — `count > 0` → springs in and stays (non-blocking, persistent) until the count clears.
- **Per-action** — default / danger / disabled, with `android_ripple` + a `pressed` fill.

## Rules

- **Floating → `shadows.lg` is correct** (this pill genuinely floats above the list, like a Toast/Sheet — the no-shadow rule doesn't apply).
- **Fully rounded** (`borderRadius: 9999`) with a hairline `lightColors.border` — a pill, not a card.
- **Keep actions to 2–4.** It's a compact bar; overflow belongs in a [`Menu`](../06-overlays/Menu.md).
- **Exactly one `danger` action** at most, placed last. Destructive bulk actions should still confirm (open a [`ConfirmDialog`](../06-overlays/ConfirmDialog.md) from `onPress`).
- **Labels are sentence case verbs** ("Export", "Delete", "Archive").
- **`label` prop** (the word after the count) defaults to `"Selected"`; keep it a short noun/state.
- **Give the list bottom padding** (~`spacing[16]`) so the floating bar doesn't cover the last rows.

## Props API

```ts
import { Feather } from '@expo/vector-icons';

export interface SelectionBarAction {
  label: string;
  icon?: React.ComponentProps<typeof Feather>['name'];   // Feather icon name
  onPress: () => void;
  variant?: 'default' | 'danger';                        // default 'default'
  disabled?: boolean;
}

export interface SelectionBarProps {
  count: number;                    // 0 hides the bar
  label?: string;                   // default 'Selected'
  actions: SelectionBarAction[];    // required
  onClear?: () => void;             // present ⇒ renders the × clear button
}
```

`SelectionBarProps` does **not** extend `ViewProps` — it takes only these four props. Exports from the barrel: `SelectionBar`, `SelectionBarAction`, `SelectionBarProps` (types).

## Examples

### Basic bulk bar
```tsx
import { SelectionBar } from '@minthr-saas/mobile-ui-kit';

<SelectionBar
  count={selectedIds.length}
  actions={[
    { label: 'Export', icon: 'download', onPress: handleExport },
    { label: 'Delete', icon: 'trash-2', variant: 'danger', onPress: handleDelete },
  ]}
  onClear={() => setSelectedIds([])}
/>
```

### Wired to a multi-select list
```tsx
const [selected, setSelected] = useState<string[]>([]);

<View style={{ flex: 1 }}>
  <ScrollView contentContainerStyle={{ paddingBottom: spacing[16] }}>
    {employees.map((e) => (
      <Checkbox
        key={e.id}
        label={e.name}
        checked={selected.includes(e.id)}
        onChange={() => toggle(e.id)}
      />
    ))}
  </ScrollView>

  <SelectionBar
    count={selected.length}
    actions={[
      { label: 'Export', icon: 'download', onPress: exportSelected },
      { label: 'Delete', icon: 'trash-2', variant: 'danger', onPress: confirmDelete },
    ]}
    onClear={() => setSelected([])}
  />
</View>
```

### Custom label + a disabled action
```tsx
<SelectionBar
  count={rows.length}
  label="Rows"
  actions={[
    { label: 'Archive', icon: 'archive', onPress: archive },
    { label: 'Send', icon: 'send', onPress: send, disabled: !canSend },
  ]}
  onClear={clear}
/>
```

## When NOT to use

- **A single primary action floating over a list** → [`FAB`](../02-actions/FAB.md).
- **Actions on one row (swipe to delete/archive)** → [`SwipeableRow`](../08-layout/SwipeableRow.md).
- **More actions than fit in a pill** → a [`Menu`](../06-overlays/Menu.md) triggered from a single button.
- **A transient confirmation of the bulk action's result** → [`Toast`](./Toast.md).

## Accessibility

- The bar sets `accessibilityRole="toolbar"` with `accessibilityLabel="Bulk actions"`, grouping the actions for assistive tech.
- The clear control is a `Pressable` with `accessibilityRole="button"`, `accessibilityLabel="Clear selection"`, and `hitSlop={4}`.
- Action buttons expose their `label` as the accessible name; the `count` pill's number is read as content, and the `label` word ("Selected") gives it context — so a screen reader announces e.g. "3 Selected". When the count changes, consider announcing it via `AccessibilityInfo.announceForAccessibility(\`${count} selected\`)`.
- Note action buttons are 30pt tall inside the 40pt bar; keep enough spacing between them (the `spacing[1]` gap plus padding) and rely on the parent layout to keep the whole pill's target area comfortable.
