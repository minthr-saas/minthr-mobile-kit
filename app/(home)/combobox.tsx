import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';

import { Combobox, Text, spacing } from '@/components/ui-kit';

const OPTIONS = [
  { label: 'France', value: 'FR', description: 'Europe', icon: 'map' as const },
  { label: 'Morocco', value: 'MA', description: 'Africa', icon: 'map' as const },
  { label: 'Tunisia', value: 'TN', description: 'Africa', icon: 'map' as const },
  { label: 'Algeria', value: 'DZ', description: 'Africa', icon: 'map' as const },
  { label: 'Belgium', value: 'BE', description: 'Europe', icon: 'map' as const },
  { label: 'Spain', value: 'ES', description: 'Europe', icon: 'map' as const },
  { label: 'United Kingdom', value: 'GB', description: 'Europe', icon: 'map' as const },
];

export default function ComboboxScreen() {
  const [value, setValue] = useState<string>();
  const [createdValue, setCreatedValue] = useState<string>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Combobox' }} />

      <View style={styles.section}>
        <Text variant="subtitle">Basic Combobox</Text>
        <Text variant="body" tone="secondary">
          Searchable single-select list.
        </Text>
        <Combobox
          placeholder="Select a country"
          options={OPTIONS}
          value={value}
          onChange={setValue}
        />
        {value && (
          <Text variant="caption" tone="brand">
            Selected: {value}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Allow Create</Text>
        <Text variant="body" tone="secondary">
          Allows adding new options if no match is found.
        </Text>
        <Combobox
          placeholder="Select or create"
          options={OPTIONS}
          value={createdValue}
          onChange={setCreatedValue}
          allowCreate
          onCreate={(val) => console.log('Created:', val)}
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Disabled State</Text>
        <Combobox
          placeholder="Can't touch this"
          options={OPTIONS}
          disabled
        />
      </View>

      <View style={styles.section}>
        <Text variant="subtitle">Error State</Text>
        <Combobox
          placeholder="Something is wrong"
          options={OPTIONS}
          error="This field is required"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: spacing[4],
    gap: spacing[6],
  },
  section: {
    gap: spacing[2],
  },
});
