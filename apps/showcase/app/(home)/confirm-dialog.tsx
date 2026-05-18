import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { Button, ConfirmDialog, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function ConfirmDialogDemo() {
  const [defaultOpen, setDefaultOpen] = useState(false);
  const [dangerOpen, setDangerOpen] = useState(false);

  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'ConfirmDialog' }} />

      <Text variant="body" tone="secondary">
        Precomposed yes / no confirmation built on Modal. Use for destructive or
        irreversible actions that need an explicit user acknowledgment.
      </Text>

      <Section label="Default variant">
        <Button
          label="Submit changes"
          variant="secondary"
          onPress={() => setDefaultOpen(true)}
        />
      </Section>

      <Section label="Danger variant">
        <Button
          label="Delete employee"
          variant="danger"
          onPress={() => setDangerOpen(true)}
        />
      </Section>

      <ConfirmDialog
        visible={defaultOpen}
        onClose={() => setDefaultOpen(false)}
        onConfirm={() => setDefaultOpen(false)}
        title="Submit changes?"
        message="This will send the updated profile to the HR team for review. You can still edit afterwards."
      />

      <ConfirmDialog
        visible={dangerOpen}
        onClose={() => setDangerOpen(false)}
        onConfirm={() => setDangerOpen(false)}
        title="Delete employee?"
        message="This will permanently remove Sara Boudia from your roster and revoke all access tokens. This cannot be undone."
        variant="danger"
        confirmLabel="Delete"
      />
    </ScrollView>
  );
}
