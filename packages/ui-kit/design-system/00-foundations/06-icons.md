# 06 — Icons

## Library — `@expo/vector-icons` (Feather)

The kit's components render icons with the **`Feather`** set from `@expo/vector-icons`:

```tsx
import { Feather } from '@expo/vector-icons';

<Feather name="search" size={16} color={lightColors.textPrimary} />
```

`@expo/vector-icons` is a **required peer dependency** (see [`package.json`](../../package.json)) and ships with every Expo app, so there is nothing extra to install in the host app.

> ⚠️ **Known discrepancy.** The package [`CLAUDE.md`](../../CLAUDE.md) Rule 6 states "Lucide icons only, via `lucide-react-native`." The shipped source does **not** match that rule — every component (35+ files: `IconButton`, `Alert`, `Select`, `BottomTabBar`, …) imports `Feather` from `@expo/vector-icons`, and `lucide-react-native` is not a dependency. This doc documents **what the code actually does**. Before writing new components, confirm with the team which is canonical and reconcile Rule 6 — do not mix both libraries in one app.

## Why Feather fits the aesthetic

Feather is a single-weight, thin, outline icon set — the same restrained, quiet character as the rest of the kit. Using one family (never mixing `Feather` with `MaterialIcons`, `Ionicons`, etc.) is what keeps the app feeling like one system.

## Sizes

Icon size is passed via the `size` prop. Stick to the kit steps — they pair with the type scale and control heights:

| Size | Usage |
|---|---|
| 14 | `IconButton` sm, inline in captions, chip chevrons |
| 16 | **Default** — inside `Button`, `Input` affordances, `ListItem` leading |
| 18 | `IconButton` lg, `PageHeader` back chevron |
| 20 | Section accents, tab bar icons |
| 24 | `EmptyState`, sheet headers |

Avoid 12, 15, 17, 19, 22. (`IconButton` sizes its glyph automatically: sm→14, md→16, lg→18.)

## Color

Icon `color` inherits the **text color of its context** — pass a semantic token, never a hex literal:

```tsx
<Feather name="search" size={16} color={lightColors.textMuted} />
```

- On a secondary surface / default text → `lightColors.textPrimary`
- Muted / placeholder → `lightColors.textMuted`
- On a brand or danger fill → `lightColors.onBrand`
- Semantic (success/warning/danger/info glyphs) → the matching `lightColors.*`

Never a blue icon next to gray text. **Icon color = the text color it sits with.**

## Direction-aware icons (RTL)

Feather chevrons/arrows do **not** auto-flip. For anything that means "next / back / forward", pick the glyph through the RTL helpers in [`src/utils/rtl.ts`](../../src/utils/rtl.ts) instead of hardcoding:

```tsx
import { forwardChevron, backChevron } from '@minthr-saas/mobile-ui-kit';

<Feather name={forwardChevron()} … />  // 'chevron-right' in LTR, 'chevron-left' in RTL
<Feather name={backChevron()} … />     // 'chevron-left'  in LTR, 'chevron-right' in RTL
```

Symmetric glyphs (`x`, `plus`, `check`, `search`, `chevron-down`) need no flipping. See [08-rtl-and-logical-properties.md](./08-rtl-and-logical-properties.md).

## Icon-only controls need a label

Any tappable icon with no visible text **must** carry an `accessibilityLabel` describing the *action* (not the glyph). Prefer the [`IconButton`](../02-actions/IconButton.md) component, which requires it:

```tsx
<IconButton icon="x" accessibilityLabel="Close" variant="ghost" />
```

## Common icon mappings (Feather names)

| Concept | Feather `name` |
|---|---|
| Search | `search` |
| Add / create | `plus` |
| Close | `x` |
| Delete | `trash-2` |
| Edit | `edit-2` |
| Expand down | `chevron-down` |
| Next / drill-in | `forwardChevron()` |
| Back / previous | `backChevron()` |
| More actions | `more-vertical` / `more-horizontal` |
| Filter | `filter` / `sliders` |
| Download | `download` |
| Upload | `upload` |
| User / users | `user` / `users` |
| Calendar | `calendar` |
| Clock | `clock` |
| Document | `file-text` |
| Settings | `settings` |
| Help | `help-circle` |
| Notifications | `bell` |
| Check / done | `check` / `check-circle` |
| Warning | `alert-triangle` |
| Info | `info` |
| Error | `alert-circle` |
| Email | `mail` |
| Phone | `phone` |
| Location | `map-pin` |
| Home | `home` |
| Lock | `lock` |

Browse the full set at [feathericons.com](https://feathericons.com); the `name` is the kebab-case icon name.

## No emoji in UI chrome

Emoji render inconsistently across iOS/Android versions and break the aesthetic. Use Feather glyphs for iconography. (Emoji is acceptable only when it *is* the content — e.g. a mood picker.)
