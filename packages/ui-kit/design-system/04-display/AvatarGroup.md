# AvatarGroup

A row of overlapping [`Avatar`](./Avatar.md)s that shows who is involved at a glance, capping the visible count and summarizing the rest as `+N`.

## Purpose

`AvatarGroup` renders a compact stack of people — a team roster, a set of reviewers, meeting attendees. It takes an `items` array, draws the first `max` as overlapping avatars each with a white halo ring, and collapses everyone past the cap into a single trailing `+N` chip. It extends `ViewProps`, so `style` and `accessibility*` forward to the root row `View`.

For a single person use [`Avatar`](./Avatar.md); for a scrollable list of people with names use [`ListItem`](../08-layout/ListItem.md) rows.

## Visual anatomy

```
   ┌──┐ overlap
   │AB│┌──┐         each avatar sits in a 1pt surfacePrimary ring
   └──┘│CD│┌──┐     (the white halo), the next tucked marginStart: -overlap
       └──┘│EF│┌────┐
           └──┘│ +3 │ ◄── overflow chip: surfaceSubtle + hair border
               └────┘
```

Avatars overlap toward the start edge; the `+N` overflow chip (if any) is always last. The overlap distance scales with `size`.

## Sizes

`size` is an [`AvatarSize`](./Avatar.md) and forwards straight to each child `Avatar`. It also picks the overlap amount:

| `size` | avatar box | overlap (marginStart) |
|---|---|---|
| `xs` | 16 | -6 |
| `sm` | 24 | -8 |
| `md` | 32 | -10 | **Default** |
| `lg` | 40 | -12 |
| `xl` | 48 | -14 |
| `2xl` | 64 | -18 |

## Overflow

- `max` caps the number of **visible** avatars (default `4`). The visible set is `items.slice(0, max)`.
- Everyone beyond the cap is counted into one chip: `overflow = items.length - visible.length`. It renders only when `overflow > 0`.
- The chip is a neutral circle (`surfaceSubtle` fill, `borders.hair` `border`) with `+N` in `textSecondary`; its font is sized relative to the box (`Math.max(10, box * 0.32)`).

## Rules

- **The white ring is intentional.** Each avatar sits in a 1pt `surfacePrimary` ring so overlapping neighbors stay visually separated. This is the one place a "border" appears in the display set — it is a halo, not a decorative outline, and it is not a shadow (Rule 1).
- **Order is your responsibility.** The component shows `items` in array order and truncates from the end. Sort meaningfully (e.g. owner first) before passing them in.
- **Keep `max` small.** 3–5 reads cleanly; beyond that the overlap gets muddy — raise the `+N` instead of showing more.
- **Homogeneous size.** Every avatar in the group shares the one `size`. Don't mix.
- **Not interactive by itself.** Like `Avatar`, it is display-only. Wrap it in a `Pressable` if the whole roster should open a member list.

## Props API

```ts
import type { ViewProps } from 'react-native';
import type { AvatarSize } from './Avatar';

export interface AvatarGroupItem {
  name: string;        // drives initials + deterministic color (see Avatar)
  imageUri?: string;   // optional photo
}

export interface AvatarGroupProps extends ViewProps {
  items: readonly AvatarGroupItem[];   // required, in display order
  size?: AvatarSize;                    // default 'md'
  /** Cap visible avatars; the rest become "+N". Defaults to 4. */
  max?: number;                         // default 4
  // style, accessibilityLabel, testID, … from ViewProps
}
```

Sibling export from the same module: `AvatarGroupItem`. Each item accepts only `name` (+ optional `imageUri`) — the same contract as [`Avatar`](./Avatar.md); presence dots are not shown in a group.

## Examples

### Team roster
```tsx
import { AvatarGroup } from '@minthr-saas/mobile-ui-kit';

<AvatarGroup
  items={[
    { name: 'Amina Benali' },
    { name: 'Yassine El Amrani' },
    { name: 'Sara Kabbaj' },
    { name: 'Omar Idrissi' },
  ]}
/>
```

### Capped with overflow
```tsx
<AvatarGroup
  size="sm"
  max={3}
  items={members} // 8 members → shows 3 + a "+5" chip
/>
```

### With photos, larger size
```tsx
<AvatarGroup
  size="lg"
  items={[
    { name: 'Fatima Zahra', imageUri: 'https://example.com/f.jpg' },
    { name: 'Karim Alaoui', imageUri: 'https://example.com/k.jpg' },
    { name: 'Nadia Cherkaoui' },
  ]}
/>
```

### Tappable roster
```tsx
import { Pressable } from 'react-native';

<Pressable onPress={openMembers} accessibilityRole="button" accessibilityLabel="View all 12 members">
  <AvatarGroup items={members} max={4} />
</Pressable>
```

## When NOT to use

- **One person** → [`Avatar`](./Avatar.md).
- **You need names, roles, or per-row actions** → a [`ListItem`](../08-layout/ListItem.md) list, not a silhouette stack.
- **A count of things that aren't people** ("5 files") → a [`Badge`](./Badge.md).
- **A profile hero for a single person** → [`ProfileHeader`](../07-navigation/ProfileHeader.md).

## Accessibility

- The group is a `View` with no default label. The individual avatars are **not** individually labeled and the `+N` chip is decorative — so provide one summarizing `accessibilityLabel` on the group (or on the `Pressable` wrapping it), e.g. `"12 team members"`.
- When the group is tappable, put the role and hint on the wrapping `Pressable` (`accessibilityRole="button"`), and make its hittable area ≥44×44pt.
- Don't rely on the overlap order to convey meaning to a screen reader — state it in the label if it matters.
