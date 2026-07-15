import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';

import { Breadcrumbs, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function BreadcrumbsDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Breadcrumbs' }} />
      <BreadcrumbsBody />
    </ScrollView>
  );
}

export function BreadcrumbsBody() {
  return (
    <>
      <Text variant="body" tone="secondary">
        Horizontally scrollable nav trail with chevron separators. The last item is the current
        page (medium weight, no press handler).
      </Text>

      <Section label="Two levels">
        <Breadcrumbs
          items={[
            { label: 'Workspace', onPress: () => {} },
            { label: 'Settings' },
          ]}
        />
      </Section>

      <Section label="Three levels">
        <Breadcrumbs
          items={[
            { label: 'Workspace', onPress: () => {} },
            { label: 'People', onPress: () => {} },
            { label: 'Sara Boudia' },
          ]}
        />
      </Section>

      <Section label="Deep trail (scrollable)">
        <Breadcrumbs
          items={[
            { label: 'Workspace', onPress: () => {} },
            { label: 'Reports', onPress: () => {} },
            { label: '2026', onPress: () => {} },
            { label: 'Q2', onPress: () => {} },
            { label: 'Engagement', onPress: () => {} },
            { label: 'Engineering team' },
          ]}
        />
      </Section>
    </>
  );
}
