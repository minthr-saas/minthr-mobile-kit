# TimePicker

A form trigger that opens the OS-native time picker and displays the chosen time.

## Purpose

Time-of-day entry should use the **platform's own picker** — the iOS wheel and the Android clock dialog are familiar and locale-aware. `TimePicker` gives you a labelled, bordered trigger row (clock icon + formatted time or placeholder) that opens `@react-native-community/datetimepicker` in `mode="time"`.

Use it wherever a single clock time matters: shift start, meeting time, clock-in. It is the sibling of [`DatePicker`](./DatePicker.md) — same shape, same platform mechanics, only the mode, icon, and default formatter differ.

## Visual anatomy

```
 Label
┌────────────────────────────────────────┐
│ 🕐  09:30                               │   ← trigger (min-height 44)
└────────────────────────────────────────┘
 hint / error line

 iOS: inline spinner under the trigger, with a "Done" header
 Android: system clock dialog floats over the screen
```

Trigger: `surfacePrimary`, `borders.thin` + `borderStrong`, `radius.md`, `spacing[3]` padding, `minHeight: 44`. A `Feather` `clock` (16, `textSecondary`) leads; the value renders `body`/`primary`, the placeholder `muted`.

## Platform behavior

- **iOS** — the picker renders inline in a `surfacePrimary` panel beneath the trigger with a **"Done"** header (brand, medium) to dismiss; `display="spinner"`.
- **Android** — the native clock dialog opens over the screen and closes itself on pick/cancel; `display="default"`.
- `onChange` fires **only** when the user confirms a time (event type `set`) — cancelling leaves the value untouched.

## States

- **Empty** — shows `placeholder` (default `"Select a time"`) in `muted`.
- **Filled** — shows `formatTime(value)`.
- **Disabled** — `surfaceSubtle` fill, `border` (softened), icon + text `muted`, opening blocked.
- **Error** — `danger` border and the `error` message below (error takes precedence over `hint`).

## Rules

- **Format for locale.** The default `formatTime` is `d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })`. For 24-hour or localized output, pass a `formatTime` from `Intl.DateTimeFormat(locale, { timeStyle: 'short' })`.
- **The `value` is a full `Date`.** The picker carries a whole `Date`; only the time part is meaningful, but you store and receive a `Date`. There are **no** `minDate`/`maxDate` props (unlike `DatePicker`) — time is unconstrained.
- **No clear affordance.** `onChange` is typed `(date: Date | null)` but the component only ever emits a real `Date`. Manage "clear" in your own state via `value={null}`.
- **Pair with a date when you need both.** For a datetime, render a `DatePicker` and a `TimePicker` side by side and merge their parts.
- **Tokens & icons** — `borderStrong` at rest, `danger` on error, `Feather` `clock` in `textSecondary`. No shadow on the trigger (Rule 1).
- **Tap target** — the trigger is `minHeight: 44` (Rule 10).

## Props API

```ts
interface TimePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;   // fires only on confirm; emits a Date
  placeholder?: string;                       // default 'Select a time'
  label?: string;
  hint?: string;
  disabled?: boolean;
  error?: string;
  formatTime?: (date: Date) => string;       // default toLocaleTimeString, 2-digit h:m
}
```

`TimePicker` and `TimePickerProps` are exported. It does **not** extend a RN props type — the surface above is the whole API. For date selection use the sibling [`DatePicker`](./DatePicker.md).

## Examples

### Basic time field
```tsx
import { useState } from 'react';
import { TimePicker } from '@minthr-saas/mobile-ui-kit';

const [time, setTime] = useState<Date | null>(null);

<TimePicker
  label="Start time"
  value={time}
  onChange={setTime}
  placeholder="Select start time"
/>
```

### 24-hour, localized
```tsx
const fmt = (d: Date) =>
  new Intl.DateTimeFormat('fr-FR', { timeStyle: 'short', hour12: false }).format(d);

<TimePicker label="Shift start" value={start} onChange={setStart} formatTime={fmt} />
```

### Date + time pair
```tsx
import { DatePicker, TimePicker } from '@minthr-saas/mobile-ui-kit';
import { View } from 'react-native';
import { spacing } from '@minthr-saas/mobile-ui-kit';

<View style={{ gap: spacing[3] }}>
  <DatePicker label="Meeting date" value={date} onChange={setDate} />
  <TimePicker label="Meeting time" value={time} onChange={setTime} />
</View>
```

## When NOT to use

- **A calendar date** → [`DatePicker`](./DatePicker.md).
- **A date range or inline month** → [`Calendar`](./Calendar.md).
- **A duration** ("2h 30m", not a clock time) → [`NumberInput`](./NumberInput.md) fields or a custom stepper.
- **A small fixed set of times** ("Morning / Afternoon / Evening") → [`SegmentedControl`](./SegmentedControl.md) or [`Select`](./Select.md).

## Accessibility

- The trigger is a `Pressable` with `accessibilityRole="button"` and an `accessibilityLabel` of the `label`, or the formatted value / placeholder when no label is set.
- The picker itself is the platform-native control and carries the OS's own accessibility semantics.
- On error, the `danger` message renders below the field; pair it with a clear `label` for screen-reader association.
