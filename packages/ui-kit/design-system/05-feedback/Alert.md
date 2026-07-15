# Alert

A tinted, in-content message from the system to the user — icon + title + description, with optional dismiss. Use it inside a screen or form to explain a state the user should read before continuing.

## Purpose

`Alert` is a **content-area card**: it renders a semantic-tinted box with a leading Feather icon, an optional `title`, an optional `description`, and an optional `onClose` dismiss button. It is laid out inline in the document flow — it does not float, does not auto-dismiss, and is not fired imperatively. For an ephemeral toast fired from anywhere use [`Toast`](./Toast.md); for a full-width app-level strip use [`Banner`](./Banner.md); for a quieter inline side-note use [`Callout`](./Callout.md).

## Visual anatomy

```
┌────────────────────────────────────────────────┐
│ (i)  Title text                            [ × ] │  ← icon (16) · title 500 · optional close
│      Description body copy wraps here to as      │  ← description (caption)
│      many lines as it needs.                     │
└────────────────────────────────────────────────┘
  gap = spacing[3]      padding = spacing[3]
  borderRadius = radius.md · borderWidth = borders.hair
```

Icon is fixed at Feather `size={16}`; the close button is Feather `x` at `size={14}`. Both `title` and `description` are optional, but an Alert with neither is empty — always pass at least one.

## Variants

`variant` (default `'info'`) tints the fill, the hairline border, the icon, and the two text colors from one semantic family:

| Variant | Icon (Feather) | Fill | Border | Title | Description |
|---|---|---|---|---|---|
| `info` **(default)** | `info` | `infoSubtle` | `palette.info[100]` | `palette.info[900]` | `palette.info[700]` |
| `success` | `check-circle` | `successSubtle` | `palette.success[100]` | `palette.success[900]` | `palette.success[700]` |
| `warning` | `alert-triangle` | `warningSubtle` | `palette.warning[100]` | `palette.warning[900]` | `palette.warning[700]` |
| `danger` | `alert-octagon` | `dangerSubtle` | `palette.danger[100]` | `palette.danger[900]` | `palette.danger[700]` |

The icon uses the family's `500` stop. There are no sizes — one size only.

## States

- **Static** — Alert has no pressed/hover state on the container; it is not interactive.
- **Dismissable** — pass `onClose` to render the trailing `×`. Removal is the caller's job: `onClose` fires and the parent unmounts the Alert (see the Dismissable example).

## Rules

- **Fill + hairline border, never a shadow** (Rule 1). The container uses a `*Subtle` background and `borderWidth: borders.hair` with the family's `100` border — Alert is not a floating overlay.
- **Corner radius is `radius.md`**; padding and the icon/content/close gap are all `spacing[3]`.
- **Title is `Text variant="body"` at `fontWeight: '500'`; description is `Text variant="caption"`.** Both colors come from the variant, not from `Text`'s `tone`.
- **Icon color = the family `500`.** Do not recolor it; it is set from the variant.
- **Sentence case** titles, verb- or noun-led, short. "Profile incomplete", not "PROFILE INCOMPLETE".
- **Don't stack two Alerts of the same severity.** One message per state.

## Props API

```ts
import type { ViewProps } from 'react-native';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends ViewProps {
  variant?: AlertVariant;   // default 'info'
  title?: string;
  description?: string;
  onClose?: () => void;     // present ⇒ renders the × dismiss button
  // ...all ViewProps (style, accessibilityLabel, testID, …)
}
```

Exports from the barrel: `Alert`, `AlertVariant`.

## Examples

### The four variants
```tsx
import { Alert } from '@minthr-saas/mobile-ui-kit';

<Alert variant="info" title="Heads up" description="Pulse survey closes Friday." />
<Alert variant="success" title="Saved" description="Your changes were applied to all 12 employees." />
<Alert variant="warning" title="Approaching limit" description="You've used 92% of your monthly invitations." />
<Alert variant="danger" title="Action failed" description="Couldn't reach the payroll service. Try again in a moment." />
```

### Title only
```tsx
<Alert variant="info" title="One-liner alert with no description body." />
```

### Dismissable (caller unmounts)
```tsx
const [show, setShow] = useState(true);

{show ? (
  <Alert
    variant="warning"
    title="Profile incomplete"
    description="Add your job title and start date so HR can finalize onboarding."
    onClose={() => setShow(false)}
  />
) : null}
```

## When NOT to use

- **A message fired from an event handler that should fade on its own** → [`Toast`](./Toast.md).
- **An app-wide status that sits flush under the top bar (offline, new version)** → [`Banner`](./Banner.md).
- **A quiet inline tip or prerequisite note embedded in content** → [`Callout`](./Callout.md).
- **A blocking yes/no decision** → [`ConfirmDialog`](../06-overlays/ConfirmDialog.md).
- **An entire empty screen with an illustration + CTA** → [`EmptyState`](../04-display/EmptyState.md).

## Accessibility

- The dismiss control is a `Pressable` with `accessibilityRole="button"` and `accessibilityLabel="Dismiss"`, with `hitSlop={8}` so its target reaches 44pt.
- Alert renders in the document flow, so a screen reader reaches it in reading order. When an Alert appears in response to an action and you need it announced immediately, wrap it (or set on it via `...rest`) with `accessibilityLiveRegion="polite"`, or call `AccessibilityInfo.announceForAccessibility(title)` when you mount it.
- Because the icon carries the meaning visually, keep the `title`/`description` text self-sufficient — don't rely on color alone to signal severity.
