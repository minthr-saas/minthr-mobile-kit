# Callout

A quiet inline panel with a colored accent stripe on its leading edge — for tips, side-notes, and prerequisite info embedded in the middle of content. The calmest of the four message components.

## Purpose

`Callout` is a subtle-fill panel with a 3px accent bar on its start edge, an optional `title`, an optional `description`, and arbitrary `children`. It carries no icon, no dismiss, and no action — it's a passive aside, not a system alert. When you need an icon + severity + dismiss, use [`Alert`](./Alert.md). When the message is app-wide, use [`Banner`](./Banner.md). When it's an ephemeral confirmation, use [`Toast`](./Toast.md).

## Visual anatomy

```
┃ Title text                          ← accent stripe (3px, start edge)
┃ Description body copy, secondary
┃ …any children…
  content padding = spacing[3]
  container: surfaceSubtle fill · borderRadius = radius.md · overflow hidden
```

The accent is a 3px-wide `View` on the leading edge; `overflow: 'hidden'` clips it to the rounded corner. There is no border and no icon.

## Accents

`accent` (default `'neutral'`) colors only the stripe — the fill and text stay neutral:

| Accent | Stripe color |
|---|---|
| `neutral` **(default)** | `palette.gray[400]` |
| `brand` | `lightColors.brand` |
| `info` | `lightColors.info` |
| `success` | `lightColors.success` |
| `warning` | `lightColors.warning` |
| `danger` | `lightColors.danger` |

Unlike `Alert`/`Banner`, the fill does **not** tint per accent — every Callout uses `surfaceSubtle`. Only the stripe changes.

## States

Callout has no interactive states — it is a static container. It renders whatever of `title` / `description` / `children` you pass; pass at least one.

## Rules

- **No shadow, no border** (Rule 1). The container is a `surfaceSubtle` fill with `radius.md`; the accent stripe stands in for a border.
- **The accent strip is square against the panel edge.** It's a plain 3px `View`; the panel's `overflow: 'hidden'` + `radius.md` round the outer corners — don't add radius to the stripe.
- **Title is `Text variant="body"` at `fontWeight: '500'`; description is `Text variant="caption" tone="secondary"`.** Colors are neutral, not tinted by the accent.
- **Content padding is `spacing[3]`;** the title/description/children gap is a fixed `2`.
- **Keep it quiet.** If the message needs a severity icon or must be dismissed, it's an `Alert`, not a Callout.
- **Sentence case**, short. "Tip", "Note", "Heads up".

## Props API

```ts
import type { ViewProps } from 'react-native';
import type { ReactNode } from 'react';

export type CalloutAccent = 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger';

export interface CalloutProps extends ViewProps {
  accent?: CalloutAccent;   // default 'neutral'
  title?: string;
  description?: string;
  children?: ReactNode;     // rendered under the description
  // ...all ViewProps (style, testID, …)
}
```

Exports from the barrel: `Callout`, `CalloutAccent`. (`ACCENT_WIDTH` = 3px is an internal constant, not exported.)

## Examples

### Accents
```tsx
import { Callout } from '@minthr-saas/mobile-ui-kit';

<Callout accent="neutral" title="Note" description="Onboarding videos are now 5–8 minutes long." />
<Callout accent="brand" title="Tip" description="Drag any column header to re-order the table view." />
<Callout accent="info" title="Heads up" description="Two of your direct reports are still pending review." />
<Callout accent="danger" title="Needs attention" description="Three contracts will expire in the next 7 days." />
```

### Title only
```tsx
<Callout accent="brand" title="Pin this card to come back to it later." />
```

### With children
```tsx
import { Callout, Button } from '@minthr-saas/mobile-ui-kit';

<Callout accent="warning" title="Draft not published">
  <Button label="Publish now" variant="secondary" size="sm" onPress={publish} />
</Callout>
```

## When NOT to use

- **A system message with a severity icon and optional dismiss** → [`Alert`](./Alert.md).
- **An app-level status strip under the top bar** → [`Banner`](./Banner.md).
- **A transient, self-fading confirmation** → [`Toast`](./Toast.md).
- **An empty screen with an illustration and CTA** → [`EmptyState`](../04-display/EmptyState.md).

## Accessibility

- Callout is a plain `View` in reading order — a screen reader reaches its `title` and `description` text in flow. The accent color carries no semantic meaning to assistive tech, so keep the wording self-sufficient.
- If a Callout appears dynamically and should be announced, add `accessibilityLiveRegion="polite"` via `...rest`.
- Any interactive `children` (e.g. a `Button`) carry their own roles and 44pt targets.
