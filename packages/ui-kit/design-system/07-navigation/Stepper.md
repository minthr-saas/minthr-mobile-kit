# Stepper

A vertical numbered indicator for multi-step flows — onboarding, checkout, setup wizards. Shows where the user is and what's done.

## Purpose

`Stepper` renders an ordered list of steps as numbered circles joined by a vertical connector, with a label (and optional description) beside each. It's a pure **display** component driven by `currentStep`: everything before the current index is *complete* (brand fill + check), the current index is *current* (brand ring), everything after is *upcoming* (grey ring). It does not own navigation — the surrounding screen advances `currentStep`.

Mobile idiom: steps stack **vertically** so long labels and descriptions read comfortably on a narrow screen, rather than the cramped horizontal rail a web layout would use.

## Visual anatomy

```
 (✓)  Personal info          ← complete: brand fill, white check
  │       Name, contact…
  │
 (2)  Employment             ← current: white fill, brand ring, brand number, '500' label
  │       Role, start date…
  │
 (3)  Documents              ← upcoming: white fill, grey ring, muted number + label
  │
 (4)  Review
```

Circle is `24×24`, fully rounded via a computed `borderRadius: 12` (half its size), not the `radius.full` token. Row = circle + text with `gap: spacing[3]`. The `1pt` connector between rows is `lightColors.brand` up to `currentStep`, `palette.gray[200]` after.

## Variants / Sizes / States

- **Single layout.** No `variant` or `size` prop — one vertical presentation.
- **Per-step status** (derived, not a prop):
  - **complete** (`idx < currentStep`) — circle filled `lightColors.brand`, white `check` icon, label `tone="primary"` at `'500'`.
  - **current** (`idx === currentStep`) — white circle, `borders.thin` `lightColors.brand` ring, brand number, label `tone="primary"` at `'500'`.
  - **upcoming** (`idx > currentStep`) — white circle, `borders.thin` `lightColors.borderStrong` ring, `textMuted` number, label `tone="muted"`.

## Rules

- **`currentStep` is 0-based.** `currentStep={1}` = the second step is current, the first is complete.
- **Number vs. check.** Upcoming/current show `idx + 1`; complete shows a `Feather` `check` (size `14`, `lightColors.onBrand`) — never a number.
- **Labels are sentence case, short.** "Personal info", "Employment". `description` is an optional one-liner in `caption` / `tone="muted"`.
- **Connector color tracks progress**, so the filled portion visually maps to how far along the user is. Don't recolor it manually.
- **No shadow, no card by default** — it's a bare indicator; drop it into a screen or `Card` as needed.

## Props API

```ts
import type { ViewProps } from 'react-native';

interface StepperStep {
  label: string;
  description?: string;
}

interface StepperProps extends ViewProps {
  steps: readonly StepperStep[];
  /** Index of the current step (0-based). All earlier steps are marked complete. */
  currentStep: number;
  // ...rest of ViewProps spreads onto the outer container
}
```

Sibling export: `StepperStep`. There is **no** `onChange` / `onStepPress` — steps are not tappable. Drive progress from the parent (e.g. a Back / Next button pair).

## Examples

### Wizard progress
```tsx
import { Stepper } from '@minthr-saas/mobile-ui-kit';

const steps = [
  { label: 'Personal info', description: 'Name, contact, address.' },
  { label: 'Employment', description: 'Role, start date, contract type.' },
  { label: 'Documents', description: 'ID, proof of address, contract.' },
  { label: 'Review' },
];

<Stepper steps={steps} currentStep={1} />
```

### Driven by Back / Next
```tsx
const [current, setCurrent] = useState(0);

<Stepper steps={steps} currentStep={current} />
<View style={{ flexDirection: 'row', gap: spacing[2] }}>
  <Button
    label="Back"
    variant="secondary"
    disabled={current === 0}
    onPress={() => setCurrent((c) => Math.max(0, c - 1))}
  />
  <Button
    label="Next"
    disabled={current === steps.length - 1}
    onPress={() => setCurrent((c) => Math.min(steps.length - 1, c + 1))}
  />
</View>
```

### Labels only (no descriptions)
```tsx
<Stepper
  steps={[{ label: 'Cart' }, { label: 'Address' }, { label: 'Payment' }]}
  currentStep={2}
/>
```

## When NOT to use

- **Switching between peer views (no order)** → [`Tabs`](./Tabs.md).
- **A single continuous percentage** → [`ProgressBar`](../05-feedback/ProgressBar.md).
- **A location trail through nested screens** → [`Breadcrumbs`](./Breadcrumbs.md).
- **More than ~5 steps** → collapse into phases or a progress bar; a long vertical stepper dominates the screen.

## Accessibility

- The current implementation renders steps as plain `View`s and does **not** set `accessibilityRole` or `accessibilityState` per step (steps are non-interactive). The circle number is drawn with the kit's typography tokens.
- Because the visual status (fill / ring / check / tone) is not exposed to the screen reader on its own, wrap the `Stepper` in a container with a summarizing label, e.g. `accessibilityLabel="Step 2 of 4: Employment"`, and update it as `currentStep` changes.
- Status is conveyed by **shape + icon + tone**, not color alone (complete = check glyph, current = filled ring) — this satisfies the "never rely on color" rule.
- No tap targets to size — it is display-only.
