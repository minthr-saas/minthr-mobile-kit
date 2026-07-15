# Drawer

A side panel that slides in from the leading or trailing edge for detail views, settings, or filters that don't warrant a full screen push.

## Purpose

`Drawer` slides a fixed-width panel in from the screen's `start` or `end` edge over a dimmed backdrop, with a spring animation. Use it for secondary content that sits alongside the current screen — an employee detail card, a settings pane, a filter form — where a full navigation push would be too heavy and a center [`Modal`](./Modal.md) too small.

It is built on RN's `Modal` (`transparent`, `animationType="none"` — the slide is hand-animated) and is RTL-native: the slide transform is multiplied by `rtlSign()` so a `side="end"` drawer always enters from the trailing edge regardless of writing direction. On mobile, a `Drawer` is the natural home for content that a web app would put in a `Sidebar` or off-canvas panel.

## Visual anatomy

```
  side="end" (default), LTR                       side="start", LTR
  ░░░ backdrop rgba(11,14,11,0.45) ░░░            ┌──────────────┐ ░░░░░░░░░░
                    ┌──────────────┐              │ Title    [✕] │ ░░░░░░░░░░
                    │ Title    [✕] │ ← header     ├──────────────┤ ░░░░░░░░░░
                    ├──────────────┤   (hair)     │  children    │ ░░░░░░░░░░
        slides in → │  children    │              │  (body)      │ ← slides in
                    │  (body)      │              ├──────────────┤ ░░░░░░░░░░
                    ├──────────────┤              │  [ footer ]  │ ░░░░░░░░░░
                    │  [ footer ]  │ ← footer      └──────────────┘ ░░░░░░░░░░
                    └──────────────┘   (hair)
     shadows.drawer · full height · paddingTop/Bottom = safe-area insets
```

Header (unless `hideDefaultHeader`) shows the `title` and a trailing `✕`. Body fills the remaining height. Footer renders only when `footer` is passed.

## Variants / sizes / states

- **`side`** — `'start'` (leading edge) or `'end'` (trailing edge). **Default `'end'`.** In LTR, `end` = right; in RTL it auto-flips to the left.
- **`size`** (width preset, capped to the viewport):
  - `sm` → `min(280, 70% screen)`
  - `md` → `min(340, 82% screen)` **(default)**
  - `lg` → `min(420, 92% screen)`
  - `full` → full screen width
- **States** — `visible` drives a spring slide-in (`damping: 22, stiffness: 220`) + backdrop fade; closing reverses with a 200ms timing slide. Backdrop press dismisses unless `dismissOnBackdrop={false}`.

## Rules

- **Logical edges only.** The panel pins with `start: 0` / `end: 0` and borders with `borderEndWidth` / `borderStartWidth` (`borders.hair`, `lightColors.border`) — never `left`/`right`. The slide uses `translateX × rtlSign()` (see [RTL foundations](../00-foundations/05-radii-borders-shadows.md) and `src/utils/rtl.ts`).
- **Floating surface → `shadows.drawer`** (offset toward the trailing edge). This is the one place `shadows.drawer` is used (Rule 1 permits it here).
- **Respects the safe area** — `paddingTop: insets.top`, `paddingBottom: insets.bottom` via `useSafeAreaInsets`.
- **`title` as string** renders `Text variant="subtitle"` (single line, sentence case); pass a `ReactNode` for a custom header row, or `hideDefaultHeader` to render your own top row entirely.
- **`footer`** is a bottom row (`justifyContent: 'flex-end'`, `gap: spacing[2]`, `borderTop` hair) — the place for a `Cancel`/`Save` [`Button`](../02-actions/Button.md) pair.
- **Body** is `padding: spacing[4]`, `gap: spacing[3]`, and flexes to fill; wrap long content in a `ScrollView`.

## Props API

```ts
import type { ReactNode } from 'react';

export type DrawerSide = 'start' | 'end';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

export interface DrawerProps {
  visible: boolean;
  onClose: () => void;
  /** Header title — string renders as subtitle Text, or pass a node for custom content. */
  title?: string | ReactNode;
  children?: ReactNode;
  /** Footer slot — typically action buttons. */
  footer?: ReactNode;
  /** Which edge the drawer slides from. Defaults to 'end' (right in LTR). */
  side?: DrawerSide;
  /** Width preset. Defaults to 'md'. */
  size?: DrawerSize;
  /** Tap on backdrop dismisses. Defaults to true. */
  dismissOnBackdrop?: boolean;
  /** Suppress the default title + close-button header. Consumer renders its own top row. */
  hideDefaultHeader?: boolean;
}
```

- Fixed-shape wrapper — does not extend RN `ModalProps`.
- `onClose` fires from the backdrop `Pressable`, the header `✕`, and `onRequestClose` (Android hardware back / OS gesture).
- **Sibling exports:** `DrawerSide`, `DrawerSize` types alongside `Drawer`.

## Examples

### Open / close with `useState`
```tsx
import { useState } from 'react';
import { Drawer, Button, Text } from '@minthr-saas/mobile-ui-kit';

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button label="View details" onPress={() => setOpen(true)} />
      <Drawer
        visible={open}
        onClose={() => setOpen(false)}
        title="Employee details"
        footer={<Button label="Close" variant="ghost" onPress={() => setOpen(false)} />}>
        <Text tone="secondary">Role, team, and contact info.</Text>
      </Drawer>
    </>
  );
}
```

### Leading-edge filter panel, large
```tsx
<Drawer visible={open} onClose={close} side="start" size="lg" title="Filters">
  {/* FilterBar / form controls */}
</Drawer>
```

### Full-width with a custom header
```tsx
<Drawer visible={open} onClose={close} size="full" hideDefaultHeader>
  <MyOwnHeaderRow onClose={close} />
  {/* content */}
</Drawer>
```

### Non-dismissible backdrop
```tsx
<Drawer visible={open} onClose={close} dismissOnBackdrop={false} title="Edit shift">
  {/* form the user must explicitly finish */}
</Drawer>
```

## When NOT to use

- **A small, centered decision or message** → [`Modal`](./Modal.md).
- **A thumb-reachable form or picker** → [`BottomSheet`](./BottomSheet.md) is the more idiomatic mobile default.
- **A yes/no confirm** → [`ConfirmDialog`](./ConfirmDialog.md).
- **A short list of actions from a trigger** → [`Menu`](./Menu.md).
- **Primary screen-to-screen navigation** → the navigator / `BottomTabBar`, not a drawer.

## Accessibility

- **Dismiss paths** (per [Accessibility → Overlays](../00-foundations/07-accessibility.md)): the backdrop `Pressable` (`accessibilityRole="button"`, `accessibilityLabel="Dismiss drawer"`), the header `✕` (`accessibilityLabel="Close drawer"`, `hitSlop={8}`), and `onRequestClose` for the **Android hardware back button** / OS back gesture. Keep at least one visible affordance when `dismissOnBackdrop={false}`.
- **Focus containment** — on open, move focus into the panel; on close, return it to the trigger. Set `accessibilityViewIsModal` on the panel (iOS) so the reader doesn't reach the screen behind it.
- **Reduce Motion** — the spring slide is ~200ms; honour the OS setting and fall back to an instant appear/cross-fade (`AccessibilityInfo.isReduceMotionEnabled()` / reanimated `useReducedMotion()`).
- **RTL** — layout auto-flips via logical props and `rtlSign()`; verify the panel enters from the correct edge in RTL.
