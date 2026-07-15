import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Card, FilterBar, Text, spacing, useToast } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

interface AppliedFilter {
  key: string;
  label: string;
}

export default function FilterBarDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'FilterBar' }} />
      <FilterBarBody />
    </ScrollView>
  );
}

export function FilterBarBody() {
  const [filters, setFilters] = useState<AppliedFilter[]>([
    { key: 'dept', label: 'Engineering' },
    { key: 'role', label: 'Senior' },
    { key: 'tenure', label: '2+ years' },
  ]);
  const toast = useToast();

  return (
    <>
      <Text variant="body" tone="secondary">
        Add-filter trigger plus a horizontally scrollable list of removable chips. Pair with a
        BottomSheet (or Select) to pick new filters.
      </Text>

      <Section label="With active filters">
        <FilterBar
          filters={filters.map((f) => ({
            key: f.key,
            label: f.label,
            onRemove: () => setFilters((prev) => prev.filter((p) => p.key !== f.key)),
          }))}
          onClearAll={() => setFilters([])}
          onAdd={() => toast.info('Hook up a BottomSheet here to pick filter values.')}
        />
      </Section>

      <Section label="Inside a results card">
        <Card padding="none">
          <View style={{ padding: spacing[3], gap: spacing[3] }}>
            <FilterBar
              filters={filters.map((f) => ({
                key: f.key,
                label: f.label,
                onRemove: () => setFilters((prev) => prev.filter((p) => p.key !== f.key)),
              }))}
              onClearAll={() => setFilters([])}
              onAdd={() => toast.info('Open picker')}
            />
            <Text variant="body" tone="secondary">
              Showing {filters.length === 0 ? 'all 1,243 employees' : '342 employees'} matching
              your filters.
            </Text>
          </View>
        </Card>
      </Section>
    </>
  );
}
