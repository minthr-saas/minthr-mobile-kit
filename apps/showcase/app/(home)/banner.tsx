import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  Banner,
  Text,
  lightColors,
  spacing,
  useToast,
} from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function BannerDemo() {
  const toast = useToast();
  const [dismissed, setDismissed] = useState(false);

  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Banner' }} />

      <Text variant="body" tone="secondary">
        Persistent app-level status strip. Full-width, no radius — sits flush
        beneath your top app bar. Different from Toast (ephemeral) and Alert
        (content-area card).
      </Text>

      <Section label="Variants">
        <View style={styles.stack}>
          <View style={styles.bannerFrame}>
            <Banner variant="info" message="A new version is available — restart the app to update." />
          </View>
          <View style={styles.bannerFrame}>
            <Banner variant="success" message="Your changes have been saved to the server." />
          </View>
          <View style={styles.bannerFrame}>
            <Banner
              variant="warning"
              message="You're offline. Changes will sync when you reconnect."
            />
          </View>
          <View style={styles.bannerFrame}>
            <Banner
              variant="danger"
              message="Sync failed. Your latest changes haven't been uploaded yet."
            />
          </View>
        </View>
      </Section>

      <Section label="With action button">
        <View style={styles.bannerFrame}>
          <Banner
            variant="warning"
            message="You're offline. Changes will sync when you reconnect."
            actionLabel="Retry"
            onAction={() => toast.info('Retry tapped')}
          />
        </View>
      </Section>

      <Section label="With action + dismiss">
        {dismissed ? (
          <Text variant="body" tone="secondary">
            Banner dismissed.{' '}
            <Text
              variant="body"
              tone="brand"
              onPress={() => setDismissed(false)}
              style={{ textDecorationLine: 'underline' }}>
              Restore
            </Text>
          </Text>
        ) : (
          <View style={styles.bannerFrame}>
            <Banner
              variant="info"
              message="Migrate this team to the new workspace before April 30."
              actionLabel="Migrate"
              onAction={() => toast.success('Migration started')}
              onDismiss={() => setDismissed(true)}
            />
          </View>
        )}
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing[3],
  },
  bannerFrame: {
    borderWidth: 1,
    borderColor: lightColors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
