# SwipeableRow

A list row that reveals action buttons when swiped horizontally — the mobile replacement for web row-hover actions.

## Purpose

`SwipeableRow` wraps any row content in a `Swipeable` from `react-native-gesture-handler`. Swiping uncovers a strip of action buttons on the leading (`leftActions`) or trailing (`rightActions`) edge. Each action is a colored `Pressable` with an optional `Feather` icon and label; firing it runs the callback and auto-closes the row. There is no real web equivalent — on the web you'd hover a row to show actions, but touch has no hover, so the swipe gesture takes its place.

Use it around a [`ListItem`](./ListItem.md) for the classic "swipe to delete / archive" pattern. It requires a `GestureHandlerRootView` ancestor (wired once at the app root).

## Visual anatomy

```
swipe →                        ┌──────── row content ────────┐
                               │  [leading] Title      ›      │
                               └──────────────────────────────┘

after left swipe:  reveals leftActions       after right swipe: reveals rightActions
┌────────┐┌──────── row … ────┐              ┌──── row … ────┐┌────────┐
│ archive││                   │              │               ││ delete │
└────────┘└───────────────────┘              └───────────────┘└────────┘
   each action: width = actionWidth (72), icon size 18 + optional caption label
```

## Action colors

`SwipeAction.color` maps to a background + a readable foreground:

| `color` | Background | Foreground |
|---|---|---|
| `default` | `lightColors.surfaceSubtle` | `lightColors.textPrimary` |
| `brand` | `lightColors.brand` | `lightColors.onBrand` |
| `success` | `lightColors.success` | `lightColors.onBrand` |
| `danger` | `lightColors.danger` | `lightColors.onBrand` |
| `warning` | `lightColors.warning` | `lightColors.onBrand` |

Default when `color` is omitted is `default`.

## Behavior / states

- **Reveal** — swipe leading edge shows `leftActions`; swipe trailing edge shows `rightActions`. A side with no actions is not swipeable.
- **Fire** — tapping an action calls its `onPress` and then closes the row (`swipeRef.current?.close()`).
- **Close** — `onClose` fires after the row settles closed (via `Swipeable`'s `onSwipeableClose`).
- **Pressed** — an action dims to `opacity: 0.85` while held, plus an Android ripple (`surfacePrimary`).
- **Tuning** — `friction={2}`, `overshootLeft={false}`, `overshootRight={false}` give a controlled, non-bouncy drag.

## Rules

- **`left`/`right` are gesture-handler's physical edges.** This component reveals via `Swipeable`'s `renderLeftActions` / `renderRightActions` and does **not** apply the `rtlSign()` transform itself — direction handling is delegated to gesture-handler. (Contrast with animated panels elsewhere in the kit that multiply `translateX` by `rtlSign()`.)
- **Give every action an accessible name.** The action's `accessibilityLabel` falls back to `label ?? icon`; supply a `label`, or an `icon` name that reads sensibly, so icon-only actions are still announced.
- **Keep actions few and reversible-ish.** One or two per side. Put the destructive one (`danger`) on the trailing edge; never hide the *only* way to do something behind a swipe.
- **Colors are semantic tokens** (Rule 3) — pick a `SwipeActionColor`, don't pass a hex. Labels are sentence case (Rule 5) at `fontWeight: '500'`.
- **Mount `GestureHandlerRootView`** at the app root, or the swipe gesture silently won't register.

## Props API

```ts
import type { ComponentProps, ReactNode } from 'react';
import type { Feather } from '@expo/vector-icons';

type SwipeActionColor = 'default' | 'brand' | 'success' | 'danger' | 'warning';

interface SwipeAction {
  label?: string;
  icon?: ComponentProps<typeof Feather>['name']; // any Feather glyph name
  color?: SwipeActionColor;                        // default 'default'
  onPress: () => void;                             // required
}

interface SwipeableRowProps {
  children: ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  actionWidth?: number;   // px width per action button — default 72
  onClose?: () => void;   // fires after the row closes itself
}
```

`SwipeableRow` does not extend `ViewProps`/`PressableProps` — the five props above are the whole surface. There are no sibling exports.

## Examples

### Swipe-to-delete a list row
```tsx
import { SwipeableRow, ListItem } from '@minthr-saas/mobile-ui-kit';

<SwipeableRow rightActions={[{ icon: 'trash-2', label: 'Delete', color: 'danger', onPress: () => remove(item.id) }]}>
  <ListItem title={item.name} subtitle={item.email} onPress={() => open(item.id)} />
</SwipeableRow>
```

### Actions on both edges
```tsx
<SwipeableRow
  leftActions={[{ icon: 'archive', label: 'Archive', color: 'brand', onPress: () => archive(id) }]}
  rightActions={[
    { icon: 'bell-off', color: 'default', onPress: () => mute(id) },
    { icon: 'trash-2', color: 'danger', onPress: () => remove(id) },
  ]}
  onClose={() => setActiveId(null)}>
  <ListItem title="Weekly digest" subtitle="Every Monday, 9am" />
</SwipeableRow>
```

### Wider action buttons with labels
```tsx
<SwipeableRow
  actionWidth={88}
  rightActions={[{ icon: 'check', label: 'Approve', color: 'success', onPress: () => approve(id) }]}>
  <ListItem title="Leave request — Sara" subtitle="12–14 Aug" />
</SwipeableRow>
```

## When NOT to use

- **A single, always-visible action per row** → put a control in the `ListItem` `trailing` slot (e.g. a `Switch`, an [`IconButton`](../02-actions/IconButton.md)).
- **A menu of many actions** → open a [`Menu`](../06-overlays/Menu.md) or [`BottomSheet`](../06-overlays/BottomSheet.md) from a trailing button.
- **The primary action of a screen** → a [`Button`](../02-actions/Button.md) or [`FAB`](../02-actions/FAB.md); don't bury it behind a gesture.
- **Non-row content** (cards, tiles) → swipe affordances read as list rows; keep them there.

## Accessibility

- Each action is a `Pressable` with `accessibilityRole="button"` and `accessibilityLabel = label ?? icon`. Always ensure that fallback is meaningful for icon-only actions.
- Swipe gestures are not discoverable by screen-reader users — provide an equivalent non-gesture path to every swipe action (e.g. the row's `onPress` opens a detail with the same actions), so the swipe is an accelerator, never the only route.
- The row auto-closes after an action fires, returning focus to the row content.
