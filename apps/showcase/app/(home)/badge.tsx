import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Badge, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function BadgeDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Badge' }} />

      <Text variant="body" tone="secondary">
        Small status pill. Six semantic variants — never use the danger variant for non-error
        information.
      </Text>

      <Section label="Variants">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
          <Badge label="Neutral" variant="neutral" />
          <Badge label="Brand" variant="brand" />
          <Badge label="Success" variant="success" />
          <Badge label="Warning" variant="warning" />
          <Badge label="Danger" variant="danger" />
          <Badge label="Info" variant="info" />
        </View>
      </Section>

      <Section label="With dot">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
          <Badge label="Online" variant="success" dot />
          <Badge label="Pending" variant="warning" dot />
          <Badge label="Offline" variant="neutral" dot />
          <Badge label="Failed" variant="danger" dot />
        </View>
      </Section>

      <Section label="With icon">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
          <Badge label="Verified" variant="success" icon="check" />
          <Badge label="Locked" variant="warning" icon="lock" />
          <Badge label="Beta" variant="info" icon="zap" />
          <Badge label="Read-only" variant="neutral" icon="eye" />
        </View>
      </Section>

      <Section label="Inline use">
        <View style={{ gap: spacing[2] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
            <Text variant="body">Engagement survey</Text>
            <Badge label="Active" variant="success" dot />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
            <Text variant="body">Beta features</Text>
            <Badge label="New" variant="info" />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
            <Text variant="body">Payroll export</Text>
            <Badge label="Draft" variant="neutral" />
          </View>
        </View>
      </Section>
    </ScrollView>
  );
}
