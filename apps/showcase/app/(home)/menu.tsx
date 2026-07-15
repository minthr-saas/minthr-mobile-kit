import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  Button,
  IconButton,
  Menu,
  Text,
  lightColors,
  spacing,
  useToast,
} from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function MenuDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Menu' }} />
      <MenuBody />
    </ScrollView>
  );
}

export function MenuBody() {
  const toast = useToast();

  const rowAnchor = useRef<View>(null);
  const buttonAnchor = useRef<View>(null);
  const inlineAnchor = useRef<View>(null);

  const [rowOpen, setRowOpen] = useState(false);
  const [buttonOpen, setButtonOpen] = useState(false);
  const [inlineOpen, setInlineOpen] = useState(false);

  return (
    <>
      <Text variant="body" tone="secondary">
        Anchored popover with an action list. Replaces desktop dropdown-menu
        patterns on mobile. Auto-flips above the anchor when too close to the
        viewport bottom.
      </Text>

      <Section label="Icon-button overflow menu">
        <View style={styles.row}>
          <Text variant="body">Engagement survey</Text>
          <View ref={rowAnchor}>
            <IconButton
              icon="more-vertical"
              accessibilityLabel="More actions"
              variant="ghost"
              onPress={() => setRowOpen(true)}
            />
          </View>
        </View>
        <Menu
          visible={rowOpen}
          onClose={() => setRowOpen(false)}
          anchorRef={rowAnchor}
          items={[
            { label: 'Duplicate', icon: 'copy', onPress: () => toast.info('Duplicated') },
            { label: 'Archive', icon: 'archive', onPress: () => toast.info('Archived') },
            {
              label: 'Delete',
              icon: 'trash-2',
              destructive: true,
              onPress: () => toast.danger('Deleted'),
            },
          ]}
        />
      </Section>

      <Section label="Anchored to a button">
        <View ref={buttonAnchor}>
          <Button
            label="Sort by"
            variant="secondary"
            rightIcon={<Feather name="chevron-down" size={16} color={lightColors.textPrimary} />}
            onPress={() => setButtonOpen(true)}
          />
        </View>
        <Menu
          visible={buttonOpen}
          onClose={() => setButtonOpen(false)}
          anchorRef={buttonAnchor}
          items={[
            { label: 'Newest first', icon: 'arrow-down', onPress: () => toast.info('Newest') },
            { label: 'Oldest first', icon: 'arrow-up', onPress: () => toast.info('Oldest') },
            { label: 'Alphabetical', icon: 'type', onPress: () => toast.info('A → Z') },
          ]}
        />
      </Section>

      <Section label="Disabled item">
        <View ref={inlineAnchor}>
          <Button
            label="Open menu"
            variant="secondary"
            onPress={() => setInlineOpen(true)}
          />
        </View>
        <Menu
          visible={inlineOpen}
          onClose={() => setInlineOpen(false)}
          anchorRef={inlineAnchor}
          items={[
            { label: 'Edit', icon: 'edit-2', onPress: () => toast.info('Edit') },
            { label: 'Share', icon: 'share-2', onPress: () => toast.info('Share') },
            { label: 'Export PDF', icon: 'download', disabled: true, onPress: () => {} },
          ]}
        />
      </Section>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
});
