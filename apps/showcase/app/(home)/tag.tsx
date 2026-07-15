import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Tag, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function TagDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Tag' }} />
      <TagBody />
    </ScrollView>
  );
}

export function TagBody() {
  const [tags, setTags] = useState(['Engineering', 'Remote', 'Senior', 'Full-time']);

  return (
    <>
      <Text variant="body" tone="secondary">
        Pill-shaped chip for user-applied labels. Optionally removable. Use Badge for system
        states; Tag for taxonomies and filters.
      </Text>

      <Section label="Variants">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
          <Tag label="Neutral" variant="neutral" />
          <Tag label="Brand" variant="brand" />
          <Tag label="Success" variant="success" />
          <Tag label="Warning" variant="warning" />
          <Tag label="Danger" variant="danger" />
          <Tag label="Info" variant="info" />
        </View>
      </Section>

      <Section label="Removable">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
          {tags.map((t) => (
            <Tag
              key={t}
              label={t}
              variant="brand"
              onRemove={() => setTags((prev) => prev.filter((x) => x !== t))}
            />
          ))}
          {tags.length === 0 ? (
            <Text variant="caption" tone="muted">
              All tags removed.
            </Text>
          ) : null}
        </View>
      </Section>
    </>
  );
}
