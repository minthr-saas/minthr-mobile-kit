import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { Button, Drawer, Text, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function DrawerDemo() {
  const [endOpen, setEndOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [footerOpen, setFooterOpen] = useState(false);

  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Drawer' }} />

      <Text variant="body" tone="secondary">
        Side-sliding panel for detail views, settings, or form sidebars. Slides from
        the start (left in LTR) or end (right in LTR) edge with a spring animation.
      </Text>

      <Section label="End drawer (default)">
        <Button
          label="Open end drawer"
          variant="secondary"
          onPress={() => setEndOpen(true)}
        />
      </Section>

      <Section label="Start drawer">
        <Button
          label="Open start drawer"
          variant="secondary"
          onPress={() => setStartOpen(true)}
        />
      </Section>

      <Section label="With footer actions">
        <Button
          label="Open with footer"
          variant="secondary"
          onPress={() => setFooterOpen(true)}
        />
      </Section>

      <Drawer
        visible={endOpen}
        onClose={() => setEndOpen(false)}
        title="Employee details">
        <Text variant="body" tone="secondary">
          Sara Boudia joined the engineering team in March 2024. She currently works on
          the design-system platform squad.
        </Text>
        <Text variant="body" tone="secondary">
          Use drawers for secondary content that does not warrant a full-screen push
          navigation.
        </Text>
      </Drawer>

      <Drawer
        visible={startOpen}
        onClose={() => setStartOpen(false)}
        title="Navigation"
        side="start"
        size="sm">
        <Text variant="body" tone="secondary">
          This drawer slides from the start edge — natural for navigation menus in
          LTR layouts (or from the right in RTL).
        </Text>
      </Drawer>

      <Drawer
        visible={footerOpen}
        onClose={() => setFooterOpen(false)}
        title="Edit department"
        footer={
          <>
            <Button label="Cancel" variant="ghost" onPress={() => setFooterOpen(false)} />
            <Button label="Save" onPress={() => setFooterOpen(false)} />
          </>
        }>
        <Text variant="body" tone="secondary">
          This drawer has a footer slot with action buttons — useful for forms or
          edit panels that need explicit save / cancel actions.
        </Text>
      </Drawer>
    </ScrollView>
  );
}
