# 04 — Spacing

Spacing lives in [`src/tokens/spacing.ts`](../../src/tokens/spacing.ts). Every gap, pad, and margin is a multiple of 4, addressed by its multiplier key.

```ts
import { spacing } from '@minthr-saas/mobile-ui-kit';
// spacing[1] === 4, spacing[2] === 8, spacing[4] === 16, spacing[6] === 24 …
```

## The 4px base scale

| Key | px | Common uses |
|---|---|---|
| `0` | 0 | Reset |
| `1` | 4 | Icon-to-text gap in tight contexts |
| `2` | 8 | Chip padding, tight internal gaps |
| `3` | 12 | Button gap, compact row padding |
| `4` | 16 | **Default** — screen padding, card padding, field spacing |
| `5` | 20 | Generous card padding |
| `6` | 24 | Section spacing |
| `8` | 32 | Major section spacing |
| `10` | 40 | Screen-level spacing |
| `12` | 48 | Large vertical rhythm |
| `16` | 64 | Hero / empty state |

There is intentionally **no** `7`, `9`, `11`, `13`, `14`, `15` key. If you reach for one, round to the nearest step.

## No arbitrary values

If you catch yourself typing `padding: 10` or `marginTop: 14` — stop and use a token.

- ❌ `{ paddingVertical: 10, paddingHorizontal: 14 }`
- ✅ `{ paddingVertical: spacing[2], paddingHorizontal: spacing[4] }`

The only raw numeric values allowed in component code are: border widths (use `borders.*`), `borderRadius` (use `radius.*`), fixed control heights that come from a component's size spec (e.g. a 44pt row), and animation offsets.

## Logical direction (RTL)

Use **logical** spacing props so the kit flips correctly in RTL. React Native supports these natively:

- ✅ `paddingStart` / `paddingEnd` / `marginStart` / `marginEnd`
- ❌ `paddingLeft` / `paddingRight` / `marginLeft` / `marginRight`

`paddingVertical` / `paddingHorizontal` / `gap` are symmetric and always fine. See [08-rtl-and-logical-properties.md](./08-rtl-and-logical-properties.md).

## Mobile density reference

Heights come from each component's size spec; use these as the house defaults.

### Screen padding
- Standard content inset: `spacing[4]` (16) on the horizontal edges.
- Respect the safe area (notch, home indicator) with `react-native-safe-area-context` — do **not** hardcode status-bar height.

### Controls (Button / Input / IconButton)
- `sm` — 28–32pt tall
- `md` — 36–38pt tall (**default**)
- `lg` — 44pt tall

Even when a control is smaller than 44pt, keep its **tap target** ≥44×44pt (pad the `Pressable`, or add `hitSlop`). This is a hard mobile rule.

### Cards & rows
- `Card` padding: `spacing[4]` (16) default, `spacing[5]` (20) generous.
- `ListItem` row: `spacing[3]`–`spacing[4]` vertical, `spacing[4]` horizontal, 44pt minimum height.

### Sheets & modals
- `BottomSheet` / `Modal` content padding: `spacing[4]`–`spacing[5]`.
- Sheet handle + header sit above the content padding.

## Vertical rhythm

Prefer a single `gap` on a flex container over per-child margins — it collapses cleanly and reads consistently:

```tsx
<View style={{ gap: spacing[4] }}>
  <FormField … />
  <FormField … />
  <Button … />
</View>
```

Between **related** items use one step (e.g. `spacing[3]`/`spacing[4]`); between **unrelated** sections use roughly double (`spacing[6]`/`spacing[8]`).

## When in doubt

- Pick the smaller value. Tighter reads more premium.
- Adjacent similar elements get the same spacing.
- Use `gap`, not stacked margins, for lists of siblings.
