import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Button, Card, EmptyState, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function EmptyStateDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'EmptyState' }} />

      <Text variant="body" tone="secondary">
        Centered icon + title + description with an optional action. Use it where a list, page, or
        section has no content to display.
      </Text>

      <Section label="Title only">
        <Card padding="none">
          <EmptyState title="No surveys yet" />
        </Card>
      </Section>

      <Section label="With description">
        <Card padding="none">
          <EmptyState
            icon="users"
            title="No teammates yet"
            description="Invite your first colleague to start collaborating on surveys and reviews."
          />
        </Card>
      </Section>

      <Section label="With action">
        <Card padding="none">
          <EmptyState
            icon="inbox"
            title="Inbox zero"
            description="You've cleared every notification. Take a breath — or start something new."
            action={
              <View style={{ flexDirection: 'row', gap: spacing[2] }}>
                <Button label="Browse templates" variant="ghost" onPress={() => {}} />
                <Button label="Create survey" onPress={() => {}} />
              </View>
            }
          />
        </Card>
      </Section>

      <Section label="Different icons">
        <View style={{ gap: spacing[3] }}>
          <Card padding="none">
            <EmptyState icon="search" title="No matches" description="Try a different filter." />
          </Card>
          <Card padding="none">
            <EmptyState
              icon="alert-circle"
              title="Connection lost"
              description="Check your network and try again."
            />
          </Card>
        </View>
      </Section>
    </ScrollView>
  );
}
