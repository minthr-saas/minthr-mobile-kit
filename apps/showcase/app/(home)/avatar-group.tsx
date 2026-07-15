import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { AvatarGroup, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

const team = [
  { name: 'Sara Boudia' },
  { name: 'Karim Bensalem' },
  { name: 'Aïcha Tlemçani' },
  { name: 'Mehdi Ouazene' },
  { name: 'Linda H.' },
  { name: 'Omar K.' },
  { name: 'Najwa Z.' },
  { name: 'Yacine T.' },
];

export default function AvatarGroupDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'AvatarGroup' }} />
      <AvatarGroupBody />
    </ScrollView>
  );
}

export function AvatarGroupBody() {
  return (
    <>
      <Text variant="body" tone="secondary">
        Overlapping avatars with an optional overflow count. White hair-line halo separates each
        avatar so they read clearly against any background.
      </Text>

      <Section label="With overflow">
        <View style={{ gap: spacing[3] }}>
          <AvatarGroup items={team} max={3} />
          <AvatarGroup items={team} max={4} />
          <AvatarGroup items={team} max={6} />
        </View>
      </Section>

      <Section label="No overflow (all visible)">
        <AvatarGroup items={team.slice(0, 3)} max={4} />
      </Section>

      <Section label="Sizes">
        <View style={{ gap: spacing[3] }}>
          <AvatarGroup items={team} max={3} size="sm" />
          <AvatarGroup items={team} max={3} size="md" />
          <AvatarGroup items={team} max={3} size="lg" />
          <AvatarGroup items={team} max={3} size="xl" />
        </View>
      </Section>
    </>
  );
}
