import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Text,
  spacing,
} from '@/components/ui-kit';

import { Section } from './_components/Section';

export default function CardDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Card' }} />

      <Text variant="body" tone="secondary">
        Hair-bordered surface container. Padding presets: none / sm / md / lg. Composes with the
        `CardHeader`, `CardTitle`, `CardDescription`, and `CardFooter` subcomponents.
      </Text>

      <Section label="Padding">
        <View style={{ gap: spacing[2] }}>
          <Card padding="sm">
            <Text variant="caption" tone="muted">
              padding=&quot;sm&quot; (12px)
            </Text>
          </Card>
          <Card padding="md">
            <Text variant="caption" tone="muted">
              padding=&quot;md&quot; (16px) — default
            </Text>
          </Card>
          <Card padding="lg">
            <Text variant="caption" tone="muted">
              padding=&quot;lg&quot; (24px)
            </Text>
          </Card>
        </View>
      </Section>

      <Section label="With subcomponents">
        <Card>
          <CardHeader>
            <CardTitle>Quarterly review</CardTitle>
            <CardDescription>
              Nine pulse questions covering team health, leadership, and the rollout of the new
              onboarding flow.
            </CardDescription>
          </CardHeader>
          <Text variant="body" tone="secondary">
            Open between May 5 and May 15. Anonymous responses, results shared in aggregate to
            people managers only.
          </Text>
          <CardFooter>
            <Button label="Skip" variant="ghost" size="sm" onPress={() => {}} />
            <Button label="Open" variant="primary" size="sm" onPress={() => {}} />
          </CardFooter>
        </Card>
      </Section>

      <Section label="Manual composition">
        <Card>
          <View style={{ gap: spacing[3] }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text variant="subtitle">Engagement survey</Text>
              <Badge label="Active" variant="success" />
            </View>
            <Text variant="body" tone="secondary">
              Useful when you need a status pill in the header — subcomponents enforce a left-only
              title layout, so drop down to plain views for asymmetric headers.
            </Text>
          </View>
        </Card>
      </Section>
    </ScrollView>
  );
}
