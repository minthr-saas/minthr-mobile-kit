import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Callout, Text, spacing } from '@/components/ui-kit';

import { Section } from './_components/Section';

export default function CalloutDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Callout' }} />

      <Text variant="body" tone="secondary">
        Inline accent-bordered panel. Quieter than Alert — use it for tips, side-notes, or
        prerequisite info embedded inside content.
      </Text>

      <Section label="Accents">
        <View style={{ gap: spacing[3] }}>
          <Callout
            accent="neutral"
            title="Note"
            description="Onboarding videos are now 5–8 minutes long instead of 15."
          />
          <Callout
            accent="brand"
            title="Tip"
            description="Drag any column header to re-order the table view."
          />
          <Callout
            accent="info"
            title="Heads up"
            description="Two of your direct reports are still pending review."
          />
          <Callout
            accent="success"
            title="Looks great"
            description="All required compliance docs are signed."
          />
          <Callout
            accent="warning"
            title="Almost full"
            description="You can have up to 100 active surveys at once."
          />
          <Callout
            accent="danger"
            title="Needs attention"
            description="Three contracts will expire in the next 7 days."
          />
        </View>
      </Section>

      <Section label="Title only">
        <Callout accent="brand" title="Pin this card to come back to it later." />
      </Section>
    </ScrollView>
  );
}
