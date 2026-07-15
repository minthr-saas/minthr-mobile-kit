# Button

The primary interactive element for actions. Use it for anything that "does something" — submit, save, confirm, delete — rather than navigates.

## Purpose

A labelled, pressable action built on `Pressable`. It takes a required `label` string (not `children`), optional leading/trailing icons, and forwards the rest of `PressableProps` (`onPress`, `accessibilityLabel`, etc.). For icon-only triggers use [`IconButton`](./IconButton.md); for a floating primary action use [`FAB`](./FAB.md).

## Visual anatomy

```
┌───────────────────────────────────┐
│ [leftIcon]   Label text  [rightIcon] │
└───────────────────────────────────┘
   ↕ height (size)     ↳ gap = spacing[1|2]
   ↔ paddingHorizontal = spacing[3|4]
```

`label` is required; icons are optional `ReactNode` slots. Never a button with only an icon — use `IconButton`.

## Variants

- **`primary`** — brand fill, white label. The single most important action in a region. **Default.**
- **`secondary`** — white surface, hairline border, primary-text label. Most non-primary buttons.
- **`ghost`** — transparent, primary-text label. Tertiary actions, toolbar buttons.
- **`danger`** — danger fill, white label. Destructive primary (Delete).
- **`danger-ghost`** — transparent, danger-colored label. Destructive secondary (Reject).
- **`link`** — no fill, no padding, brand label, underlined. Inline text action.

## Sizes

- **`sm`** — 32pt tall, `fontSize.sm` (12), `paddingHorizontal: spacing[3]`, `gap: spacing[1]`.
- **`md`** — 38pt tall, `fontSize.md` (14), `paddingHorizontal: spacing[4]`, `gap: spacing[2]`. **Default.**
- **`lg`** — 44pt tall, `fontSize.md` (14), `paddingHorizontal: spacing[4]`, `gap: spacing[2]`.

## States

- Default, pressed (background darkens to `brandHover` / ripple on Android), disabled (`opacity: 0.5`).
- Pressed feedback uses `android_ripple` + the `pressed` style — never a `TouchableOpacity` opacity flash (Rule 8).

## Rules

- **One `primary` per region.** A screen, a sheet, a form footer each get at most one primary — never two fighting.
- **`label` is sentence case, verb-first, 1–3 words.** "Save", "Delete account", "Create survey". Never a full sentence, never Title Case.
- **Icons are `ReactNode`** — pass a `<Feather name="plus" size={16} color={…} />`. Match the icon color to the label color (white on `primary`/`danger`, `textPrimary` on `secondary`/`ghost`, `danger` on `danger-ghost`).
- **`fullWidth`** stretches the button to its container (`alignSelf: 'stretch'`) — the standard for form submits and sheet CTAs.
- **`link`** drops horizontal padding and underlines; use it inline, not as a standalone CTA.
- **No shadow** (Rule 1). `secondary` gets a hairline border; the others are fills.
- **Tap target** — `sm` is 32pt tall; add `hitSlop` if it sits alone, so the target reaches 44pt.

## Props API

```ts
import type { PressableProps } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  variant?: ButtonVariant;   // default 'primary'
  size?: ButtonSize;         // default 'md'
  fullWidth?: boolean;       // default false
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  // onPress, disabled, accessibilityLabel, hitSlop, … from PressableProps
}
```

There is **no** `loading` prop. For an async submit, disable the button and swap the `label` (e.g. "Saving…"), optionally passing a `<Spinner size="sm" tone="inverse" />` as `leftIcon`.

## Examples

### Primary CTA with icon
```tsx
import { Feather } from '@expo/vector-icons';
import { Button, lightColors } from '@minthr-saas/mobile-ui-kit';

<Button
  label="New teammate"
  variant="primary"
  leftIcon={<Feather name="plus" size={16} color={lightColors.onBrand} />}
  onPress={openCreate}
/>
```

### Full-width form submit (async)
```tsx
<Button
  label={submitting ? 'Saving…' : 'Save'}
  variant="primary"
  fullWidth
  disabled={submitting}
  onPress={onSubmit}
/>
```

### Destructive
```tsx
<Button
  label="Delete account"
  variant="danger"
  leftIcon={<Feather name="trash-2" size={16} color={lightColors.onBrand} />}
  onPress={confirmDelete}
/>
```

### Footer pair (Cancel + Save)
```tsx
<View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: spacing[2] }}>
  <Button label="Cancel" variant="ghost" onPress={onClose} />
  <Button label="Save" variant="primary" onPress={onSave} />
</View>
```

### Inline link
```tsx
<Button label="Forgot password?" variant="link" onPress={onForgot} />
```

## When NOT to use

- **Icon-only trigger** → [`IconButton`](./IconButton.md).
- **Floating primary action over a list** → [`FAB`](./FAB.md).
- **Navigation between screens** → a pressable `ListItem`, `Tabs`, or `router` link, not a Button.
- **On/off state** → [`Switch`](../03-forms/Switch.md) or [`SegmentedControl`](../03-forms/SegmentedControl.md).
- **A menu of actions** → open a [`Menu`](../06-overlays/Menu.md) or [`BottomSheet`](../06-overlays/BottomSheet.md) from a single trigger.

## Accessibility

- Extends `Pressable`, so it already has `accessibilityRole="button"` semantics when you provide handlers; the visible `label` is read out. For extra context pass `accessibilityHint`.
- When the label is non-descriptive out of context, add `accessibilityLabel`.
- Disabled reflects in `accessibilityState` via the `disabled` prop.
