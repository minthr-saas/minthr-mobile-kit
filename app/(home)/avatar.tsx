import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Avatar, Text, spacing } from '@/components/ui-kit';

import { Section } from './_components/Section';

export default function AvatarDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Avatar' }} />

      <Text variant="body" tone="secondary">
        Person identifier. Six sizes, deterministic background color from the name, optional image
        URL and presence ring.
      </Text>

      <Section label="Sizes">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
          <Avatar name="Jane Doe" size="xs" />
          <Avatar name="Jane Doe" size="sm" />
          <Avatar name="Jane Doe" size="md" />
          <Avatar name="Jane Doe" size="lg" />
          <Avatar name="Jane Doe" size="xl" />
          <Avatar name="Jane Doe" size="2xl" />
        </View>
      </Section>

      <Section label="Initials are deterministic per name">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
          <Avatar name="Sara Boudia" size="lg" />
          <Avatar name="Karim Bensalem" size="lg" />
          <Avatar name="Aïcha Tlemçani" size="lg" />
          <Avatar name="Mehdi Ouazene" size="lg" />
          <Avatar name="Linda H." size="lg" />
          <Avatar name="O" size="lg" />
        </View>
      </Section>

      <Section label="With image source">
        <View style={{ flexDirection: 'row', gap: spacing[3] }}>
          <Avatar
            name="From URL"
            size="xl"
            imageUri="https://i.pravatar.cc/150?img=12"
          />
          <Avatar
            name="From URL 2"
            size="xl"
            imageUri="https://i.pravatar.cc/150?img=32"
          />
        </View>
      </Section>

      <Section label="Presence">
        <View style={{ flexDirection: 'row', gap: spacing[4] }}>
          <Avatar name="Online One" size="lg" presence="online" />
          <Avatar name="Away One" size="lg" presence="away" />
          <Avatar name="Offline One" size="lg" presence="offline" />
        </View>
      </Section>
    </ScrollView>
  );
}
