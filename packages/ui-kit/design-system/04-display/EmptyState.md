# EmptyState

A centered placeholder — icon, title, optional description, optional action — for a screen or region that has no content yet.

## Purpose

`EmptyState` fills the void when a list, search, or screen has nothing to show. It stacks a soft icon bubble, a `title`, an optional `description`, and an optional `action` node (typically a [`Button`](../02-actions/Button.md)), all centered. It explains *why* it's empty and, when useful, offers the one thing to do about it. It extends `ViewProps`, so `style` and `accessibility*` forward to the root `View`.

For a loading placeholder (not an empty one) use [`Skeleton`](../05-feedback/Skeleton.md); for an error strip use [`Alert`](../05-feedback/Alert.md).

## Visual anatomy

```
              ╭─────╮
              │  ⌾  │        icon in a 48pt surfaceSubtle bubble
              ╰─────╯          (Feather, size 20, textMuted)
           No teammates yet    ◄── title  (Text variant="subtitle")
      Invite your first        ◄── description (body, secondary,
        colleague to begin.        centered, maxWidth 320)
            ┌──────────┐
            │  Invite  │       ◄── action (optional ReactNode, e.g. Button)
            └──────────┘
```

The container is `alignItems: 'center'` with generous vertical breathing room (`paddingVertical: spacing[10]`). Everything is centered; the description caps at `maxWidth: 320` so lines stay readable.

## Anatomy / slots

| Slot | Source | Notes |
|---|---|---|
| Icon bubble | `icon` (Feather name, default `'inbox'`) | 48×48 circle, `surfaceSubtle` fill; glyph is size 20 in `textMuted` |
| Title | `title` (required) | rendered as `Text` `variant="subtitle"` |
| Description | `description` (optional) | `Text` `variant="body"` `tone="secondary"`, centered |
| Action | `action` (optional `ReactNode`) | usually a single primary [`Button`](../02-actions/Button.md); has `marginTop: spacing[2]` |

There are no size or variant axes — EmptyState is one fixed, calm layout.

## Rules

- **Title is required; keep it short and human.** Sentence case (Rule 5): "No teammates yet", not "NO RESULTS". State the situation, don't apologize.
- **Description is one helpful sentence** — what this area will hold, or how to fill it. It centers and caps at 320pt; longer copy belongs elsewhere.
- **At most one action, and make it the obvious next step.** Pass a single `Button` (usually `variant="primary"`). For a truly dead-end empty state (e.g. "no results"), omit the action entirely.
- **The icon is a quiet hint, not decoration.** Default `inbox` suits an empty list; pick a Feather name that matches the void (`search` for no results, `users` for no people, `file-text` for no documents). It always renders in `textMuted` inside the neutral bubble — don't try to color it semantically.
- **No border, no shadow** (Rule 1) — the bubble is a `surfaceSubtle` fill, the whole block floats in the page background.
- **Center it in the available space.** EmptyState only centers its own content horizontally; give it a flex parent (or wrap in a centered `View`) so it sits mid-screen rather than at the top.

## Props API

```ts
import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';
import type { Feather } from '@expo/vector-icons';

export interface EmptyStateProps extends ViewProps {
  icon?: React.ComponentProps<typeof Feather>['name'];  // default 'inbox'
  title: string;                                        // required
  description?: string;
  action?: ReactNode;                                   // e.g. a <Button />
  // style, accessibilityLabel, testID, … from ViewProps
}
```

`icon` is a Feather icon **name string** (the component renders the `<Feather>` for you); `action` is a rendered node you pass in, unlike `icon`. No sibling type is exported.

## Examples

### List with no content and a primary action
```tsx
import { Button, EmptyState } from '@minthr-saas/mobile-ui-kit';
import { Feather } from '@expo/vector-icons';
import { lightColors } from '@minthr-saas/mobile-ui-kit';

<EmptyState
  icon="users"
  title="No teammates yet"
  description="Invite your first colleague to start building your team."
  action={
    <Button
      label="Invite teammate"
      variant="primary"
      leftIcon={<Feather name="plus" size={16} color={lightColors.onBrand} />}
      onPress={openInvite}
    />
  }
/>
```

### No search results (dead end, no action)
```tsx
<EmptyState
  icon="search"
  title="No results"
  description="Try a different keyword or clear your filters."
/>
```

### Default icon, title only
```tsx
<EmptyState title="You're all caught up" />
```

### Centered in the screen
```tsx
import { View } from 'react-native';

<View style={{ flex: 1, justifyContent: 'center' }}>
  <EmptyState
    icon="file-text"
    title="No documents"
    description="Uploaded files will appear here."
    action={<Button label="Upload" variant="secondary" onPress={onUpload} />}
  />
</View>
```

## When NOT to use

- **Content is loading, not absent** → [`Skeleton`](../05-feedback/Skeleton.md) placeholders.
- **Something went wrong** (network / permission error) → [`Alert`](../05-feedback/Alert.md) or [`Banner`](../05-feedback/Banner.md).
- **A brief transient notice** → a [`Toast`](../05-feedback/Toast.md).
- **A first-run marketing / onboarding splash** → a dedicated onboarding screen, not this quiet placeholder.

## Accessibility

- EmptyState is a `View`; the `title` and `description` are kit [`Text`](../01-typography/Text.md) nodes and are read in order by the screen reader.
- The `action` you pass carries its own semantics — a [`Button`](../02-actions/Button.md) already announces as a button with its label, and satisfies the 44pt tap target — so you don't add accessibility props to EmptyState for it.
- The icon is decorative and conveys nothing on its own, which is correct since the `title` states the situation in words. If you want the block read as one unit, set `accessibilityLabel` on the container summarizing the title + description.
