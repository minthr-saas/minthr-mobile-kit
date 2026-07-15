# OtpInput

A segmented one-time-code field — a row of single-character cells for entering a numeric verification code (SMS OTP, email code, 2FA).

## Purpose

The familiar "boxes" OTP pattern. Visually it's a row of `length` cells, but under the hood a *single* hidden `TextInput` captures all input — tapping any cell focuses that one field, and each typed digit fills the next cell. This keeps caret behaviour, paste, and platform SMS autofill (`textContentType="oneTimeCode"`, `autoComplete="sms-otp"`) working, which per-cell inputs notoriously break.

Input is filtered to digits only and truncated to `length`. When the code reaches full length, `onComplete` fires — wire your verify call there.

## Visual anatomy

```
Label
┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
│ 1  │ │ 2  │ │ 3  │ │    │ │    │ │    │   44×44 cells, gap spacing[2]
└────┘ └────┘ └────┘ └────┘ └────┘ └────┘
              ▲ active cell (brand border)
Error text
        (a 1×1 transparent TextInput is absolutely positioned behind the row)
```

Cells are `CELL_SIZE` = 44×44pt, `radius.md`, with the digit rendered at `fontSize.lg` / `fontWeight.medium`. The hidden input is `position: 'absolute'`, `1×1`, `opacity: 0`, `caretHidden`.

## States

- **Default** — every cell has a `border` hairline on `surfacePrimary`.
- **Active** — while focused, the *next-to-fill* cell (`idx === min(value.length, length − 1)`) gets a `brand` border at `borders.thin`. Only one cell is active at a time.
- **Error** — a non-empty `error` paints *every* cell's border `danger` (`borders.thin`) and shows the message below.

There is no disabled state.

## Rules

- **Controlled string.** `value` is the whole code as a string; `onChange` receives the digit-filtered, length-capped string. Store it as a string (leading zeros matter for codes), not a number.
- **Digits only.** Non-digits are stripped (`/\D/g`) and input is sliced to `length` — the user cannot overtype.
- **`length` defaults to 6**; pass `4` for a 4-digit code. Typical values are 4 or 6.
- **`onComplete` fires on the full length** via an effect on `value` — use it to auto-submit; don't also wait for a separate button unless you want a manual confirm.
- **Cells are exactly 44pt** to meet the tap target (Rule 10); the whole row is one `Pressable` that focuses the hidden input, so tapping anywhere works.
- **Keyboard is `number-pad`**; `autoFocus` is opt-in. Autofill attributes are pre-wired — don't strip them.
- **No shadow** (Rule 1); hairline borders only. Label is `Text variant="caption"`, medium, `textSecondary`.

## Props API

```ts
interface OtpInputProps {
  value: string;                          // required — controlled, digits only
  onChange: (value: string) => void;      // required
  length?: number;                        // default 6 (typically 4 or 6)
  label?: string;
  error?: string;                         // non-empty → all cells danger + message
  autoFocus?: boolean;
  onComplete?: (value: string) => void;   // fires when value.length === length
}
```

`OtpInputProps` does **not** extend `TextInputProps` — the surface is deliberately small; the internal keyboard/autofill config is fixed. There is no `hint`, `disabled`, `size`, or `variant`.

## Examples

### 6-digit SMS verification with auto-submit
```tsx
import { OtpInput } from '@minthr-saas/mobile-ui-kit';

const [code, setCode] = useState('');

<OtpInput
  label="Verification code"
  value={code}
  onChange={setCode}
  autoFocus
  onComplete={(full) => verify(full)}
/>
```

### 4-digit PIN
```tsx
<OtpInput length={4} value={pin} onChange={setPin} />
```

### With a validation error
```tsx
<OtpInput
  value={code}
  onChange={(v) => { setCode(v); setError(''); }}
  error={error}          // e.g. set to 'Incorrect code' after a failed verify
  onComplete={submit}
/>
```

### Resend flow (parent-owned)
```tsx
<>
  <OtpInput value={code} onChange={setCode} onComplete={verify} />
  <Button label="Resend code" variant="link" onPress={resend} disabled={cooldown > 0} />
</>
```

## When NOT to use

- **A password or secret longer than a short code** → [`Input`](./Input.md) with `secureTextEntry`.
- **Any non-digit code** (alphanumeric invite codes) → the cells are digit-only; use [`Input`](./Input.md).
- **A general short number with steppers** → [`NumberInput`](./NumberInput.md).
- **Free-form text** → [`Input`](./Input.md) / [`Textarea`](./Textarea.md).

## Accessibility

- The focusable row is a `Pressable` with `accessibilityRole="text"` and `accessibilityLabel="Verification code"`, so the control is announced as a single labelled field rather than N empty boxes.
- Each cell is 44×44pt, meeting the minimum tap target; the whole row is tappable to focus.
- The visual cells are non-interactive `View`s — screen readers interact with the one hidden `TextInput`, which keeps the reading model simple.
- Surface failures via the `error` string; add an `accessibilityHint` such as "Enter the 6-digit code we texted you" for first-time context.
