# ConfirmDialog

A precomposed yes/no confirmation dialog built on `Modal`, with a default and a danger variant.

## Purpose

`ConfirmDialog` is the ready-made way to ask "are you sure?" before a consequential action. It wraps [`Modal`](./Modal.md) with a fixed layout: an icon in a tinted circle, a title, a message, and a `Cancel` / confirm [`Button`](../02-actions/Button.md) pair. Reach for it instead of hand-building a `Modal` every time you need a binary decision — especially destructive ones (delete, remove, discard).

For anything richer than a single message + yes/no (a form, multiple options, long content), drop down to a raw [`Modal`](./Modal.md) or a [`BottomSheet`](./BottomSheet.md).

## Visual anatomy

```
  ┌───────────────────────────────────────┐
  │  Delete employee?                 [ ✕ ] │  ← Modal header (title + close)
  ├───────────────────────────────────────┤
  │              ( ⚠ )                      │  ← icon circle (40×40, tinted)
  │                                         │
  │   This action cannot be undone.         │  ← message (Text body, secondary)
  ├───────────────────────────────────────┤
  │                  [ Cancel ] [ Delete ]  │  ← Modal actions
  └───────────────────────────────────────┘
        default → help-circle / brand tint
        danger  → alert-triangle / danger tint
```

The icon circle background is `lightColors.brandSubtle` (default) or `lightColors.dangerSubtle` (danger); the glyph color matches (`lightColors.brand` / `lightColors.danger`).

## Variants / sizes / states

- **`variant="default"`** *(default)* — `help-circle` glyph, brand tint, confirm button is `primary`. For neutral confirmations (leave page, submit).
- **`variant="danger"`** — `alert-triangle` glyph, danger tint, confirm button is `danger`. For destructive actions (delete, remove).
- **No sizes** — inherits the `Modal` card (`maxWidth: 420`, centered).
- **States** — `visible` toggles the fade; the backdrop dismisses (inherited from `Modal`, which defaults `dismissOnBackdrop` to true).

## Rules

- **Title is a question, message is the consequence.** Title: "Delete employee?" — message: "This action cannot be undone." Both sentence case.
- **`variant="danger"` for anything irreversible.** It sets both the warning icon and the `danger` confirm button automatically — don't restyle the buttons yourself.
- **One confirm, one cancel.** The dialog renders exactly two buttons: `cancelLabel` (`ghost`) + `confirmLabel` (`primary`/`danger`). Keep the confirm label a verb ("Delete", "Discard", "Leave").
- **`onConfirm` and `onClose` are separate.** `onConfirm` runs the action; `onClose` just dismisses (Cancel, backdrop, back button). Call your own close after the action if needed.
- **Built on `Modal`** — it inherits the `radius.lg` card, `shadows.lg`, hairline dividers, and the header `✕`. Don't add shadows or restyle.

## Props API

```ts
export type ConfirmDialogVariant = 'default' | 'danger';

export interface ConfirmDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  variant?: ConfirmDialogVariant;   // default 'default'
  confirmLabel?: string;            // default 'Confirm'
  cancelLabel?: string;             // default 'Cancel'
}
```

- Composes [`Modal`](./Modal.md) internally — it does **not** expose `Modal`'s `actions`/`children`/`dismissOnBackdrop`; the layout is fixed. `title` here maps to the Modal title; `message` is the body.
- **Sibling exports:** `ConfirmDialogVariant` type alongside `ConfirmDialog`.

## Examples

### Destructive delete
```tsx
import { useState } from 'react';
import { ConfirmDialog, Button } from '@minthr-saas/mobile-ui-kit';

function DeleteAction() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button label="Delete account" variant="danger" onPress={() => setOpen(true)} />
      <ConfirmDialog
        visible={open}
        onClose={() => setOpen(false)}
        onConfirm={() => { doDelete(); setOpen(false); }}
        title="Delete employee?"
        message="This action cannot be undone."
        variant="danger"
        confirmLabel="Delete"
      />
    </>
  );
}
```

### Neutral confirmation
```tsx
<ConfirmDialog
  visible={open}
  onClose={() => setOpen(false)}
  onConfirm={submit}
  title="Submit timesheet?"
  message="You won't be able to edit it after submitting."
  confirmLabel="Submit"
/>
```

### Discard changes
```tsx
<ConfirmDialog
  visible={open}
  onClose={() => setOpen(false)}
  onConfirm={discard}
  title="Discard changes?"
  message="Your edits will be lost."
  variant="danger"
  confirmLabel="Discard"
  cancelLabel="Keep editing"
/>
```

## When NOT to use

- **A form, multiple choices, or long content** → a raw [`Modal`](./Modal.md) or a [`BottomSheet`](./BottomSheet.md).
- **A short list of actions** → [`Menu`](./Menu.md).
- **A non-blocking success/failure message** → `Toast` (see [`Toast`](../05-feedback/Toast.md)).
- **A side panel of detail** → [`Drawer`](./Drawer.md).
- **An inline warning that doesn't block** → an `Alert` / `Callout` on the screen.

## Accessibility

- Inherits everything from [`Modal`](./Modal.md): native modal presentation, the header `✕` (`accessibilityRole="button"`, `accessibilityLabel="Close"`), backdrop dismiss, and `onRequestClose` for the **Android hardware back button** / OS back gesture — all routed to `onClose`.
- **Never rely on color alone** — the danger variant pairs the red tint with an `alert-triangle` icon *and* the word in the confirm label; the meaning survives for color-blind users (see [Accessibility → never rely on color](../00-foundations/07-accessibility.md)).
- The confirm/cancel `Button`s carry their visible labels as accessible names; keep them verbs so intent is clear out of context.
- **Focus containment** — focus moves into the dialog on open and returns to the trigger on close; treat the surface as `accessibilityViewIsModal` on iOS.
- Honour Reduce Motion — the fade is short and resolves near-instantly.
