# Tabs

Underline-style in-page sub-navigation. Switch between related views *within* a single screen — never for moving between screens.

## Purpose

`Tabs` is a horizontal row of text labels with an active underline, sitting on a hairline baseline. It's a **controlled** component: you own the selected `value` in state and update it in `onChange`. Each tab is a `Pressable` with `accessibilityRole="tab"`.

This is the *in-page* tab pattern — profile sections (Overview / Reviews / Documents), filtered list views. For the app's persistent bottom navigation use [`BottomTabBar`](./BottomTabBar.md); for a numbered multi-step flow use [`Stepper`](./Stepper.md); for a compact 2–3 option filter that isn't a "view", consider [`SegmentedControl`](../03-forms/SegmentedControl.md).

## Visual anatomy

```
 Overview   Reviews   Compensation   Documents
 ───────                                        ← active: 2pt brand underline + '500' label
─────────────────────────────────────────────  ← baseline: borders.hair, lightColors.border
 └ horizontally scrollable when many tabs (scrollable) ┘
```

Each tab: `paddingVertical: spacing[2]`, `paddingHorizontal: spacing[3]`, tabs separated by `gap: spacing[1]`. The baseline hairline spans the full width (`start: 0`, `end: 0`).

## Variants / Sizes / States

- **Single size.** There is one tab size — no `size` prop.
- **`scrollable` (default `true`)** — wraps the row in a horizontal `ScrollView` so a long set of tabs scrolls instead of squashing. Set `scrollable={false}` for a small fixed set (2–3) that always fits.
- **States per tab:** *inactive* — `tone="secondary"`, transparent underline; *selected* — `tone="primary"`, `fontWeight: '500'`, `2pt` brand underline. No per-tab disabled state exists in the API.

## Rules

- **Underline, not fill.** The active tab is marked by a `2pt` `lightColors.brand` bottom border over the `borders.hair` baseline — no background pill (that's `SegmentedControl`).
- **Weight, not size, signals active.** Selected label goes to `fontWeight.medium` (`'500'`); inactive stays `fontWeight.regular` with `tone="secondary"`. Never bump the font size.
- **Labels are sentence case, 1–2 words.** "Compensation", "Time off" — not "COMPENSATION", not a sentence.
- **No shadow** (Rule 1) — the baseline hairline is the only separator.
- **Keep 4–6 tabs max.** More than that reads as a menu; rethink the grouping.

## Props API

```ts
import type { ViewProps } from 'react-native';

interface TabOption<T extends string = string> {
  value: T;
  label: string;
}

interface TabsProps<T extends string = string> extends ViewProps {
  options: readonly TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  scrollable?: boolean;   // default true — wrap in a horizontal ScrollView
  // ...rest of ViewProps spreads onto the outer container
}
```

`Tabs` is generic over the tab key `T`, so `value`/`onChange` stay type-safe against your union (e.g. `'overview' | 'reviews'`). Sibling export: `TabOption<T>`.

## Examples

### Profile sections
```tsx
import { useState } from 'react';
import { Tabs } from '@minthr-saas/mobile-ui-kit';

const [tab, setTab] = useState<'overview' | 'reviews' | 'documents'>('overview');

<Tabs
  options={[
    { value: 'overview', label: 'Overview' },
    { value: 'reviews', label: 'Reviews' },
    { value: 'documents', label: 'Documents' },
  ]}
  value={tab}
  onChange={setTab}
/>
```

### Fixed set, no scroll
```tsx
const [filter, setFilter] = useState<'all' | 'mine' | 'archived'>('all');

<Tabs
  scrollable={false}
  options={[
    { value: 'all', label: 'All' },
    { value: 'mine', label: 'Mine' },
    { value: 'archived', label: 'Archived' },
  ]}
  value={filter}
  onChange={setFilter}
/>
```

### Switching the panel below
```tsx
<>
  <Tabs options={sections} value={tab} onChange={setTab} />
  <View style={{ paddingTop: spacing[3] }}>
    {tab === 'overview' ? <Overview /> : null}
    {tab === 'reviews' ? <Reviews /> : null}
  </View>
</>
```

### Anchored inside a ProfileHeader
```tsx
<ProfileHeader
  name="Sara Boudia"
  avatar={<Avatar name="Sara Boudia" size="xl" />}
  tabs={<Tabs options={sections} value={tab} onChange={setTab} />}
/>
```

## When NOT to use

- **Moving between top-level app areas** → [`BottomTabBar`](./BottomTabBar.md) (this replaces the web sidebar/nav-rail).
- **A numbered, ordered flow (onboarding, checkout)** → [`Stepper`](./Stepper.md).
- **A compact binary/ternary toggle inside a form** → [`SegmentedControl`](../03-forms/SegmentedControl.md).
- **A nested-location trail** → [`Breadcrumbs`](./Breadcrumbs.md).

## Accessibility

- Each tab is a `Pressable` with `accessibilityRole="tab"` and `accessibilityState={{ selected }}`, so VoiceOver/TalkBack announce the active tab and its selected state.
- The visible `label` is the announced name — keep it descriptive on its own.
- Tap target: a tab is only `spacing[2]` tall in padding; if your labels are short, add `hitSlop` or rely on the row height to keep the hittable area ≥44pt.
- The RTL baseline uses logical `start`/`end`, and the horizontal `ScrollView` flows in reading order automatically.
