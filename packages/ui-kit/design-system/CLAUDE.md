# Design-system rules for `@minthr-saas/mobile-ui-kit`

**Read this file fully before every task. These rules are non-negotiable.**

This is the design-system spec for the MintHR **mobile** UI kit (React Native + Expo). It is the sister of the web `@minthr-saas/ui-kit`: same tokens, same aesthetic, mobile-native implementation. For package-level build/import guidance see [`../CLAUDE.md`](../CLAUDE.md); this file governs design.

## Project identity

**MintHR** is a multi-language HR (SIRH) SaaS in production. This kit powers its mobile app. Aesthetic: **Quiet UI** — inspired by Linear, Vercel, Attio, and calm first-party iOS. Premium through restraint, not decoration.

## The stack

- **React Native 0.81 + React 19**, distributed for **Expo**.
- **`StyleSheet`** for styling (no Tailwind, no styled-components, no inline hex).
- **TypeScript 5.9**, `strict`.
- Built with `react-native-builder-bob`.
- Animations: `react-native-reanimated` + `react-native-gesture-handler`.
- Sheets: `@gorhom/bottom-sheet`. Native pickers: `@react-native-community/datetimepicker`. Safe area: `react-native-safe-area-context`.

## Non-negotiable design rules

### 1. No shadows on containers
`Card`, `Button`, `Input`, `Badge`, `ListItem`, `PageHeader`, `Tag` — separate them with `borders.hair` + `lightColors.border`, never a shadow. Shadows (`shadows.sm/md/lg/drawer`) are reserved for elements that genuinely float: `Modal`, `BottomSheet`, `Menu`/`Popover`, `Tooltip`, `Toast`, `Drawer`.

### 2. Logical layout properties only
Use `marginStart` / `marginEnd` / `paddingStart` / `paddingEnd` / `start` / `end` / `border*StartWidth` / `border*Start/EndRadius`. **Never** `marginLeft` / `paddingRight` / `left` / `right` / `borderLeftWidth`. The kit is RTL-native. Two things stay physical — use [`src/utils/rtl.ts`](../src/utils/rtl.ts): directional icons (`forwardChevron()` / `backChevron()`) and `translateX` animations (multiply by `rtlSign()`).

### 3. Tokens only
No hardcoded hex (`#2C7955`), no inline color strings, no raw pixel values for spacing/radius/border. Use `lightColors.*`, `spacing[N]`, `radius.*`, `borders.*`. If a token doesn't exist, stop and add it (with a matching `darkColors` key) — don't invent an inline value.

### 4. Font weights `'400'` or `'500'` only
Use `fontWeight.regular` / `fontWeight.medium`. Never `'600'`, `'700'`, or `'bold'` — they look heavy. For emphasis use a darker tone or a larger size. RN requires string weights (`'500'`).

### 5. Sentence case, never ALL CAPS
"Total surveys", not "TOTAL SURVEYS". Acronyms (HR, IT, OTP) keep their proper case.

### 6. One icon family — Feather via `@expo/vector-icons`
`import { Feather } from '@expo/vector-icons'`. Sizes 14 / 16 / 18 / 20 / 24. Icon `color` = the text color of its context (a semantic token). Don't mix icon libraries.

> The package [`../CLAUDE.md`](../CLAUDE.md) Rule 6 says "Lucide only, via `lucide-react-native`." The shipped code uses `Feather` instead and does not depend on `lucide-react-native`. This spec documents the code's reality. Reconcile the two before adding icons in a new library.

### 7. 4px spacing scale
`spacing[1]`=4 … `spacing[16]`=64. No arbitrary 7, 13, 18. The only raw numeric values allowed are `borders.*`, `radius.*`, size-spec control heights, and animation offsets.

### 8. `Pressable`, not `TouchableOpacity`
Use `android_ripple` + `style={({ pressed }) => …}` for press feedback rather than opacity flashes.

### 9. No raw `<Text>` from `react-native` in product code
Use the kit `Text` component — it enforces family, token color, and the weight constraint. Raw `<Text>` stays inside the kit's own components.

### 10. 44×44pt minimum tap targets
Even when a control looks smaller, its hittable area must be ≥44×44pt (use `hitSlop`). Keep ≥8pt between adjacent targets.

### 11. Reuse existing components
Once a component ships, never rebuild what exists. Compose.

## Workflow before any task

1. Re-read this file.
2. Read [`README.md`](./README.md) for the folder map.
3. Read the component's spec in the matching category folder (e.g. `03-forms/Input.md`).
4. Read the relevant `00-foundations/*` if colors, type, spacing, icons, RTL, or accessibility are involved.
5. Confirm the component's real API in [`../src/<Name>.tsx`](../src) and its export in [`../src/index.ts`](../src/index.ts).

## Adding or changing a component

1. Update/write the spec in `design-system/<NN-category>/<Name>.md` **first**.
2. Create/edit `src/<Name>.tsx` — one component per file, named export, props typed with `interface` extending the relevant RN props (e.g. `Omit<PressableProps, 'style' | 'children'>`).
3. Re-export from `src/index.ts`.
4. Add/update the entry in `src/_registry.ts` (name, path, category, status, description).
5. Add/update the showcase route `apps/showcase/app/(home)/<name>.tsx` using the `Section` scaffold (see [`00-foundations/09-showcase-demos.md`](./00-foundations/09-showcase-demos.md)).
6. `npm run typecheck --workspace=@minthr-saas/mobile-ui-kit` must pass.

## Anti-patterns to reject immediately

- **"Add a shadow to the card"** → violates Rule 1. Use `borders.hair` + `lightColors.border`.
- **"Use this hex directly"** → violates Rule 3. Map it to a token.
- **"Make this bold (`'700'`)"** → violates Rule 4. Use `fontWeight.medium` or a darker tone.
- **"Use `TouchableOpacity`"** → violates Rule 8. Use `Pressable`.
- **"`marginLeft: 12`"** → violates Rule 2. Use `marginStart: spacing[3]`.
- **"Deep-import `@minthr-saas/mobile-ui-kit/tokens/colors`"** → use the barrel.
- **"Reach for the web `NavRail`/`Sidebar`/`Pagination`"** → those are web-only. Use `BottomTabBar`, `Drawer`, infinite scroll + `PullToRefresh`.

## Definition of done

1. ✅ Faithfully implements its spec.
2. ✅ Showcase route shows every variant × size × state.
3. ✅ No hardcoded colors / sizes / shadows — tokens only.
4. ✅ Logical layout props throughout; verified in RTL.
5. ✅ `accessibilityRole` + `accessibilityLabel` + `accessibilityState`; tap target ≥44pt.
6. ✅ Exported from `src/index.ts`; entry in `src/_registry.ts`.
7. ✅ `typecheck` passes.
8. ✅ Light theme only (dark values are placeholders — see `00-foundations/02-colors.md`).

## When in doubt
Default to restraint and the mobile idiom. If the spec doesn't cover a case, ask with 2–3 concrete options rather than guessing.
