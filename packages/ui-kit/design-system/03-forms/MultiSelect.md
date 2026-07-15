# MultiSelect

A searchable multi-select. The trigger shows a count summary; tapping it opens a bottom sheet of checkbox options with search, optional select-all, and a running count — selections commit live on every toggle.

## Purpose

`MultiSelect` is the multi-value sibling of [`Combobox`](./Combobox.md): pick **zero or more** from a long list (skills, cost centres, notified people). The trigger reads "Select options" when empty, otherwise a summary like "3 selected" (customisable via `summaryLabel`). It opens a scrollable **bottom sheet** where each option is a [`Checkbox`](./Checkbox.md) row; toggling commits immediately through `onChange`, and a footer shows the count plus "Clear all". It supports `allowSelectAll`, `allowCreate`, and a hard `maxSelections` cap. For a single value use `Combobox`/[`Select`](./Select.md).

## Visual anatomy

```
Trigger (minHeight 44, radius.md, borderStrong)
┌──────────────────────────────────────┐
│ 3 selected                ⌄           │  ← summaryLabel(count) / placeholder
└──────────────────────────────────────┘

Bottom sheet (scrollable)
┌──────────────────────────────────────┐
│ Select options                       │  ← placeholder as title
│ 🔍 Search…                            │  ← autofocus Input
├──────────────────────────────────────┤
│ ▣ Select all                          │  ← only if allowSelectAll && no search
│ ☑ [icon] Option label                 │  ← checked: brandSubtle bg, brand label
│ ☐ [icon] Option label                 │
│ ＋ Create "acme"                       │  ← only when allowCreate + no exact match
├──────────────────────────────────────┤
│ 3 of 5 selected           Clear all   │  ← footer: count + clear
└──────────────────────────────────────┘
```

## Requirement: SheetProvider

`MultiSelect` calls `useSheet()` and opens with `isScrollable: true`; a `SheetProvider` must be mounted above it. The checklist, select-all, create row, and footer all live in the sheet body.

## States

**Trigger** — mirrors `Combobox`: `borderStrong` `thin` border; text is placeholder (`textMuted`) when nothing is picked, else `summaryLabel(count)` in `textPrimary`; `disabled` → `surfaceSubtle` fill + muted chevron; `error` → `danger` border (string not rendered here).

**Sheet**

- **Option row** — a `Checkbox` + label (+ optional `description`, `icon`); checked rows get a `brandSubtle` background and `brand` label.
- **Select all** — a tri-state `Checkbox` (`checked` / `indeterminate` / unchecked) shown only when `allowSelectAll` and the search box is empty. Respects `maxSelections` (selects up to the cap).
- **Max reached** — when `currentValues.length >= maxSelections`, unselected options become `disabled` (dimmed, non-pressable); already-selected ones can still be removed.
- **Footer** — appears when anything is selected or `maxSelections` is set; shows "N selected" (or "N of M selected") and a "Clear all" action.
- **Empty** — `emptyMessage` ("No options found").
- **Create row** — when `allowCreate` and the trimmed query matches no option; adds the value, clears the search, and keeps the sheet open (multi-add flow).

## Rules

- **Selection commits live.** Every toggle calls `onChange` with the next array — there is no "Done" button; the footer's "Clear all" resets to `[]`.
- **Trigger summary is customisable but count-based.** Default `summaryLabel` is `(n) => \`${n} selected\``; override for domain wording ("3 people") — keep it short, sentence case.
- **`maxSelections` is a hard cap** enforced in the toggle logic; communicate it via the "N of M selected" footer rather than an error.
- **Disabled options** (`option.disabled`) never count toward select-all and can't be toggled.
- **Icons are `Feather` names at 16 / `textSecondary`**, before the label; `description` is a secondary caption.
- **Trigger has no shadow** — `borderStrong` `thin` border only (Rule 1), matching `Combobox` and text inputs.

## Props API

```ts
import type { Feather } from '@expo/vector-icons';

export interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ComponentProps<typeof Feather>['name'];
  disabled?: boolean;
}

export interface MultiSelectProps {
  values?: string[];                        // controlled
  defaultValues?: string[];                 // uncontrolled; default []
  onChange?: (values: string[]) => void;

  options: MultiSelectOption[];
  placeholder?: string;                     // trigger + sheet title; default 'Select options'
  searchPlaceholder?: string;               // default 'Search…'
  emptyMessage?: string;                    // default 'No options found'

  summaryLabel?: (count: number) => string; // default (n) => `${n} selected`

  allowSelectAll?: boolean;                 // default false
  allowCreate?: boolean;                    // default false
  onCreate?: (newValue: string) => void;

  maxSelections?: number;                   // hard cap

  required?: boolean;                       // accepted; no visual marker of its own
  error?: string;                           // toggles danger border (text not rendered here)
  disabled?: boolean;
}
```

`MultiSelect` and the `MultiSelectOption` type are named exports.

## Examples

### Basic multi-select (controlled)
```tsx
import { useState } from 'react';
import { MultiSelect } from '@minthr-saas/mobile-ui-kit';

const [skills, setSkills] = useState<string[]>([]);

<MultiSelect
  values={skills}
  onChange={setSkills}
  placeholder="Add skills"
  options={allSkills.map((s) => ({ value: s.id, label: s.name }))}
/>
```

### Select-all with a custom summary
```tsx
<MultiSelect
  values={people}
  onChange={setPeople}
  allowSelectAll
  summaryLabel={(n) => `${n} notified`}
  placeholder="Notify people"
  options={teammates}
/>
```

### Capped at three, with descriptions
```tsx
<MultiSelect
  defaultValues={[]}
  onChange={setPerks}
  maxSelections={3}
  options={[
    { value: 'meal', label: 'Meal vouchers', description: '8€ / working day' },
    { value: 'transit', label: 'Transit pass', description: '50% reimbursed' },
    { value: 'gym', label: 'Gym', description: 'Partner network' },
  ]}
/>
```

### Allow creating tags
```tsx
<MultiSelect
  values={tags}
  onChange={setTags}
  allowCreate
  onCreate={(name) => registerTag(name)}
  placeholder="Add tags"
  options={existingTags}
/>
```

## When NOT to use

- **Exactly one value** → [`Combobox`](./Combobox.md) or [`Select`](./Select.md).
- **A handful of always-visible checkboxes** → stack [`Checkbox`](./Checkbox.md) rows in a [`FormField`](./FormField.md).
- **Card-shaped multi-pick with rich content** → [`SelectableCard`](./SelectableCard.md) with `variant="checkbox"`.
- **Filtering a list, not answering a form field** → [`FilterBar`](../03-forms/FilterBar.md).

## Accessibility

- The trigger is a `Pressable` with `accessibilityRole="combobox"` and `accessibilityState={{ expanded: false, disabled }}`.
- Each option row embeds a [`Checkbox`](./Checkbox.md), which carries `accessibilityRole="checkbox"` and a `checked` state (`true` / `false` / `"mixed"` for the indeterminate select-all).
- Options past `maxSelections` and `option.disabled` rows set `disabled` on the row and its checkbox.
- The search field is a kit [`Input`](./Input.md) with `autoFocus`. Give the field its name via a wrapping [`FormField`](./FormField.md) label.
