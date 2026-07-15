# ProfileHeader

A centered identity hero for an entity's detail screen: avatar over name + status, a quick-actions row, and tabs anchored to the bottom edge.

## Purpose

`ProfileHeader` is the mobile contact-card pattern for the top of a person/entity screen. It centers an avatar, then a centered identity stack (name + inline status, subtitle, optional extras), then a dedicated actions row (quick actions plus an optional `…` overflow button), optional `children`, and finally a `tabs` slot that runs full-bleed along the bottom edge. It sits on `lightColors.surfacePrimary` with a hairline bottom border separating it from the content below.

Where [`PageHeader`](./PageHeader.md) is the generic left-aligned screen template, `ProfileHeader` is specifically the *who-is-this* hero — use it for an employee profile, a team page, a company record.

## Visual anatomy

```
┌───────────────────────────────────────────────┐
│                   ( Avatar )                    │  ← avatar slot, centered
│              Sara Boudia  [Active]              │  ← name (title/'500') + status badge, centered
│         Software Engineer · Engineering         │  ← subtitle (body, secondary), centered
│              [Remote] [Full-time]               │  ← identityExtra (optional)
│                                                 │
│             [ Message ]      ( … )              │  ← actions row: quickActions + overflow (44×44)
│  … optional children …                          │
│  Overview   Reviews   Documents                 │  ← tabs slot, full-bleed to the edges
├─────────────────────────────────────────────── │  ← borders.hair bottom border
```

`density="default"`: `paddingTop: spacing[5]`, `gap: spacing[3]`. `density="compact"`: smaller avatar spacing, name drops to `variant="subtitle"`, `gap: spacing[2]`.

## Variants / Sizes / States

- **`density`** — `'default'` (roomy hero, name at `variant="title"`) or `'compact'` (tighter spacing, name at `variant="subtitle"`). Controls vertical spacing + name size only.
- **Overflow button** — appears only when `onOverflowPress` is set: a `44×44` `Feather` `more-horizontal` (`size={20}`, `lightColors.textSecondary`), `radius.full`, pressed fill `surfaceSubtle`.
- **Actions row** — rendered only if `quickActions` *or* `onOverflowPress` is present; wraps and centers.
- **Tabs row** — rendered only if `tabs` is passed; pulled full-width with `marginHorizontal: -spacing[4]` so an underline `Tabs` baseline spans the whole header.

## Rules

- **Everything is centered** — avatar, name, subtitle, actions. This is the contact-card idiom; don't left-align it (that's `PageHeader`).
- **`name` is a required string; slots are `ReactNode`.** Render an [`Avatar`](../04-display/Avatar.md) in `avatar`, a [`Badge`](../04-display/Badge.md) in `status`, [`Button`](../02-actions/Button.md)s in `quickActions`.
- **Name uses `fontWeight.medium`** (`'500'`) and `numberOfLines={2}`; subtitle is `tone="secondary"`, `numberOfLines={2}`.
- **Quick actions are secondary/small.** Use `size="sm"` `secondary`/`ghost` buttons ("Message", "Edit"). Keep destructive or rare actions behind the `…` overflow.
- **Separator is a hairline bottom border** (`borders.hair` + `lightColors.border`) — no shadow (Rule 1).
- **Pass `tabs` a real [`Tabs`](./Tabs.md)** so the sub-nav anchors to the header's bottom edge and scrolls under it.

## Props API

```ts
import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';

type ProfileHeaderDensity = 'default' | 'compact';

interface ProfileHeaderProps extends ViewProps {
  avatar?: ReactNode;        // centered above the name — render an <Avatar />
  name: string;              // required
  subtitle?: string;         // role, department, …
  status?: ReactNode;        // badge shown inline next to the name
  identityExtra?: ReactNode; // extra content below the subtitle (e.g. badges)
  quickActions?: ReactNode;  // buttons on a dedicated row
  onOverflowPress?: () => void; // appends a '…' overflow button to the actions row
  tabs?: ReactNode;          // tab nav anchored to the bottom edge (full-bleed)
  density?: ProfileHeaderDensity; // default 'default'
  children?: ReactNode;      // rendered below the actions row, above the tabs
  // ...rest of ViewProps spreads onto the root View
}
```

Sibling export: `ProfileHeaderDensity`.

## Examples

### Default density with a quick action
```tsx
import { Avatar, Badge, Button, ProfileHeader } from '@minthr-saas/mobile-ui-kit';

<ProfileHeader
  avatar={<Avatar name="Sara Boudia" size="xl" />}
  name="Sara Boudia"
  subtitle="Software Engineer · Engineering"
  status={<Badge label="Active" variant="success" dot />}
  quickActions={<Button label="Message" variant="secondary" size="sm" onPress={onMessage} />}
  onOverflowPress={openMenu}
/>
```

### Compact density (minimal)
```tsx
<ProfileHeader
  density="compact"
  avatar={<Avatar name="Karim Elbouazri" size="lg" />}
  name="Karim Elbouazri"
  subtitle="Product Manager · Product"
  status={<Badge label="On leave" variant="warning" dot />}
/>
```

### With identity extras
```tsx
<ProfileHeader
  avatar={<Avatar name="Amina Chaoui" size="xl" />}
  name="Amina Chaoui"
  subtitle="Head of Design · Design team"
  identityExtra={
    <View style={{ flexDirection: 'row', gap: spacing[2], flexWrap: 'wrap' }}>
      <Badge label="Remote" variant="info" />
      <Badge label="Full-time" variant="neutral" />
    </View>
  }
  quickActions={<Button label="Edit" variant="secondary" size="sm" onPress={onEdit} />}
  onOverflowPress={openMenu}
/>
```

### Anchored tabs
```tsx
const [tab, setTab] = useState<'overview' | 'reviews'>('overview');

<ProfileHeader
  avatar={<Avatar name="Sara Boudia" size="xl" />}
  name="Sara Boudia"
  subtitle="Software Engineer · Engineering"
  tabs={
    <Tabs
      options={[
        { value: 'overview', label: 'Overview' },
        { value: 'reviews', label: 'Reviews' },
      ]}
      value={tab}
      onChange={setTab}
    />
  }
/>
```

## When NOT to use

- **A generic screen title (left-aligned)** → [`PageHeader`](./PageHeader.md).
- **A person inside a list** → a `ListItem` / list row with a small `Avatar`, not a full hero.
- **Top-level app navigation** → [`BottomTabBar`](./BottomTabBar.md).

## Accessibility

- The overflow button sets `accessibilityRole="button"` and `accessibilityLabel="More actions"`, with `hitSlop={spacing[2]}` on its `44×44` box.
- `name`, `subtitle`, and the badges read as text in JSX (visual) order — avatar, identity, actions, tabs — so the swipe order is sensible.
- Give the `avatar`'s `<Avatar />` a meaningful label (it derives initials); decorative-only avatars can be hidden from the reader.
- The anchored `tabs` retain their own `accessibilityRole="tab"` + `accessibilityState={{ selected }}` from [`Tabs`](./Tabs.md).
