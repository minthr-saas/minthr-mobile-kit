import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  Spinner,
  Text,
  lightColors,
  spacing,
} from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function SpinnerDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Spinner' }} />
      <SpinnerBody />
    </ScrollView>
  );
}

export function SpinnerBody() {
  return (
    <>
      <Text variant="body" tone="secondary">
        Circular loading indicator. For inline loading states; for determinate /
        linear progress, reach for ProgressBar instead.
      </Text>

      <Section label="Sizes">
        <View style={styles.row}>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </View>
      </Section>

      <Section label="Tones">
        <View style={styles.row}>
          <Spinner tone="brand" />
          <Spinner tone="neutral" />
          <View style={styles.inverseFrame}>
            <Spinner tone="inverse" />
          </View>
        </View>
      </Section>

      <Section label="With label">
        <View style={styles.row}>
          <Spinner label="Loading…" />
          <Spinner size="lg" label="Syncing" />
        </View>
      </Section>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[6],
  },
  inverseFrame: {
    backgroundColor: lightColors.brand,
    padding: spacing[3],
    borderRadius: 8,
  },
});
