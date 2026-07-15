# PhoneInput

A phone-number field: an [`Input`](./Input.md) with a leading country selector (flag + dial code) that opens a searchable country sheet.

## Purpose

International phone entry needs a country dial code alongside the number. `PhoneInput` puts a **country indicator** on the leading edge of a standard [`Input`](./Input.md) — the flag emoji, the `+dial` code, and a `chevron-down` — and forces the `phone-pad` keyboard for the number itself.

Tapping the indicator opens a **BottomSheet country selector**: a search field over the country list (match by name or dial code), with the active country checked. Countries come from static data in [`src/data/countries.ts`](../../src/data/countries.ts) (`COUNTRIES`, `findCountry`, `DEFAULT_FAVORITES`), using emoji flags — no SVG assets to bundle.

> **Requires a `SheetProvider`.** The selector opens via `useSheet()`; wrap your app in a `SheetProvider` (once, at the root) or opening will throw.

## Visual anatomy

```
┌───────────────┬──────────────────────────┐
│ 🇲🇦 +212  ⌄   │  6 12 34 56 78            │
└───────────────┴──────────────────────────┘
   ↑ indicator (opens sheet)   ↑ phone-pad Input

 selector sheet
┌───────────────────────────────┐
│ Select country                │
│ [🔍 Search countries or codes]│
│  🇫🇷  France            +33    │
│  🇲🇦  Morocco           +212 ✓ │
│  …                            │
└───────────────────────────────┘
```

Indicator: `surfaceSubtle` fill, `spacing[3]` horizontal padding, full height, a trailing hairline + `marginEnd` separating it from the number, medium-weight dial code, and a `chevron-down` (14) in `textSecondary`.

## Behavior

- **Controlled or uncontrolled country** — pass `countryCode` (a code string like `"MA"`) to control it; omit it and the component tracks its own state starting from `defaultCountry` (default `'FR'`). `onCountryChange` fires the selected code either way.
- **The number is the `Input` value** — `value` / `onChangeText` flow straight through to the underlying `Input`. `keyboardType` is fixed to `phone-pad`; `leftIcon` is taken over by the indicator (don't pass your own).
- **Selector** — filters `COUNTRIES` by `name` or `dialCode` substring (case-insensitive), shows flag + name + dial code, a `check` on the active row, and "No countries found" when nothing matches.

## States

- Inherits `Input` states: default, focused (brand border), `error` (danger border + message), `disabled`.
- `disabled` greys the dial code (`muted`) and chevron and blocks the sheet.

## Rules

- **`PhoneInput` does not format or validate the number.** It hands you the raw string the user typed and the selected country code separately; do any E.164 assembly / validation at the call site (`libphonenumber` or your own). Store the two independently.
- **Codes are ISO alpha-2** (`FR`, `MA`, `US`) — the value of `countryCode` / `defaultCountry`. Note `US` and `CA` share `+1`; disambiguate by code, not dial code.
- **The country list is fixed data.** `COUNTRIES`, `findCountry`, and `DEFAULT_FAVORITES` live in `src/data/countries.ts` and are **not** re-exported from the package barrel today. To seed or preselect, use a plain code string.
- **One indicator.** The country selector always sits on the leading edge (it's the Input's `leftIcon`); there's no trailing variant.
- **Tokens & icons** — `surfaceSubtle` indicator, `borders.hair` divider, `Feather` `chevron-down` in a semantic token. No shadow (Rule 1).

## Props API

```ts
// from src/data/countries.ts (not currently barrel-exported)
type Country = {
  code: string;       // ISO alpha-2 — 'FR', 'MA', 'US'
  name: string;       // 'France'
  flag: string;       // '🇫🇷' (emoji)
  dialCode: string;   // '+33'
};

interface PhoneInputProps extends Omit<InputProps, 'left'> {
  countryCode?: string;                          // controlled ISO code
  onCountryChange?: (countryCode: string) => void;
  defaultCountry?: string;                        // default 'FR' (uncontrolled)
  // ── inherited from Input ──
  // value?: string;  onChangeText?: (text: string) => void;
  // label?, hint?, error?, disabled?, placeholder?, rightIcon? …
  // (leftIcon is overridden by the country indicator; keyboardType is forced to 'phone-pad')
}
```

`PhoneInput` and `PhoneInputProps` are exported.

## Examples

### Controlled country + number
```tsx
import { useState } from 'react';
import { PhoneInput } from '@minthr-saas/mobile-ui-kit';

const [phone, setPhone] = useState('');
const [country, setCountry] = useState('MA');

<PhoneInput
  label="Mobile number"
  value={phone}
  onChangeText={setPhone}
  countryCode={country}
  onCountryChange={setCountry}
  placeholder="6 12 34 56 78"
/>
```

### Uncontrolled with a default country
```tsx
const [phone, setPhone] = useState('');

<PhoneInput
  label="Emergency contact"
  defaultCountry="FR"
  value={phone}
  onChangeText={setPhone}
/>
```

### With validation error
```tsx
<PhoneInput
  label="Work phone"
  value={phone}
  onChangeText={setPhone}
  countryCode={country}
  onCountryChange={setCountry}
  error={!isValid ? 'Enter a valid number' : undefined}
/>
```

## When NOT to use

- **An email or generic contact string** → [`Input`](./Input.md) with `keyboardType="email-address"`.
- **A numeric quantity** (extension count, code length) → [`NumberInput`](./NumberInput.md).
- **A one-time verification code** → [`OtpInput`](./OtpInput.md).
- **Only choosing a country, no number** → a [`BottomSheet`](../06-overlays/BottomSheet.md) list or [`Select`](./Select.md).

## Accessibility

- The number field inherits `Input` semantics (label association, `error` text).
- The country indicator is a `Pressable`; it announces the flag and dial code. Provide a `label` so the field's purpose is clear.
- Inside the sheet each country is a `Pressable` row with a visible `check` on the active one; the search `Input` is `autoFocus` so focus lands there when the sheet opens.
- The forced `phone-pad` keyboard gives the correct input affordance without extra props.
