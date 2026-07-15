# DatePicker

A form trigger that opens the OS-native date picker and displays the chosen date.

## Purpose

Dates on mobile should use the **platform's own picker** — the iOS spinner and the Android calendar dialog are familiar, accessible, and locale-aware. `DatePicker` gives you a labelled, bordered trigger row (calendar icon + formatted value or placeholder) that opens `@react-native-community/datetimepicker` in `mode="date"`.

Use it in forms for a single day: start date, birth date, contract end. For picking a *range* or seeing a whole month inline, use [`Calendar`](./Calendar.md) instead.

## Visual anatomy

```
 Label
┌────────────────────────────────────────┐
│ 📅  14/07/2026                          │   ← trigger (min-height 44)
└────────────────────────────────────────┘
 hint / error line

 iOS: inline spinner under the trigger, with a "Done" header
 Android: system dialog floats over the screen
```

Trigger: `surfacePrimary`, `borders.thin` + `borderStrong`, `radius.md`, `spacing[3]` padding, `minHeight: 44`. A `Feather` `calendar` (16, `textSecondary`) leads; the value renders `body`/`primary`, the placeholder `muted`.

## Platform behavior

- **iOS** — the picker renders inline in a `surfacePrimary` panel beneath the trigger with a **"Done"** header (brand, medium) to dismiss; `display="spinner"`.
- **Android** — the native dialog opens over the screen and closes itself on pick/cancel; `display="default"`.
- `onChange` fires **only** when the user confirms a date (event type `set`) — cancelling leaves the value untouched.

## States

- **Empty** — shows `placeholder` (default `"Select a date"`) in `muted`.
- **Filled** — shows `formatDate(value)`.
- **Disabled** — `surfaceSubtle` fill, `border` (softened), icon + text `muted`, opening blocked.
- **Error** — `danger` border and the `error` message below (error takes precedence over `hint`).

## Rules

- **Constrain with `minDate` / `maxDate`.** Pass them so the native picker greys out invalid days (e.g. no future date of birth, no end before start).
- **Format for locale.** The default `formatDate` is `d.toLocaleDateString()`. The app is multi-language — pass a `formatDate` built from `Intl.DateTimeFormat(locale, { dateStyle: 'medium' })` for consistent, localized output.
- **There is no clear affordance.** Although `onChange` is typed `(date: Date | null)`, the component only ever emits a real `Date`. If you need "clear", manage it in your own state and pass `value={null}`.
- **`value` is a `Date | null`** — a real JS `Date`, not a string. Store it as such.
- **Tokens & icons** — `borderStrong` at rest, `danger` on error, `Feather` `calendar` in `textSecondary`. No shadow on the trigger (Rule 1).
- **Tap target** — the trigger is `minHeight: 44` (Rule 10).

## Props API

```ts
interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;   // fires only on confirm; emits a Date
  placeholder?: string;                       // default 'Select a date'
  label?: string;
  hint?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  error?: string;
  formatDate?: (date: Date) => string;       // default d.toLocaleDateString()
}
```

`DatePicker` and `DatePickerProps` are exported. It does **not** extend a RN props type — the surface above is the whole API. For time selection use the sibling [`TimePicker`](./TimePicker.md).

## Examples

### Basic date field
```tsx
import { useState } from 'react';
import { DatePicker } from '@minthr-saas/mobile-ui-kit';

const [start, setStart] = useState<Date | null>(null);

<DatePicker
  label="Start date"
  value={start}
  onChange={setStart}
  placeholder="Select start date"
/>
```

### Localized formatting + bounds
```tsx
const fmt = (d: Date) =>
  new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(d);

<DatePicker
  label="Date of birth"
  value={dob}
  onChange={setDob}
  maxDate={new Date()}          // no future dates
  formatDate={fmt}
/>
```

### Dependent range (end after start)
```tsx
<DatePicker
  label="End date"
  value={end}
  onChange={setEnd}
  minDate={start ?? undefined}   // can't precede start
  error={end && start && end < start ? 'End must be after start' : undefined}
/>
```

## When NOT to use

- **A date *range* or a month you want visible inline** → [`Calendar`](./Calendar.md).
- **A time of day** → [`TimePicker`](./TimePicker.md).
- **A date *and* time together** → pair `DatePicker` + `TimePicker`, or drive the native picker's datetime mode in a custom control.
- **Choosing from a small set of relative options** ("Today / This week / This month") → [`SegmentedControl`](./SegmentedControl.md) or [`Select`](./Select.md).

## Accessibility

- The trigger is a `Pressable` with `accessibilityRole="button"` and an `accessibilityLabel` of the `label`, or the formatted value / placeholder when no label is set.
- The picker itself is the platform-native control, so it carries the OS's own accessibility semantics.
- On error, the `danger` message renders as text below the field; pair it with a clear `label` so the association is obvious to a screen reader.
