import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Alert, Text, spacing } from '@/components/ui-kit';

import { Section } from './_components/Section';

export default function AlertDemo() {
  const [showDismissable, setShowDismissable] = useState(true);

  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Alert' }} />

      <Text variant="body" tone="secondary">
        Tinted banner with icon + title + description. Use sparingly — never stack two alerts of
        the same severity.
      </Text>

      <Section label="Variants">
        <View style={{ gap: spacing[3] }}>
          <Alert variant="info" title="Heads up" description="Pulse survey closes Friday." />
          <Alert
            variant="success"
            title="Saved"
            description="Your changes were applied to all 12 employees."
          />
          <Alert
            variant="warning"
            title="Approaching limit"
            description="You've used 92% of your monthly invitations."
          />
          <Alert
            variant="danger"
            title="Action failed"
            description="Couldn't reach the payroll service. Try again in a moment."
          />
        </View>
      </Section>

      <Section label="Title only">
        <Alert variant="info" title="One-liner alert with no description body." />
      </Section>

      <Section label="Dismissable">
        {showDismissable ? (
          <Alert
            variant="warning"
            title="Profile incomplete"
            description="Add your job title and start date so HR can finalize onboarding."
            onClose={() => setShowDismissable(false)}
          />
        ) : (
          <Text variant="caption" tone="muted">
            Dismissed.
          </Text>
        )}
      </Section>
    </ScrollView>
  );
}
