import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { Radio, RadioGroup, Text, spacing } from '@/components/ui-kit';

import { Section } from './_components/Section';

export default function RadioDemo() {
  const [contract, setContract] = useState('full-time');
  const [layout, setLayout] = useState('grid');

  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Radio' }} />

      <Text variant="body" tone="secondary">
        Mutually-exclusive choice group. Vertical or horizontal — both keep the same accessibility
        semantics.
      </Text>

      <Section label="Vertical (default)">
        <RadioGroup value={contract} onChange={setContract}>
          <Radio
            value="full-time"
            label="Full time"
            description="40 hours per week, salaried."
          />
          <Radio
            value="part-time"
            label="Part time"
            description="20–30 hours per week, hourly."
          />
          <Radio
            value="contract"
            label="Contract"
            description="Fixed engagement. End date required."
          />
          <Radio value="intern" label="Intern" disabled description="Disabled — feature locked." />
        </RadioGroup>
      </Section>

      <Section label="Horizontal">
        <RadioGroup value={layout} onChange={setLayout} direction="horizontal">
          <Radio value="grid" label="Grid" />
          <Radio value="list" label="List" />
          <Radio value="compact" label="Compact" />
        </RadioGroup>
      </Section>

      <Section label="Disabled group">
        <RadioGroup value="a" onChange={() => {}} disabled>
          <Radio value="a" label="Option A" />
          <Radio value="b" label="Option B" />
          <Radio value="c" label="Option C" />
        </RadioGroup>
      </Section>
    </ScrollView>
  );
}
