# Tooltip

A long-press hint bubble. On touch there is no hover, so the tooltip is disclosed by pressing and holding its trigger.

## Purpose

`Tooltip` shows a short text hint over a dimmed backdrop when the user **long-presses** the wrapped element. It clones its single child and injects an `onLongPress` handler, so any `Pressable`-like element becomes a tooltip trigger without extra wiring. Tapping anywhere dismisses it.

Because mobile has no hover state, long-press is the canonical "tell me more" gesture. Keep tooltips for genuinely optional, glanceable context — an abbreviation, a field's meaning. Anything the user *needs* to read belongs inline (a [`FormField`](../03-forms/FormField.md) hint, a `Callout`), not hidden behind a gesture.

## Visual anatomy

```
        [ trigger element ]           ← child; long-press opens the bubble
   ░░░░░ backdrop rgba(11,14,11,0.25) ░░░░░   (lighter than Modal/Drawer 0.45)
              ┌───────────────────────────┐
              │  Hint text (caption)       │  ← Text variant="caption" tone="inverse"
              └───────────────────────────┘
       maxWidth 320 · gray-800 fill · radius.md · borders.hair (gray-700) · shadows.md
```

The bubble is centered on screen (not anchored to the trigger) and dark-on-light for contrast; the label is a single caption line that wraps up to `maxWidth: 320`.

## Variants / sizes / states

- **No variants or sizes.** One dark bubble, one caption line.
- **States** — closed (default) / open (long-press). Tap anywhere on the backdrop closes it.

## Rules

- **Long-press to open, tap to dismiss.** The child is cloned with an injected `onLongPress`; don't rely on tap/hover.
- **Child must be a single `Pressable`-like element** that accepts `onLongPress`. If your content isn't pressable, wrap it in the sibling **`TooltipTrigger`** (a `Pressable` wrapper) first.
- **Dark bubble is intentional** — `palette.gray[800]` fill with `palette.gray[700]` hairline border and `shadows.md`; text is `Text variant="caption" tone="inverse"`. This is one of the few places raw `palette.*` is used, for the inverted surface.
- **Lighter backdrop** — `rgba(11,14,11,0.25)`, dimmer than the `Modal`/`Drawer` scrim, because a tooltip is non-blocking.
- **Keep the label short** — one phrase, sentence case. Long copy belongs inline.

## Props API

```ts
import type { ReactElement, ReactNode } from 'react';
import type { ViewProps } from 'react-native';

export interface TooltipProps {
  label: string;
  /**
   * The trigger element. Receives an injected `onLongPress` handler that
   * opens the tooltip. Must be a single Pressable-like element.
   */
  children: ReactElement<{ onLongPress?: (...args: unknown[]) => void }>;
}

// Sibling export — wrap non-Pressable content to gain long-press support.
export function TooltipTrigger(props: ViewProps & { children: ReactNode }): JSX.Element;
```

- `Tooltip` manages its own open/close state internally (`useState`) — there is **no** `visible`/`onClose` prop; it is uncontrolled.
- Built on RN `Modal` (`transparent`, `animationType="fade"`).
- **Sibling exports:** `TooltipTrigger`, `TooltipProps`.

## Examples

### Wrap an IconButton
```tsx
import { Tooltip, IconButton } from '@minthr-saas/mobile-ui-kit';

<Tooltip label="Full-time equivalent">
  <IconButton icon="info" accessibilityLabel="What is FTE?" />
</Tooltip>
```

### Wrap a plain view with `TooltipTrigger`
```tsx
import { Tooltip, TooltipTrigger, Text } from '@minthr-saas/mobile-ui-kit';

<Tooltip label="Contract ends 31 Dec 2026">
  <TooltipTrigger>
    <Text tone="brand">CDD</Text>
  </TooltipTrigger>
</Tooltip>
```

### On a Button trigger
```tsx
<Tooltip label="Only managers can approve">
  <Button label="Approve" disabled onPress={() => {}} />
</Tooltip>
```

## When NOT to use

- **Information the user must read to proceed** → inline hint on a [`FormField`](../03-forms/FormField.md), a `Callout`, or a `Banner` — never hide it behind a long-press.
- **A list of actions** → [`Menu`](./Menu.md).
- **A confirmation or decision** → [`ConfirmDialog`](./ConfirmDialog.md) / [`Modal`](./Modal.md).
- **Rich or interactive content** → [`BottomSheet`](./BottomSheet.md); a tooltip is text-only.
- **Transient status after an action** → `Toast` (see [`Toast`](../05-feedback/Toast.md)).

## Accessibility

- Long-press is not discoverable to everyone, so a tooltip must be **supplementary** — the essential meaning should already be conveyed by the trigger's `accessibilityLabel` / `accessibilityHint`. Give the trigger a real label (e.g. `accessibilityLabel="What is FTE?"`), and put the hint text in `accessibilityHint` so screen-reader users get it without the gesture.
- **Dismiss** — tap anywhere (backdrop) or the OS back gesture / **Android hardware back** (`onRequestClose`). It is non-blocking by design.
- **Contrast** — the `gray-800` bubble with inverse text clears AA for the caption size.
- **Reduce Motion** — the fade is brief; it resolves near-instantly under the OS setting.
- Because the bubble is centered rather than anchored, don't put load-bearing meaning in its position — only in the `label`.
