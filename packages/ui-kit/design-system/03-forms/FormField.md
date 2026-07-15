# FormField

A labelled wrapper that gives any non-text control the same label + helper/error layout that `Input` and `Textarea` build in.

## Purpose

`FormField` solves label consistency. `Input`/`Textarea` already render their own label, hint, and error line — but a [`Switch`](./Switch.md), [`Checkbox`](./Checkbox.md), [`RadioGroup`](./Radio.md), [`Select`](./Select.md), or a custom `Pressable` row have no such chrome. Wrap them in `FormField` and they inherit the identical caption-styled label, the optional "required" marker, and a single helper-or-error line beneath. It renders its `children` verbatim between the label and the message — it does not inject props into them. Use it **only** around non-text controls; for a plain text field, reach for [`Input`](./Input.md) directly.

## Visual anatomy

```
┌───────────────────────────────────────────┐
│ Label text                        required │  ← labelRow: caption/medium + danger marker
│ ┌───────────────────────────────────────┐ │
│ │           children (any control)       │ │
│ └───────────────────────────────────────┘ │
│ Helper text  — or —  Error text            │  ← caption / muted  |  caption / danger
└───────────────────────────────────────────┘
     ↕ wrapper gap = spacing[1]
```

## Anatomy pieces

- **Label** (`label`) — `caption` variant, `textSecondary`, `fontWeight.medium`. Omit for an unlabelled wrapper.
- **Required marker** (`required`) — the literal word "required" in `caption`/`tone="danger"`, right-aligned on the label row. Not an asterisk.
- **Children** — whatever control you pass; rendered as-is.
- **Message** — one line only: `error` (danger) takes precedence; otherwise `hint` (muted); otherwise nothing.

## States

`FormField` has no interactive state of its own — it reflects what you pass:

- **Default** — label + optional hint.
- **Required** — shows the "required" marker; this is a visual cue only, it enforces nothing.
- **Error** — `error` string replaces the hint in `danger` tone. (`FormField` does not restyle the wrapped control's border — pass the same error state to controls that accept an `error` prop, e.g. `Select`.)

## Rules

- **Error beats hint.** When both are set, only `error` renders. Don't rely on seeing both at once.
- **Label is sentence case**, `caption`/`medium`, `textSecondary` (Rules 4, 5) — matched to `Input`'s label so mixed forms line up.
- **"required" is a word, not an asterisk**, in `danger` tone — consistent with the kit's plain-language stance. The marker is purely visual; validate in your own logic.
- **Wrapper gap is `spacing[1]`** (4pt) between label, control, and message — do not add extra margins; stack `FormField`s with the form's own gap.
- **One control per field.** Wrap a single control (or one `RadioGroup`); don't stuff multiple inputs into one `FormField`.
- **Extends `ViewProps`** — pass `style` to adjust the outer wrapper (e.g. width), and `accessibility*` if the group needs a name.

## Props API

```ts
import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';

export interface FormFieldProps extends ViewProps {
  label?: string;
  hint?: string;
  error?: string;       // when set, replaces `hint`
  required?: boolean;   // renders the "required" marker
  children: ReactNode;  // the wrapped control
  // style, accessibility*, … from ViewProps
}
```

`FormField` is a named export from the barrel.

## Examples

### Around a Switch
```tsx
import { useState } from 'react';
import { FormField, Switch } from '@minthr-saas/mobile-ui-kit';

const [notify, setNotify] = useState(true);

<FormField label="Email notifications" hint="Weekly digest every Monday">
  <Switch value={notify} onValueChange={setNotify} />
</FormField>
```

### Required, with an error
```tsx
<FormField label="Department" required error={submitted && !dept ? 'Pick a department' : undefined}>
  <Select value={dept} onChange={setDept} options={departments} title="Department" />
</FormField>
```

### Around a RadioGroup
```tsx
<FormField label="Leave type">
  <RadioGroup value={type} onChange={setType}>
    <Radio value="paid" label="Paid leave" />
    <Radio value="unpaid" label="Unpaid leave" />
  </RadioGroup>
</FormField>
```

### Unlabelled wrapper (helper only)
```tsx
<FormField hint="This can be changed later in settings">
  <Checkbox checked={agree} onChange={setAgree} label="I accept the policy" />
</FormField>
```

## When NOT to use

- **A plain text field** → [`Input`](./Input.md) or [`Textarea`](./Textarea.md) — they render label/hint/error internally, so double-wrapping duplicates the label.
- **A specialised text input** (number, currency, phone, OTP) → the dedicated component; they carry their own field chrome.
- **A control that already includes its own label** — don't nest labels.
- **Section grouping** (a titled block of several fields) → a [`Card`](../08-layout/Card.md) with a header, not a giant `FormField`.

## Accessibility

- `FormField` is a plain `View`; the visible `label` is text, not a programmatic label binding — it does not wire `accessibilityLabelledBy` to the child. For screen-reader parity, also give the wrapped control its own `accessibilityLabel` when the visual label wouldn't be announced.
- The wrapped control keeps its own role and state (`Switch` → switch, `RadioGroup` items → radio, etc.).
- Because it extends `ViewProps`, you can set `accessibilityRole`/`accessibilityLabel` on the wrapper to group the label and control for assistive tech when needed.
