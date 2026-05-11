# `components/ui-kit/` — Guide for AI coding agents

You are working inside the MintHR mobile UI kit (React Native + Expo). This file is **the source of truth** for how to use and extend it. Read it before proposing any UI change.

This kit lives **inside the app** (not a published package). Sister to the web [`@minthr-saas/ui-kit`](https://github.com/minthr-saas/minthr-ui-kit). The two share design tokens and aesthetic — they differ only in implementation primitives (RN's `View`/`Text`/`Pressable` + `StyleSheet` instead of HTML + Tailwind).

## How to import

Always from the barrel, using the project's `@/` path alias:

```tsx
import { palette, lightColors, spacing, radius, borders, shadows } from '@/components/ui-kit';
import type { SpacingKey, ShadowKey } from '@/components/ui-kit';
```

Do not write `from '@/components/ui-kit/tokens/colors'`. Deep-subpath imports break the encapsulation.

## Non-negotiable rules (hard-fail if violated)

These come from the web kit's design philosophy. Read [the web kit's CLAUDE.md](../../minthr-ui-kit/packages/ui-kit/CLAUDE.md) for the full reasoning.

1. **No shadows on containers.** `Card`, `Button`, `Input`, `Badge` — use `borders.hair` with `lightColors.border`, never shadows. Shadows are reserved for floating elements only: `Modal`, `BottomSheet`, `Popover`, `Tooltip`, `Toast`.

2. **Logical layout properties.** Use `marginStart` / `marginEnd` / `paddingStart` / `paddingEnd` (RN supports them natively). **Never** `marginLeft` / `marginRight` etc. The kit is RTL-native.

3. **Tokens only.** No hardcoded hex (`#2C7955`), no inline color strings, no raw pixel values for spacing/radius. Use `lightColors.*`, `spacing[N]`, `radius.*`. If a token doesn't exist, stop and ask — don't invent one.

4. **Font weights `'400'` or `'500'` only.** Never `'600'`, `'700'`, or `'bold'`. They look heavy in this aesthetic. Use `fontWeight.regular` / `fontWeight.medium` only.

5. **Sentence case labels, never ALL CAPS.** "Total surveys" not "TOTAL SURVEYS".

6. **Lucide icons only**, via `lucide-react-native` (with `react-native-svg` peer-installed). `strokeWidth={1.8}`, `size={14|16|20}`. Don't mix icon libraries — the existing app uses `@expo/vector-icons` for the navigation chrome; kit components must use Lucide.

7. **4px spacing scale.** Use `spacing[1]` (4) / `spacing[2]` (8) / `spacing[3]` (12) / `spacing[4]` (16) / `spacing[5]` (20) / `spacing[6]` (24) / `spacing[8]` (32) / `spacing[10]` (40) / `spacing[12]` (48) / `spacing[16]` (64). No arbitrary 7px, 13px, etc.

8. **Reuse existing components.** Once components ship, never rebuild what already exists.

9. **`Pressable` over `TouchableOpacity`.** Modern API, better feedback control. Use `android_ripple` + `style={({ pressed }) => …}` for press feedback rather than opacity changes.

10. **No raw `<Text>` in product code.** Once the kit's `Text` component ships, raw `<Text>` from `react-native` should not appear outside `components/ui-kit/`. Wrapping it ensures the right font family + token-based color + weight constraint (Rule 4).

## Tokens — quick reference

```ts
import {
  palette,        // raw color scale: palette.brand[500], palette.gray[200], etc.
  lightColors,    // semantic light theme: lightColors.surfacePrimary, .textPrimary, .border
  darkColors,     // semantic dark theme (TBD — values not yet populated)
  spacing,        // 4px scale: spacing[1] = 4, spacing[2] = 8, ...
  radius,         // sm:4, md:6, lg:8, xl:12, full:9999
  borders,        // hair: StyleSheet.hairlineWidth, thin: 1, thick: 2
  shadows,        // sm/md/lg/drawer cross-platform shadow objects (overlays only — Rule 1)
  fontFamily,     // sans, mono
  fontSize,       // xs/sm/md/lg/xl/2xl
  fontWeight,     // regular: '400', medium: '500' (Rule 4 — these two only)
  lineHeight,     // tight: 1.2, normal: 1.4, relaxed: 1.6 (multipliers)
} from '@/components/ui-kit';
```

## Components — quick reference

Each component lives in its own `.tsx` under `components/ui-kit/`. Demos live at `app/(home)/<component>.tsx`. The full list (with category + status) is the source-of-truth registry [`_registry.ts`](./_registry.ts).

| Category | Components |
|---|---|
| **Typography** | `Text` |
| **Actions** | `Button`, `IconButton` |
| **Forms** | `Input`, `Textarea`, `NumberInput`, `OtpInput`, `PasswordStrength`, `Select`, `Switch`, `Checkbox`, `Radio` (+ `RadioGroup`), `SegmentedControl`, `FormField`, `FilterBar`, `Combobox`, `MultiSelect`, `CurrencyInput`, `PhoneInput`, `DatePicker`, `TimePicker`, `FileUpload` |
| **Display** | `Avatar`, `AvatarGroup`, `Badge`, `Tag`, `KpiCard`, `EmptyState` |
| **Feedback** | `Alert`, `Callout`, `Skeleton`, `ProgressBar`, `Toast` (`useToast` hook), `SelectionBar` |
| **Overlays** | `Modal`, `BottomSheet`, `Tooltip`, `ConfirmDialog`, `ActionSheet`, `Drawer` |
| **Navigation** | `Tabs`, `Stepper`, `PageHeader`, `Breadcrumbs`, `Pagination`, `ProfileHeader`, `Paginator` |
| **Layout** | `Card` (+ `CardHeader` / `CardTitle` / `CardDescription` / `CardFooter`), `Divider`, `Accordion` (+ `AccordionItem`) |

When adding a new component:
1. Create `components/ui-kit/<Name>.tsx`
2. Re-export it from [`index.ts`](./index.ts)
3. Add an entry to [`_registry.ts`](./_registry.ts)
4. Create the demo route at `app/(home)/<name>.tsx`

## Anti-patterns to reject immediately

When a user asks you to do any of these, **push back** — don't implement them:

- **"Add a shadow to the card"** → violates Rule 1. Use `borders.hair` + `lightColors.border`.
- **"Use this hex color directly"** → violates Rule 3. Either a kit token exists or we map to one.
- **"Make this text bold (`fontWeight: '700'`)"** → violates Rule 4. Use `fontWeight.medium` (`'500'`) for emphasis.
- **"Use TouchableOpacity for the button"** → violates Rule 9. Use `Pressable`.
- **"Wrap with `marginLeft: 12`"** → violates Rule 2. Use `marginStart: spacing[3]`.
- **"Import directly from the file: `from '@/components/ui-kit/tokens/colors'`"** → use the barrel.
