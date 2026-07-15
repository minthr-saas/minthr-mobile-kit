# Banner

A persistent, full-width, app-level status strip — offline, sync failed, new version, migration due. It sits flush against (or beneath) the top app bar and stays until the state clears or the user dismisses it.

## Purpose

`Banner` is a **full-width, no-radius** semantic strip for a state that affects the whole app, not one piece of content. It renders a leading icon, a single `message` line (up to 3 lines), an optional inline text action, and an optional dismiss `×`. It is persistent — no timer. Different from [`Toast`](./Toast.md) (ephemeral, floating, imperative) and [`Alert`](./Alert.md) (a rounded card inside the content area).

## Visual anatomy

```
┌──────────────────────────────────────────────────────────┐
│ (!)  You're offline. Changes will sync when you…  Retry  × │
└──────────────────────────────────────────────────────────┘
   ↑ icon (16)      ↑ message (flex, numberOfLines={3})  ↑action ↑dismiss
   paddingHorizontal = spacing[4] · paddingVertical = spacing[3]
   borderBottomWidth = borders.hair  (no radius — sits flush)
```

No corner radius. The only border is a hairline **bottom** border in the variant's `100` tone, so the strip reads as attached to the chrome above it.

## Variants

`variant` (default `'info'`) sets the fill, bottom border, icon, message text, and action text from one semantic family:

| Variant | Icon (Feather) | Fill | Bottom border | Message text | Action text |
|---|---|---|---|---|---|
| `info` **(default)** | `info` | `infoSubtle` | `palette.info[100]` | `palette.info[900]` | `palette.info[700]` |
| `success` | `check-circle` | `successSubtle` | `palette.success[100]` | `palette.success[900]` | `palette.success[700]` |
| `warning` | `alert-triangle` | `warningSubtle` | `palette.warning[100]` | `palette.warning[900]` | `palette.warning[700]` |
| `danger` | `alert-octagon` | `dangerSubtle` | `palette.danger[100]` | `palette.danger[900]` | `palette.danger[700]` |

The icon uses the family's `500` stop. One size only.

## States

- **Message only** — icon + text.
- **With action** — pass **both** `actionLabel` and `onAction`; the action renders as an inline `Text` in the family's `700` at `fontWeight.medium` (a text button, not a filled `Button`). Missing either prop hides it.
- **Dismissable** — pass `onDismiss` to render the trailing `×`. As with Alert, the parent removes the Banner when it fires.

## Rules

- **Fill + hairline bottom border, never a shadow** (Rule 1). Banner is chrome, not a floating overlay.
- **No corner radius** — a rounded top strip looks broken against the app bar.
- **`message` is one string, capped at 3 lines** (`numberOfLines={3}`). Keep it to a sentence — no title/description split (that's `Alert`).
- **The action is a text button, not a `Button`.** It is right-aligned via `flexShrink: 0`; label is `fontWeight.medium`. Keep it a single verb ("Retry", "Migrate").
- **Horizontal padding `spacing[4]`, vertical `spacing[3]`, gap `spacing[3]`.**
- **One banner at a time.** If two app states are true, show the more urgent.

## Props API

```ts
import type { ViewProps } from 'react-native';

export type BannerVariant = 'info' | 'success' | 'warning' | 'danger';

export interface BannerProps extends ViewProps {
  variant?: BannerVariant;   // default 'info'
  message: string;           // required
  actionLabel?: string;      // needs onAction to render
  onAction?: () => void;     // needs actionLabel to render
  onDismiss?: () => void;    // present ⇒ renders the × dismiss button
  // ...all ViewProps (style, testID, …)
}
```

Exports from the barrel: `Banner`, `BannerVariant`.

## Examples

### The four variants
```tsx
import { Banner } from '@minthr-saas/mobile-ui-kit';

<Banner variant="info" message="A new version is available — restart the app to update." />
<Banner variant="success" message="Your changes have been saved to the server." />
<Banner variant="warning" message="You're offline. Changes will sync when you reconnect." />
<Banner variant="danger" message="Sync failed. Your latest changes haven't been uploaded yet." />
```

### With an action
```tsx
<Banner
  variant="warning"
  message="You're offline. Changes will sync when you reconnect."
  actionLabel="Retry"
  onAction={retry}
/>
```

### Action + dismiss (caller unmounts)
```tsx
const [show, setShow] = useState(true);

{show ? (
  <Banner
    variant="info"
    message="Migrate this team to the new workspace before April 30."
    actionLabel="Migrate"
    onAction={startMigration}
    onDismiss={() => setShow(false)}
  />
) : null}
```

## When NOT to use

- **A transient confirmation of an action ("Profile saved")** → [`Toast`](./Toast.md).
- **A message tied to one card/form/section rather than the whole app** → [`Alert`](./Alert.md).
- **A quiet inline tip inside content** → [`Callout`](./Callout.md).
- **A rich message needing a title + body + icon inside a screen** → [`Alert`](./Alert.md).

## Accessibility

- The container sets `accessibilityLiveRegion="polite"`, so when the Banner mounts a screen reader announces its `message` without stealing focus. This value is hardcoded — because the component spreads `...rest` **before** setting `"polite"`, a caller cannot override it to `"assertive"` through props. For a critical strip, call `AccessibilityInfo.announceForAccessibility(message)` instead. (Consider filing a fix so `...rest` is spread last, matching `ProgressBar`.)
- The action and dismiss are each a `Pressable` with `accessibilityRole="button"`; the action's label is the visible text, the dismiss's is `"Dismiss"`. Both use `hitSlop={spacing[2]}`, and the dismiss box is 24×24 — add surrounding space so the target reaches 44pt.
- Keep severity in the words, not only the color/icon.
