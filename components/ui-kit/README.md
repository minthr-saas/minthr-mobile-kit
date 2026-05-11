# `components/ui-kit/`

MintHR mobile UI kit, living **inside** this Expo app (not a separate package). Sister to the web [`@minthr-saas/ui-kit`](https://github.com/minthr-saas/minthr-ui-kit) — same design tokens and aesthetic, adapted to React Native primitives.

> **Status**: empty scaffold. Design tokens are wired up; components ship in follow-up commits.

## Usage

Import from the barrel using the existing `@/` path alias:

```tsx
import {
  palette,
  lightColors,
  spacing,
  radius,
  borders,
  shadows,
  fontFamily,
  fontSize,
  fontWeight,
} from '@/components/ui-kit';
```

Example:

```tsx
import { StyleSheet, View, Text } from 'react-native';
import { borders, fontFamily, fontSize, fontWeight, lightColors, radius, spacing } from '@/components/ui-kit';

const styles = StyleSheet.create({
  card: {
    backgroundColor: lightColors.surfacePrimary,
    borderColor: lightColors.border,
    borderWidth: borders.hair,
    borderRadius: radius.lg,
    padding: spacing[4],
  },
  title: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    color: lightColors.textPrimary,
  },
});
```

## Layout

```
components/ui-kit/
├── tokens/
│   ├── colors.ts        Raw palette + semantic light/dark colors
│   ├── spacing.ts       4px scale (spacing[1] = 4 ... spacing[16] = 64)
│   ├── typography.ts    fontFamily, fontSize, fontWeight (only '400' / '500')
│   ├── radius.ts        sm:4, md:6, lg:8, xl:12, full:9999
│   ├── borders.ts       hair (StyleSheet.hairlineWidth), thin:1, thick:2
│   ├── shadows.ts       sm/md/lg/drawer (overlays only — see CLAUDE.md Rule 1)
│   └── index.ts         Token barrel
├── index.ts             Public barrel
├── README.md            This file
└── CLAUDE.md            AI-agent guide — non-negotiable design rules
```

## Adding components

When you add a component (e.g. `Button.tsx`), put it directly under `components/ui-kit/` and re-export from `index.ts`:

```ts
// components/ui-kit/index.ts
export * from './tokens';
export * from './Button';
```

Read [`CLAUDE.md`](./CLAUDE.md) before writing component code — the design rules are non-negotiable.
