# IconButton

An icon-only pressable. For compact actions where a text label would cost too much space — header actions, row actions, toolbar controls, close buttons.

## Purpose

Renders a single `Feather` glyph inside a square, tappable box. It **requires** an `accessibilityLabel` (there's no visible text to announce), so it can never ship inaccessible. Same variant vocabulary as [`Button`](./Button.md).

## Visual anatomy

```
┌──────┐
│  ⌵  │   square box (size), centered Feather glyph
└──────┘
```

## Variants

- **`primary`** — brand fill, white glyph.
- **`secondary`** — white surface, hairline border, primary-text glyph. **Default.**
- **`ghost`** — transparent, primary-text glyph. The usual choice for header/toolbar/row actions.
- **`danger`** — danger fill, white glyph. Destructive.

## Sizes

Box and glyph scale together:

- **`sm`** — 28pt box, 14 glyph.
- **`md`** — 36pt box, 16 glyph. **Default.**
- **`lg`** — 44pt box, 18 glyph.

## Rules

- **`accessibilityLabel` is required and describes the action, not the glyph** — "Close", not "x icon". This is enforced by the type.
- **`icon` is a Feather name** (`ComponentProps<typeof Feather>['name']`), typed — you get autocomplete and a compile error on typos.
- **Tap target ≥44pt.** `sm` (28) and `md` (36) are smaller than 44 — add `hitSlop` when they stand alone so the hittable area still reaches 44pt.
- **`ghost` for actions inside chrome** (headers, list rows) so the box disappears until pressed; reserve fills for standout actions.
- **Directional glyphs** (next/back) come from `forwardChevron()` / `backChevron()`, not hardcoded (Rule 2 / icons doc).
- **No shadow** (Rule 1); `secondary` uses a hairline border.
- Pressed state darkens the fill (`brandHover`) or tints the ghost/secondary with `surfaceSubtle`; Android adds a ripple.

## Props API

```ts
import type { PressableProps } from 'react-native';
import type { Feather } from '@expo/vector-icons';

type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  icon: React.ComponentProps<typeof Feather>['name'];
  /** Required — describes the action, not the icon. */
  accessibilityLabel: string;
  variant?: IconButtonVariant; // default 'secondary'
  size?: IconButtonSize;       // default 'md'
  // onPress, disabled, hitSlop, … from PressableProps
}
```

## Examples

### Header close
```tsx
import { IconButton } from '@minthr-saas/mobile-ui-kit';

<IconButton icon="x" accessibilityLabel="Close" variant="ghost" onPress={onClose} />
```

### Row action
```tsx
<IconButton icon="trash-2" accessibilityLabel="Delete" variant="ghost" size="sm" hitSlop={10} onPress={onDelete} />
```

### Primary compose action
```tsx
<IconButton icon="edit-2" accessibilityLabel="Edit profile" variant="primary" onPress={onEdit} />
```

### Directional (RTL-safe)
```tsx
import { forwardChevron } from '@minthr-saas/mobile-ui-kit';

<IconButton icon={forwardChevron()} accessibilityLabel="Next" variant="ghost" onPress={next} />
```

## When NOT to use

- **The action needs a label to be understood** → [`Button`](./Button.md) with `leftIcon`.
- **A screen's main create action** → [`FAB`](./FAB.md).
- **Toggling a boolean setting** → [`Switch`](../03-forms/Switch.md).

## Accessibility

- `accessibilityLabel` is mandatory and `accessibilityRole="button"` is set. Add `accessibilityHint` for non-obvious outcomes.
- Always confirm the effective tap target is ≥44pt (use `hitSlop` for `sm`/`md`).
