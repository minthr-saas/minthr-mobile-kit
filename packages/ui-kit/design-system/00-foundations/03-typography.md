# 03 — Typography

Typography tokens live in [`src/tokens/typography.ts`](../../src/tokens/typography.ts). The idiomatic way to render text is the [`Text`](../01-typography/Text.md) component — it wires the right family, size, weight, and tone from tokens. Raw `<Text>` from `react-native` should not appear in product code.

```ts
import { fontFamily, fontSize, fontWeight, lineHeight, Text } from '@minthr-saas/mobile-ui-kit';
```

## Font family

React Native uses the platform system font — no web font loading, no Inter bundle. This keeps startup fast and text rendering native.

```ts
export const fontFamily = {
  sans: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
  mono: Platform.select({ ios: 'Menlo',  android: 'monospace', default: 'monospace' }),
};
```

If the app later ships a custom font (e.g. Inter via `expo-font`), change it **only** in this token — every component reads `fontFamily.sans`.

## Font weights — only 2

`fontWeight.regular` (`'400'`) and `fontWeight.medium` (`'500'`). Nothing else is exposed, by design.

Never `'300'`, `'600'`, `'700'`, or `'bold'` — they read heavy and shouty in this aesthetic. In React Native, string weights are required (`'500'`, not `500`). If you need more emphasis, use a darker `tone` or a larger `variant`, not a heavier weight.

## Font size scale

```ts
export const fontSize = { xs: 11, sm: 12, md: 14, lg: 16, xl: 18, '2xl': 22 };
```

Note the mobile baseline body size is **14** (`md`), one step larger than the web kit's 13px — small screens and varied viewing distances need a touch more legibility.

## Line height

`lineHeight` values are **multipliers**, not pixels. Multiply by the font size:

```ts
export const lineHeight = { tight: 1.2, normal: 1.4, relaxed: 1.6 };
// e.g. body: fontSize.md * lineHeight.normal === 14 * 1.4 === 19.6
```

## The `Text` variants (canonical scale)

The `Text` component encodes the scale so you rarely touch raw tokens. Each `variant` fixes size + weight + line-height; `tone` sets the color.

| `variant` | Size | Weight | Line height | Typical use |
|---|---|---|---|---|
| `title` | `2xl` (22) | `medium` | tight (1.2) | Screen / section titles |
| `subtitle` | `lg` (16) | `medium` | tight (1.2) | Card titles, group headers |
| `body` | `md` (14) | `regular` | normal (1.4) | **Default** — paragraphs, list titles |
| `caption` | `sm` (12) | `regular` | normal (1.4) | Secondary text, metadata, helper |
| `mono` | `sm` (12) | `regular` | normal (1.4) | Codes, IDs, tabular values |

| `tone` | Color |
|---|---|
| `primary` (default) | `textPrimary` (`gray-800`) |
| `secondary` | `textSecondary` (`gray-600`) |
| `muted` | `textMuted` (`gray-500`) |
| `inverse` | `textInverse` (white — on brand/danger fills) |
| `brand` | `brand` (`#2C7955`) |
| `danger` | `danger` |

```tsx
<Text variant="title">Directory</Text>
<Text variant="body" tone="secondary">15 active teammates</Text>
<Text variant="caption" tone="muted">Updated 3 minutes ago</Text>
```

## Sentence case is mandatory

Never Title Case. Never ALL CAPS.

- ✅ "Employee directory"
- ❌ "Employee Directory"
- ❌ "EMPLOYEE DIRECTORY"

Exception: **acronyms stay uppercase** (HR, IT, CEO, OTP). That's their proper form.

## Numbers, dates, currency

The app is multi-language. Format with `Intl` at the call site — don't hand-roll:

```ts
new Intl.NumberFormat(locale).format(1234.56);
new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
```

For aligned numeric columns (amounts, counts), use the `mono` variant or set `fontVariant: ['tabular-nums']` on the style so digits line up. React Native honors `fontVariant` on both platforms for most system fonts.

## Hierarchy rules

- Skip one step at a time. `title` (22) → `subtitle` (16) is fine; `title` → `caption` is too big a jump for a heading pair.
- Differentiate within a size using `tone` (color), not italics. Never italic for emphasis.
- One `title` per screen region. The screen has one; a `Card` has at most one `subtitle`.

## Examples

### Screen header
```tsx
<View>
  <Text variant="title">Employee directory</Text>
  <Text variant="caption" tone="muted">15 active · updated 3 minutes ago</Text>
</View>
```

### Label + value row
```tsx
<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  <Text variant="caption" tone="secondary">Total days</Text>
  <Text variant="body" style={{ fontWeight: fontWeight.medium }}>0.5 day(s)</Text>
</View>
```

### Numeric / tabular value
```tsx
<Text variant="body" style={{ fontVariant: ['tabular-nums'] }}>1 234,56 MAD</Text>
```
