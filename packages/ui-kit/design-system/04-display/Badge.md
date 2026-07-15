# Badge

A small, static status pill. Use it to label the state of a thing — "Active", "Draft", "Rejected" — in one glance, with a semantic color that carries the meaning.

## Purpose

`Badge` is a read-only status tag: a rounded rectangle with a subtle semantic fill and matching text, optionally led by a colored dot or a Feather icon. It is **system-owned** — the app sets it to reflect state, the user never dismisses or edits it. It extends `ViewProps`, so `style` and `accessibility*` forward to the root `View`.

For a chip the **user** applies or removes (a filter, a selected label) use [`Tag`](./Tag.md); for a full banner with title + body use [`Alert`](../05-feedback/Alert.md) or [`Callout`](../05-feedback/Callout.md).

## Visual anatomy

```
   ┌───────────────────┐
   │ ● Active          │   dot (optional) OR icon (optional) + label
   └───────────────────┘
    ↕ paddingVertical: 2   ↔ paddingHorizontal: spacing[2]
    radius.sm (4)   gap: 4   label = fontSize.xs, fontWeight.medium
```

The badge is `alignSelf: 'flex-start'` — it hugs its content and never stretches. `dot` and `icon` both render before the label and both take the label's text color.

## Variants

Six semantic variants; each is a `*Subtle` fill with the family's `700` text (per the text-on-color rule in [`00-foundations/02-colors.md`](../00-foundations/02-colors.md)):

| `variant` | Fill | Text | Typical status |
|---|---|---|---|
| `neutral` | `surfaceSubtle` | `textSecondary` | Default, "Archived", generic | **Default** |
| `brand` | `brandSubtle` | `brand[700]` | On-brand highlight |
| `success` | `successSubtle` | `success[700]` | "Active", "Approved", "Completed" |
| `warning` | `warningSubtle` | `warning[700]` | "Draft", "Pending", "In progress" |
| `danger` | `dangerSubtle` | `danger[700]` | "Rejected", "Inactive", "Overdue" |
| `info` | `infoSubtle` | `info[700]` | "New", informational |

There is one size. Badge is deliberately fixed at `fontSize.xs` (11) so it stays a quiet label, not a control.

## Rules

- **Static only.** Badge is not pressable and has no `onRemove`. If it needs an action, you want a [`Tag`](./Tag.md) or a [`Button`](../02-actions/Button.md).
- **Color is the meaning** — pick the variant by semantics, not decoration. Green = good, amber = in-progress, red = bad, blue = new/info, brand = highlight, neutral = default.
- **Sentence case, 1–2 words** (Rule 5). "In progress", not "IN PROGRESS" and not "In Progress". Acronyms keep their case ("HR", "OTP").
- **`dot` or `icon`, not both** as a rule of thumb — the dot is the lightest signal; use an `icon` (any Feather name) only when the glyph adds real meaning. Both inherit the label color automatically; never recolor them separately.
- **No border, no shadow** (Rule 1). The subtle fill alone separates it from the surface. Corners are `radius.sm` — a soft rectangle, which is what distinguishes it from the fully-rounded [`Tag`](./Tag.md) pill.

## Props API

```ts
import type { ViewProps } from 'react-native';
import type { Feather } from '@expo/vector-icons';

export type BadgeVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends ViewProps {
  label: string;                                        // required
  variant?: BadgeVariant;                               // default 'neutral'
  /** Show a colored dot before the label. */
  dot?: boolean;                                        // default false
  /** Show a Feather icon before the label. */
  icon?: React.ComponentProps<typeof Feather>['name'];  // default undefined
  // style, accessibilityLabel, testID, … from ViewProps
}
```

Sibling export: `BadgeVariant`. Note `icon` is a Feather icon **name string** (e.g. `"check"`), not a rendered node — the component draws the `<Feather>` for you at size 11 in the variant's text color.

## Examples

### Status badges
```tsx
import { Badge } from '@minthr-saas/mobile-ui-kit';

<Badge label="Active" variant="success" />
<Badge label="Draft" variant="warning" />
<Badge label="Rejected" variant="danger" />
```

### With a dot
```tsx
<Badge label="Online" variant="success" dot />
```

### With an icon
```tsx
<Badge label="Verified" variant="brand" icon="check" />
<Badge label="New" variant="info" icon="star" />
```

### In a list row (trailing status)
```tsx
import { View } from 'react-native';
import { Badge, Text, spacing } from '@minthr-saas/mobile-ui-kit';

<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
  <Text variant="body">Leave request</Text>
  <Badge label="Pending" variant="warning" dot />
</View>
```

## When NOT to use

- **The user can add or remove it** (filters, applied labels) → [`Tag`](./Tag.md).
- **It needs to be tappable** → [`Tag`](./Tag.md) with `onRemove`, or a [`Button`](../02-actions/Button.md).
- **A full-width status message with a title and body** → [`Alert`](../05-feedback/Alert.md) or [`Banner`](../05-feedback/Banner.md).
- **A count on a tab or icon** → the badge slot built into [`BottomTabBar`](../07-navigation/BottomTabBar.md).

## Accessibility

- Badge is a `View`; its `label` text is read by the screen reader. When the label alone is ambiguous out of context, add an `accessibilityLabel` that states what the status refers to, e.g. `"Request status: pending"`.
- The `dot` and `icon` are decorative — they carry no independent meaning to a screen reader, which is correct since the label already says it.
- Because Badge is non-interactive there is no tap target to satisfy; keep it out of `Pressable` unless the whole surrounding row is the target.
