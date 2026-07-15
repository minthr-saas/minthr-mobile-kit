# BottomTabBar

The app's persistent bottom navigation: a row of icon + label tabs with an active tint, badges, and an optional FAB-style center action.

## Purpose

`BottomTabBar` is the primary chrome for moving between the top-level areas of the app. It renders a fixed row of tabs (icon, optional label, active tint), respects the device's bottom safe-area inset, and sits on `lightColors.surfacePrimary` with a hairline top border. It's controlled: you own the `active` key and update it in `onChange`.

This **replaces the web kit's sidebar / nav-rail** — mobile top-level navigation belongs at the thumb-reachable bottom, not the side. Use it either standalone with local state, or as a custom `tabBar` for `@react-navigation/bottom-tabs`.

## Visual anatomy

```
┌───────────────────────────────────────────────────────┐  ← borders.hair top border, surfacePrimary
│                            ●3                    ·      │  ← numeric badge / dot badge
│   [home]     [users]     (( + ))    [msg]      [help]   │  ← 'primary' item = brand circle (FAB-style)
│    Home       Team                   Inbox      Help    │  ← labels (hidden when variant="compact")
└───────────────────────────────────────────────────────┘
        ↑ active tab: brand tint + '500' label   ↑ paddingBottom = safe-area inset
```

Row height `56` (default) / `56 + spacing[2]` (compact). Icons `22` (regular) / `24` (primary). The primary circle is `52×52`, fully rounded via a computed `borderRadius: 26` (half its size, not the `radius.full` token), `lightColors.brand`.

## Variants / Sizes / States

- **`variant="default"`** — icon **and** `caption` label stacked. **Default.**
- **`variant="compact"`** — icon only (labels hidden); the row is slightly taller for balance.
- **Item `kind`:**
  - `'default'` — icon (+ label) tinted `lightColors.brand` when active, `lightColors.textSecondary` otherwise; active label goes to `fontWeight.medium`.
  - `'primary'` — a brand-filled circular action (FAB-style, `onBrand` icon) rendered in place of the icon. Typically the center "add" affordance in a 5-tab layout.
- **Badges** (`item.badge`): `number > 0` → red count pill (`lightColors.danger`, `>99` shows `"99+"`); `true` → a red dot; `undefined`/`false`/`0` → nothing. Primary-item badges are larger and ringed with a `surfacePrimary` border.
- **Disabled** (`item.disabled`) — dims to `opacity: 0.4`, ignores taps (`onChange` is not called).
- **Pressed** — non-primary tabs fill `surfaceSubtle`; both kinds use `android_ripple` (borderless; brand-strong ripple for primary).

## Rules

- **It's chrome, not a floating element — no shadow** (Rule 1). Separation from content is the `borders.hair` **top** border only.
- **Icons are Feather names** (`ComponentProps<typeof Feather>['name']`) — `'home'`, `'users'`, `'message-square'`, etc. Tint is applied by the component; don't color icons yourself.
- **Labels are one word, sentence case** ("Home", "Inbox", "Time off"). They're `fontSize.xs`; keep them short so they don't truncate.
- **Safe area is handled internally** via `useSafeAreaInsets()` → `paddingBottom: insets.bottom`. Mount it at the root of the screen tree (outside scroll views) so it stays pinned; it does not need its own `SafeAreaView`.
- **3–5 items.** For 5, put a single `kind: 'primary'` action in the center; more than 5 crowds the row.
- **One active key at a time** — `active` is a single value from your key union.

## Props API

