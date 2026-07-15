# CurrencyInput

A money field: a [`NumberInput`](./NumberInput.md) paired with a currency indicator that can open a searchable currency selector.

## Purpose

Amounts in an HR product (salary, allowance, expense) are always a *number + a currency*. `CurrencyInput` composes the two: the numeric side is a full [`NumberInput`](./NumberInput.md) (including its `−`/`+` steppers, `min`/`max`/`step`, and error/hint), and a currency **indicator** sits on the leading or trailing edge showing the symbol (or code when there's no symbol, e.g. `MAD`, `TND`).

When `switchable`, tapping the indicator opens a **BottomSheet currency selector** — a search field over the currency list with the active code checked. This is the mobile idiom: a full-height searchable sheet rather than a cramped inline dropdown. Currencies come from static data in [`src/data/currencies.ts`](../../src/data/currencies.ts) (`CURRENCIES` / `HR_COMMON_CURRENCIES`).

> **Requires a `SheetProvider`.** The selector is opened via `useSheet()`, so a `SheetProvider` must wrap your app (usually once at the root). Without it, opening throws.

## Visual anatomy

```
 switchable, symbolPosition="start"
┌──────┬───────────────────────────────────┐
│ $  ⌄ │  [−]      1250          [+]        │
└──────┴───────────────────────────────────┘
   ↑ indicator (opens sheet)   ↑ NumberInput with steppers

 selector sheet
┌───────────────────────────────┐
│ Select currency               │
│ [🔍 Search currencies…]       │
│  $   USD — US Dollar        ✓ │
│  €   EUR — Euro               │
│  …                            │
└───────────────────────────────┘
```

Indicator: `surfaceSubtle` fill, `spacing[3]` horizontal padding, full height, a hairline dividing it from the field, medium-weight label, and a `chevron-down` (14, `textSecondary`) only when `switchable`.

## Behavior

- **`symbolPosition`** — `'start'` (default) puts the indicator before the field with a trailing hairline + `marginEnd`; `'end'` puts it after with a leading hairline + `marginStart`.
- **`switchable`** — default `false`. When `false` the indicator is static (transparent fill, not pressable, no chevron) — a fixed-currency field. When `true` it's a `Pressable` that opens the sheet.
- **Controlled or uncontrolled currency** — pass `currency` to control it (a `Currency` object or a string code like `"USD"`); omit it and the component tracks its own selection internally, defaulting to `EUR`. `onCurrencyChange` fires the chosen `Currency` either way.
- **Selector** — filters by `code` or `name` (case-insensitive), shows the symbol/code, name, and a `check` on the active row; empty search shows "No currencies found".

## States

- Numeric side inherits `NumberInput` states: default, focused (brand border), `error` (danger border + message), `disabled`.
- `disabled` also greys the indicator label (`muted`), removes the chevron, and blocks the sheet.

## Rules

- **The `decimals` on a `Currency` are data, not formatting.** This mobile field displays the symbol/code and delegates numeric entry to `NumberInput`; it does not auto-round to `decimals`. Format for display at the call site with `Intl.NumberFormat` when you render the stored value.
- **Use codes without symbols deliberately.** `MAD`, `TND`, `DZD`, `CHF`, `XOF`, `XAF` have **no** `symbol`, so the indicator shows the 3-letter code — correct and expected.
- **`availableCurrencies` narrows the sheet.** Omit it and the sheet lists every entry in `CURRENCIES`. Pass a subset (e.g. `HR_COMMON_CURRENCIES`) to shorten it. These live in `src/data/currencies.ts` and are **not** re-exported from the package barrel today — import from source or build your own `Currency[]`.
- **One indicator, one edge.** Don't render symbols on both sides; pick `symbolPosition`.
- **Tokens & icons** — indicator fill is `surfaceSubtle`, divider is `borders.hair`, chevron is a `Feather` glyph in `textSecondary`. No shadow (Rule 1).

## Props API

```ts
// from src/data/currencies.ts (not currently barrel-exported)
type Currency = {
  code: string;       // 'USD', 'MAD', …
  symbol?: string;    // '$', '€' … absent for MAD/TND/DZD/CHF/XOF/XAF
  decimals: number;   // 2, 3, or 0 (data only — see Rules)
  name?: string;
};

interface CurrencyInputProps
  extends Omit<NumberInputProps, 'precision' | 'prefix' | 'suffix' | 'textAlign'> {
  currency?: Currency | string;                 // default EUR (string code resolves via CURRENCIES)
  onCurrencyChange?: (currency: Currency) => void;
  availableCurrencies?: Currency[];             // default Object.values(CURRENCIES)
  switchable?: boolean;                          // default false
  symbolPosition?: 'start' | 'end';             // default 'start'
  // ── inherited from NumberInput ──
  // value: number | null;  onChange: (value: number | null) => void;   (required)
  // label?, hint?, error?, disabled?, min?, max?, step?  and TextInputProps
}
```

`CurrencyInput` and `CurrencyInputProps` are exported. The numeric `value` is a `number | null` and updates come through `onChange` (NOT `onChangeText`).

## Examples

### Fixed currency (not switchable)
```tsx
import { useState } from 'react';
import { CurrencyInput } from '@minthr-saas/mobile-ui-kit';

const [amount, setAmount] = useState<number | null>(1250);

<CurrencyInput
  label="Gross salary"
  currency="MAD"
  value={amount}
  onChange={setAmount}
/>
```

### Switchable currency with change handler
```tsx
const [amount, setAmount] = useState<number | null>(null);
const [code, setCode] = useState('EUR');

<CurrencyInput
  label="Expense amount"
  switchable
  currency={code}
  onCurrencyChange={(c) => setCode(c.code)}
  value={amount}
  onChange={setAmount}
  hint="Reimbursed in company currency"
/>
```

### Symbol on the trailing edge, with validation
```tsx
<CurrencyInput
  label="Bonus"
  currency="USD"
  symbolPosition="end"
  value={bonus}
  onChange={setBonus}
  min={0}
  error={bonus === null ? 'Enter an amount' : undefined}
/>
```

## When NOT to use

- **A plain quantity or count** (no currency) → [`NumberInput`](./NumberInput.md).
- **A percentage or ratio** → [`NumberInput`](./NumberInput.md) with a `%` shown alongside.
- **Free-text that happens to contain digits** (an IBAN, an employee ID) → [`Input`](./Input.md).
- **Only picking a currency, no amount** → open a [`BottomSheet`](../06-overlays/BottomSheet.md) list or use [`Select`](./Select.md).

## Accessibility

- The numeric field, its `−`/`+` steppers ("Decrement" / "Increment"), and its `error` messaging come from [`NumberInput`](./NumberInput.md).
- When `switchable`, the indicator is a `Pressable`; give the surrounding field a `label` so the amount's purpose is announced.
- Inside the selector sheet each currency row is a `Pressable`; the active row shows a visible `check`. The search `Input` is `autoFocus` so a screen reader lands on it when the sheet opens.
