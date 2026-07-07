import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  BottomTabBar,
  type BottomTabBarItem,
  Card,
  lightColors,
  spacing,
  Text,
} from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

type TabKey = 'home' | 'inbox' | 'profile' | 'settings';

const ITEMS: readonly BottomTabBarItem<TabKey>[] = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'inbox', label: 'Inbox', icon: 'inbox', badge: 3 },
  { key: 'profile', label: 'Profile', icon: 'user', badge: true },
  { key: 'settings', label: 'Settings', icon: 'settings', disabled: true },
];

const COPY: Record<TabKey, { title: string; body: string }> = {
  home: { title: 'Home', body: 'Welcome back. Pulse survey closes Friday.' },
  inbox: { title: 'Inbox', body: '3 unread messages waiting.' },
  profile: { title: 'Profile', body: 'Your profile and preferences.' },
  settings: { title: 'Settings', body: '(Disabled — try the other tabs.)' },
};

export default function BottomTabBarDemo() {
  const [active, setActive] = useState<TabKey>('home');

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ title: 'BottomTabBar' }} />

      <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
        <Text variant="body" tone="secondary">
          Persistent bottom navigation bar. Renders a row of icon + label tab items with
          numeric / dot badges and active-tint styling. No shadow — it&apos;s chrome, not a
          floating element. Wire it up with local state, or pass it as `tabBar` to a
          @react-navigation/bottom-tabs Navigator.
        </Text>

        <Section label="Controlled demo">
          <Card>
            <Text variant="subtitle">{COPY[active].title}</Text>
            <Text variant="body" tone="secondary">
              {COPY[active].body}
            </Text>
          </Card>
          <Text variant="caption" tone="muted">
            Active key: {active}
          </Text>
        </Section>

        <Section label="Compact variant (icon-only)">
          <View style={styles.compactPreview}>
            <BottomTabBar
              variant="compact"
              items={[
                { key: 'home', label: 'Home', icon: 'home' },
                { key: 'search', label: 'Search', icon: 'search' },
                { key: 'inbox', label: 'Inbox', icon: 'inbox', badge: 12 },
                { key: 'profile', label: 'Profile', icon: 'user', badge: true },
              ]}
              active="home"
              onChange={() => {}}
            />
          </View>
        </Section>

        <Section label="With primary action (5-tab layout)">
          <View style={styles.compactPreview}>
            <BottomTabBar
              variant="compact"
              items={[
                { key: 'home', label: 'Home', icon: 'home' },
                { key: 'team', label: 'Team', icon: 'users' },
                { key: 'add', label: 'Add', icon: 'plus', kind: 'primary' },
                { key: 'inbox', label: 'Inbox', icon: 'message-square', badge: 2 },
                { key: 'help', label: 'Help', icon: 'help-circle' },
              ]}
              active="home"
              onChange={() => {}}
            />
          </View>
        </Section>
      </ScrollView>

      <BottomTabBar items={ITEMS} active={active} onChange={setActive} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: lightColors.surfacePage,
  },
  compactPreview: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: lightColors.border,
  },
});
