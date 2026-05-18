import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { ProgressBar, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function ProgressBarDemo() {
  const [v, setV] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setV((prev) => (prev >= 1 ? 0 : Math.min(1, prev + 0.05)));
    }, 250);
    return () => clearInterval(id);
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'ProgressBar' }} />

      <Text variant="body" tone="secondary">
        Linear value indicator (0–1). Use semantic variants to convey state — green for completion,
        amber for warnings, red for failures.
      </Text>

      <Section label="Static values">
        <View style={{ gap: spacing[4] }}>
          <Block label="0%" value={0} />
          <Block label="25%" value={0.25} />
          <Block label="50%" value={0.5} />
          <Block label="75%" value={0.75} />
          <Block label="100%" value={1} />
        </View>
      </Section>

      <Section label="Variants">
        <View style={{ gap: spacing[4] }}>
          <Block label="Default — 60%" value={0.6} variant="default" />
          <Block label="Success — 60%" value={0.6} variant="success" />
          <Block label="Warning — 60%" value={0.6} variant="warning" />
          <Block label="Danger — 60%" value={0.6} variant="danger" />
        </View>
      </Section>

      <Section label="Animated (auto-incrementing)">
        <View style={{ gap: spacing[2] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="caption" tone="muted">
              Sync progress
            </Text>
            <Text variant="caption" tone="muted">
              {Math.round(v * 100)}%
            </Text>
          </View>
          <ProgressBar value={v} />
        </View>
      </Section>
    </ScrollView>
  );
}

function Block({
  label,
  value,
  variant = 'default',
}: {
  label: string;
  value: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}) {
  return (
    <View style={{ gap: spacing[1] }}>
      <Text variant="caption" tone="muted">
        {label}
      </Text>
      <ProgressBar value={value} variant={variant} />
    </View>
  );
}
