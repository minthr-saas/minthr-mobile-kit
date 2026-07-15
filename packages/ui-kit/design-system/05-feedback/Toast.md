# Toast

An ephemeral notification that slides in from the top, floats above everything, and auto-dismisses — fired imperatively from anywhere via `useToast()`.

## Purpose

`Toast` is a transient confirmation ("Profile saved") or lightweight failure ("Could not reach payroll") that you trigger from an event handler, not render in the tree. A `ToastProvider` at the app root owns a queue; any descendant calls `useToast()` and fires `toast.success(...)`, `toast.danger(...)`, etc. Toasts stack at the top, auto-dismiss after 4s (configurable), and cap at 3 on screen. It is the only feedback component that legitimately **floats** (`shadows.md`). For an inline card use [`Alert`](./Alert.md); for a persistent app-level strip use [`Banner`](./Banner.md).

## Visual anatomy

```
 ┌──────────────────────────────────────────────┐   ← floats: shadows.md
 │ (✓)  Compensation updated                 [×] │   ← icon(16) · title(500) · dismiss(×,14)
 │      Sara Boudia · effective May 1, 2026.     │   ← description (caption)
 └──────────────────────────────────────────────┘
   fill: surfacePrimary · border: lightColors.border (hair) · radius.md
   stacked at top under the safe area · enter: fade + slide down from -16
```

Unlike `Alert`/`Banner`, the Toast surface is **white (`surfacePrimary`) with a neutral hairline border** — only the icon is tinted per variant. Enters with `opacity 0→1` and `translateY -16→0` over 200ms (native driver).

## Variants

`variant` (default `'info'`) changes only the icon and its color; fill/border/text stay neutral:

| Variant | Icon (Feather) | Icon color | Title | Description |
|---|---|---|---|---|
| `info` **(default)** | `info` | `palette.info[500]` | `textPrimary` | `textSecondary` |
| `success` | `check-circle` | `palette.success[500]` | `textPrimary` | `textSecondary` |
| `warning` | `alert-triangle` | `palette.warning[500]` | `textPrimary` | `textSecondary` |
| `danger` | `alert-octagon` | `palette.danger[500]` | `textPrimary` | `textSecondary` |

## Behaviour

- **Auto-dismiss** — `duration` ms (default `4000`). Pass `0` to keep it until the user taps `×`.
- **Queue cap** — at most `MAX_VISIBLE = 3` toasts show at once; firing more pushes the oldest out (`slice(-3)`).
- **Position** — top of the screen, inside `SafeAreaView edges={['top']}`, `pointerEvents="box-none"` so the app underneath stays tappable. Horizontal padding `spacing[4]`, top padding `spacing[2]`, `spacing[2]` between stacked toasts.
- **Dismiss** — every toast has a `×`; `show()`/helpers also return an `id` you can pass to `dismiss(id)`.

## Rules

- **Floating → shadow is correct here** (`shadows.md`) — Toast is the exception to the no-shadow rule; it genuinely floats.
- **Fire it, don't render it.** Toasts come from `useToast()`, not JSX. Mount exactly one `<ToastProvider>` near the app root.
- **Keep it to a confirmation.** Title is a short sentence-case line; description is one optional detail line. No actions, no forms — if the user must decide, use a [`ConfirmDialog`](../06-overlays/ConfirmDialog.md).
- **Don't spam.** The queue caps at 3 by design; batch related events instead of firing five toasts.
- **Errors that must be acted on** belong in an [`Alert`](./Alert.md) or [`Banner`](./Banner.md), not a toast that disappears.

## Props API

```ts
export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;   // default 'info'
  /** Milliseconds before auto-dismiss. Defaults to 4000. Pass 0 to disable. */
  duration?: number;
}

// Provider — mount once near the app root.
export function ToastProvider(props: { children: ReactNode }): JSX.Element;

// Hook — returns the imperative API. Throws if used outside a ToastProvider.
export function useToast(): {
  show: (opts: ToastOptions) => string;              // returns the toast id
  dismiss: (id: string) => void;
  success: (titleOrOpts: string | ToastOptions) => string;
  info:    (titleOrOpts: string | ToastOptions) => string;
  warning: (titleOrOpts: string | ToastOptions) => string;
  danger:  (titleOrOpts: string | ToastOptions) => string;
};
```

The convenience helpers accept **either** a plain title string **or** a full `ToastOptions` object (their `variant` is forced to match the helper). Exports from the barrel: `ToastProvider`, `useToast`, `ToastVariant`, `ToastOptions`. The individual toast view is internal — there is no standalone `<Toast>` component to render.

## Examples

### Mount the provider (once, at the root)
```tsx
import { ToastProvider } from '@minthr-saas/mobile-ui-kit';

export default function RootLayout() {
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  );
}
```

### Fire from anywhere
```tsx
import { useToast } from '@minthr-saas/mobile-ui-kit';

function SaveButton() {
  const toast = useToast();
  return <Button label="Save" onPress={() => { save(); toast.success('Profile saved'); }} />;
}
```

### Title + description
```tsx
toast.success({
  title: 'Compensation updated',
  description: 'Sara Boudia · effective May 1, 2026.',
});
```

### Persistent (no auto-dismiss) + manual dismiss
```tsx
const id = toast.info({
  title: 'Sync paused',
  description: 'Tap the × to dismiss. No auto-timer.',
  duration: 0,
});
// later:
toast.dismiss(id);
```

## When NOT to use

- **A message tied to a screen/form that should stay put** → [`Alert`](./Alert.md).
- **An app-wide status (offline, new version) that persists** → [`Banner`](./Banner.md).
- **A quiet inline tip inside content** → [`Callout`](./Callout.md).
- **A decision the user must confirm** → [`ConfirmDialog`](../06-overlays/ConfirmDialog.md).

## Accessibility

- The dismiss control is a `Pressable` with `accessibilityRole="button"`, `accessibilityLabel="Dismiss notification"`, and `hitSlop={8}`.
- Because a toast appears and vanishes on its own, announce its content to screen readers when it fires — call `AccessibilityInfo.announceForAccessibility(title)` in `show`, or wrap the toast content in `accessibilityLiveRegion="polite"` (`"assertive"` for `danger`) so VoiceOver/TalkBack read it without stealing focus.
- Keep `duration` long enough to be read; for anything a user must act on, use a persistent surface (`Alert`/`Banner`) instead of a timed toast, since assistive-tech users may miss a 4s window.
