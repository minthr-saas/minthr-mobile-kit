# @minthr-saas/mobile-ui-kit

MintHR mobile UI kit for React Native + Expo. Sister to the web [`@minthr-saas/ui-kit`](https://github.com/minthr-saas/minthr-ui-kit) — same design tokens and aesthetic, adapted to React Native primitives.

## Install

```sh
npm install @minthr-saas/mobile-ui-kit
```

Peer dependencies (install in your app if not already present):

```sh
npm install \
  react react-native \
  react-native-gesture-handler react-native-reanimated react-native-safe-area-context \
  react-native-keyboard-aware-scroll-view \
  @gorhom/bottom-sheet \
  @react-navigation/native \
  @react-native-community/datetimepicker \
  @expo/vector-icons \
  expo-document-picker
```

Make sure the corresponding Expo plugins / babel plugins (reanimated, gesture-handler, datetimepicker) are configured per their docs.

## Usage

```tsx
import {
  Button,
  Card,
  Text,
  palette,
  lightColors,
  spacing,
  radius,
  borders,
  shadows,
  fontFamily,
  fontSize,
  fontWeight,
} from '@minthr-saas/mobile-ui-kit';
```

Example:

```tsx
import { StyleSheet, View } from 'react-native';
import {
  Text,
  borders,
  fontFamily,
  fontSize,
  fontWeight,
  lightColors,
  radius,
  spacing,
} from '@minthr-saas/mobile-ui-kit';

const styles = StyleSheet.create({
  card: {
    backgroundColor: lightColors.surfacePrimary,
    borderColor: lightColors.border,
    borderWidth: borders.hair,
    borderRadius: radius.lg,
    padding: spacing[4],
  },
});

export function MyCard() {
  return (
    <View style={styles.card}>
      <Text variant="title">Hello</Text>
    </View>
  );
}
```

Always import from the barrel — never deep-import (`@minthr-saas/mobile-ui-kit/tokens/colors` is not supported).

## Layout

```
packages/ui-kit/
├── src/
│   ├── tokens/
│   │   ├── colors.ts        Raw palette + semantic light/dark colors
│   │   ├── spacing.ts       4px scale (spacing[1] = 4 ... spacing[16] = 64)
│   │   ├── typography.ts    fontFamily, fontSize, fontWeight (only '400' / '500')
│   │   ├── radius.ts        sm:4, md:6, lg:8, xl:12, full:9999
│   │   ├── borders.ts       hair (StyleSheet.hairlineWidth), thin:1, thick:2
│   │   ├── shadows.ts       sm/md/lg/drawer (overlays only — see CLAUDE.md Rule 1)
│   │   └── index.ts         Token barrel
│   ├── data/                Static reference data (countries, currencies)
│   ├── _registry.ts         Component metadata (categories, status)
│   ├── <Component>.tsx      One component per file
│   └── index.ts             Public barrel
├── package.json
├── tsconfig.json
├── tsconfig.build.json      tsc build config (declarations only)
├── README.md                This file
└── CLAUDE.md                AI-agent guide — non-negotiable design rules
```

## Build

The package is built with [`react-native-builder-bob`](https://github.com/callstack/react-native-builder-bob). It emits `lib/commonjs`, `lib/module`, and `lib/typescript`. Metro / RN consumers pick up `src/` directly via the `react-native` field; Node consumers (tests, tooling) get the CommonJS build.

```sh
npm run build       # build all targets (commonjs, module, typescript)
npm run typecheck   # tsc --noEmit against src/
```

## Adding components

1. Create `src/<Name>.tsx`
2. Re-export it from [`src/index.ts`](./src/index.ts)
3. Add an entry to [`src/_registry.ts`](./src/_registry.ts)
4. (Showcase) add a demo route at `apps/showcase/app/(home)/<name>.tsx`

Read [`CLAUDE.md`](./CLAUDE.md) before writing component code — the design rules are non-negotiable.
