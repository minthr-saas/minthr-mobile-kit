# Combobox

A searchable single-select. The trigger looks like a field; tapping it opens a bottom sheet with a search box and a filtered option list — optionally letting the user create a new value.

## Purpose

`Combobox` is the [`Select`](./Select.md) you reach for when the list is **long** or the user already knows the term (employees, cities, cost centres). It opens a scrollable **bottom sheet** (via the sheet host) with an autofocused search `Input` at the top; typing filters options by `label` or `description`. With `allowCreate`, an unmatched query offers a "Create …" row. It supports both controlled (`value`) and uncontrolled (`defaultValue`) use. For a static short list, plain `Select` is lighter; for multiple values, use [`MultiSelect`](./MultiSelect.md).

## Visual anatomy

```
Trigger (minHeight 44, radius.md, borderStrong)
┌──────────────────────────────────────┐
│ Selected label            ⌄           │
└──────────────────────────────────────┘

Bottom sheet (scrollable)
┌──────────────────────────────────────┐
│ Select an option                     │  ← placeholder as title, underline
│ ┌──────────────────────────────────┐ │
│ │ 🔍  Search…                        │ │  ← autofocus Input, search leftIcon
│ └──────────────────────────────────┘ │
├──────────────────────────────────────┤
│ [icon] Option label                ✓ │  ← selected: brandSubtle bg, brand label
│         Description                   │
│ [icon] Option label                  │
│ ＋ Create "acme"                      │  ← only when allowCreate + no exact match
└──────────────────────────────────────┘
```

## Requirement: SheetProvider

`Combobox` calls `useSheet()` and opens with `isScrollable: true`, so a `SheetProvider` must be mounted above it. The search, filtering, and create row all live inside the sheet body.

## States

**Trigger**

- **Empty / filled** — placeholder in `textMuted`, or the selected option's `label` in `textPrimary` (one line).
- **Disabled** — `surfaceSubtle` fill, `border` (softened), chevron in `textMuted`, press disabled.
- **Error** (`error` set) — border becomes `danger`. The `error` string is not rendered by the trigger — wrap in a [`FormField`](./FormField.md) to show it.

**Sheet**

- **Filtering** — case-insensitive substring match on `label` and `description`.
- **Empty** — shows `emptyMessage` ("No options found" by default).
- **Selected row** — `brandSubtle` background and a `brand` label + trailing `brand` check.
- **Disabled option** — `opacity: 0.5`, not pressable.
- **Create row** — appears when `allowCreate` and the trimmed query is non-empty and matches no option's label exactly.

## Rules

- **Trigger is `minHeight: 44` with a `borderStrong` `thin` border** — a touch stronger than `Select`'s hairline, matching the kit's text-input weight (Rule 1: no shadow).
- **Chevron is `chevron-down`** (`textSecondary`, or `textMuted` when disabled) — the sheet rises, so no directional chevron.
- **Per-option `icon`** is a `Feather` glyph name rendered at 16 in `textSecondary`, before the label (`marginEnd: spacing[2]`).
- **`group` exists on the option type but is not rendered** — the current sheet is a flat list; don't rely on grouping.
- **Create is opt-in and explicit.** `allowCreate` shows the row; picking it calls `onCreate(value)` then selects that value. Keep created values sentence case.
- **Controlled vs uncontrolled** — pass `value` (+ `onChange`) to control it, or `defaultValue` to let it self-manage. Don't mix.
- **Selection commits and closes** — choosing a row (or create) closes the sheet immediately; there's no confirm step.

## Props API

```ts
import type { Feather } from '@expo/vector-icons';

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ComponentProps<typeof Feather>['name'];
  disabled?: boolean;
  group?: string;   // present in the type; not rendered in the current sheet
}

export interface ComboboxProps {
  value?: string;                       // controlled value
  defaultValue?: string;                // uncontrolled initial value
  onChange?: (value: string) => void;

  options: ComboboxOption[];
  placeholder?: string;                 // trigger + sheet title; default 'Select an option'
  searchPlaceholder?: string;           // default 'Search…'
  emptyMessage?: string;                // default 'No options found'

  allowCreate?: boolean;                // default false
  onCreate?: (newValue: string) => void;

  required?: boolean;                   // accepted; no visual marker of its own
  error?: string;                       // toggles danger border (text not rendered here)
  disabled?: boolean;
}
```

`Combobox` and the `ComboboxOption` type are named exports.

## Examples

### Basic searchable select (controlled)
```tsx
import { useState } from 'react';
import { Combobox } from '@minthr-saas/mobile-ui-kit';

const [city, setCity] = useState<string>();

<Combobox
  value={city}
  onChange={setCity}
  placeholder="Select a city"
  searchPlaceholder="Search cities…"
  options={cities.map((c) => ({ value: c.id, label: c.name }))}
/>
```

### With icons and descriptions
```tsx
<Combobox
  value={project}
  onChange={setProject}
  placeholder="Assign to project"
  options={[
    { value: 'p1', label: 'Onboarding', description: '12 members', icon: 'briefcase' },
    { value: 'p2', label: 'Payroll Q3', description: '4 members', icon: 'dollar-sign' },
  ]}
/>
```

### Allow creating a new value
```tsx
<Combobox
  defaultValue=""
  onChange={setTag}
  allowCreate
  onCreate={(name) => saveTag(name)}
  placeholder="Add a tag"
  options={existingTags}
/>
```

### Disabled + error via FormField
```tsx
<FormField label="Manager" error={err}>
  <Combobox value={mgr} onChange={setMgr} error={err} options={managers} />
</FormField>
```

## When NOT to use

- **Short static list, no search needed** → [`Select`](./Select.md).
- **Multiple values** → [`MultiSelect`](./MultiSelect.md) (adds checkboxes, select-all, a count footer).
- **2–5 always-visible options** → [`RadioGroup`](./Radio.md).
- **Free text with no option list** → [`Input`](./Input.md).
- **View/mode switch** → [`SegmentedControl`](./SegmentedControl.md).

## Accessibility

- The trigger is a `Pressable` with `accessibilityRole="combobox"` and `accessibilityState={{ expanded: false, disabled }}` (the flag is present for assistive tech; the panel is a sheet, not an inline listbox).
- The search field is a kit [`Input`](./Input.md) with `autoFocus`, so the keyboard opens with the sheet.
- Disabled options set `disabled` on their `Pressable` and dim to `opacity: 0.5`; the selected row is conveyed with a `brand` check plus `brandSubtle` fill.
- Provide the field's name through a wrapping [`FormField`](./FormField.md) label — the trigger itself has no `accessibilityLabel`, so the visible label carries the context.
