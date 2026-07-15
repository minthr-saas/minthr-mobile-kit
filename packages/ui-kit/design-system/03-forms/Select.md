# Select

A single-choice field that opens its options in a bottom sheet — the mobile replacement for a web dropdown.

## Purpose

`Select` is for picking **one** value from a short-to-medium, static list (department, status, role) where a `RadioGroup` would take too much vertical space. The trigger is a compact 40pt field showing the current label (or placeholder); tapping it opens a **bottom sheet** of options via the kit's sheet host — never a floating menu, because dropdowns are a poor fit for touch. It's generic over the value type (`<T extends string>`) and holds no internal state: you own `value` (which may be `null`) and `onChange`. For a searchable list use [`Combobox`](./Combobox.md); for multiple values use [`MultiSelect`](./MultiSelect.md).

## Visual anatomy

```
Trigger (height 40, radius.md, hairline border)
┌──────────────────────────────────────┐
│ Selected label            ⌄           │  ← value: body (primary) / placeholder (muted)
└──────────────────────────────────────┘        chevron-down, textSecondary

Bottom sheet (opens on press)
┌──────────────────────────────────────┐
│ Choose                               │  ← title (subtitle), hairline underline
├──────────────────────────────────────┤
│ Option label                        ✓ │  ← check (brand) on the selected row
│   Description                         │
├──────────────────────────────────────┤
│ Option label                         │
└──────────────────────────────────────┘
```

## Requirement: SheetProvider

`Select` calls `useSheet()`, so a `SheetProvider` must sit above it in the tree (typically once at the app root). Without it the hook throws. The sheet, its scrim, and dismissal are all handled by the host.

## States

**Trigger**

- **Empty** — placeholder text in `textMuted`; hairline `border`.
- **Filled** — selected label in `textPrimary`.
- **Pressed** — background flips to `surfaceSubtle`.
- **Error** (`error` set) — border becomes `danger` at `borders.thin`. (The `error` string itself is not rendered by `Select`; surface it via a wrapping [`FormField`](./FormField.md).)
- **Disabled** — `opacity: 0.5`, press disabled.

**Sheet option**

- Rows divide with a hairline (`optionDivider`) from the second item down; pressed rows tint `surfaceSubtle`; the row matching `value` shows a `brand` check. Selecting a row calls `onChange` and closes the sheet.

## Rules

- **Trigger is 40pt tall, `radius.md`, hairline `border`** (Rule 1 — no shadow). Error swaps to a `danger` `thin` border.
- **`value` can be `null`.** Null renders the `placeholder` (default "Select an option"); a set value renders its option's `label`. The label is truncated to one line (`numberOfLines={1}`).
- **`title` names the sheet** (default "Choose") and doubles as the trigger's `accessibilityLabel`. Keep it a short noun ("Department", "Status").
- **Options are a static array**; each is `{ value, label, description? }`. `description` shows as a muted caption under the label in the sheet only.
- **Chevron is `chevron-down`** in `textSecondary` — it stays down (not a directional/RTL chevron) because the sheet rises from the bottom, not a side.
- **No search, no create, no multi.** Those are deliberately out of scope — reach for `Combobox` / `MultiSelect`.
- **Selected mark is a `brand` check**, not a filled row — restraint over emphasis.

## Props API

```ts
export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;   // shown as a muted caption in the sheet
}

export interface SelectProps<T extends string = string> {
  options: readonly SelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;   // default 'Select an option'
  title?: string;         // sheet title + trigger accessibilityLabel; default 'Choose'
  disabled?: boolean;
  error?: string;         // toggles the danger border (text not rendered here)
}
```

`Select` and the `SelectOption` type are named exports. It does **not** extend `PressableProps` — the props above are the full surface.

## Examples

### Basic single-select
```tsx
import { useState } from 'react';
import { Select } from '@minthr-saas/mobile-ui-kit';

const [status, setStatus] = useState<string | null>(null);

<Select
  value={status}
  onChange={setStatus}
  title="Status"
  placeholder="Choose a status"
  options={[
    { value: 'active', label: 'Active' },
    { value: 'onboarding', label: 'Onboarding' },
    { value: 'offboarded', label: 'Offboarded' },
  ]}
/>
```

### With descriptions
```tsx
<Select
  value={role}
  onChange={setRole}
  title="Role"
  options={[
    { value: 'admin', label: 'Admin', description: 'Full access to all settings' },
    { value: 'manager', label: 'Manager', description: 'Approves their team only' },
    { value: 'member', label: 'Member', description: 'Self-service access' },
  ]}
/>
```

### In a FormField with validation
```tsx
<FormField label="Department" required error={touched && !dept ? 'Required' : undefined}>
  <Select
    value={dept}
    onChange={setDept}
    title="Department"
    error={touched && !dept ? 'Required' : undefined}
    options={departments}
  />
</FormField>
```

### Disabled
```tsx
<Select value={country} onChange={setCountry} title="Country" disabled options={countries} />
```

## When NOT to use

- **Long list, or the user knows the term** → [`Combobox`](./Combobox.md) (adds search + optional create).
- **Multiple selections** → [`MultiSelect`](./MultiSelect.md).
- **2–5 options where seeing all at once helps** → [`RadioGroup`](./Radio.md).
- **Switching a view/mode inline** → [`SegmentedControl`](./SegmentedControl.md).
- **A date or time** → [`DatePicker`](./DatePicker.md) / [`TimePicker`](./TimePicker.md).

## Accessibility

- The trigger is a `Pressable` with `accessibilityRole="button"` and `accessibilityLabel={title}`, so it announces its purpose even before a value is chosen.
- Disabled state is passed through `disabled`, reflected in `accessibilityState`.
- Sheet rows are `Pressable`s with `accessibilityRole="button"`; the selected row is marked visually with a `brand` check — pair with a wrapping [`FormField`](./FormField.md) label for full context.
- Dismissing the sheet (scrim tap / drag) is handled by the `SheetProvider` host and needs no extra wiring.
