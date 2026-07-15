# Card

A hair-bordered surface that groups related content into one visual block — the base container of the kit.

## Purpose

`Card` is a plain `View` with a hairline border, `radius.lg` corners, a white surface, and a padding preset. It carries **no shadow** (Rule 1) — separation comes from `borders.hair` + `lightColors.border`, never elevation. It forwards `ViewProps`, so `style`, `accessibilityLabel`, `onLayout`, etc. all pass through.

On mobile, cards are the workhorse for dashboard tiles, detail panels, and grouped form sections stacked in a scroll view. Compose the header/title/description/footer subcomponents inside; for a full-width row list use [`ListItem`](./ListItem.md) + [`List`](./ListItem.md) instead of one card per row.

## Visual anatomy

```
┌──────────────────────────────────────┐  ← borders.hair, radius.lg
│  CardHeader                           │
│    CardTitle      (Text subtitle)     │
│    CardDescription(Text body/2ndary)  │
│  ····································· │  ← marginBottom spacing[3]
│  children (your content)              │
│  ┌─────────────────────────────────┐ │  ← CardFooter: top hairline
│  │            [Cancel]  [Save]      │ │    justify flex-end, gap 2
│  └─────────────────────────────────┘ │
└──────────────────────────────────────┘
   ↳ padding = none | sm | md | lg
```

## Padding

`padding` sets the inner inset on all edges:

- **`none`** — `0`. For edge-to-edge media or a nested `List`.
- **`sm`** — `spacing[3]` (12). Compact tiles.
- **`md`** — `spacing[4]` (16). **Default** — the house standard.
- **`lg`** — `spacing[6]` (24). Generous / hero cards.

## States

`Card` has no interactive state of its own — it is a static surface. To make a whole card tappable, wrap it in a `Pressable` (`onPress`) or reach for a pressable [`ListItem`](./ListItem.md). Do not add a pressed background to `Card` directly.

## Rules

- **No shadow** (Rule 1). The border is the separation. Never add `shadows.*` to a card.
- **Radius is `radius.lg`** on the outer surface; nested elements use an equal or smaller radius, never larger.
- **One border color** — `lightColors.border`. For a stronger edge, that is a different component decision, not a per-instance override.
- **`CardFooter` gets its own top hairline** and right-aligns actions with `gap: spacing[2]` — the standard Cancel/Save pairing.
- **Title casing is sentence case** (Rule 5). `CardTitle` renders `Text` `variant="subtitle"`; `CardDescription` renders `variant="body"` `tone="secondary"`.

## Props API

```ts
import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';

type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps extends ViewProps {
  children: ReactNode;
  padding?: CardPadding;      // default 'md'
  // style, accessibilityLabel, onLayout, … from ViewProps
}
```

### Sibling exports (same file)

```ts
interface CardHeaderProps extends ViewProps {   // gap spacing[1], marginBottom spacing[3]
  children: ReactNode;
}

interface CardTitleProps {                       // → <Text variant="subtitle">
  children: ReactNode;
}

interface CardDescriptionProps {                 // → <Text variant="body" tone="secondary">
  children: ReactNode;
}

interface CardFooterProps extends ViewProps {    // row, justify flex-end, gap spacing[2],
  children: ReactNode;                            //   top hairline, marginTop/paddingTop spacing[3]
}
```

`CardTitle` and `CardDescription` take **only** `children` (no `style`/`ViewProps`) — they are thin `Text` wrappers. `CardHeader` and `CardFooter` forward `ViewProps`.

## Examples

### Basic card
```tsx
import { Card, Text } from '@minthr-saas/mobile-ui-kit';

<Card>
  <Text>Your leave balance is 12 days.</Text>
</Card>
```

### Header + description + footer
```tsx
import {
  Card, CardHeader, CardTitle, CardDescription, CardFooter, Button, Text,
} from '@minthr-saas/mobile-ui-kit';

<Card padding="lg">
  <CardHeader>
    <CardTitle>Delete workspace</CardTitle>
    <CardDescription>This removes every survey and cannot be undone.</CardDescription>
  </CardHeader>
  <Text>Type the workspace name to confirm.</Text>
  <CardFooter>
    <Button label="Cancel" variant="ghost" onPress={onCancel} />
    <Button label="Delete" variant="danger" onPress={onDelete} />
  </CardFooter>
</Card>
```

### Padding preset for a compact tile
```tsx
import { Card, Text, spacing } from '@minthr-saas/mobile-ui-kit';

<Card padding="sm" style={{ gap: spacing[1] }}>
  <Text variant="caption" tone="muted">Open surveys</Text>
  <Text variant="title">18</Text>
</Card>
```

### Edge-to-edge list inside a card
```tsx
import { Card, List, ListItem } from '@minthr-saas/mobile-ui-kit';

<Card padding="none">
  <List>
    <ListItem title="Profile" onPress={openProfile} />
    <ListItem title="Notifications" onPress={openNotifications} />
  </List>
</Card>
```

## When NOT to use

- **A row list of settings / navigation** → [`List`](./ListItem.md) + [`ListItem`](./ListItem.md), optionally with `padding="none"` on a wrapping card.
- **Collapsible grouped sections** → [`Accordion`](./Accordion.md).
- **Content that floats above the screen** (dialog, sheet) → [`Modal`](../06-overlays/Modal.md) or [`BottomSheet`](../06-overlays/BottomSheet.md) — those get a shadow; cards never do.
- **A single hairline separator** → [`Divider`](./Divider.md).
- **An empty / zero-data placeholder** → [`EmptyState`](../04-display/EmptyState.md).

## Accessibility

- `Card` is a non-interactive `View`; it adds no role. Pass `accessibilityLabel` / `accessibilityRole` through `ViewProps` only if the card conveys a single semantic unit worth grouping for a screen reader.
- If you make the card tappable via a wrapping `Pressable`, set `accessibilityRole="button"` and a descriptive `accessibilityLabel` on the `Pressable`, not the card.
- Keep text tone contrast intact — `CardDescription` uses `tone="secondary"`; don't drop it to `muted` for body-level copy.
