import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import {
  Avatar,
  Badge,
  Button,
  IconButton,
  ProfileHeader,
  Tabs,
  Text,
  spacing,
} from '@/components/ui-kit';

import { Section } from './_components/Section';

export default function ProfileHeaderDemo() {
  return (
    <ScrollView contentContainerStyle={{ gap: spacing[5], paddingBottom: spacing[10] }}>
      <Stack.Screen options={{ title: 'ProfileHeader' }} />

      <View style={{ padding: spacing[5], paddingBottom: 0 }}>
        <Text variant="body" tone="secondary">
          Entity-profile hero strip. Renders avatar, name, subtitle, status badge,
          quick-action buttons, and an optional tabs slot at the bottom edge.
        </Text>
      </View>

      <Section label="Default density">
        <View style={{ marginHorizontal: -spacing[4], marginVertical: -spacing[4] }}>
          <ProfileHeader
            avatar={<Avatar name="Sara Boudia" size="xl" />}
            name="Sara Boudia"
            subtitle="Software Engineer · Engineering"
            status={<Badge label="Active" variant="success" dot />}
            quickActions={
              <>
                <Button label="Message" variant="secondary" size="sm" />
              </>
            }
            onOverflowPress={() => {}}
          />
        </View>
      </Section>

      <Section label="Compact density">
        <View style={{ marginHorizontal: -spacing[4], marginVertical: -spacing[4] }}>
          <ProfileHeader
            density="compact"
            avatar={<Avatar name="Karim Elbouazri" size="lg" />}
            name="Karim Elbouazri"
            subtitle="Product Manager · Product"
            status={<Badge label="On leave" variant="warning" dot />}
          />
        </View>
      </Section>

      <Section label="With identity extra">
        <View style={{ marginHorizontal: -spacing[4], marginVertical: -spacing[4] }}>
          <ProfileHeader
            avatar={<Avatar name="Amina Chaoui" size="xl" />}
            name="Amina Chaoui"
            subtitle="Head of Design · Design team"
            identityExtra={
              <View style={{ flexDirection: 'row', gap: spacing[2], flexWrap: 'wrap' }}>
                <Badge label="Remote" variant="info" />
                <Badge label="Full-time" variant="neutral" />
              </View>
            }
            quickActions={
              <>
                <Button label="Edit" variant="secondary" size="sm" />
              </>
            }
            onOverflowPress={() => {}}
          />
        </View>
      </Section>

      <Section label="Minimal — name only">
        <View style={{ marginHorizontal: -spacing[4], marginVertical: -spacing[4] }}>
          <ProfileHeader
            name="Guest user"
          />
        </View>
      </Section>
    </ScrollView>
  );
}
