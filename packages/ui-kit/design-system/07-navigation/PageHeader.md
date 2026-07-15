# PageHeader

The screen-top template: an optional back chevron, a title + subtitle block, and an actions row — stacked for mobile.

## Purpose

`PageHeader` is the standard way to open a screen. It stacks three optional pieces vertically: a `44×44` back button (when you pass `onBack`), a title/subtitle block that gets the full width, and an `actions` row underneath. It replaces the web kit's sticky `TopHeader`/toolbar — on mobile the header is part of the scroll content at the top of the screen, inside the safe area, not a floating bar.

Everything except `title` is optional, so the same component covers "just a title" up to "back + title + subtitle + badges + button".

## Visual anatomy

```
┌─────────────────────────────────────────────┐
│ (‹)                                           │  ← back chevron (backChevron()), 44×44, only if onBack
│                                               │
│ Engagement survey                             │  ← title (variant="title", up to 2 lines)
│ Open · 9 questions · 64 responses             │  ← subtitle (variant="body", secondary, up to 3 lines)
│                                               │
│ [Active]  [ Edit ]                            │  ← actions row (wraps, gap spacing[2])
└─────────────────────────────────────────────┘
   gap between blocks = spacing[3]; paddingVertical = spacing[2]
```

## Variants / Sizes / States

- **No `variant` / `size`** — one composition, shaped by which optional props you pass.
- **Back button** — rendered only when `onBack` is provided. `44×44` tap target, pulled to the edge with `marginStart: -spacing[2]` so the glyph optically aligns; pressed state fills `lightColors.surfaceSubtle` (plus Android borderless ripple).
- **Actions** — any `ReactNode`; the row is `flexWrap: 'wrap'` so several items wrap gracefully.

## Rules

- **Back chevron is RTL-aware.** The glyph comes from `backChevron()` (`chevron-left` in LTR, `chevron-right` in RTL), `size={24}`, `color={lightColors.textPrimary}` — never a hardcoded `chevron-left`.
- **One `title` per screen** (Rule from typography). Title is `variant="title"` (22/`'500'`); subtitle is `variant="body"` `tone="secondary"`.
- **Sentence case**, no ALL CAPS: "Compensation", "Engagement survey".
- **Actions belong on their own row**, not beside the title — this keeps long titles from colliding with buttons on narrow screens. Put a `Badge` + a small `secondary`/`ghost` `Button` there; keep the primary action as a `FAB` or a footer CTA, not here.
- **No border, no shadow.** `PageHeader` is a bare content block (`gap` + `paddingVertical` only). If you need a rule between it and scrolling content, add a [`Divider`](../08-layout/Divider.md) below it — do not add a shadow (Rule 1).
- **Safe area is the caller's job.** `PageHeader` does not apply insets; render it inside a `SafeAreaView` / a padded screen container so the back button clears the notch.

## Props API

```ts
import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';

interface PageHeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
  /** Show a back chevron above the title. Provide onBack to handle taps. */
  onBack?: () => void;
  /** Action slot rendered on its own row below the title. */
  actions?: ReactNode;
  // ...rest of ViewProps spreads onto the outer container
}
```

`title` is the only required prop. There is no `title` `ReactNode` override — it's a plain string rendered through the kit `Text`.

## Examples

### Title only
```tsx
import { PageHeader } from '@minthr-saas/mobile-ui-kit';

<PageHeader title="Quarterly review" />
```

### Back + title + subtitle
```tsx
import { useRouter } from 'expo-router';

const router = useRouter();

<PageHeader
  title="Compensation"
  subtitle="Effective May 1, 2026"
  onBack={() => router.back()}
/>
```

### With an actions row
```tsx
import { Badge, Button } from '@minthr-saas/mobile-ui-kit';

<PageHeader
  title="Engagement survey"
  subtitle="Open · 9 questions · 64 responses"
  onBack={() => router.back()}
  actions={
    <>
      <Badge label="Active" variant="success" />
      <Button label="Edit" size="sm" variant="secondary" onPress={onEdit} />
    </>
  }
/>
```

### Inside a safe-area screen
```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView edges={['top']} style={{ paddingHorizontal: spacing[5] }}>
  <PageHeader title="Directory" subtitle="15 active teammates" />
</SafeAreaView>
```

## When NOT to use

- **Persistent app navigation** → [`BottomTabBar`](./BottomTabBar.md) (replaces the web sidebar/nav-rail).
- **In-page section switching** → [`Tabs`](./Tabs.md).
- **A person/entity profile hero (centered avatar + identity)** → [`ProfileHeader`](./ProfileHeader.md).
- **A nested-location trail above the title** → [`Breadcrumbs`](./Breadcrumbs.md).

## Accessibility

- The back button sets `accessibilityRole="button"` and `accessibilityLabel="Back"`, with `hitSlop={spacing[2]}` on top of its `44×44` box.
- The title reads as ordinary text; if the screen needs an explicit heading semantic, pass `accessibilityRole="header"` via the spread `ViewProps` on the header container or on a wrapping element.
- JSX order (back → title → subtitle → actions) matches the visual top-to-bottom order, so the screen reader swipes through it sensibly.
- Keep `≥spacing[2]` between the items in the `actions` row so adjacent targets don't mis-hit.
