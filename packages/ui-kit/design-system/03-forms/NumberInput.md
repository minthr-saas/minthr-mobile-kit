# NumberInput

A numeric field flanked by minus/plus stepper buttons — for a bounded, discrete quantity the user nudges up or down: days, headcount, quantity, a rating.

## Purpose

A controlled numeric control. It holds `value: number | null` and reports changes through `onChange(next: number | null)`. Two `Pressable` steppers add/subtract `step` (clamped to `[min, max]`); the centre `TextInput` accepts direct typing on a `number-pad` keyboard. `null` means "empty" — the field shows a blank, and clearing the text reports `null` back to you.

It embodies the mobile idiom of "adjust a small integer without opening the keyboard": tapping ± is faster than typing for values near the current one.

## Visual anatomy

```
Label
┌──────┬───────────────────┬──────┐
│  −   │       value        │  +   │  height 40
└──────┴───────────────────┴──────┘
  40pt      centred, flex      40pt
Hint or error text
```

The two `STEP_WIDTH`-wide (40pt) buttons sit inside a single bordered `fieldWrap` (`overflow: 'hidden'`, `radius.md`); the centre input is divided from them by hairline start/end borders and its text is centred.

## States

- **Default / Focused / Error** — same border language as [`Input`](./Input.md): `border` hairline by default, `brand` at `borders.thin` when the field is focused, `danger` at `borders.thin` when a non-empty `error` is passed.
- **Stepper pressed** — the pressed button fills with `surfaceSubtle` (Rule 8 `android_ripple`/`pressed` style, not opacity).
- **Stepper disabled** — a button drops to `opacity: 0.5` and its icon greys to `textMuted` once the bound is reached: `incDisabled = value !== null && value >= max`, `decDisabled = value !== null && value <= min`.

## Rules

- **Controlled only.** You must pass `value` and `onChange`; there's no internal fallback state. Render the number with `Intl.NumberFormat` at the call site if you display it elsewhere.
- **Empty is `null`, not `0`.** Clearing the input reports `null`; stepping from empty treats the base as `0` (`(value ?? 0) ± step`). Guard your submit for `null`.
- **`min`/`max` clamp both paths** — steppers and typed values run through `clamp`. Defaults are `-Infinity` / `Infinity` (unbounded), `step` defaults to `1`.
- **Steppers are 40pt wide** (`STEP_WIDTH`), the field is 40pt tall (`FIELD_HEIGHT`) — the tap targets are square and thumb-friendly. Icons are `Feather` `minus` / `plus` at size 14, coloured `textPrimary` (or `textMuted` when disabled).
- **Centre-aligned value** — a stepper field reads as a dial, so the number is centred, not start-aligned.
- **`disabled` is declared but only forwarded to the inner `TextInput`** (which ignores it) — it does *not* grey out or lock the steppers. To present a truly read-only quantity, render plain text instead of a disabled `NumberInput`.
- **No shadow** (Rule 1); hairline dividers only. Label is `Text variant="caption"`, medium, `textSecondary`.

## Props API

```ts
import type { TextInputProps } from 'react-native';

interface NumberInputProps
  extends Omit<TextInputProps, 'value' | 'onChangeText' | 'keyboardType' | 'onChange'> {
  value: number | null;                     // required — controlled; null = empty
  onChange: (value: number | null) => void; // required
  disabled?: boolean;                        // declared; forwarded to inner TextInput only
  label?: string;
  hint?: string;
  error?: string;                            // non-empty → error border + message
  min?: number;                              // default -Infinity
  max?: number;                              // default Infinity
  step?: number;                             // default 1
  // placeholder, onFocus, onBlur, … from TextInputProps (minus the omitted keys)
}
```

`value`, `onChangeText`, `keyboardType`, and `onChange` are `Omit`ted from `TextInputProps` because the component owns them (`keyboardType` is fixed to `number-pad`). There is no `size` or `variant`.

## Examples

### Days of leave (0–30)
```tsx
import { NumberInput } from '@minthr-saas/mobile-ui-kit';

const [days, setDays] = useState<number | null>(1);

<NumberInput
  label="Days"
  value={days}
  onChange={setDays}
  min={0}
  max={30}
/>
```

### Half-day step
```tsx
<NumberInput
  label="Duration"
  value={amount}
  onChange={setAmount}
  min={0}
  step={0.5}
  hint="Half-days allowed"
/>
```

### Required with validation
```tsx
const [qty, setQty] = useState<number | null>(null);

<NumberInput
  label="Quantity"
  value={qty}
  onChange={setQty}
  min={1}
  error={submitted && qty === null ? 'Enter a quantity' : undefined}
/>
```

## When NOT to use

- **A money amount with a currency symbol / grouping** → [`CurrencyInput`](./CurrencyInput.md).
- **A phone number** → [`PhoneInput`](./PhoneInput.md).
- **A large or free-form number where steppers add no value** (an ID, a year typed in full) → [`Input`](./Input.md) with `keyboardType="number-pad"`.
- **Picking from a small fixed set of numbers** → [`SegmentedControl`](./SegmentedControl.md) or [`Select`](./Select.md).
- **A multi-step wizard** → the navigation [`Stepper`](../07-navigation/Stepper.md), which is unrelated to this control.

## Accessibility

- Each stepper is a `Pressable` with `accessibilityRole="button"` and an `accessibilityLabel` (`"Decrement"` / `"Increment"`); `disabled` is set once a bound is hit, so it reflects in `accessibilityState`.
- The 40×40pt steppers already meet the 44pt target when you account for the surrounding border; keep them un-cramped.
- The centre field is a standard numeric `TextInput` — add `accessibilityLabel` matching the visible `label` if a screen reader would otherwise read only the value.
- Announce range violations through the `error` string plus an `accessibilityHint` (e.g. "Maximum is 30").
