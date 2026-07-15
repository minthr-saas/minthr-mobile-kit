import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Divider, Switch, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function SwitchDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Switch' }} />
      <SwitchBody />
    </ScrollView>
  );
}

export function SwitchBody() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [c, setC] = useState(true);
  const [d, setD] = useState(false);

  return (
    <>
      <Text variant="body" tone="secondary">
        Brand-tinted toggle. Standalone or wrapped with a label and description for settings rows.
      </Text>

      <Section label="Standalone">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
          <Switch value={a} onValueChange={setA} />
          <Switch value={b} onValueChange={setB} />
          <Switch value={false} onValueChange={() => {}} disabled />
          <Switch value={true} onValueChange={() => {}} disabled />
        </View>
      </Section>

      <Section label="Settings rows">
        <Switch
          label="Push notifications"
          description="Receive alerts for new messages and reminders."
          value={c}
          onValueChange={setC}
        />
        <Divider />
        <Switch
          label="Daily summary email"
          description="A digest of your day's activity at 7 PM."
          value={d}
          onValueChange={setD}
        />
        <Divider />
        <Switch
          label="Beta features"
          description="Disabled — your workspace plan does not include beta access."
          value={false}
          onValueChange={() => {}}
          disabled
        />
      </Section>
    </>
  );
}
