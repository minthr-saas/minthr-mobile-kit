import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { ActionSheet, Button, Text, spacing } from '@/components/ui-kit';
import type { ActionSheetItem } from '@/components/ui-kit';

import { Section } from './_components/Section';

export default function ActionSheetDemo() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const [dangerOpen, setDangerOpen] = useState(false);

  const basicItems: ActionSheetItem[] = [
    { label: 'Edit profile', icon: 'edit-2', onPress: () => {} },
    { label: 'Share link', icon: 'share-2', onPress: () => {} },
    { label: 'Download CV', icon: 'download', onPress: () => {} },
  ];

  const sectionItems: ActionSheetItem[] = [
    {
      type: 'section',
      label: 'Communication',
      items: [
        { label: 'Send email', icon: 'mail', onPress: () => {} },
        { label: 'Call', icon: 'phone', onPress: () => {} },
      ],
    },
    { type: 'separator' },
    {
      type: 'section',
      label: 'Documents',
      items: [
        { label: 'View contract', icon: 'file-text', onPress: () => {} },
        { label: 'Upload document', icon: 'upload', onPress: () => {} },
      ],
    },
  ];

  const dangerItems: ActionSheetItem[] = [
    { label: 'Edit record', icon: 'edit-2', onPress: () => {} },
    { label: 'Duplicate', icon: 'copy', onPress: () => {} },
    { type: 'separator' },
    { label: 'Archive', icon: 'archive', onPress: () => {}, disabled: true },
    { label: 'Delete record', icon: 'trash-2', variant: 'danger', onPress: () => {} },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'ActionSheet' }} />

      <Text variant="body" tone="secondary">
        Bottom-anchored action menu — the mobile-idiomatic replacement for desktop
        dropdown menus. Supports items, sections, separators, and danger variants.
      </Text>

      <Section label="Basic actions">
        <Button
          label="Show actions"
          variant="secondary"
          onPress={() => setBasicOpen(true)}
        />
      </Section>

      <Section label="With sections">
        <Button
          label="Show grouped actions"
          variant="secondary"
          onPress={() => setSectionsOpen(true)}
        />
      </Section>

      <Section label="With danger action">
        <Button
          label="Show danger actions"
          variant="secondary"
          onPress={() => setDangerOpen(true)}
        />
      </Section>

      <ActionSheet
        visible={basicOpen}
        onClose={() => setBasicOpen(false)}
        title="Employee actions"
        items={basicItems}
      />

      <ActionSheet
        visible={sectionsOpen}
        onClose={() => setSectionsOpen(false)}
        title="Contact options"
        items={sectionItems}
      />

      <ActionSheet
        visible={dangerOpen}
        onClose={() => setDangerOpen(false)}
        items={dangerItems}
      />
    </ScrollView>
  );
}
