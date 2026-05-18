import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  Button,
  Checkbox,
  SelectionBar,
  Text,
  spacing,
} from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

const EMPLOYEES = [
  'Sara Boudia',
  'Karim Elbouazri',
  'Amina Chaoui',
  'Youssef Tazi',
  'Fatima Zahra Alami',
];

export default function SelectionBarDemo() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(name: string) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
        <Stack.Screen options={{ title: 'SelectionBar' }} />

        <Text variant="body" tone="secondary">
          Floating bottom-anchored bulk-actions pill. Appears when items are selected,
          disappears when the count reaches zero. Tap the checkboxes below to try it.
        </Text>

        <Section label="Select employees">
          {EMPLOYEES.map((name) => (
            <Checkbox
              key={name}
              label={name}
              checked={selected.includes(name)}
              onChange={() => toggle(name)}
            />
          ))}
        </Section>

        <Section label="Select all / clear">
          <View style={{ flexDirection: 'row', gap: spacing[2] }}>
            <Button
              label="Select all"
              variant="secondary"
              size="sm"
              onPress={() => setSelected([...EMPLOYEES])}
            />
            <Button
              label="Clear"
              variant="ghost"
              size="sm"
              onPress={() => setSelected([])}
            />
          </View>
        </Section>
      </ScrollView>

      <SelectionBar
        count={selected.length}
        actions={[
          { label: 'Export', icon: 'download', onPress: () => {} },
          { label: 'Delete', icon: 'trash-2', variant: 'danger', onPress: () => {} },
        ]}
        onClear={() => setSelected([])}
      />
    </View>
  );
}
