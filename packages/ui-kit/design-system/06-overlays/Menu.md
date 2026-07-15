# Menu

An anchored popover action list that appears below its trigger and auto-flips above when near the bottom of the screen.

## Purpose

`Menu` is the mobile replacement for a desktop dropdown-menu. It measures a trigger view (via `anchorRef`) and floats a short list of actions next to it, aligning its leading edge with the anchor's leading edge. If there isn't room below, it flips above. A full-screen backdrop press dismisses it.

Use it for a compact set of contextual actions on a row or a header button — "Edit / Duplicate / Delete". For more than ~5 actions, or actions that need descriptions or sections, use a [`BottomSheet`](./BottomSheet.md) instead — it's more comfortable under the thumb and scrolls.

## Visual anatomy

```
   [ ⋮ ]  ← anchorRef (a View wrapping the trigger)
   ┌──────────────────────────┐
   │  ✎  Edit                  │  ← MenuRow (minHeight 44)
   │  ⧉  Duplicate             │
   │  🗑  Delete                │  ← destructive → lightColors.danger
   └──────────────────────────┘
     minWidth 200 · radius.lg · borders.hair · shadows.md
     GAP 4pt below the anchor · flips above when it would overflow the bottom
```

The menu aligns its **leading edge** to the anchor's leading edge and clamps to `spacing[3]` from the screen edges. In RTL the leading edge is on the right, computed from the anchor's physical right.

## Variants / sizes / states

- **No variants or sizes.** One surface; width is `minWidth` (default `200`) expanding to content, clamped to the viewport.
- **Row states:**
  - **default** — label + optional icon in `lightColors.textPrimary`.
  - **`destructive`** — label + icon in `lightColors.danger` (for Delete / Remove).
  - **`disabled`** — `opacity: 0.5`, not pressable.
  - **pressed** — background `lightColors.surfaceSubtle` (+ Android ripple).
- **Positioning states** — below the anchor (default) or flipped above (auto, when `anchor.y + height + estimatedHeight` would pass the bottom).

## Rules

- **`anchorRef` wraps the trigger.** Put a `ref` on a `View` around the button; the menu measures it with `measureInWindow`. The menu only renders once the anchor is measured.
- **Floating surface → `shadows.md`** + `radius.lg` + `borders.hair` (Rule 1 permits shadow on this overlay). Rows have no dividers — they're separated by spacing.
- **Selecting a row closes the menu first, then runs `onPress`.** Don't also call `onClose` inside your handler.
- **Icons are Feather names** (`item.icon`), rendered at size 16 in the row's tone color. Keep labels sentence case, verb-first ("Edit", "Delete").
- **Rows are ≥44pt tall** (`ESTIMATED_ROW_HEIGHT = 44`) — the tap-target minimum is built in.
- **Reserve `destructive` for one row**, usually last.

## Props API

```ts
import type { ComponentProps, RefObject } from 'react';
import type { View } from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface MenuItem {
  label: string;
  icon?: ComponentProps<typeof Feather>['name'];
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

export interface MenuProps {
  visible: boolean;
  onClose: () => void;
  /** Ref of the View that anchors the menu — usually wraps the trigger. */
  anchorRef: RefObject<View | null>;
  items: readonly MenuItem[];
  /** Min width of the menu surface. Defaults to 200. */
  minWidth?: number;
}
```

- Fixed-shape wrapper on RN `Modal` (`transparent`, `animationType="fade"`). No `style`/`children` pass-through — the action list is data-driven via `items`.
- `onClose` fires on backdrop tap and `onRequestClose` (Android hardware back).
- **Sibling exports:** `MenuItem` type alongside `Menu`.

## Examples

### Row actions with a destructive item
```tsx
import { useRef, useState } from 'react';
import { View } from 'react-native';
import { Menu, IconButton } from '@minthr-saas/mobile-ui-kit';

function RowMenu() {
  const triggerRef = useRef<View>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <View ref={triggerRef}>
        <IconButton icon="more-vertical" accessibilityLabel="More actions"
          onPress={() => setOpen(true)} />
      </View>
      <Menu
        visible={open}
        onClose={() => setOpen(false)}
        anchorRef={triggerRef}
        items={[
          { label: 'Edit', icon: 'edit-2', onPress: handleEdit },
          { label: 'Duplicate', icon: 'copy', onPress: handleDuplicate },
          { label: 'Delete', icon: 'trash-2', destructive: true, onPress: handleDelete },
        ]}
      />
    </>
  );
}
```

### Disabled item + wider surface
```tsx
<Menu
  visible={open}
  onClose={() => setOpen(false)}
  anchorRef={triggerRef}
  minWidth={240}
  items={[
    { label: 'Archive', icon: 'archive', onPress: onArchive },
    { label: 'Export', icon: 'download', disabled: true, onPress: () => {} },
  ]}
/>
```

## When NOT to use

- **More than ~5 actions, or actions needing descriptions/sections** → [`BottomSheet`](./BottomSheet.md).
- **A yes/no or destructive confirm** → [`ConfirmDialog`](./ConfirmDialog.md) (a Menu item can open one).
- **A single-value picker feeding a field** → `Select` / `Combobox` (forms), not a Menu.
- **A focused task or form** → [`Modal`](./Modal.md) or a [`Drawer`](./Drawer.md).
- **A long-press hint on an element** → [`Tooltip`](./Tooltip.md).

## Accessibility

- Each row is a `Pressable` with `accessibilityRole="menuitem"`; disabled rows are non-interactive. The backdrop `Pressable` carries `accessibilityLabel="Close menu"`.
- **Dismiss paths** (per [Accessibility → Overlays](../00-foundations/07-accessibility.md)): tap the backdrop or the OS back gesture / **Android hardware back** (`onRequestClose`). Selecting any row also closes.
- **Labels, not glyphs** — the row `label` is the accessible name; the icon is supporting. Give the trigger its own `accessibilityLabel` (e.g. "More actions").
- **Tap targets** — rows are ≥44pt tall by construction; keep the trigger ≥44pt too (add `hitSlop` if the glyph is smaller).
- On iOS, treat the menu surface as modal (`accessibilityViewIsModal`) so the reader stays within the action list while it's open.
