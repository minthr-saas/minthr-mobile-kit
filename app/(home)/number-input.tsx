import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { NumberInput, Text, spacing } from '@/components/ui-kit';

import { Section } from './_components/Section';

export default function NumberInputDemo() {
  const [seats, setSeats] = useState<number | null>(5);
  const [days, setDays] = useState<number | null>(0);
  const [hours, setHours] = useState<number | null>(40);

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'NumberInput' }} />

      <Text variant="body" tone="secondary">
        Numeric input with built-in step buttons. Tap to type, or hit ± to nudge. Respects min /
        max bounds — buttons disable at the limits.
      </Text>

      <Section label="Plain (no bounds)">
        <NumberInput value={seats} onChange={setSeats} label="Team seats" />
      </Section>

      <Section label="With min and max">
        <NumberInput
          value={days}
          onChange={setDays}
          label="Vacation days requested"
          min={0}
          max={20}
          hint="Up to 20 days per request."
        />
      </Section>

      <Section label="Custom step">
        <NumberInput
          value={hours}
          onChange={setHours}
          label="Weekly hours"
          min={0}
          max={60}
          step={5}
          hint="Increments of 5."
        />
      </Section>

      <Section label="With error">
        <View style={{ gap: spacing[2] }}>
          <NumberInput
            value={null}
            onChange={() => {}}
            label="Salary band"
            error="Salary band is required."
          />
        </View>
      </Section>
    </ScrollView>
  );
}
