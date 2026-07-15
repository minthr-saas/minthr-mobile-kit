# SelectableCard

A card-shaped radio or checkbox option: the whole card surface is the tap target, with a radio dot or checkbox tick as the indicator.

## Purpose

`SelectableCard` is for choice flows where each option carries **rich content** and deserves a generous target — "pick a plan", "choose a payment method", "select a role". Instead of a 18pt radio ring next to a line of text, the entire card is pressable and you compose whatever you like inside (`children`): a title, price, description, an icon. The indicator sits at the end and takes one of two shapes — `radio` (single-select intent) or `checkbox` (multi-select intent) — but `SelectableCard` itself is **uncontrolled group-wise**: you drive `selected`/`onPress` per card and manage the set in your own state.

## Visual anatomy

```
variant="radio", selected
┌────────────────────────────────────────────┐  ← brand border + brandSubtle bg
│  children (title, price, description…)   ◉  │  ← indicator: 22pt round, brand + dot
└────────────────────────────────────────────┘

variant="checkbox", unselected
┌────────────────────────────────────────────┐  ← border hairline-thin, surfacePrimary
│  children                                ☐  │  ← indicator: 22pt square (radius.sm)
└────────────────────────────────────────────┘
   ↑ padding = spacing[4] · gap(content↔indicator) = spacing[3]
```

The card is a `Pressable` row: content (`flex: 1`) on the leading side, a 22pt indicator on the trailing side, aligned to the top.

## Variants

- **`radio`** (default) — round indicator; an 8pt `onBrand` dot when selected. Use for single-select groups (one card selected at a time — enforced by your state).
- **`checkbox`** — square indicator (`radius.sm`); a `Feather` `check` (14, `onBrand`) when selected. Use for multi-select groups.

The variant only changes the indicator shape and its selected glyph; card layout is identical.

## States

- **Unselected** — `surfacePrimary` fill, `border` hairline-thin border; indicator is `surfacePrimary` with a `borderStrong` outline.
- **Selected** — `brand` border, `brandSubtle` fill; indicator fills `brand` with the dot/tick.
- **Pressed (unselected only)** — background flips to `surfaceSubtle` via `android_ripple` + the `pressed` style. A selected card does not show the pressed tint.
- **Disabled** — `opacity: 0.5`, press disabled.

## Rules

- **The card is the target.** Don't wrap a `SelectableCard` in another `Pressable` or add a nested button that competes for the tap. The 22pt indicator is decorative feedback, not the hit area.
- **Selected = `brand` border + `brandSubtle` fill** (Rule 1: border, no shadow) — the single selected-state green on the screen; keep the surrounding UI calm so it reads.
- **Match `variant` to intent.** `radio` signals "one of these"; `checkbox` signals "any of these". Roles follow (`accessibilityRole` is derived from `variant`).
- **Compose content with `Text`** (Rule 9) — a `subtitle`/`body` title plus a `caption`/`muted` description is the common shape; `content` already applies `gap: spacing[1]`.
- **Padding is `spacing[4]`, radius `lg`** — cards are roomy by design; stack them with the form's own gap, not extra margins.
- **You own single-select.** For a `radio` group, ensure only one card's `selected` is `true` at a time in your handler — the component won't do it for you.

## Props API

```ts
import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';

export type SelectableCardVariant = 'radio' | 'checkbox';

export interface SelectableCardProps extends Omit<ViewProps, 'children'> {
  selected: boolean;
  onPress: () => void;
  variant?: SelectableCardVariant;   // default 'radio'
  disabled?: boolean;
  children: ReactNode;               // the card content you compose
  // style, accessibility*, … from ViewProps
}
```

`SelectableCard` and the `SelectableCardVariant` type are named exports. Note it extends `ViewProps` (not `PressableProps`), so `style` targets the card container.

## Examples

### Single-select group (radio)
```tsx
import { useState } from 'react';
import { SelectableCard, Text, spacing } from '@minthr-saas/mobile-ui-kit';

const [plan, setPlan] = useState('team');

<View style={{ gap: spacing[3] }}>
  {plans.map((p) => (
    <SelectableCard key={p.id} selected={plan === p.id} onPress={() => setPlan(p.id)}>
      <Text variant="subtitle">{p.name}</Text>
      <Text variant="caption" tone="muted">{p.priceLabel}</Text>
    </SelectableCard>
  ))}
</View>
```

### Multi-select group (checkbox)
```tsx
const [perks, setPerks] = useState<string[]>([]);
const toggle = (id: string) =>
  setPerks((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

{allPerks.map((perk) => (
  <SelectableCard
    key={perk.id}
    variant="checkbox"
    selected={perks.includes(perk.id)}
    onPress={() => toggle(perk.id)}>
    <Text variant="body">{perk.name}</Text>
    <Text variant="caption" tone="muted">{perk.detail}</Text>
  </SelectableCard>
))}
```

### With a leading icon in the content
```tsx
import { Feather } from '@expo/vector-icons';
import { lightColors, spacing } from '@minthr-saas/mobile-ui-kit';

<SelectableCard selected={method === 'card'} onPress={() => setMethod('card')}>
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
    <Feather name="credit-card" size={20} color={lightColors.textSecondary} />
    <Text variant="body">Company card</Text>
  </View>
</SelectableCard>
```

### Disabled option
```tsx
<SelectableCard selected={false} disabled onPress={() => {}}>
  <Text variant="body">Enterprise (contact sales)</Text>
</SelectableCard>
```

## When NOT to use

- **Plain one-line options, no rich content** → [`RadioGroup`](./Radio.md) / [`Checkbox`](./Checkbox.md) — a card is overkill.
- **A long or searchable list** → [`Select`](./Select.md) / [`Combobox`](./Combobox.md) / [`MultiSelect`](./MultiSelect.md).
- **Switching a view/mode inline** → [`SegmentedControl`](./SegmentedControl.md).
- **A tappable content card that navigates** (not a selection) → a pressable [`Card`](../08-layout/Card.md) or `ListItem`.

## Accessibility

- The card is a `Pressable` with `accessibilityRole` derived from `variant` (`"radio"` or `"checkbox"`) and `accessibilityState={{ selected, disabled }}`.
- The accessible name comes from the composed `children` text; if the content is icon-only or ambiguous, pass an `accessibilityLabel` (available via `ViewProps`).
- Disabled cards report `disabled` in `accessibilityState` and ignore presses.
- Press feedback uses `android_ripple` + the `pressed` style (Rule 8) — no opacity flash. The card's generous size already clears the 44pt target (Rule 10).
