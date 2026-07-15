# Pattern: Auth layout

A **pattern**, not a component — the shared layout for every authentication screen (sign in, forgot password, reset password, OTP verify, invite accept). It guarantees the auth journey feels like one calm, branded flow. Built from `Text`, `Input`, `OtpInput`, `PasswordStrength`, `Button`, `Alert`, and `Callout` on a safe-area, keyboard-aware frame.

## When to use

Every screen in the unauthenticated flow. Not for in-app confirmation dialogs (use [`ConfirmDialog`](../06-overlays/ConfirmDialog.md)) or re-auth prompts inside the app (use a [`BottomSheet`](../06-overlays/BottomSheet.md)).

## Visual anatomy

```
┌─────────────────────────────┐
│         (status bar)         │
│                             │
│         🍃  MintHR           │  ← brand mark, centered, top third
│                             │
│      Welcome back            │  Text variant="title"
│  Sign in to your account     │  Text variant="body" tone="secondary"
│                             │
│  [ Alert — errors ]          │  optional, above the form
│                             │
│  ┌─────────────────────────┐ │
│  │ Email                   │ │  FormField → Input
│  └─────────────────────────┘ │
│  ┌─────────────────────────┐ │
│  │ Password            👁  │ │  Input (secureTextEntry + reveal)
│  └─────────────────────────┘ │
│              Forgot password? │  Text tone="brand", end-aligned
│                             │
│  [        Sign in         ] │  Button primary fullWidth
│                             │
│  New here?  Create account   │  footer, centered
└─────────────────────────────┘
   ↑ content stays above the keyboard; everything inside the safe area
```

## The frame

Center the content vertically on tall screens; keep it scrollable and keyboard-aware for short ones.

```tsx
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import {
  Text, FormField, Input, Button, Alert, spacing,
} from '@minthr-saas/mobile-ui-kit';

export function SignInScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: spacing[6], gap: spacing[5] }}
        keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', gap: spacing[2] }}>
          {/* brand mark */}
          <Text variant="title">Welcome back</Text>
          <Text variant="body" tone="secondary">Sign in to your MintHR account</Text>
        </View>

        {error ? <Alert variant="danger" title={error} onDismiss={clearError} /> : null}

        <View style={{ gap: spacing[4] }}>
          <FormField label="Email">
            <Input
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
            />
          </FormField>
          <FormField label="Password">
            <Input
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              textContentType="password"
            />
          </FormField>
          <Text variant="caption" tone="brand" style={{ alignSelf: 'flex-end' }} onPress={onForgot}>
            Forgot password?
          </Text>
        </View>

        <Button label={loading ? 'Signing in…' : 'Sign in'} variant="primary" fullWidth disabled={loading} onPress={onSubmit} />

        <Text variant="caption" tone="muted" style={{ textAlign: 'center' }}>
          New here?{' '}
          <Text variant="caption" tone="brand" onPress={onCreateAccount}>Create account</Text>
        </Text>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
```

## Screen-specific pieces

- **OTP verify** → [`OtpInput`](../03-forms/OtpInput.md). Enable iOS SMS autofill (`textContentType="oneTimeCode"`) where the component exposes it.
- **Reset / set password** → pair the password `Input` with [`PasswordStrength`](../03-forms/PasswordStrength.md) so the meter updates as they type.
- **"Check your inbox" confirmation** (after forgot-password submit) → an inline [`Callout`](../05-feedback/Callout.md), not a toast.
- **Success then redirect** (after reset) → a [`Toast`](../05-feedback/Toast.md), then navigate to sign in.

## Rules

- **Safe area + keyboard-aware.** Content never hides behind the notch, home indicator, or keyboard.
- **One brand statement.** The mark sits at the top; the title should not repeat "MintHR" ("Welcome back", not "Sign in to MintHR").
- **`fullWidth` primary submit**, always. Show progress by disabling + swapping the label (there's no `loading` prop on `Button`).
- **Errors as `Alert` above the form** (`variant="danger"`, dismissible) — not a toast, which auth users can miss.
- **Real keyboard hints** — `keyboardType`, `autoCapitalize="none"` for email, `autoComplete` / `textContentType` for password managers and OTP autofill.
- **No shadows, no gradients.** A quiet surface, centered content, generous `spacing[5]`–`spacing[6]`. Restraint reads as premium.
- **Sentence case** copy; **logical props** and RTL correctness throughout.
- **English defaults** in examples; the real app localizes.

## When NOT to use

- In-app destructive confirm → [`ConfirmDialog`](../06-overlays/ConfirmDialog.md).
- A settings-style form → [sectioned-form](./sectioned-form.md).
