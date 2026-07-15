# Text

The one way to render text in the app. A thin wrapper over React Native's `Text` that fixes the font family, size, weight, line-height, and color from tokens — so raw `<Text>` from `react-native` never appears in product code (CLAUDE.md Rule 9).

## Purpose

Encodes the type scale as a small set of `variant`s and the color scale as `tone`s. You pick a semantic role (`title`, `body`, `caption`, …) and a tone (`primary`, `muted`, `brand`, …); the component supplies the exact size/weight/line-height and color. This is what keeps every screen's typography identical.

## Visual anatomy

```
Text variant="title"      Employee directory      ← 22 / medium / tight
Text variant="body"       Manage your team…        ← 14 / regular / normal
Text variant="caption"    15 active · updated 3m   ← 12 / regular / normal (tone="muted")
```

## Variants

Each `variant` fixes size + weight + line-height (see [03-typography.md](../00-foundations/03-typography.md)):

- **`title`** — 22 (`2xl`), medium, tight. Screen / section titles.
- **`subtitle`** — 16 (`lg`), medium, tight. Card titles, group headers.
- **`body`** — 14 (`md`), regular, normal. **Default.** Paragraphs, list titles.
- **`caption`** — 12 (`sm`), regular, normal. Secondary text, metadata, helper copy.
- **`mono`** — 12 (`sm`), regular, normal, monospace family. Codes, IDs, aligned values.

## Tones

Each `tone` sets the color from `lightColors`:

- **`primary`** (default) — `textPrimary` (`gray-800`)
- **`secondary`** — `textSecondary` (`gray-600`)
- **`muted`** — `textMuted` (`gray-500`)
- **`inverse`** — `textInverse` (white — on brand/danger fills)
- **`brand`** — `brand`
- **`danger`** — `danger`

## Rules

- **Never render raw `<Text>` from `react-native`** in product code. Always this component.
- **Don't pass `fontWeight` above `'500'`.** For emphasis, use a heavier `variant` (e.g. `subtitle`) or a stronger `tone`, not a bold weight.
- **`style` merges last**, so you can nudge layout (`marginTop`, `textAlign`, `fontVariant`) — but not to break Rule 4 (weights) or Rule 3 (colors). For tabular numbers, `style={{ fontVariant: ['tabular-nums'] }}`.
- **Sentence case** all copy. Acronyms keep their case.
- Any `RNTextProps` pass through — `numberOfLines`, `ellipsizeMode`, `onPress`, `selectable`, `accessibilityRole`, `maxFontSizeMultiplier`, etc.
- For a heading that a screen reader should announce as such, pass `accessibilityRole="header"`.

## Props API

```ts
import type { TextProps as RNTextProps } from 'react-native';

type TextVariant = 'title' | 'subtitle' | 'body' | 'caption' | 'mono';
type TextTone = 'primary' | 'secondary' | 'muted' | 'inverse' | 'brand' | 'danger';

interface TextProps extends RNTextProps {
  variant?: TextVariant; // default 'body'
  tone?: TextTone;        // default 'primary'
}
```

## Examples

### Screen header
```tsx
import { Text } from '@minthr-saas/mobile-ui-kit';

<Text variant="title" accessibilityRole="header">Employee directory</Text>
<Text variant="caption" tone="muted">15 active · updated 3 minutes ago</Text>
```

### Truncated list title
```tsx
<Text variant="body" numberOfLines={1}>{employee.fullName}</Text>
<Text variant="caption" tone="secondary" numberOfLines={1}>{employee.role}</Text>
```

### Emphasis without bold
```tsx
{/* ✅ darker/larger, not heavier */}
<Text variant="subtitle">Base salary</Text>
{/* ❌ don't do this */}
<Text style={{ fontWeight: '700' }}>Base salary</Text>
```

### Tabular value
```tsx
<Text variant="body" style={{ fontVariant: ['tabular-nums'] }}>1 234,56 MAD</Text>
```

### Inline brand link
```tsx
<Text variant="body" tone="brand" onPress={forgotPassword}>Forgot password?</Text>
```

## When NOT to use

- **Inside another kit component that already renders text** (`Button` has `label`, `Badge`/`Tag`/`ListItem` render their own text) — pass the string prop, don't nest a `Text`.
- **For icons** — use `Feather`, not a `Text` glyph.
- **As a layout box** — it's for text; use `View` for structure.

## Accessibility

- Font sizes scale with the OS text-size setting by default — don't disable it. Cap growth with `maxFontSizeMultiplier` only where a layout truly can't stretch.
- Use `accessibilityRole="header"` for titles so VoiceOver/TalkBack can navigate by heading.
- Ensure `tone` meets contrast: `muted` (`gray-500`) is 4.6:1 on white — fine for ≥12; don't take tones lighter for body text.
