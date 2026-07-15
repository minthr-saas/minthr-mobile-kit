# FAB — Floating Action Button

A primary action that floats above the screen content, anchored to a bottom corner. The mobile-idiomatic way to expose the single most important create/compose action on a list or dashboard screen.

## Purpose

An absolutely-positioned, brand-filled circular (or pill) button that sits over scrollable content, above the safe-area inset. It is the **one** documented exception to the no-shadow rule (Rule 1) — it genuinely floats, so it carries `shadows.md`.

## Visual anatomy

```
┌───────────────────────────────┐
│                               │
│  (scrollable content)         │
│                               │
│                        ╭────╮ │
│                        │ ＋ │ │  ← regular: 56pt circle, bottom-end
│                        ╰────╯ │
└───────────────────────────────┘
        safe-area inset + spacing[5] from the bottom
```

## Variants

- **`regular`** — 56pt circle, 20 glyph. **Default.** The standard FAB.
- **`mini`** — 40pt circle, 18 glyph. Secondary/compact contexts.
- **`extended`** — 48pt pill with icon **and** `label`. Use when the action benefits from a word ("New", "Compose").

## Position

- **`bottom-end`** — trailing corner. **Default** (RTL-correct via the logical `end` inset).
- **`bottom-start`** — leading corner.
- **`bottom-center`** — centered along the bottom.

## Rules

- **One FAB per screen.** It represents the single primary action. If you need several, you probably want a `Menu` or `BottomSheet` from one FAB.
- **`accessibilityLabel` is required for icon-only variants** (`regular` / `mini`). For `extended`, the `label` doubles as the accessible name, but pass `accessibilityLabel` if the label alone is ambiguous.
- **`label` is required for `extended`** and ignored otherwise.
- **Sits above the safe area.** By default it offsets `insets.bottom + spacing[5]`. Override with `offsetBottom` when a `BottomTabBar` or `SelectionBar` occupies the bottom — push the FAB above it so they don't overlap.
- **The wrapper is `pointerEvents="box-none"`** so only the button intercepts touches; the content behind stays scrollable/tappable. Place `<FAB>` as the **last child** of the screen container (a sibling of the `ScrollView`), not inside it.
- **Brand fill, white glyph, `shadows.md`.** Pressed darkens to `brandHover` (+ Android ripple); disabled is `opacity: 0.5`.

## Props API

```ts
import type { Feather } from '@expo/vector-icons';

type FABVariant = 'regular' | 'mini' | 'extended';
type FABPosition = 'bottom-end' | 'bottom-start' | 'bottom-center';

interface FABProps {
  icon: React.ComponentProps<typeof Feather>['name'];
  onPress: () => void;
  label?: string;              // required when variant='extended'
  variant?: FABVariant;        // default 'regular'
  position?: FABPosition;      // default 'bottom-end'
  accessibilityLabel?: string; // required for icon-only variants
  disabled?: boolean;
  offsetBottom?: number;       // override the default safe-area bottom offset
}
```

## Examples

### Standard create FAB
```tsx
import { FAB } from '@minthr-saas/mobile-ui-kit';

<View style={{ flex: 1 }}>
  <ScrollView>{/* list */}</ScrollView>
  <FAB icon="plus" accessibilityLabel="New request" onPress={openCreate} />
</View>
```

### Extended
```tsx
<FAB variant="extended" icon="plus" label="New" onPress={openCreate} />
```

### Above a bottom tab bar
```tsx
<FAB icon="edit-2" accessibilityLabel="Compose" offsetBottom={tabBarHeight + spacing[4]} onPress={compose} />
```

## When NOT to use

- **Inline actions in a form or toolbar** → [`Button`](./Button.md) / [`IconButton`](./IconButton.md).
- **More than one primary action** → a `Menu`/`BottomSheet` of actions from a single trigger.
- **On a detail/settings screen with a footer** → a `fullWidth` `Button` in the footer reads better than a floating one.

## Accessibility

- `accessibilityRole="button"`, `accessibilityState={{ disabled }}`, and `accessibilityLabel` (or `label`) are wired.
- The 56/48/40pt sizes all meet or exceed the 44pt target.
- Ensure the FAB never covers content a user must reach — offset it above bottom chrome.
