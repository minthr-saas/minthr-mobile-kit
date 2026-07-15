# 09 — Showcase demos

## Why this exists

Every component ships with a demo screen in the Expo showcase app at `apps/showcase/app/(home)/<component>.tsx`. Those screens are the living documentation — the place a teammate opens on a device to see every variant, size, and state before reaching for a component. If each dev builds their demo screen freehand, the showcase stops feeling like one system.

**Rule:** never build a demo screen without the shared `Section` scaffold.

## The showcase app

- Expo Router. The component index lives at `app/(home)/index.tsx`; each component gets its own route file `app/(home)/<component>.tsx`.
- Route file name matches the registry `path` (e.g. `Button` → `/button` → `button.tsx`). See [`src/_registry.ts`](../../src/_registry.ts).
- Shared demo scaffolding lives in `app/(home)/_components/` — the key one is `Section`.

## The demo screen skeleton

```tsx
import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Button, Text, spacing } from '@minthr-saas/mobile-ui-kit';
import { Section } from './_components/Section';

export default function ButtonDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Button' }} />

      <Text variant="body" tone="secondary">
        Pressable action. 6 variants × 3 sizes, with disabled and full-width states.
      </Text>

      <Section label="Variants">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
          <Button label="Primary" variant="primary" onPress={() => {}} />
          <Button label="Secondary" variant="secondary" onPress={() => {}} />
          {/* … */}
        </View>
      </Section>

      <Section label="Sizes">{/* … */}</Section>
      <Section label="States">{/* … */}</Section>
    </ScrollView>
  );
}
```

### The parts

- **`<ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>`** — the screen frame. Consistent 20pt padding and section gap across every demo.
- **`<Stack.Screen options={{ title }}>`** — sets the native header title to the component name.
- **Lead `<Text variant="body" tone="secondary">`** — one-line description. Copy it from the component's registry `description` so the two never drift.
- **`<Section label="…" description?="…" flush?>`** — one per topic (Variants / Sizes / States / Examples). Renders a caption-styled label, optional sub-description, and an inset `surfaceSubtle` preview card. Pass `flush` to drop the preview background for full-bleed demos (overlays, sheets, full-width bars).

## `Section` — the one scaffold

```ts
interface SectionProps {
  label: string;
  description?: string;
  children: ReactNode;
  /** Disable the inset preview background — for full-bleed demos. */
  flush?: boolean;
}
```

Use it for **every** group of examples. Don't hand-roll ad-hoc `View`s with custom padding — the whole point is that `/button` and `/input` and `/modal` share one rhythm.

## What a demo screen must cover

A demo is done when it shows:

1. **Every variant** (all `variant` values, laid out to compare).
2. **Every size** (`sm` / `md` / `lg` where applicable).
3. **Every meaningful state** — default, disabled, loading, error, selected, empty.
4. **Realistic examples** — the component in a plausible MintHR context (a form row, a list, a sheet), not just floating primitives.
5. **Interaction** — for stateful components, wire real `useState` so a reviewer can tap and see it work.
6. **Overlays/gestures** use `flush` sections and are actually openable (a trigger `Button`, not a static screenshot).

## Rules

1. **Always use `ScrollView` + `Section`.** No custom screen frame, no ad-hoc padding.
2. **Lead with the registry description**, verbatim, so docs and registry agree.
3. **`<Stack.Screen options={{ title }}>` title = the component name** (`Button`, not `button`).
4. **Sentence case** for all labels and copy (foundation rule).
5. **Add the route when you add the component** — new component ⇒ new `_registry.ts` entry ⇒ new `app/(home)/<component>.tsx`. All three, same PR.
6. **Tokens only** in demo code too — `spacing[*]`, `lightColors.*`. Demos are read as reference; sloppy demos teach sloppy usage.

## Adding a shared demo helper

If you find yourself repeating the same demo widget (a state toggle, a fake list) across screens, add it to `app/(home)/_components/` rather than copy-pasting, and note it here so the next dev finds it. The existing helpers include `Section`, `DemoHeader`, and a few example overlays (`NavigationDrawer`, `ProfileDrawer`, `QuickActionsSheet`).
