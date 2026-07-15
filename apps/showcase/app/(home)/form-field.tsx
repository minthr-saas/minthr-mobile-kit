import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import {
  FormField,
  Radio,
  RadioGroup,
  SegmentedControl,
  Switch,
  Text,
  spacing,
} from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function FormFieldDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'FormField' }} />
      <FormFieldBody />
    </ScrollView>
  );
}

export function FormFieldBody() {
  const [notifications, setNotifications] = useState(true);
  const [contract, setContract] = useState('full-time');
  const [visibility, setVisibility] = useState<'public' | 'team' | 'private'>('team');

  return (
    <>
      <Text variant="body" tone="secondary">
        Label + helper/error wrapper for non-text controls. Use it to give Switch, Checkbox,
        Radio, SegmentedControl, etc. the same field layout as Input / Textarea.
      </Text>

      <Section label="Wrapping a Switch">
        <FormField
          label="Email notifications"
          hint="A daily digest at 7 PM in your local timezone.">
          <Switch value={notifications} onValueChange={setNotifications} />
        </FormField>
      </Section>

      <Section label="Wrapping a SegmentedControl">
        <FormField label="Profile visibility" required hint="Who can see your full profile.">
          <SegmentedControl
            options={[
              { value: 'public', label: 'Public' },
              { value: 'team', label: 'Team' },
              { value: 'private', label: 'Private' },
            ]}
            value={visibility}
            onChange={setVisibility}
          />
        </FormField>
      </Section>

      <Section label="Wrapping a RadioGroup, with error">
        <FormField label="Contract type" error="Selection required to continue onboarding.">
          <RadioGroup value={contract} onChange={setContract}>
            <Radio value="full-time" label="Full time" />
            <Radio value="part-time" label="Part time" />
            <Radio value="contract" label="Contract" />
          </RadioGroup>
        </FormField>
      </Section>
    </>
  );
}
