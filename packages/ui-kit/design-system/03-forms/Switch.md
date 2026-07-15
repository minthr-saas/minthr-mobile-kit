# Switch

An on/off toggle for a single setting that takes effect immediately — the mobile idiom for "flip this on".

## Purpose

A custom, kit-themed pill toggle (built on `Pressable` + `Animated`, not RN's native `Switch`) so the look is identical across platforms and matches the MintHR aesthetic. Optionally paired with a `label` + `description` in a settings-row layout. It's for a **binary, self-applying** setting: notifications on/off, dark mode, "make profile public". The change is the action — there's no Save step.

With no `label`/`description` it returns the bare control (drop it into your own row); with either, it renders the standard right-aligned settings row.

## Visual anatomy

```
Off:  ┌─────────┐        On:  ┌─────────┐
      │ ●       │             │       ● │   ● = 16pt thumb, slides on toggle
      └─────────┘             └─────────┘
      40×23 pill · gray[100] fill · faint brandSubtle ring (always)
      thumb: borderStrong when off, brand when on

Row (label present):
┌──────────────────────────────────────────┐
│ Email notifications              [ ●    ] │  space-between, gap spacing[3]
│ Get a message for each request            │  ← description (caption, muted)
└──────────────────────────────────────────┘
```

## States

The **track never changes colour** — it's always `palette.gray[100]` (the documented secondary-surface fill, same token `SegmentedControl` uses for its track) with a faint `lightColors.brandSubtle` ring (the semantic tint that stands in for the source's translucent green). Only the thumb's position and colour change:

- **Off** — thumb rests at the start edge, coloured `lightColors.borderStrong`.
- **On** — thumb slides to the end edge (200ms), coloured `lightColors.brand`.
- **Disabled** — `Pressable` is disabled; the bare control (or, in row mode, the whole row) drops to `opacity: 0.5`.

The thumb's horizontal travel is multiplied by `rtlSign()` so it slides toward the logical end edge under RTL. Position animates on the native driver; colour swaps instantly (colour can't run on the native driver).

There is no size or variant axis — a Switch is a Switch.

## Rules

- **Controlled.** Pass `value: boolean` and `onValueChange`. The handler is `onValueChange`, never `onChange`/`onPress`.
- **Immediate effect only.** A Switch commits instantly. If a change needs confirmation or a Save button, it's not a Switch — use a [`Checkbox`](./Checkbox.md) inside a form instead.
- **Label is the setting, description is the consequence.** Label is `Text variant="body"`, `fontWeight.medium`; description is `Text variant="caption"` `tone="muted"`. Both sentence-case.
- **Row layout is `space-between`** with `spacing[3]` gap — text block on the start edge (it `flexShrink`es), control on the end. This is logical/RTL-safe by default.
- **Colours are tokens.** Track fill `palette.gray[100]` (documented secondary surface), ring `lightColors.brandSubtle`, thumb `lightColors.brand` (on) / `lightColors.borderStrong` (off). No inline hex or `rgba()`; the only `palette` read is the track fill, which the semantic layer has no alias for (matches `SegmentedControl`).
- **Geometry is a fixed size spec** — 40×23 track, 16pt thumb, `radius.full`, `borders.thin` ring. These raw pixel values are the allowed size-spec / animation-offset exception to the 4px scale; don't parameterise them.
- **No shadow** (Rule 1) — the pill ring is the affordance, not a drop shadow.
- **Tap target ≥44pt** (Rule 10) — the 40×23 pill carries a `hitSlop` that expands the hittable area to ≥44×44.

## Props API

```ts
interface SwitchProps {
  value: boolean;                          // required — controlled
  onValueChange: (value: boolean) => void; // required
  disabled?: boolean;
  label?: string;                          // present → renders the settings row
  description?: string;                    // secondary line under the label
}
```

`SwitchProps` does not extend RN's `SwitchProps` — the surface is deliberately minimal (no `trackColor`, `thumbColor`, etc.; those are themed internally). There is no `size` or `variant`.

## Examples

### Bare toggle in your own row
```tsx
import { Switch } from '@minthr-saas/mobile-ui-kit';

const [on, setOn] = useState(false);

<Switch value={on} onValueChange={setOn} />
```

### Settings row with label + description
```tsx
const [notify, setNotify] = useState(true);

<Switch
  value={notify}
  onValueChange={setNotify}
  label="Email notifications"
  description="Get a message for each new request"
/>
```

### Disabled (locked by policy)
```tsx
<Switch
  value={true}
  onValueChange={() => {}}
  disabled
  label="Two-factor authentication"
  description="Required by your organization"
/>
```

## When NOT to use

- **A choice that needs a Save / Submit step** → [`Checkbox`](./Checkbox.md) in a form.
- **One of several mutually exclusive options** → [`SegmentedControl`](./SegmentedControl.md) or [`RadioGroup`](./Radio.md).
- **Selecting rows / items in a list** → [`Checkbox`](./Checkbox.md).
- **Triggering an action** (not a state) → [`Button`](../02-actions/Button.md).

## Accessibility

- The `Pressable` carries `accessibilityRole="switch"` and reports on/off through `accessibilityState.checked` — no extra wiring needed for the control itself.
- In row mode the tappable element is the control, not the row; the `label` is forwarded as the control's `accessibilityLabel` so the target is announced. To make the whole row tappable, wrap it yourself.
- The control meets the 44pt target via `hitSlop`; keep ≥8pt between stacked switch rows.
- Disabled reflects in `accessibilityState.disabled` via the `disabled` prop.
