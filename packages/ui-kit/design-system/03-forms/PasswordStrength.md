# PasswordStrength

A four-segment meter plus a word that rates how strong a password looks — a live, reassuring hint shown beneath a password field.

## Purpose

A read-only *display* control. Give it the current `password` string and it renders four bars that fill left-to-right and a colour-coded label ("Weak", "Fair", "Good", "Strong"). It pairs with an [`Input`](./Input.md) using `secureTextEntry`; it is **not** an input itself and holds no state.

The package also exports the scorer, `getPasswordScore`, so you can gate a submit button on the same heuristic the meter displays — keeping the visual and the logic in sync.

> The scorer is a lightweight client-side hint, **not** a real entropy estimator. Always validate password policy on the server too.

## Visual anatomy

```
▇▇▇▇  ▇▇▇▇  ▁▁▁▁  ▁▁▁▁      ← 4 bars, height 4, radius.full, gap spacing[1]
Fair                        ← label, medium, colour == meter colour
```

Bar `idx` (0–3) is filled when `score > idx`, so the number of filled bars equals the capped score. Filled bars take the score's colour; empty bars are `palette.gray[100]`.

## Scoring

`getPasswordScore(password)` returns `{ score, label, color }`. Empty input is a special case; otherwise points accumulate and cap at 4:

| Condition | Points |
|---|---|
| length ≥ 8 | +1 |
| length ≥ 12 | +1 |
| has both upper- and lower-case | +1 |
| has a digit | +1 |
| has a symbol (non-alphanumeric) | +1 |

| `score` | `label` | `color` |
|---|---|---|
| — (empty string) | `Empty` | `palette.gray[300]` |
| 0 | `Very weak` | `palette.danger[500]` |
| 1 | `Weak` | `palette.danger[500]` |
| 2 | `Fair` | `palette.warning[500]` |
| 3 | `Good` | `palette.success[500]` |
| 4 | `Strong` | `palette.success[700]` |

`PasswordScore` is exported as the literal union `0 | 1 | 2 | 3 | 4`.

## Rules

- **Display only** — no `onChange`, no focus, no keyboard. It reflects the `password` you feed it and nothing more.
- **Meaning drives colour**, so this component reads the raw `palette` severity ramp (danger → warning → success) rather than a single `lightColors` semantic token — the four steps need four distinct hues. This is the one sanctioned place to cross the "semantic tokens only" line, because the colour *is* the data.
- **Sentence-case labels**, one word or two ("Very weak"). Acronyms aren't involved here.
- **Bars are 4pt tall, `radius.full`** (pill), evenly spaced with `spacing[1]`; the whole block stacks with `spacing[1]` gap above the label.
- **No shadow** (Rule 1) — it's a flat inline meter.
- **Extends `ViewProps`** — pass `style` to position it (e.g. a small `marginTop` under the field); the container styles merge with yours.

## Props API

```ts
import type { ViewProps } from 'react-native';

type PasswordScore = 0 | 1 | 2 | 3 | 4;

interface PasswordStrengthProps extends ViewProps {
  password: string;   // required — the string to score
  // style, testID, … from ViewProps
}

// Sibling export — the scorer behind the meter:
function getPasswordScore(password: string): {
  score: PasswordScore;
  label: string;
  color: string;
};
```

`ScoreInfo` (the return shape) is internal and not exported; consume the object structurally.

## Examples

### Under a password field
```tsx
import { Input, PasswordStrength } from '@minthr-saas/mobile-ui-kit';

const [pw, setPw] = useState('');

<>
  <Input label="New password" secureTextEntry value={pw} onChangeText={setPw} />
  {pw.length > 0 ? <PasswordStrength password={pw} /> : null}
</>
```

### Gate the submit on the same heuristic
```tsx
import { getPasswordScore, Button } from '@minthr-saas/mobile-ui-kit';

const strongEnough = getPasswordScore(pw).score >= 3;

<Button label="Set password" disabled={!strongEnough} onPress={submit} />
```

### Spacing it off the field
```tsx
import { spacing } from '@minthr-saas/mobile-ui-kit';

<PasswordStrength password={pw} style={{ marginTop: spacing[1] }} />
```

## When NOT to use

- **Capturing the password** → it's display-only; use [`Input`](./Input.md) with `secureTextEntry`.
- **Enforcing policy** → don't rely on the meter alone; validate server-side and surface failures via the `Input` `error` string.
- **A generic progress indicator** → use [`ProgressBar`](../05-feedback/ProgressBar.md).
- **Showing a numeric percentage / determinate value** → `ProgressBar`, not a 4-step severity meter.

## Accessibility

- As a `View`, it carries no role by default. When the meter is the only strength cue, add `accessibilityLabel` (e.g. `` `Password strength: ${getPasswordScore(pw).label}` ``) so the rating is spoken, since bar colour alone is not perceivable to all users.
- Colour is never the *sole* signal — the word label always accompanies the bars — but reinforce it with the spoken label above for screen-reader users.
- Consider wrapping it in `accessibilityLiveRegion="polite"` so the rating is announced as the user types, without stealing focus.
