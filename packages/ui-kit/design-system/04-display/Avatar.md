# Avatar

A compact, circular identifier for a person — their photo when there is one, otherwise their initials on a color that is always the same for that name.

## Purpose

`Avatar` renders a person in one glyph. Given a required `name`, it draws a circle: if you pass an `imageUri` it shows the photo; otherwise it shows the person's initials on a **deterministic** background color derived from the name (the same person always gets the same color). An optional `presence` dot marks online / away / offline. It extends `ViewProps`, so layout, `style`, and `accessibility*` props forward to the root `View`.

For a stack of several people use [`AvatarGroup`](./AvatarGroup.md); for a full identity block (avatar + name + status + actions) use [`ProfileHeader`](../07-navigation/ProfileHeader.md).

## Visual anatomy

```
   ┌─────────────┐
   │             │        image (imageUri) OR
   │     AB      │  ◄──── initials on a deterministic bg color
   │           ● │  ◄──── presence dot (bottom-end, white ring)
   └─────────────┘
    ↕↔ box (size)   ● = spacing.presence, borderColor surfacePrimary
```

Circle diameter is `box`; `borderRadius` is always `box / 2`. The presence dot sits at `bottom: 0, end: 0` with a 1.5pt ring in `surfacePrimary`, so it reads clearly over any avatar.

## Sizes

`size` maps to a `{ box, font, presence }` triple (all in pt):

| `size` | box | initials font | presence dot |
|---|---|---|---|
| `xs` | 16 | 8 | 6 |
| `sm` | 24 | 10 | 8 |
| `md` | 32 | 12 | 10 | **Default** |
| `lg` | 40 | 14 | 12 |
| `xl` | 48 | 18 | 14 |
| `2xl` | 64 | 24 | 18 |

## Presence

`presence` is optional; omit it and no dot renders. Each value maps to a semantic token:

- **`online`** → `lightColors.success`
- **`away`** → `lightColors.warning`
- **`offline`** → `lightColors.textMuted`

## Rules

- **Deterministic color, not random.** When there is no image, the background is chosen by hashing `name` into a fixed 6-color palette — `brand[500]`, `success[500]`, `warning[500]`, `danger[500]`, `info[500]`, `gray[600]`. The same name always yields the same color across the app, so a person is recognizable list-to-list. The hash and palette live inside [`src/Avatar.tsx`](../../src/Avatar.tsx) — don't reinvent or override them. See the Avatar color palette note in [`00-foundations/02-colors.md`](../00-foundations/02-colors.md).
- **Initials are computed for you.** One name → first two letters; two-plus names → first letter of the first and last word; empty → `?`. Always uppercased. Don't pass pre-formatted initials — pass the real `name`.
- **Initials text is white** (`textInverse`), `fontWeight.medium`, and never scales with the OS font setting (`allowFontScaling={false}`) so it always fits the circle.
- **No shadow, no border on the circle itself** (Rule 1). The only border in the component is the 1.5pt ring around the presence dot, which is there to separate it from the avatar, not to decorate.
- **Pick a size by context** — `xs`/`sm` inside dense rows and chips, `md` in list rows, `lg`/`xl` in headers, `2xl` for a profile hero.
- **Avatar is not pressable.** It is a display glyph. To make a tappable avatar, wrap it in a `Pressable` (or place it in a [`ListItem`](../08-layout/ListItem.md) leading slot).

## Props API

```ts
import type { ViewProps } from 'react-native';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarPresence = 'online' | 'away' | 'offline';

export interface AvatarProps extends ViewProps {
  name: string;                 // required — drives initials AND the deterministic color
  imageUri?: string;            // when set, shows the photo instead of initials
  size?: AvatarSize;            // default 'md'
  presence?: AvatarPresence;    // default undefined (no dot)
  // style, accessibilityLabel, testID, … from ViewProps
}
```

Sibling exports from the same module: `AvatarSize`, `AvatarPresence`. There is **no** `initials`, `color`, `shape`, or `onPress` prop — color is derived, the shape is always a circle, and pressability is the caller's job.

## Examples

### Initials avatar (deterministic color)
```tsx
import { Avatar } from '@minthr-saas/mobile-ui-kit';

<Avatar name="Amina Benali" />
```

### Photo with a size
```tsx
<Avatar
  name="Yassine El Amrani"
  imageUri="https://example.com/y.jpg"
  size="lg"
/>
```

### With presence
```tsx
<Avatar name="Sara Kabbaj" size="md" presence="online" />
```

### Tappable avatar in a row
```tsx
import { Pressable, View } from 'react-native';
import { Avatar, Text, spacing } from '@minthr-saas/mobile-ui-kit';

<Pressable onPress={openProfile} accessibilityRole="button">
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
    <Avatar name="Omar Idrissi" size="sm" presence="away" />
    <Text variant="body">Omar Idrissi</Text>
  </View>
</Pressable>
```

### Hero avatar
```tsx
<Avatar name="Fatima Zahra" size="2xl" presence="online" />
```

## When NOT to use

- **Several people at once** → [`AvatarGroup`](./AvatarGroup.md) overlaps them with a `+N` overflow.
- **A status word, not a person** ("Active", "Draft") → [`Badge`](./Badge.md).
- **A full identity header with name, status, and actions** → [`ProfileHeader`](../07-navigation/ProfileHeader.md).
- **A generic circular icon button** → [`IconButton`](../02-actions/IconButton.md); Avatar is for people, not actions.

## Accessibility

- Avatar extends `ViewProps` but sets **no** role or label by default. When it stands alone as the only representation of a person, pass `accessibilityLabel={name}` (and optionally `accessibilityRole="image"`).
- When the name is already shown as visible text right next to the avatar, hide the avatar from the screen reader to avoid a double read: `importantForAccessibility="no"` / `accessibilityElementsHidden`.
- The `presence` dot is purely visual — if that state matters to a non-sighted user, fold it into the label (e.g. `accessibilityLabel="Sara Kabbaj, online"`).
- The `2xl` box (64pt) exceeds the 44pt target; the smaller sizes are display-only, so only enforce the tap target on the `Pressable` you wrap around it, not on the Avatar.
