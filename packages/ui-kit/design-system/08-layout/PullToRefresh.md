# PullToRefresh

A `ScrollView` wired with a kit-tinted `RefreshControl` for the pull-down-to-refresh gesture.

## Purpose

`PullToRefresh` is a thin wrapper over `ScrollView` that pre-mounts a brand-tinted `RefreshControl`. Pull the content down past the top and the spinner appears; release to fire `onRefresh`. You own the `refreshing` boolean — flip it true when the reload starts and false when it finishes. It forwards the rest of `ScrollViewProps` (minus `refreshControl`, which it controls).

For virtualized lists you don't want to render inside a `ScrollView`, the same styling ships as [`KitRefreshControl`](#sibling-export--kitrefreshcontrol) — pass it to a `FlatList`/`SectionList`'s `refreshControl` prop directly.

## Visual anatomy

```
        ↓ pull down
   ╭───────────╮
   │    ◌      │   ← RefreshControl spinner, tint = lightColors.brand (default)
   ╰───────────╯      progressBackgroundColor = surfacePrimary (Android puck)
   ┌───────────────┐
   │  children     │   ← ScrollView content
   │      …        │
   └───────────────┘
```

## Behavior / states

- **Idle** — normal scroll; no spinner.
- **Pulling** — the spinner tracks the drag once the user overscrolls the top.
- **Refreshing** — while `refreshing` is `true`, the spinner stays visible. Set it `false` in a `finally` so it always clears.
- **Tint** — spinner/progress color defaults to `lightColors.brand`; override with `tint` (a color value) for a contextual accent.

## Rules

- **`refreshing` is controlled by you.** The component never manages it — wire it to your own state around the async reload.
- **`onRefresh` is the RN gesture callback name** (Rule: `onRefresh`, never `onClick`/`onRefreshing`). Keep the handler idempotent; the gesture can fire again while a reload is in flight.
- **Tint is the only color knob**, and it defaults to the semantic `lightColors.brand` (Rule 3). The Android progress puck sits on `lightColors.surfacePrimary`.
- **Don't nest scroll containers.** Put `PullToRefresh` at the scroll root of the screen; don't wrap a `FlatList` in it — use `KitRefreshControl` on the list instead.
- **Long / virtualized data → `FlatList` + `KitRefreshControl`.** A `ScrollView` renders all children eagerly; reserve `PullToRefresh` for bounded content.

## Props API

```ts
import type { RefreshControlProps, ScrollViewProps } from 'react-native';

interface PullToRefreshProps extends Omit<ScrollViewProps, 'refreshControl'> {
  refreshing: boolean;      // required — you own this state
  onRefresh: () => void;    // required — fired on pull-release
  tint?: string;            // spinner/progress color — default lightColors.brand
  // children, contentContainerStyle, showsVerticalScrollIndicator, … from ScrollViewProps
}
```

### Sibling export — `KitRefreshControl`

Pre-styled `RefreshControl` for `FlatList`/`SectionList`/`ScrollView` consumers.

```ts
interface KitRefreshControlProps
  extends Omit<RefreshControlProps, 'tintColor' | 'colors' | 'progressBackgroundColor'> {
  tint?: string;            // default lightColors.brand
  // refreshing, onRefresh, progressViewOffset, … from RefreshControlProps
}
```

`KitRefreshControl` locks `tintColor` / `colors` / `progressBackgroundColor` to the kit's values (so they can't be overridden with an off-token color) and exposes only `tint`. `refreshing` and `onRefresh` come from `RefreshControlProps` and are required by RN.

## Examples

### Standard pull-to-refresh screen
```tsx
import { useState, useCallback } from 'react';
import { PullToRefresh, Card, Text, spacing } from '@minthr-saas/mobile-ui-kit';

function Feed() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await reload();
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <PullToRefresh
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={{ padding: spacing[4], gap: spacing[4] }}>
      <Card><Text>Latest updates…</Text></Card>
    </PullToRefresh>
  );
}
```

### Contextual tint
```tsx
import { PullToRefresh, lightColors } from '@minthr-saas/mobile-ui-kit';

<PullToRefresh refreshing={refreshing} onRefresh={onRefresh} tint={lightColors.textMuted}>
  {content}
</PullToRefresh>
```

### FlatList with KitRefreshControl
```tsx
import { FlatList } from 'react-native';
import { KitRefreshControl, ListItem } from '@minthr-saas/mobile-ui-kit';

<FlatList
  data={people}
  keyExtractor={(p) => p.id}
  renderItem={({ item }) => <ListItem title={item.name} subtitle={item.role} onPress={() => open(item.id)} />}
  refreshControl={<KitRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
/>
```

## When NOT to use

- **A long or infinite list** → `FlatList`/`SectionList` + [`KitRefreshControl`](#sibling-export--kitrefreshcontrol), for virtualization.
- **Explicit, button-driven reload** → a [`Button`](../02-actions/Button.md) or [`IconButton`](../02-actions/IconButton.md) with a refresh icon; pull-to-refresh is an accelerator, not the only path.
- **Background / automatic polling** → refresh on an interval or focus; don't require a gesture.
- **A fixed, non-scrolling screen** → there's nothing to pull; skip it.

## Accessibility

- Pull-to-refresh is a gesture with no built-in screen-reader affordance — always provide an alternative reload path (e.g. an `IconButton` in the [`PageHeader`](../07-navigation/PageHeader.md)) so refresh isn't gesture-only.
- The underlying `RefreshControl` announces its busy state on iOS; keep `refreshing` accurate so assistive tech reflects the real loading state.
- Forwarded `ScrollViewProps` let you set `accessibilityLabel` and keyboard/scroll behavior on the scroll region as needed.
