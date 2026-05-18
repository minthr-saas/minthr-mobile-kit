import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Tabs, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function TabsDemo() {
  const [tab, setTab] = useState<'overview' | 'reviews' | 'compensation' | 'documents'>(
    'overview',
  );
  const [filter, setFilter] = useState<'all' | 'mine' | 'archived'>('all');

  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Tabs' }} />

      <Text variant="body" tone="secondary">
        Underline-style tabs for in-page sub-navigation. Different from the bottom tab bar — use
        these inside a screen to switch between related views.
      </Text>

      <Section label="Profile sections">
        <Tabs
          options={[
            { value: 'overview', label: 'Overview' },
            { value: 'reviews', label: 'Reviews' },
            { value: 'compensation', label: 'Compensation' },
            { value: 'documents', label: 'Documents' },
          ]}
          value={tab}
          onChange={setTab}
        />
        <View style={{ paddingTop: spacing[3] }}>
          <Text variant="caption" tone="muted">
            Selected: {tab}
          </Text>
        </View>
      </Section>

      <Section label="Two tabs (horizontal scroll disabled)">
        <Tabs
          scrollable={false}
          options={[
            { value: 'all', label: 'All' },
            { value: 'mine', label: 'Mine' },
            { value: 'archived', label: 'Archived' },
          ]}
          value={filter}
          onChange={setFilter}
        />
      </Section>
    </ScrollView>
  );
}
