# ListItem

The mobile-staple row primitive: a leading slot, title + optional subtitle, a trailing slot, and an auto chevron when it navigates.

## Purpose

`ListItem` is the backbone of settings screens, detail views, and pickers — the mobile equivalent of a table row. It lays out a **leading** slot (icon, `Avatar`, `Checkbox`), a **title** (+ optional **subtitle**), and a **trailing** slot (`Badge`, `Switch`, secondary text). When it has an `onPress` and no trailing slot, it auto-shows a forward chevron so it reads as "drill in". It forwards `PressableProps` (minus `style`/`children`).

Compose rows into a [`List`](#sibling-exports) to get inset hairline separators between them, and group lists under a [`ListSection`](#sibling-exports) for a header caption and footer note. Rows have a 44pt+ tap target by construction (`minHeight: 56`).

## Visual anatomy

```
┌───────────────────────────────────────────────┐
│ [leading]  Title text                 [trailing] ›│  ← minHeight 56
│            Subtitle text (up to 2 lines)         │
└───────────────────────────────────────────────┘
   padH spacing[4] · padV spacing[3] · gap spacing[3]
   chevron: Feather forwardChevron() (RTL-aware), size 18, textMuted
```

`leading` and `trailing` are `flexShrink: 0`; the text column takes the remaining width (`flex: 1`). Title is 1 line, subtitle up to 2, both truncate.

## Variants / states

- **Static row** — no `onPress`: renders a `View`, no chevron, no press feedback.
- **Pressable row** — with `onPress`: renders a `Pressable` with `accessibilityRole="button"`, an Android ripple (`surfaceSubtle`), and a `surfaceSubtle` pressed background.
- **Chevron** — auto-shown when pressable **and** there is no `trailing` slot. Force it on/off with `showChevron`.
- **Destructive** — `destructive` renders the title in `tone="danger"` (e.g. "Delete account", "Sign out").
- **Disabled** — `disabled` dims the row to `opacity: 0.5` and blocks the press.

## Rules

- **No shadow** (Rule 1). Rows sit on `lightColors.surfacePrimary`; separation is a hairline via `List`, not elevation.
- **The chevron is RTL-aware.** It uses `forwardChevron()` from `utils/rtl` (`chevron-right` in LTR, `chevron-left` in RTL) and `color: lightColors.textMuted`, nudged with `marginStart: -spacing[1]`.
- **Trailing slot vs chevron are exclusive by default.** A `trailing` slot suppresses the auto chevron; set `showChevron` explicitly if you truly want both.
- **Title is one line, subtitle two** — keep titles short (sentence case, Rule 5). Long values belong in the subtitle or trailing text.
- **Row geometry is fixed to the spec:** `minHeight: 56`, `paddingHorizontal: spacing[4]`, `paddingVertical: spacing[3]`, `gap: spacing[3]` — a ≥44pt tap target (Rule 10).
- **Use logical insets.** The separator and chevron use `marginStart` so they flip correctly in RTL (Rule 2).

## Props API

```ts
import type { ReactNode } from 'react';
import type { PressableProps, ViewProps } from 'react-native';

interface ListItemProps extends Omit<PressableProps, 'style' | 'children'> {
  title: string;
  subtitle?: string;
  leading?: ReactNode;   // icon, Avatar, Checkbox, …
  trailing?: ReactNode;  // Badge, Switch, secondary text, …
  showChevron?: boolean; // default: onPress set && no trailing slot
  destructive?: boolean; // title in danger tone
  // onPress, disabled, accessibilityLabel, hitSlop, … from PressableProps
}
```

### Sibling exports

```ts
interface ListProps extends ViewProps {
  bordered?: boolean;   // wrap in a hair-bordered, radius.lg surface — default false
  children: ReactNode;  // ListItem elements; hairline separators inserted between them
}

interface ListSectionProps extends ViewProps {
  title?: string;       // heading above the list — Text caption, tone muted
  caption?: string;     // footer note below the list — Text caption, tone muted
  children: ReactNode;
}
```

`List` inserts a `borders.hair` separator (inset with `marginStart: spacing[4]`) between each child. `bordered` adds the card-like outline with `overflow: 'hidden'`. `ListSection` stacks a title, the list, and a caption with `gap: spacing[2]`.

## Examples

### Navigation rows inside a bordered list
```tsx
import { List, ListItem } from '@minthr-saas/mobile-ui-kit';
import { Feather } from '@expo/vector-icons';
import { lightColors } from '@minthr-saas/mobile-ui-kit';

<List bordered>
  <ListItem
    title="Profile"
    leading={<Feather name="user" size={20} color={lightColors.textSecondary} />}
    onPress={() => router.push('/profile')}
  />
  <ListItem
    title="Notifications"
    subtitle="Push, email and in-app"
    leading={<Feather name="bell" size={20} color={lightColors.textSecondary} />}
    onPress={() => router.push('/notifications')}
  />
</List>
```

### Trailing control (Switch suppresses the chevron)
```tsx
import { useState } from 'react';
import { List, ListItem, Switch } from '@minthr-saas/mobile-ui-kit';

function AlertsRow() {
  const [on, setOn] = useState(true);
  return (
    <List>
      <ListItem
        title="Email alerts"
        trailing={<Switch value={on} onValueChange={setOn} />}
      />
    </List>
  );
}
```

### Sectioned settings with a destructive row
```tsx
import { ListSection, List, ListItem } from '@minthr-saas/mobile-ui-kit';

<ListSection title="Account" caption="Signing out keeps your data on this device.">
  <List bordered>
    <ListItem title="Change password" onPress={onChangePassword} />
    <ListItem title="Sign out" destructive onPress={onSignOut} />
  </List>
</ListSection>
```

### Trailing text value
```tsx
import { List, ListItem, Text } from '@minthr-saas/mobile-ui-kit';

<List bordered>
  <ListItem title="Plan" trailing={<Text tone="secondary">Business</Text>} />
  <ListItem title="Seats" trailing={<Text tone="secondary">24 / 30</Text>} />
</List>
```

## When NOT to use

- **A free-form content block, not a row** → [`Card`](./Card.md).
- **Collapsible grouped detail** → [`Accordion`](./Accordion.md).
- **Swipe-to-reveal actions on a row** → wrap the `ListItem` in [`SwipeableRow`](./SwipeableRow.md).
- **A primary "does something" action** → [`Button`](../02-actions/Button.md); rows navigate, buttons act.
- **A long, virtualized data set** → render `ListItem`s inside a `FlatList` (use [`KitRefreshControl`](./PullToRefresh.md) for pull-to-refresh) rather than a plain `List`.

## Accessibility

- A pressable row is a `Pressable` with `accessibilityRole="button"`; the visible `title` is the accessible name. Add `accessibilityLabel` when the title needs more context, and `accessibilityHint` for the destination.
- `disabled` propagates to `accessibilityState` and blocks the press.
- Static (non-pressable) rows render a plain `View` with no button role — correct, since they do nothing.
- The row's `minHeight: 56` guarantees the 44pt minimum tap target (Rule 10); add `hitSlop` only for unusually dense custom layouts.
