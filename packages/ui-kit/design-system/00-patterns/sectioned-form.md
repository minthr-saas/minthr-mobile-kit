# Pattern: Sectioned form

A **pattern**, not a component — how to build a long, grouped form on mobile using kit primitives (`FormField`, `Input`/`Select`/`Switch`/…, `Divider`, `Button`). On the web this is a two-column "description left, fields right" layout; on mobile it collapses to a **single vertical column** of labelled groups, because there is no room for a side column and thumbs scroll top-to-bottom.

## When to use

- Settings, profile-edit, and configuration screens with **2–6 natural groups** (Personal info, Contact, Preferences…).
- Forms long enough (8+ fields) to need visual structure.

**Don't use it for:**
- Short forms (<5 fields) — a single stacked list of `FormField`s needs no sections.
- A quick edit that belongs in a `BottomSheet`.

## Visual anatomy

```
┌─────────────────────────────┐  ← screen scrolls
│ Personal information         │  section header (subtitle + caption)
│ Basic details about you.     │
│ ┌─────────────────────────┐ │
│ │ Full name               │ │  FormField → Input
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Date of birth           │ │  FormField → DatePicker
│ └─────────────────────────┘ │
│ ─────────────────────────── │  Divider
│ Employment                   │
│ Role, department, dates.     │
│ ┌─────────────────────────┐ │
│ │ Role                    │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
│ [        Save        ]      │  ← sticky footer Button (fullWidth)
└─────────────────────────────┘
```

## The pattern

### Keyboard + scroll

Wrap the scroll region in `KeyboardAwareScrollView` (peer dep `react-native-keyboard-aware-scroll-view`) so a focused field is never hidden behind the keyboard. Keep the primary `Button` in a footer pinned above the safe area.

```tsx
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import {
  Text, FormField, Input, Select, DatePicker, Switch, Divider, Button, spacing,
} from '@minthr-saas/mobile-ui-kit';

function FormSection({ title, description, children }) {
  return (
    <View style={{ gap: spacing[3] }}>
      <View style={{ gap: 2 }}>
        <Text variant="subtitle">{title}</Text>
        {description ? <Text variant="caption" tone="muted">{description}</Text> : null}
      </View>
      <View style={{ gap: spacing[4] }}>{children}</View>
    </View>
  );
}

export function EmployeeForm() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ padding: spacing[4], gap: spacing[6] }}
        keyboardShouldPersistTaps="handled">
        <FormSection title="Personal information" description="Basic details about the employee.">
          <FormField label="Full name" required>
            <Input value={name} onChangeText={setName} />
          </FormField>
          <FormField label="Date of birth">
            <DatePicker value={dob} onChange={setDob} />
          </FormField>
        </FormSection>

        <Divider />

        <FormSection title="Employment" description="Role, department, and start date.">
          <FormField label="Role" required>
            <Input value={role} onChangeText={setRole} />
          </FormField>
          <FormField label="Department">
            <Select value={dept} onChange={setDept} options={DEPARTMENTS} />
          </FormField>
        </FormSection>

        <Divider />

        <FormSection title="Preferences">
          <Switch value={notify} onValueChange={setNotify} label="Email notifications" />
        </FormSection>
      </KeyboardAwareScrollView>

      <View style={{ padding: spacing[4], paddingBottom: insets.bottom + spacing[3] }}>
        <Button label={saving ? 'Saving…' : 'Save'} variant="primary" fullWidth disabled={saving} onPress={onSave} />
      </View>
    </View>
  );
}
```

### Grouping options

- **Freeform sections + `Divider`** (above) — the cleanest default for a full-screen form.
- **`Card` per section** — when a group needs visual containment (e.g. a dangerous "Delete account" zone). Give the `Card` a `subtitle` header inside.
- **`ListSection` / `ListItem`** — when the "form" is really a list of settings rows that open pickers/sheets rather than inline fields (see [list-screen.md](./list-screen.md) and [`../08-layout/ListItem.md`](../08-layout/ListItem.md)).

## Rules

- **Single column.** No side-by-side fields on phone widths; put every field full-width. Two fields may share a row only on tablets, via a `flexDirection: 'row'` with `gap` — and only when both are short (e.g. postal code + city).
- **`gap` on the container**, not per-child margins — `spacing[4]` between fields, `spacing[6]` between sections.
- **Every field uses `FormField`** for a consistent label / helper / error contract. See [`../03-forms/FormField.md`](../03-forms/FormField.md).
- **One primary action.** A single `fullWidth` `Button` in a pinned footer (or the `PageHeader` actions row) — never a Save button per section.
- **`Divider` between sections** — quieter than heavy padding alone.
- **Keyboard-aware scroll** is mandatory; test that the focused field stays visible on both platforms.
- **Descriptions are 1 sentence.** More than that belongs in a [`Callout`](../05-feedback/Callout.md) or a help link.
- **Don't disable Save to hide validation.** Let the user press it and surface field errors via `FormField`.
- **Logical props + RTL** throughout.

## When NOT to use this pattern

- Short form → a plain stack of `FormField`s, no sections.
- Single decision / confirm → a [`BottomSheet`](../06-overlays/BottomSheet.md) or [`ConfirmDialog`](../06-overlays/ConfirmDialog.md).
- A list of navigable settings → the [list-screen](./list-screen.md) pattern with `ListItem` rows.
