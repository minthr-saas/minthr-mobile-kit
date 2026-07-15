import { Feather } from '@expo/vector-icons';
import { type ComponentType } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Text,
  borders,
  fontWeight,
  lightColors,
  radius,
  spacing,
} from '@minthr-saas/mobile-ui-kit';

export interface ComponentShowcaseProps {
  name: string;
  Body: ComponentType;
  /** Render the demo inside a fixed-height viewport (full-screen chrome demos). */
  framed?: boolean;
  onOpen: () => void;
}

/** Height of the viewport used for framed (full-screen-chrome) demos. */
const FRAME_HEIGHT = 380;

export function ComponentShowcase({ name, Body, framed, onOpen }: ComponentShowcaseProps) {
  return (
    <View style={styles.block}>
      <View style={styles.head}>
        <Text variant="subtitle" style={styles.name}>
          {name}
        </Text>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`Open ${name} full screen`}
          hitSlop={spacing[2]}
          onPress={onOpen}
          android_ripple={{ color: lightColors.surfaceSubtle, borderless: true }}
          style={({ pressed }) => [styles.open, pressed && styles.openPressed]}>
          <Text variant="caption" tone="brand" style={styles.openLabel}>
            Open
          </Text>
          <Feather name="arrow-up-right" size={14} color={lightColors.brand} />
        </Pressable>
      </View>

      {framed ? (
        <View style={styles.frame}>
          <Body />
        </View>
      ) : (
        <View style={styles.inline}>
          <Body />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: spacing[3],
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
    paddingHorizontal: spacing[1],
  },
  name: {
    fontWeight: fontWeight.medium,
    flexShrink: 1,
  },
  open: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
  },
  openPressed: {
    backgroundColor: lightColors.brandSubtle,
  },
  openLabel: {
    fontWeight: fontWeight.medium,
  },
  inline: {
    gap: spacing[5],
  },
  frame: {
    height: FRAME_HEIGHT,
    borderRadius: radius.lg,
    borderWidth: borders.hair,
    borderColor: lightColors.border,
    backgroundColor: lightColors.surfacePage,
    overflow: 'hidden',
  },
});
