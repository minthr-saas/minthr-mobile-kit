import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Checkbox, Text, spacing } from '@/components/ui-kit';

import { Section } from './_components/Section';

export default function CheckboxDemo() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(true);

  const [parts, setParts] = useState({ legal: true, hr: false, ops: true });
  const allChecked = Object.values(parts).every(Boolean);
  const noneChecked = Object.values(parts).every((v) => !v);
  const parentState: boolean | 'indeterminate' = allChecked
    ? true
    : noneChecked
      ? false
      : 'indeterminate';

  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Checkbox' }} />

      <Text variant="body" tone="secondary">
        Square selector — checked, unchecked, or indeterminate. Tap area covers the label.
      </Text>

      <Section label="States">
        <View style={{ gap: spacing[3] }}>
          <Checkbox checked={a} onChange={setA} label="Unchecked" />
          <Checkbox checked={b} onChange={setB} label="Checked" />
          <Checkbox checked="indeterminate" onChange={() => {}} label="Indeterminate" />
          <Checkbox checked={false} onChange={() => {}} label="Disabled unchecked" disabled />
          <Checkbox checked={true} onChange={() => {}} label="Disabled checked" disabled />
        </View>
      </Section>

      <Section label="With description">
        <Checkbox
          checked={a}
          onChange={setA}
          label="Email notifications"
          description="Receive a digest each evening with your team's activity."
        />
      </Section>

      <Section label="Parent / children">
        <View style={{ gap: spacing[3] }}>
          <Checkbox
            checked={parentState}
            onChange={(next) => {
              setParts({ legal: next, hr: next, ops: next });
            }}
            label="All departments"
          />
          <View style={{ paddingStart: spacing[6], gap: spacing[3] }}>
            <Checkbox
              checked={parts.legal}
              onChange={(next) => setParts((p) => ({ ...p, legal: next }))}
              label="Legal"
            />
            <Checkbox
              checked={parts.hr}
              onChange={(next) => setParts((p) => ({ ...p, hr: next }))}
              label="People"
            />
            <Checkbox
              checked={parts.ops}
              onChange={(next) => setParts((p) => ({ ...p, ops: next }))}
              label="Operations"
            />
          </View>
        </View>
      </Section>
    </ScrollView>
  );
}
