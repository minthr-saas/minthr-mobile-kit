import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Button, IconButton, Text, Tooltip, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function TooltipDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Tooltip' }} />
      <TooltipBody />
    </ScrollView>
  );
}

export function TooltipBody() {
  return (
    <>
      <Text variant="body" tone="secondary">
        Long-press the trigger to open a tooltip. Tap anywhere to dismiss. Hover does not exist on
        touch devices, so we use long-press as the canonical disclosure gesture.
      </Text>

      <Section label="On a Button">
        <View style={{ flexDirection: 'row', gap: spacing[2] }}>
          <Tooltip label="Saves your draft and exits review mode.">
            <Button label="Save draft" variant="secondary" onPress={() => {}} />
          </Tooltip>
          <Tooltip label="This deletes the record permanently. There is no undo.">
            <Button label="Delete" variant="danger" onPress={() => {}} />
          </Tooltip>
        </View>
      </Section>

      <Section label="On an IconButton">
        <View style={{ flexDirection: 'row', gap: spacing[2] }}>
          <Tooltip label="Mark as read — clears the badge but keeps the message in your inbox.">
            <IconButton icon="check" accessibilityLabel="Mark as read" onPress={() => {}} />
          </Tooltip>
          <Tooltip label="Archive removes this from the active list. Find it in Archived later.">
            <IconButton icon="archive" accessibilityLabel="Archive" onPress={() => {}} />
          </Tooltip>
          <Tooltip label="Open more actions: pin, mute, mark unread, …">
            <IconButton
              icon="more-horizontal"
              accessibilityLabel="More actions"
              onPress={() => {}}
            />
          </Tooltip>
        </View>
      </Section>
    </>
  );
}
