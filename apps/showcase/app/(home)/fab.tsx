import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { FAB, Text, spacing, useToast } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function FABDemo() {
  const toast = useToast();

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: 'FAB' }} />
      <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
        <Text variant="body" tone="secondary">
          Floating Action Button — circular primary action anchored above the screen, usually
          bottom-end. Allowed to carry a shadow (it&apos;s a floating element). Use sparingly —
          one FAB per screen.
        </Text>

        <Section label="Variants">
          <Text variant="caption" tone="muted">
            Bottom-end FAB renders below over this screen — tap it to confirm.
          </Text>
        </Section>

        <Section label="Anatomy">
          <Text variant="body">
            • <Text variant="body" tone="primary">regular</Text> — 56dp circle, used by default
          </Text>
          <Text variant="body">
            • <Text variant="body" tone="primary">mini</Text> — 40dp circle, denser screens
          </Text>
          <Text variant="body">
            • <Text variant="body" tone="primary">extended</Text> — pill with icon + label
          </Text>
        </Section>

        <View style={{ height: spacing[16] * 2 }} />
      </ScrollView>

      <FAB
        icon="plus"
        accessibilityLabel="New item"
        onPress={() => toast.success('Plus tapped')}
      />
    </View>
  );
}
