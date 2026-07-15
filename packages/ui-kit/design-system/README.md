# MintHR Mobile Design System

The design documentation for **`@minthr-saas/mobile-ui-kit`** — the MintHR React Native + Expo UI kit. Sister to the web [`@minthr-saas/ui-kit`](https://github.com/minthr-saas/minthr-ui-kit): same tokens, same aesthetic, mobile-native implementation.

## Philosophy in one line
**Quiet UI, natively.** Premium through restraint, not decoration — built on React Native primitives (`View` / `Text` / `Pressable` + `StyleSheet`), respecting iOS and Android conventions.

## What this folder is

Every markdown file here is a **spec** — the source of truth for what a token means and how a component behaves. The runnable code lives in [`../src/`](../src); the interactive demos live in [`apps/showcase`](../../../apps/showcase). When code and spec disagree, the spec is the intent and the code is the reality — reconcile them, don't let them drift.

## How to use this documentation

1. **[`CLAUDE.md`](./CLAUDE.md)** — the non-negotiable rules. Read first, every session.
2. **[`00-foundations/`](./00-foundations)** — tokens and cross-cutting rules. Read before touching colors, type, spacing, icons, RTL, or accessibility.
3. **Component specs** — before using or extending a component, read its spec (e.g. [`02-actions/Button.md`](./02-actions/Button.md)).
4. **[`00-patterns/`](./00-patterns)** — recipes that compose primitives (forms, auth, lists). Not components.

## Folder map

```
00-foundations/   Tokens + philosophy (read first)
00-patterns/      Composition recipes (not components)
01-typography/    Text
02-actions/       Button, IconButton, FAB
03-forms/         Input, Select, Checkbox, DatePicker, … (the largest group)
04-display/       Avatar, AvatarGroup, Badge, Tag, EmptyState
05-feedback/      Alert, Banner, Callout, Skeleton, Spinner, ProgressBar, Toast, SelectionBar
06-overlays/      Modal, BottomSheet, Drawer, Menu, Tooltip, ConfirmDialog
07-navigation/    Tabs, Stepper, PageHeader, Breadcrumbs, ProfileHeader, BottomTabBar
08-layout/        Card, Divider, Accordion, ListItem, SwipeableRow, PullToRefresh
```

The component folders mirror the eight categories in [`src/_registry.ts`](../../src/_registry.ts) — the authoritative registry of what ships. If the registry and this folder disagree on what exists, the registry wins.

## The stack

- **React Native 0.81** + **React 19**, distributed for **Expo**.
- Built with [`react-native-builder-bob`](https://github.com/callstack/react-native-builder-bob) (`commonjs` / `module` / `typescript` targets).
- Peer deps: `@expo/vector-icons`, `@gorhom/bottom-sheet`, `@react-native-community/datetimepicker`, `@react-navigation/native`, `expo-document-picker`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-safe-area-context`, `react-native-keyboard-aware-scroll-view`.
- Icons: **Feather** from `@expo/vector-icons` (see [`00-foundations/06-icons.md`](./00-foundations/06-icons.md) for the note on the `CLAUDE.md` Lucide discrepancy).

## Importing

Always from the barrel — never a deep subpath:

```tsx
import { Button, Card, Text, lightColors, spacing } from '@minthr-saas/mobile-ui-kit';
```

Inside the package (`packages/ui-kit/src/`), use relative imports (`from './tokens/colors'`).

## Component spec format

Every component spec follows the same shape:

1. **Purpose** — what problem it solves, when to use it (and the mobile idiom it embodies).
2. **Visual anatomy** — ASCII layout sketch.
3. **Variants / sizes / states** — the axes of the component.
4. **Rules** — the design decisions and constraints.
5. **Props API** — the real exported TypeScript interface (`onPress`, tokens, RN types — not web props).
6. **Examples** — 3–5 React Native usages that compile against the barrel.
7. **When NOT to use** — explicit non-cases and the better alternative.
8. **Accessibility** — the roles/labels/states the component needs.

## Non-negotiables (also in `CLAUDE.md`)

- **No shadows on containers.** Borders (`borders.hair` + `lightColors.border`) separate surfaces. Shadows are for floating overlays only.
- **Logical layout props only.** `marginStart`/`paddingEnd`/`start`/`end`, never `marginLeft`/`paddingRight`/`left`/`right`. RTL-native.
- **Tokens only.** No hex literals, no raw pixel spacing/radius. If a token is missing, add it — don't inline.
- **Font weights `'400'` / `'500'` only.** Never `'600'`, `'700'`, `'bold'`.
- **Sentence case labels.** Never ALL CAPS.
- **One icon family** — Feather via `@expo/vector-icons`.
- **`Pressable`, not `TouchableOpacity`.** Use `pressed` state + `android_ripple` for feedback.
- **No raw `<Text>` from `react-native`** in product code — use the kit `Text`.
- **44×44pt minimum tap targets.**

## Kit inventory

The component set spans eight categories — Typography, Actions, Forms, Display, Feedback, Overlays, Navigation, Layout. The Forms group is by far the largest (text inputs, pickers, selectors, uploads). See [`src/_registry.ts`](../../src/_registry.ts) for the live list with per-component category and status, and each category folder here for the specs.
