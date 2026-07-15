import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';

import { Badge, Button, Card, PageHeader, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function PageHeaderDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'PageHeader' }} />
      <PageHeaderBody />
    </ScrollView>
  );
}

export function PageHeaderBody() {
  return (
    <>
      <Text variant="body" tone="secondary">
        Screen-top template, stacked for mobile. Back chevron sits on top (44x44 tap target),
        title + subtitle below get the full width, and actions render on their own row underneath.
      </Text>

      <Section label="Title only">
        <Card>
          <PageHeader title="Quarterly review" />
        </Card>
      </Section>

      <Section label="Title + subtitle">
        <Card>
          <PageHeader
            title="Sara Boudia"
            subtitle="Senior product designer · Marrakech"
          />
        </Card>
      </Section>

      <Section label="With back button">
        <Card>
          <PageHeader
            title="Compensation"
            subtitle="Effective May 1, 2026"
            onBack={() => {}}
          />
        </Card>
      </Section>

      <Section label="With actions">
        <Card>
          <PageHeader
            title="Engagement survey"
            subtitle="Open · 9 questions · 64 responses"
            onBack={() => {}}
            actions={
              <>
                <Badge label="Active" variant="success" />
                <Button label="Edit" size="sm" variant="secondary" onPress={() => {}} />
              </>
            }
          />
        </Card>
      </Section>
    </>
  );
}