```ts
import type { ComponentProps } from 'react';
import type { Feather } from '@expo/vector-icons';

type BottomTabBarVariant = 'default' | 'compact';
type BottomTabBarItemKind = 'default' | 'primary';

interface BottomTabBarItem<T extends string = string> {
  key: T;
  label: string;
  icon: ComponentProps<typeof Feather>['name'];
  /** number renders a count badge; true renders a dot; undefined renders nothing. */
  badge?: number | boolean;
  disabled?: boolean;
  /** 'primary' renders a brand-filled circular action (FAB-style). Defaults to 'default'. */
  kind?: BottomTabBarItemKind;
}

interface BottomTabBarProps<T extends string = string> {
  items: readonly BottomTabBarItem<T>[];
  active: T;
  onChange: (key: T) => void;
  variant?: BottomTabBarVariant;   // default 'default'
}
```

Generic over the key union `T`, so `active`/`onChange`/`items[].key` stay type-safe. Note `BottomTabBarProps` does **not** extend `ViewProps` — only the four props above are accepted. Sibling exports: `BottomTabBarItem`, `BottomTabBarVariant`, `BottomTabBarItemKind`, and `BottomTabBarItemView` (the per-item renderer, exported for advanced composition).

## Examples

### Standalone with local state
```tsx
import { useState } from 'react';
import { BottomTabBar, type BottomTabBarItem } from '@minthr-saas/mobile-ui-kit';

type TabKey = 'home' | 'inbox' | 'profile' | 'settings';

const ITEMS: readonly BottomTabBarItem<TabKey>[] = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'inbox', label: 'Inbox', icon: 'inbox', badge: 3 },
  { key: 'profile', label: 'Profile', icon: 'user', badge: true },
  { key: 'settings', label: 'Settings', icon: 'settings', disabled: true },
];

const [active, setActive] = useState<TabKey>('home');

<BottomTabBar items={ITEMS} active={active} onChange={setActive} />
```

### Compact (icon-only)
```tsx
<BottomTabBar
  variant="compact"
  active={active}
  onChange={setActive}
  items={[
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'search', label: 'Search', icon: 'search' },
    { key: 'inbox', label: 'Inbox', icon: 'inbox', badge: 12 },
    { key: 'profile', label: 'Profile', icon: 'user', badge: true },
  ]}
/>
```

### 5-tab layout with a primary center action
```tsx
<BottomTabBar
  active={active}
  onChange={setActive}
  items={[
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'team', label: 'Team', icon: 'users' },
    { key: 'add', label: 'Add', icon: 'plus', kind: 'primary' },
    { key: 'inbox', label: 'Inbox', icon: 'message-square', badge: 2 },
    { key: 'help', label: 'Help', icon: 'help-circle' },
  ]}
/>
```

### As a React Navigation custom tab bar
```tsx
<Tab.Navigator
  tabBar={({ state, navigation }) => (
    <BottomTabBar
      items={ITEMS}
      active={state.routes[state.index].name as TabKey}
      onChange={(key) => navigation.navigate(key)}
    />
  )}
>
  {/* screens */}
</Tab.Navigator>
```

## When NOT to use

- **Switching views within one screen** → [`Tabs`](./Tabs.md).
- **A single floating action that isn't part of navigation** → [`FAB`](../02-actions/FAB.md). (A nav-integrated add button belongs here as `kind: 'primary'`.)
- **A temporary slide-in side menu** → [`Drawer`](../06-overlays/Drawer.md).
- **An ordered wizard** → [`Stepper`](./Stepper.md).

## Accessibility

- The container is `accessibilityRole="tablist"`; each item is `accessibilityRole="tab"` with `accessibilityLabel={item.label}` and `accessibilityState={{ selected: active, disabled }}`, so the reader announces the active tab and skips disabled ones.
- The visible `label` doubles as the a11y label even in `compact` (icon-only) mode, so screen-reader users always hear the destination name.
- Active state is signalled by **tint + label weight**, not color alone; the label text itself distinguishes tabs for low-vision users.
- Each `Pressable` fills its `flex: 1` cell (≥`56pt` tall), comfortably exceeding the 44pt minimum. Badges are decorative overlays — encode the important count/state in the label or an accompanying screen region, not the dot alone.
