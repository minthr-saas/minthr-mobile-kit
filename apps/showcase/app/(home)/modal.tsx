import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { Button, Modal, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function ModalDemo() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Modal' }} />

      <Text variant="body" tone="secondary">
        Centered overlay with a backdrop. Use sparingly — for confirmations, focused tasks, or
        destructive actions. For browsing/picking flows, prefer BottomSheet.
      </Text>

      <Section label="Confirmation pattern">
        <Button label="Delete employee" variant="danger" onPress={() => setConfirmOpen(true)} />
      </Section>

      <Section label="Info modal">
        <Button label="Show release notes" variant="secondary" onPress={() => setInfoOpen(true)} />
      </Section>

      <Modal
        visible={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete employee?"
        actions={
          <>
            <Button label="Cancel" variant="ghost" onPress={() => setConfirmOpen(false)} />
            <Button label="Delete" variant="danger" onPress={() => setConfirmOpen(false)} />
          </>
        }>
        <Text variant="body" tone="secondary">
          This will remove Sara Boudia from your roster and revoke all access tokens. This cannot
          be undone.
        </Text>
      </Modal>

      <Modal
        visible={infoOpen}
        onClose={() => setInfoOpen(false)}
        title="What's new — May 2026"
        actions={<Button label="Got it" onPress={() => setInfoOpen(false)} />}>
        <Text variant="body" tone="secondary">
          We have shipped per-component showcase routes, six new components, and a registry-driven
          index page. Visit the Kit tab to see the full list.
        </Text>
        <Text variant="body" tone="secondary">
          As always, file feedback in #design-system on Slack.
        </Text>
      </Modal>
    </ScrollView>
  );
}
