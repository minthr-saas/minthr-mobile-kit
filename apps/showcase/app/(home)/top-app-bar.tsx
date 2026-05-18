import { Stack, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  Card,
  lightColors,
  spacing,
  Text,
  TopAppBar,
  useToast,
} from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function TopAppBarDemo() {
  const router = useRouter();
  const toast = useToast();

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />

      <TopAppBar
        title="Inbox"
        subtitle="3 unread"
        onBack={() => router.back()}
        rightActions={[
          {
            icon: 'search',
            accessibilityLabel: 'Search inbox',
            onPress: () => toast.info('Search tapped'),
          },
          {
            icon: 'more-vertical',
            accessibilityLabel: 'More options',
            onPress: () => toast.info('More tapped'),
          },
        ]}
      />

      <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
        <Text variant="body" tone="secondary">
          Top screen chrome. Platform-adaptive height (44 on iOS, 56 on Android) with full 44x44
          tap targets for the back chevron and trailing icons. Use{' '}
          <Text variant="body" tone="primary">
            Stack.Screen options=&#123;&#123; headerShown: false &#125;&#125;
          </Text>{' '}
          so this replaces the expo-router header — that&apos;s what this screen does, so the
          bar above is the real chrome (tap back to return).
        </Text>

        <Section label="Centered (iOS-style)">
          <View style={styles.framedBar}>
            <TopAppBar
              variant="centered"
              title="Profile"
              onBack={() => toast.info('Back tapped')}
              rightActions={[
                {
                  icon: 'edit-2',
                  accessibilityLabel: 'Edit profile',
                  onPress: () => toast.info('Edit tapped'),
                },
              ]}
            />
          </View>
        </Section>

        <Section label="Default with subtitle, no back">
          <View style={styles.framedBar}>
            <TopAppBar
              title="Q1 Performance"
              subtitle="Updated 2 hours ago"
              rightActions={[
                {
                  icon: 'download',
                  accessibilityLabel: 'Download report',
                  onPress: () => toast.success('Downloading'),
                },
              ]}
            />
          </View>
        </Section>

        <Section label="Transparent over colored surface">
          <View style={styles.tintedFrame}>
            <TopAppBar
              transparent
              title="Onboarding"
              onBack={() => toast.info('Back tapped')}
            />
            <View style={styles.tintedBody}>
              <Text variant="body" tone="secondary">
                Renders without a hairline, lets the background bleed through.
              </Text>
            </View>
          </View>
        </Section>

        <Section label="Custom left slot">
          <View style={styles.framedBar}>
            <TopAppBar
              title="Cart"
              leftSlot={
                <Text variant="body" tone="brand" style={{ fontWeight: '500' }}>
                  Cancel
                </Text>
              }
              rightActions={[
                {
                  icon: 'check',
                  accessibilityLabel: 'Confirm',
                  onPress: () => toast.success('Confirmed'),
                },
              ]}
            />
          </View>
        </Section>

        <Card>
          <Text variant="caption" tone="muted">
            Note: The inline examples above don&apos;t apply their own safe-area top inset
            because they&apos;re embedded inside a scrolling page, not mounted as actual
            screen chrome.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: lightColors.surfacePage,
  },
  framedBar: {
    borderWidth: 1,
    borderColor: lightColors.border,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: lightColors.surfacePrimary,
  },
  tintedFrame: {
    borderWidth: 1,
    borderColor: lightColors.border,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: lightColors.brandSubtle,
  },
  tintedBody: {
    padding: spacing[4],
  },
});
