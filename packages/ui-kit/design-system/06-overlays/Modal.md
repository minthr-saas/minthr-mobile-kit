# Modal

A centered, backdrop-dimmed dialog for a focused task or message that must interrupt the current screen.

## Purpose

`Modal` floats a small card in the middle of the screen over a dimmed backdrop. Use it for a short, self-contained interaction the user must resolve before continuing — a compact form, a detail confirmation, a single decision. It is built on React Native's own `Modal` (`transparent`, `animationType="fade"`, `statusBarTranslucent`), so it participates in the platform's overlay stack and honours the Android hardware back button.

On mobile, prefer a [`BottomSheet`](./BottomSheet.md) for anything with more than a couple of controls or that the user might dismiss casually — sheets sit under the thumb and drag away naturally. Reach for `Modal` when the interaction is genuinely modal (blocking) and deserves center-stage weight. For a plain yes/no question use the precomposed [`ConfirmDialog`](./ConfirmDialog.md), which is built on this component.

## Visual anatomy

```
  ┌───────────────────────────────────────┐
  │  Title                          [ ✕ ]  │  ← header (always rendered)
  ├───────────────────────────────────────┤     borderBottom: borders.hair
  │                                         │
  │  children (body)                        │  padding: spacing[4], gap: spacing[3]
  │                                         │
  ├───────────────────────────────────────┤     borderTop: borders.hair
  │                    [ Cancel ] [ Save ]  │  ← actions (only if provided)
  └───────────────────────────────────────┘
     maxWidth: 420 · radius.lg · borders.hair · shadows.lg
   ░░░░░░░░ backdrop rgba(11,14,11,0.45), padding spacing[5] ░░░░░░░░
```

The header row is **always** present so the close affordance is reachable — even with no `title`, the `✕` renders at the trailing edge. The body renders only when `children` are passed; the footer renders only when `actions` are passed.

## Variants / sizes / states

- **No variants or sizes.** One layout: a single card, `width: '100%'` capped at `maxWidth: 420`, centered. There is no `size` prop — width is driven by the viewport and the 420 cap.
- **States** — `visible` toggles the fade in/out. Backdrop press dismisses unless `dismissOnBackdrop={false}`.

## Rules

- **Container radius is `radius.lg`**, not `radius.xl`. (Foundations lists `radius.xl` for modals as a guideline; the shipped card uses `radius.lg` + `borders.hair` + `lightColors.border`.)
- **Floating surface → `shadows.lg`** is applied to the card (Rule 1 permits shadows on true overlays). The backdrop is a fixed `rgba(11,14,11,0.45)` scrim.
- **Title uses `Text variant="subtitle"`.** Keep it sentence case, short ("Edit teammate", not "EDIT TEAMMATE DETAILS").
- **`actions` sit bottom-end** in a row with `gap: spacing[2]`. Follow the footer-pair convention: one `ghost` Cancel, one `primary`/`danger` confirm — at most one primary (see [`Button`](../02-actions/Button.md)).
- **Dividers, not shadows, inside.** Header gets `borderBottom`, footer gets `borderTop`, both `borders.hair` / `lightColors.border`.
- **The close `✕`** is a `Pressable` with `hitSlop={8}` (reaches the 44pt target) and `Feather name="x"` at `lightColors.textSecondary`.

## Props API

```ts
import type { ReactNode } from 'react';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  /** Footer slot — typically Buttons, rendered at the bottom-end. */
  actions?: ReactNode;
  /** Tap on backdrop dismisses. Defaults to true. */
  dismissOnBackdrop?: boolean;
}
```

- Does not extend RN's `ModalProps` — it is a fixed-shape wrapper. There is no `animationType`, `size`, or `variant` to pass through.
- `onClose` fires on backdrop tap (when allowed), on the header `✕`, and via `onRequestClose` (Android hardware back / OS back gesture).
- **Sibling exports:** [`ConfirmDialog`](./ConfirmDialog.md) is built on `Modal` and re-uses this API.

## Examples

### Open / close with `useState`
```tsx
import { useState } from 'react';
import { Modal, Button, Text } from '@minthr-saas/mobile-ui-kit';

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button label="Edit teammate" onPress={() => setOpen(true)} />
      <Modal
        visible={open}
        onClose={() => setOpen(false)}
        title="Edit teammate"
        actions={
          <>
            <Button label="Cancel" variant="ghost" onPress={() => setOpen(false)} />
            <Button label="Save" variant="primary" onPress={() => setOpen(false)} />
          </>
        }>
        <Text tone="secondary">Update the details for this teammate.</Text>
      </Modal>
    </>
  );
}
```

### Message-only (no footer)
```tsx
<Modal visible={open} onClose={close} title="Session expired">
  <Text tone="secondary">Please sign in again to continue.</Text>
</Modal>
```

### Non-dismissible backdrop (force a choice)
```tsx
<Modal
  visible={open}
  onClose={close}
  title="Unsaved changes"
  dismissOnBackdrop={false}
  actions={
    <>
      <Button label="Discard" variant="danger-ghost" onPress={discard} />
      <Button label="Keep editing" variant="primary" onPress={close} />
    </>
  }>
  <Text tone="secondary">You have changes that haven't been saved.</Text>
</Modal>
```

## When NOT to use

- **A casual, thumb-reachable surface or a form of any length** → [`BottomSheet`](./BottomSheet.md).
- **A plain confirm / destructive yes-no** → [`ConfirmDialog`](./ConfirmDialog.md) (precomposed on this).
- **A side panel of details or filters** → [`Drawer`](./Drawer.md).
- **A short action list from a trigger** → [`Menu`](./Menu.md).
- **Transient status ("Saved")** → `Toast` (see [`Toast`](../05-feedback/Toast.md)), not a blocking modal.

## Accessibility

- Built on RN `Modal`, so it presents as a native modal layer and the OS handles focus containment while it is open.
- **Dismiss paths:** `onRequestClose` wires the **Android hardware back button** and OS back gesture to `onClose`; the on-screen affordances are the header `✕` (`accessibilityRole="button"`, `accessibilityLabel="Close"`, `hitSlop={8}`) and the backdrop tap (when `dismissOnBackdrop`). Always keep at least one visible affordance.
- **`accessibilityViewIsModal` (iOS):** RN's `Modal` container already isolates the screen reader from content behind it. If you nest custom overlays, set `accessibilityViewIsModal` on the topmost surface so VoiceOver doesn't wander behind it (see [Accessibility → Overlays](../00-foundations/07-accessibility.md)).
- Move focus into the modal on open and return it to the trigger on close. Honour Reduce Motion — the fade is short and resolves near-instantly.
