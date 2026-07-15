# Radio

A single choice from a small, mutually-exclusive set. `Radio` items only work inside a `RadioGroup`, which owns the selected `value`.

## Purpose

Radio is for picking **exactly one** option from 2–5 visible choices where seeing every option at once matters — pay frequency, leave type, contract kind. The `RadioGroup` holds the `value` and broadcasts `onChange`; each `Radio` renders a ring + optional label/description and reports its own `value` up through context. If the list is long or needs search, this is the wrong control — collapse it into a [`Select`](./Select.md). For on/off, use a [`Switch`](./Switch.md); for "any number of these", use a [`Checkbox`](./Checkbox.md).

## Visual anatomy

```
RadioGroup (gap = spacing[3])
┌ ○  Label text            ← empty ring: borderStrong, borders.thin (1pt)
│      Description          ← caption / muted
├ ◉  Label text            ← selected ring: brand border + brand dot
│      Description
└ ○  Label text
   ↑ ring 18pt · dot 8pt · row gap = spacing[2]
```

The ring is a fixed 18pt circle with an 8pt brand dot when selected. Label and description are optional — a bare ring is valid (e.g. inside a custom row).

## Variants

None. A radio is a radio. The only structural axis is the **group `direction`**: `vertical` (stacked, default) or `horizontal` (wraps).

## States

- **Empty** — `surfacePrimary` fill, `borderStrong` ring at `borders.thin` (1pt), no dot.
- **Selected** — `surfacePrimary` fill, `brand` ring, `brand` 8pt dot. Set when `RadioGroup.value === Radio.value`.
- **Disabled** — `opacity: 0.5` and presses are ignored. Set per-item (`disabled` on `Radio`) or for the whole set (`disabled` on `RadioGroup`); either one disables the item.

## Rules

- **The group owns state.** `Radio` is presentational-plus-context; it throws if rendered outside a `RadioGroup`. Never try to control a lone `Radio`.
- **One selection, always.** Radio has no "none" state once a value is set — if "none" is a valid answer, add an explicit option or use a [`Checkbox`](./Checkbox.md).
- **Selected color is `brand`** (ring border + dot); empty ring is `borderStrong` (Rule 3). The fill stays `surfacePrimary` in both states — the dot, not a background, signals selection.
- **Ring is 18pt but the row is the tap target.** The whole `Pressable` row (ring + text) is pressable; keep labels present so the target clears 44pt, or add `hitSlop` on bare rings (Rule 10).
- **Labels are sentence case**, 1–4 words; `description` is the secondary caption line in `textMuted` (Rule 5).
- **`horizontal` only for 2–3 short options** (e.g. "Yes / No / N/A"); it `flexWrap`s, so long labels reflow awkwardly. Default to `vertical`.
- **Row gap is `spacing[3]` inside the group, `spacing[2]` between ring and text** — do not restyle; the rhythm is fixed.

## Props API

```ts
import type { ReactNode } from 'react';

export interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  direction?: 'vertical' | 'horizontal';   // default 'vertical'
  children: ReactNode;                      // the <Radio> items
}

export interface RadioProps {
  value: string;                 // must be unique within the group
  label?: string;
  description?: string;
  disabled?: boolean;            // OR'd with the group's disabled
}
```

Both `RadioGroup` and `Radio` are named exports from the barrel. `Radio` reads the group through React context — there are no `onChange`/`selected` props on `Radio` itself.

## Examples

### Basic group
```tsx
import { useState } from 'react';
import { RadioGroup, Radio } from '@minthr-saas/mobile-ui-kit';

const [freq, setFreq] = useState('monthly');

<RadioGroup value={freq} onChange={setFreq}>
  <Radio value="weekly" label="Weekly" />
  <Radio value="biweekly" label="Every two weeks" />
  <Radio value="monthly" label="Monthly" />
</RadioGroup>
```

### With descriptions
```tsx
<RadioGroup value={plan} onChange={setPlan}>
  <Radio value="standard" label="Standard" description="Accrues 1.5 days per month" />
  <Radio value="unlimited" label="Unlimited" description="No cap, manager approval" />
</RadioGroup>
```

### Horizontal, with one option disabled
```tsx
<RadioGroup value={answer} onChange={setAnswer} direction="horizontal">
  <Radio value="yes" label="Yes" />
  <Radio value="no" label="No" />
  <Radio value="na" label="N/A" disabled />
</RadioGroup>
```

### Inside a FormField
```tsx
import { FormField, RadioGroup, Radio } from '@minthr-saas/mobile-ui-kit';

<FormField label="Contract type" required error={err}>
  <RadioGroup value={type} onChange={setType}>
    <Radio value="cdi" label="Permanent (CDI)" />
    <Radio value="cdd" label="Fixed-term (CDD)" />
  </RadioGroup>
</FormField>
```

## When NOT to use

- **On / off, or a single toggle** → [`Switch`](./Switch.md).
- **"Select all that apply" (0..n)** → [`Checkbox`](./Checkbox.md).
- **More than ~5 options, or needs search** → [`Select`](./Select.md) / [`Combobox`](./Combobox.md).
- **Whole-card options with rich content per choice** (plans, payment methods) → [`SelectableCard`](./SelectableCard.md) with `variant="radio"`.
- **Switching a view/mode inline** → [`SegmentedControl`](./SegmentedControl.md).

## Accessibility

- Each `Radio` is a `Pressable` with `accessibilityRole="radio"` and `accessibilityState={{ selected, disabled }}` — screen readers announce it as a radio and read its selected state.
- The visible `label` is the accessible name; when a radio has no label (bare ring), pass an `accessibilityLabel` on the row or keep the label present.
- Disabled radios expose `disabled` in `accessibilityState` and swallow presses.
- Wrap the group in a [`FormField`](./FormField.md) to give the whole set a caption-styled label and error line.
