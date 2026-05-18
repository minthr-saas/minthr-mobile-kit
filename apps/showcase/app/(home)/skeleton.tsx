import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Card, Skeleton, Text, radius, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function SkeletonDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Skeleton' }} />

      <Text variant="body" tone="secondary">
        Animated placeholder while content loads. Match the rough shape of the final UI — same
        widths, same heights — so layout does not jump on hydration.
      </Text>

      <Section label="Lines">
        <View style={{ gap: spacing[2] }}>
          <Skeleton width="60%" height={12} />
          <Skeleton width="90%" height={12} />
          <Skeleton width="75%" height={12} />
        </View>
      </Section>

      <Section label="Shapes">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
          <Skeleton width={40} height={40} radius={20} />
          <View style={{ flex: 1, gap: spacing[2] }}>
            <Skeleton width="60%" height={14} />
            <Skeleton width="40%" height={12} />
          </View>
        </View>
      </Section>

      <Section label="Card placeholder">
        <Card>
          <View style={{ gap: spacing[3] }}>
            <Skeleton width="50%" height={18} />
            <Skeleton width="100%" height={12} />
            <Skeleton width="85%" height={12} />
            <View style={{ height: spacing[2] }} />
            <Skeleton width="100%" height={140} radius={radius.md} />
          </View>
        </Card>
      </Section>
    </ScrollView>
  );
}
