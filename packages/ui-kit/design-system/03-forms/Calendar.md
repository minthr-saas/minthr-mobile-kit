# Calendar

An inline month-view date picker supporting single, range, and multi selection — no external date library.

## Purpose

When you need the whole month visible — scheduling, time-off requests, seeing which days are already taken — an inline calendar beats a native spinner. `Calendar` renders a self-contained month grid (nav header, weekday row, 7-column day grid) with three selection modes:

- **`single`** — one day (e.g. a report date).
- **`range`** — a start/end span (e.g. a leave request), with the days between tinted.
- **`multi`** — an arbitrary set of days (e.g. recurring shifts).

Render it directly on a screen, or drop it inside a [`BottomSheet`](../06-overlays/BottomSheet.md) to use it as a modal picker. All date math is hand-rolled (`stripTime`, `isSameDay`, `startOfMonth`, `addMonths`) — no `moment`/`date-fns` dependency. For a compact form field that opens the OS picker, use [`DatePicker`](./DatePicker.md) instead.

## Visual anatomy

```
┌──────────────────────────────────────────┐
│  ‹        July 2026                 ›     │  ← nav (RTL-aware chevrons)
│  Sun Mon Tue Wed Thu Fri Sat              │  ← weekday row
│              1   2   3   4   5            │
│   6   7   8  (9) [10][11][12]  13         │  (9)=today ring  [..]=range
│  …                                        │
└──────────────────────────────────────────┘
```

Cells are `40pt` (`CELL_SIZE`); the pressable inner circle is `radius.full`. **Selected** = `brand` fill, `onBrand` text, medium weight. **In-range** = `brandSubtle` fill behind the cell. **Today** (unselected) = `brand` `borders.thin` ring. **Disabled** = `textMuted`.

## Modes / States

| Mode | `value` type | `onChange` payload |
|---|---|---|
| `single` (default) | `Date \| null` | `(value: Date)` |
| `range` | `{ start: Date \| null; end: Date \| null }` | `(value: CalendarRange)` |
| `multi` | `readonly Date[]` | `(value: readonly Date[])` |

**Range tap logic:** first tap sets `{ start, end: null }`; a second tap on/after start sets `end`; a tap **before** start swaps them (`{ start: tapped, end: previousStart }`); tapping again once a full range exists restarts from a new start. **Multi tap logic:** toggles the day in/out of the array.

Day states: default, pressed (`surfaceSubtle`), selected, in-range, today-ring, disabled. Disabled days come from `minDate` / `maxDate` / `disabledDates` and can't be pressed.

## Rules

- **`value` and `onChange` are required and their types are keyed to `mode`.** The props are a discriminated union — TypeScript enforces the right pairing (a `range` calendar can't take a `Date` value). Get `mode` right or the types won't compile.
- **`firstDayOfWeek`** — `0` (Sunday, default) or `1` (Monday). It shifts both the weekday header and the leading blanks.
- **Weekday and month names are English constants.** The grid labels aren't localized in the component; for other languages, wrap or localize upstream (this is a known limitation, not a prop).
- **`initialMonth`** sets the first visible month (defaults to today's month); the visible month is then internal state driven by the nav chevrons.
- **RTL** — the prev/next chevrons use `backChevron()` / `forwardChevron()` so "previous" and "next" stay correct in RTL. The grid uses logical layout.
- **Tokens** — `brand` for selection, `brandSubtle` for range fill, `borders.thin` for the today ring, `surfaceSubtle` for press. No shadow (Rule 1).
- **Tap target** — day cells are `40pt` with the pressable centered; nav buttons carry `hitSlop`.

## Props API

```ts
import type { ViewProps } from 'react-native';

type CalendarMode = 'single' | 'range' | 'multi';
type CalendarRange = { start: Date | null; end: Date | null };

interface CalendarBaseProps extends ViewProps {
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: readonly Date[];
  initialMonth?: Date;          // first visible month; default = today
  firstDayOfWeek?: 0 | 1;       // 0 = Sunday (default), 1 = Monday
}

// Discriminated union — pick one shape per mode:
type CalendarProps =
  | (CalendarBaseProps & { mode?: 'single'; value: Date | null;        onChange: (value: Date) => void })
  | (CalendarBaseProps & { mode: 'range';   value: CalendarRange;      onChange: (value: CalendarRange) => void })
  | (CalendarBaseProps & { mode: 'multi';   value: readonly Date[];    onChange: (value: readonly Date[]) => void });
```

`Calendar`, `CalendarMode`, `CalendarRange`, and `CalendarProps` are exported.

## Examples

### Single date
```tsx
import { useState } from 'react';
import { Calendar } from '@minthr-saas/mobile-ui-kit';

const [day, setDay] = useState<Date | null>(null);

<Calendar value={day} onChange={setDay} />
```

### Leave range, Monday-first, no past days
```tsx
import { Calendar, type CalendarRange } from '@minthr-saas/mobile-ui-kit';

const [range, setRange] = useState<CalendarRange>({ start: null, end: null });

<Calendar
  mode="range"
  value={range}
  onChange={setRange}
  firstDayOfWeek={1}
  minDate={new Date()}
/>
```

### Multi-select with blocked dates
```tsx
const [days, setDays] = useState<readonly Date[]>([]);

<Calendar
  mode="multi"
  value={days}
  onChange={setDays}
  disabledDates={publicHolidays}
/>
```

### Inside a bottom sheet (modal picker)
```tsx
// Render <Calendar single /> as the sheet body; confirm the value in the sheet footer.
<Calendar value={day} onChange={(d) => { setDay(d); closeSheet(); }} />
```

## When NOT to use

- **A single date in a compact form** → [`DatePicker`](./DatePicker.md) (opens the native picker, takes less vertical space).
- **A time of day** → [`TimePicker`](./TimePicker.md).
- **Just navigating between months of data** (not selecting) → build a lighter month header; the selection machinery is overkill.
- **A relative shortcut set** ("Last 7 days", "This month") → [`SegmentedControl`](./SegmentedControl.md) feeding date bounds.

## Accessibility

- The month nav buttons are `Pressable` with `accessibilityRole="button"` and labels `"Previous month"` / `"Next month"`.
- Every day is a `Pressable` with `accessibilityRole="button"`, `accessibilityLabel` = `date.toDateString()`, and `accessibilityState={{ selected, disabled }}` — so a screen reader announces both the date and whether it's chosen or unavailable.
- Disabled days set `disabled` on their `Pressable`, removing them from the tap order.
