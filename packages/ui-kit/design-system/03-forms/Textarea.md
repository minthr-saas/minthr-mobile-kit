# Textarea

The multi-line text field — for free-form input that can run past one line: a note, a comment, a reason, a description.

## Purpose

A `multiline` `TextInput` wrapped with the same label / hint / error chrome as [`Input`](./Input.md), plus a `rows` prop that sets the field's *minimum* height. Text starts at the top-left (`textAlignVertical="top"`) and the field grows as the user types (RN default for multiline). It extends `TextInputProps`, so `value`, `onChangeText`, `maxLength`, `onSubmitEditing`, etc. pass straight through.

Reach for it whenever a single 40pt line would feel cramped — anything the user might write a sentence or paragraph into.

## Visual anatomy

```
Label                              ← fontSize.sm, medium, textSecondary
┌────────────────────────────────────────┐
│ value / placeholder                     │  minHeight from `rows`
│ (text flows, top-aligned)               │  paddingVertical spacing[3]
│                                         │
└────────────────────────────────────────┘
Hint text or error text
```

Minimum height is computed, not fixed:
`minHeight = max(rows, 1) × fontSize.md × lineHeight.normal + spacing[3] × 2`
(≈ `rows × 19.6 + 24`). The field never shrinks below that and expands with content.

## States

Same border-driven states as `Input`, applied to the field itself (there is no separate wrapper `View` here):

- **Default** — `border` hairline, `surfacePrimary` fill, `radius.md`.
- **Focused** — border → `brand` at `borders.thin` (tracked with `useState`; your `onFocus`/`onBlur` still fire).
- **Error** — a non-empty `error` paints the border `danger` (`borders.thin`) and shows the message below, replacing the hint.

There is no built-in disabled style; pass `editable={false}` from `TextInputProps` when you need read-only.

## Rules

- **`rows` sizes the floor, not a cap.** Default `4`. Pick it for the *expected* length (2–3 for a short reason, 5–6 for a description); the field still grows for longer input. Don't hard-code `height` in `style` — you'd defeat the auto-grow.
- **Line height is locked** to `fontSize.md × lineHeight.normal` (14 × 1.4 ≈ 19.6) so wrapped lines breathe. Padding is `spacing[3]` on all sides.
- **Top-aligned text** (`textAlignVertical="top"`) — a multi-line field must start typing from the top-left, never vertically centred. Alignment flips to `right` under RTL via `isRTL()`.
- **`placeholderTextColor` is `textMuted`**, matching `Input`.
- **Error string is the whole error UI** — one short sentence; it overrides the hint.
- **No shadow** (Rule 1); hairline border only. Sentence-case the label.

## Props API

```ts
import type { TextInputProps } from 'react-native';

interface TextareaProps extends TextInputProps {
  label?: string;
  hint?: string;
  error?: string;   // non-empty → error border + message, overrides hint
  rows?: number;    // default 4 — sets the MINIMUM height
  // value, onChangeText, maxLength, onSubmitEditing, onFocus, onBlur, style, … from TextInputProps
}
```

`multiline` and `textAlignVertical="top"` are set internally — don't pass them. `style` lands on the `TextInput`. There is no `variant`, `size`, or icon slot.

## Examples

### Leave-request reason
```tsx
import { Textarea } from '@minthr-saas/mobile-ui-kit';

const [reason, setReason] = useState('');

<Textarea
  label="Reason"
  placeholder="Add a short note for your manager"
  rows={3}
  value={reason}
  onChangeText={setReason}
/>
```

### With a character limit + hint
```tsx
<Textarea
  label="Description"
  rows={5}
  maxLength={280}
  value={desc}
  onChangeText={setDesc}
  hint={`${desc.length}/280`}
/>
```

### Validation error
```tsx
<Textarea
  label="Rejection reason"
  rows={2}
  value={note}
  onChangeText={setNote}
  error={submitted && note.trim() === '' ? 'A reason is required to reject' : undefined}
/>
```

### Read-only
```tsx
<Textarea label="Policy" value={policyText} editable={false} rows={6} />
```

## When NOT to use

- **A short single-line value** (name, email, code) → [`Input`](./Input.md).
- **A number, currency, or phone value** → [`NumberInput`](./NumberInput.md) / [`CurrencyInput`](./CurrencyInput.md) / [`PhoneInput`](./PhoneInput.md).
- **A choice from a fixed set** → [`Select`](./Select.md) or [`Combobox`](./Combobox.md).
- **Rich text / formatting** — not supported; the kit is plain-text only.

## Accessibility

- The inner `TextInput` carries the text-field role; the visible `label` names it. Add `accessibilityLabel` when no label is shown.
- The field is comfortably taller than 44pt at every `rows` value, so tap target is not a concern — keep ≥8pt spacing between it and neighbouring controls.
- Pair the `error` string with `accessibilityHint` (or a polite live region) so the correction is announced.
- Forward `maxLength` and the appropriate `autoCapitalize` / `autoCorrect` for the content — free text usually wants `autoCapitalize="sentences"`.
