# Divider

A hairline rule that separates content — horizontal, vertical, or a labelled section break.

## Purpose

`Divider` draws a single `borders.hair`-thick line in `lightColors.border`. It has three modes: a full-width **horizontal** rule, a stretch-height **vertical** rule (for splitting a row), and a **labelled** horizontal rule (a centered caption flanked by two lines). It is a pure presentational `View` with `accessibilityRole="none"` — it is never focusable and carries no interaction.

On mobile the divider is the lightest possible grouping cue: use it to break a scroll of unrelated blocks, or to split two inline stats. When you find yourself dividing many rows, reach for [`List`](./ListItem.md) (which inserts row separators for you) instead of hand-placing dividers.

## Visual anatomy

```
horizontal          ───────────────────────────   height = borders.hair

vertical            │   splits a flex row          width = borders.hair
                    │                               alignSelf: stretch

labelled            ───────  or  ───────           two flex lines + caption
```

## Orientation

- **`horizontal`** — `height: borders.hair`, `width: 100%`, spaced with `marginVertical`. **Default.**
- **`vertical`** — `width: borders.hair`, `alignSelf: 'stretch'`, spaced with `marginHorizontal`. Put it inside a `flexDirection: 'row'` container so `stretch` gives it height.

## Spacing

The `spacing` prop adds symmetric margin around the line (vertical margin when horizontal, horizontal margin when vertical):

| Value | px | Applied as |
|---|---|---|
| `none` | 0 | **Default** — flush |
| `sm` | 8 | `spacing[2]` equivalent |
| `md` | 16 | `spacing[4]` equivalent |
| `lg` | 24 | `spacing[6]` equivalent |

> These come from an internal `spacingMap` of raw px (`8 / 16 / 24`) that mirrors the 4px scale.

## Rules

- **Hairline only.** The line is always `borders.hair` in `lightColors.border` — never `thin`/`thick`, never a color override (Rule 3). If you need a heavier separation, that is a `Card` boundary, not a divider.
- **`label` requires `horizontal`.** The label branch is only reached in horizontal mode; a `vertical` divider ignores `label`. The label renders as `Text` `variant="caption"` `tone="muted"`, sentence case (Rule 5).
- **Vertical needs a row + height.** `alignSelf: 'stretch'` only produces height inside a `flexDirection: 'row'` parent with real height.
- **Don't stack dividers with card borders.** A `Card` already has a hairline edge; a divider flush against it doubles the line.
- **Many rows → use `List`.** `List` auto-inserts inset separators between `ListItem`s; don't hand-place dividers between rows.

## Props API

```ts
type DividerOrientation = 'horizontal' | 'vertical';
type DividerSpacing = 'none' | 'sm' | 'md' | 'lg';

interface DividerProps {
  orientation?: DividerOrientation;   // default 'horizontal'
  label?: string;                     // horizontal only; renders a centered caption
  spacing?: DividerSpacing;           // default 'none'
}
```

`Divider` does **not** extend `ViewProps` — there is no `style` passthrough. Its three props are the whole surface. There are no sibling exports.

## Examples

### Plain separator between blocks
```tsx
import { Divider } from '@minthr-saas/mobile-ui-kit';

<Divider spacing="md" />
```

### Labelled section break ("or")
```tsx
import { Divider, Button } from '@minthr-saas/mobile-ui-kit';

<Button label="Continue with email" variant="secondary" fullWidth onPress={onEmail} />
<Divider label="or" spacing="md" />
<Button label="Continue with SSO" variant="secondary" fullWidth onPress={onSso} />
```

### Vertical split inside a stat row
```tsx
import { View } from 'react-native';
import { Divider, Text, spacing } from '@minthr-saas/mobile-ui-kit';

<View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
  <Text variant="title">12</Text>
  <Divider orientation="vertical" />
  <Text variant="title">4</Text>
</View>
```

### Flush divider (no margin)
```tsx
<Divider />
```

## When NOT to use

- **Separating rows in a list** → [`List`](./ListItem.md) inserts inset hairlines automatically.
- **Grouping content into a bordered block** → [`Card`](./Card.md).
- **Collapsible section boundaries** → [`Accordion`](./Accordion.md) draws its own item hairlines.
- **A labelled group of form fields** → a section header via [`ListSection`](./ListItem.md) or a `FormField` group, not a labelled divider.

## Accessibility

- `Divider` sets `accessibilityRole="none"` so it is skipped by assistive tech — a rule is decorative and must not steal focus or be announced.
- The `label` text is still readable if a user navigates to it, but it is not a heading; use a real section header (e.g. [`ListSection`](./ListItem.md) `title`) when the label is meant to name the following content semantically.
