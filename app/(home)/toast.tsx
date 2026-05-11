import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Button, Text, spacing, useToast } from '@/components/ui-kit';

import { Section } from './_components/Section';

export default function ToastDemo() {
  const toast = useToast();

  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Toast' }} />

      <Text variant="body" tone="secondary">
        Ephemeral top-aligned notification. Fired imperatively from anywhere via the
        useToast() hook. Auto-dismisses after 4 seconds (configurable).
      </Text>

      <Section label="Variants">
        <View style={{ gap: spacing[2] }}>
          <Button
            label="Info"
            variant="secondary"
            onPress={() => toast.info('Pulse survey closes Friday')}
          />
          <Button
            label="Success"
            variant="secondary"
            onPress={() => toast.success('Profile saved')}
          />
          <Button
            label="Warning"
            variant="secondary"
            onPress={() => toast.warning('You have 8% of monthly invitations left')}
          />
          <Button
            label="Danger"
            variant="secondary"
            onPress={() => toast.danger('Could not reach payroll service')}
          />
        </View>
      </Section>

      <Section label="With description">
        <Button
          label="Show detailed toast"
          variant="secondary"
          onPress={() =>
            toast.success({
              title: 'Compensation updated',
              description: 'Sara Boudia · effective May 1, 2026.',
            })
          }
        />
      </Section>

      <Section label="Persistent (no auto-dismiss)">
        <Button
          label="Show until dismissed"
          variant="secondary"
          onPress={() =>
            toast.info({
              title: 'Sync paused',
              description: 'Tap the × to dismiss. No auto-timer.',
              duration: 0,
            })
          }
        />
      </Section>

      <Section label="Spam test (queue caps at 3)">
        <Button
          label="Fire 5 in a row"
          variant="secondary"
          onPress={() => {
            toast.info('First');
            toast.info('Second');
            toast.info('Third');
            toast.info('Fourth');
            toast.info('Fifth — older ones get pushed out');
          }}
        />
      </Section>
    </ScrollView>
  );
}
