import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { KpiCard, Text, spacing } from '@/components/ui-kit';

import { Section } from './_components/Section';

export default function KpiCardDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'KpiCard' }} />

      <Text variant="body" tone="secondary">
        Single-stat card with a big number and optional trend chip. Use for dashboards. Keep the
        value short — KpiCard is not a replacement for full data viz.
      </Text>

      <Section label="Plain">
        <KpiCard label="Active employees" value="1,243" />
      </Section>

      <Section label="With trend chips">
        <View style={{ gap: spacing[3] }}>
          <KpiCard
            label="Active employees"
            value="1,243"
            delta="+12 MoM"
            trend="up"
          />
          <KpiCard label="Open roles" value="38" delta="-4 WoW" trend="down" />
          <KpiCard label="Average tenure" value="3.4 yrs" delta="0% YoY" trend="flat" />
        </View>
      </Section>

      <Section label="With hint">
        <KpiCard
          label="Engagement score"
          value="78"
          hint="Across 9 questions, 64 responses."
          delta="+6 vs last quarter"
          trend="up"
        />
      </Section>

      <Section label="Side-by-side row">
        <View style={{ flexDirection: 'row', gap: spacing[3] }}>
          <View style={{ flex: 1 }}>
            <KpiCard label="Headcount" value="1,243" delta="+12" trend="up" />
          </View>
          <View style={{ flex: 1 }}>
            <KpiCard label="Open roles" value="38" delta="-4" trend="down" />
          </View>
        </View>
      </Section>
    </ScrollView>
  );
}
