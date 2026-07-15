# Checkbox

A square, tri-state checkbox with an optional label and description — for opting in, selecting list items, or a parent "select all" that can be partially filled.

## Purpose

A `Pressable` box that toggles between checked and unchecked and can also *display* an indeterminate ("mixed") state — the classic "some children selected" affordance for a select-all header. Unlike [`Switch`](./Switch.md), a checkbox reads as a *form choice* that's typically confirmed with a Save/Submit step, and it's the right control for selecting multiple items from a set.

The whole row (box + text) is the tap target, so a labelled checkbox is comfortable to hit.

## Visual anatomy

```
☑  Label text                 ← box 18×18, radius.sm, gap spacing[2]
   Secondary description       ← caption, muted (optional)

States of the box:
[ ]  unchecked   — surfacePrimary fill, borderStrong (thin)
[✓]  checked     — brand fill + border, Feather "check" (onBrand)
[–]  indeterminate — brand fill + border, Feather "minus" (onBrand)
```

Row is top-aligned (`alignItems: 'flex-start'`) so the box lines up with the first line of a multi-line label; the box is nudged `marginTop: 1`.

## States

The `checked` prop is `boolean | 'indeterminate'`, mapped to an internal `CheckboxState`:

- **`unchecked`** — empty box: `surfacePrimary` fill, `borderStrong` border at `borders.thin`.
- **`checked`** — filled: `brand` fill + border, white `check` glyph (`lightColors.onBrand`, size 14).
- **`indeterminate`** — filled the same as checked but with a `minus` glyph; represents "partially selected".
- **Disabled** — the row drops to `opacity: 0.5` and `onPress` early-returns (no toggle).

Pressing toggles boolean output: from `checked` → `false`, from anything else → `true` (so tapping an indeterminate box resolves it to checked).

## Rules

- **Controlled.** Pass `checked` and `onChange(next: boolean)`. `onChange` always reports a plain boolean — `'indeterminate'` is a display-only input state you drive from parent logic (e.g. `allSelected ? true : someSelected ? 'indeterminate' : false`).
- **Indeterminate is for parents, not leaves.** Use it on a "select all" row whose children are mixed; never as a third user-selectable value.
- **Box is 18pt** (`BOX_SIZE`), `radius.sm` — small and precise. When rendered **without** a label, the tap target is only 18pt, below the 44pt minimum; add `hitSlop` or wrap it so the hittable area reaches 44pt (Rule 10).
- **Icon colour is `onBrand`** on the brand fill — the only correct contrast on a `500` fill. Icons are `Feather` `check` / `minus` at size 14.
- **Label vs. description** — label is `Text variant="body"`; description is `Text variant="caption"` `tone="muted"`. Both sentence-case. Omit both for a bare box (e.g. inside a list row you've built).
- **No shadow** (Rule 1); the box uses a border, not elevation.

## Props API

```ts
type CheckboxState = 'checked' | 'unchecked' | 'indeterminate';

interface CheckboxProps {
  checked: boolean | 'indeterminate';   // required — controlled; 'indeterminate' shows the mixed glyph
  onChange: (next: boolean) => void;     // required — always emits a boolean
  disabled?: boolean;
  label?: string;
  description?: string;
}
```

`CheckboxState` is exported for typing your own state machinery. There is no `size` or `variant`; `CheckboxProps` does not extend `PressableProps`.

## Examples

### Consent checkbox
```tsx
import { Checkbox } from '@minthr-saas/mobile-ui-kit';

const [agree, setAgree] = useState(false);

<Checkbox
  checked={agree}
  onChange={setAgree}
  label="I agree to the terms"
  description="You can withdraw consent at any time"
/>
```

### Select-all header (indeterminate)
```tsx
const allSelected = selected.length === items.length;
const someSelected = selected.length > 0 && !allSelected;

<Checkbox
  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
  onChange={(next) => setSelected(next ? items.map((i) => i.id) : [])}
  label="Select all"
/>
```

### Per-row selection
```tsx
{items.map((item) => (
  <Checkbox
    key={item.id}
    checked={selected.includes(item.id)}
    onChange={(next) =>
      setSelected((s) => (next ? [...s, item.id] : s.filter((id) => id !== item.id)))
    }
    label={item.name}
  />
))}
```

### Bare box (add hitSlop for the tap target)
```tsx
<Checkbox checked={done} onChange={setDone} />
```

## When NOT to use

- **A setting that applies immediately** (no Save step) → [`Switch`](./Switch.md).
- **One of several mutually exclusive options** → [`RadioGroup`](./Radio.md) or [`SegmentedControl`](./SegmentedControl.md).
- **Selecting a rich card / tile** → [`SelectableCard`](./SelectableCard.md).
- **Triggering an action** → [`Button`](../02-actions/Button.md).

## Accessibility

- The `Pressable` sets `accessibilityRole="checkbox"` and reports state through `accessibilityState={{ checked, disabled }}`, where `checked` is `'mixed'` for the indeterminate state and a boolean otherwise — screen readers announce all three states correctly.
- A labelled checkbox is a large tap target (box + text). A **bare** box is only 18pt — add `hitSlop` to reach 44×44pt.
- Disabled reflects in `accessibilityState.disabled` and blocks the toggle.
- Keep ≥8pt between stacked checkboxes so adjacent targets don't collide.
