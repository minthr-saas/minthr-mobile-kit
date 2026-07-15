# Accordion

Collapsible sections stacked inside one hair-bordered surface — tap a header to expand or collapse its body.

## Purpose

`Accordion` is a container that manages open/closed state for its `AccordionItem` children through React context. Each item has a pressable header (title + chevron) and a body that animates in and out with `LayoutAnimation`. It defaults to **single-open** (opening one closes the others); pass `multiple` to allow several open at once.

On mobile, accordions condense long content — FAQs, grouped settings, review summaries — into a scannable list that fits the viewport. The whole group is one bordered surface (`radius.lg`, `borders.hair`) with **no shadow** (Rule 1); item boundaries are hairlines.

## Visual anatomy

```
┌────────────────────────────────────┐  ← surface: borders.hair, radius.lg, overflow hidden
│  Section one            ⌃          │  ← header (Pressable): title + chevron-up (open)
│  Body content of section one …      │  ← body: shown only when expanded
├────────────────────────────────────┤  ← item top hairline
│  Section two            ⌄          │  ← chevron-down (collapsed)
├────────────────────────────────────┤
│  Section three          ⌄          │
└────────────────────────────────────┘
   header: padH spacing[4], padV spacing[3], gap spacing[3]
   chevron: Feather chevron-up / chevron-down, size 16, textSecondary
```

## Modes

- **Single-open** (`multiple={false}`, **default**) — opening an item collapses whichever was open. Best for FAQs and mutually-exclusive detail.
- **Multiple-open** (`multiple`) — items toggle independently; any number can be open. Best for filter groups or a settings screen where users compare sections.

## States

- **Collapsed** — body unmounted, chevron points down (`chevron-down`).
- **Expanded** — body mounted, chevron points up (`chevron-up`). Controlled per-item via context; seed initial open items with `defaultExpanded`.
- **Pressed** — the header background shifts to `lightColors.surfaceSubtle` while held.
- Toggling runs `LayoutAnimation.Presets.easeInEaseOut` (enabled on Android via `UIManager.setLayoutAnimationEnabledExperimental`).

## Rules

- **No shadow** (Rule 1). The group is a hair-bordered surface; items divide with a top hairline (`borders.hair` + `lightColors.border`).
- **The chevron is vertical, not directional.** It uses `chevron-up`/`chevron-down` — an expand/collapse affordance — so it does **not** use the RTL `forwardChevron()` helper (that is for drill-in rows like `ListItem`).
- **Header title is `Text` `variant="body"` at `fontWeight: '500'`** (Rule 4 — medium is the heaviest allowed). Sentence case (Rule 5).
- **`id` must be unique** within an `Accordion` — it is the key the context uses to track expansion.
- **`AccordionItem` must live inside an `Accordion`** — it reads the context and throws `"AccordionItem must be used inside an Accordion."` if rendered standalone.
- **Radius `radius.lg`** with `overflow: 'hidden'` so item backgrounds clip to the rounded surface.

## Props API

```ts
import type { ReactNode } from 'react';

interface AccordionProps {
  multiple?: boolean;                  // allow >1 open at once — default false
  defaultExpanded?: readonly string[]; // item ids to start expanded — default []
  children: ReactNode;                 // AccordionItem elements
}
```

### Sibling export — `AccordionItem`

```ts
interface AccordionItemProps {
  id: string;        // unique within the Accordion; the expansion key
  title: string;     // header label — Text variant="body", fontWeight '500'
  children: ReactNode; // body content, shown when expanded
}
```

`Accordion` owns state internally (uncontrolled) — there is no `onChange`/`value` prop and no `style` passthrough. Neither export extends `ViewProps`.

## Examples

### FAQ (single-open)
```tsx
import { Accordion, AccordionItem, Text } from '@minthr-saas/mobile-ui-kit';

<Accordion>
  <AccordionItem id="pto" title="How do I request time off?">
    <Text tone="secondary">Open the Leave tab and tap New request.</Text>
  </AccordionItem>
  <AccordionItem id="pay" title="When is payday?">
    <Text tone="secondary">The last working day of each month.</Text>
  </AccordionItem>
</Accordion>
```

### Multiple-open with a section pre-expanded
```tsx
<Accordion multiple defaultExpanded={['general']}>
  <AccordionItem id="general" title="General">
    <Text tone="secondary">Language, timezone, and locale.</Text>
  </AccordionItem>
  <AccordionItem id="privacy" title="Privacy">
    <Text tone="secondary">Who can see your profile.</Text>
  </AccordionItem>
</Accordion>
```

### Rich body with kit components
```tsx
import { Accordion, AccordionItem, Button, Text } from '@minthr-saas/mobile-ui-kit';
import { Feather } from '@expo/vector-icons';
import { lightColors } from '@minthr-saas/mobile-ui-kit';

<Accordion>
  <AccordionItem id="export" title="Export data">
    <Text tone="secondary">Download a CSV of this workspace.</Text>
    <Button
      label="Export"
      variant="secondary"
      leftIcon={<Feather name="download" size={16} color={lightColors.textPrimary} />}
      onPress={onExport}
    />
  </AccordionItem>
</Accordion>
```

## When NOT to use

- **A flat list of navigable rows** → [`List`](./ListItem.md) + [`ListItem`](./ListItem.md) with a forward chevron.
- **A single always-visible grouped block** → [`Card`](./Card.md).
- **Only two or three short items that all fit** → just show them; collapsing adds friction with no payoff.
- **Switching between mutually-exclusive views** → `Tabs` or `SegmentedControl`, not stacked accordions.
- **A menu of one-shot actions** → [`Menu`](../06-overlays/Menu.md) or [`BottomSheet`](../06-overlays/BottomSheet.md).

## Accessibility

- Each header is a `Pressable` with `accessibilityRole="button"` and `accessibilityState={{ expanded: isOpen }}`, so assistive tech announces the expanded/collapsed state.
- The visible `title` is the accessible name; keep it descriptive and standalone.
- Collapsed bodies are unmounted (not just hidden), so their content is correctly absent from the accessibility tree until expanded.
