import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Button, Stepper, Text, spacing } from '@/components/ui-kit';

import { Section } from './_components/Section';

const steps = [
  { label: 'Personal info', description: 'Name, contact, address.' },
  { label: 'Employment', description: 'Role, start date, contract type.' },
  { label: 'Documents', description: 'ID, proof of address, contract.' },
  { label: 'Review' },
];

export default function StepperDemo() {
  const [current, setCurrent] = useState(1);

  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Stepper' }} />

      <Text variant="body" tone="secondary">
        Numbered step indicator for multi-step flows. All steps before the current one are marked
        complete; later steps are upcoming.
      </Text>

      <Section label="Current step 2 of 4">
        <Stepper steps={steps} currentStep={current} />
      </Section>

      <Section label="Try it">
        <View style={{ flexDirection: 'row', gap: spacing[2] }}>
          <Button
            label="Back"
            variant="secondary"
            size="sm"
            disabled={current === 0}
            onPress={() => setCurrent((c) => Math.max(0, c - 1))}
          />
          <Button
            label="Next"
            size="sm"
            disabled={current === steps.length - 1}
            onPress={() => setCurrent((c) => Math.min(steps.length - 1, c + 1))}
          />
        </View>
      </Section>
    </ScrollView>
  );
}
