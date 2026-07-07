import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Tag,
  Text,
  borders,
  lightColors,
  radius,
  spacing,
  type ComponentCategory,
} from '@minthr-saas/mobile-ui-kit';

export interface DemoHeaderProps {
  name: string;
  category?: ComponentCategory;
  description?: string;
  onBack?: () => void;
}

const BACK_TARGET = 44;

export function DemoHeader({ name, category, description, onBack }: DemoHeaderProps) {
  return (
    <View style={styles.root}>
      <View style={styles.topRow}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={spacing[2]}
            onPress={onBack}
            android_ripple={{ color: lightColors.surfaceSubtle, borderless: true }}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}>
            <Feather name="chevron-left" size={22} color={lightColors.textPrimary} />
          </Pressable>
        ) : null}
        {category ? <Tag label={category} variant="info" /> : null}
      </View>

      <View style={styles.titleBlock}>
        <Text variant="title">{name}</Text>
        {description ? (
          <Text variant="body" tone="secondary">
            {description}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[2],
    paddingBottom: spacing[4],
    gap: spacing[3],
    backgroundColor: lightColors.surfacePage,
    borderBottomWidth: borders.hair,
    borderBottomColor: lightColors.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: BACK_TARGET,
  },
  backButton: {
    width: BACK_TARGET,
    height: BACK_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: -spacing[2],
    borderRadius: radius.full,
  },
  backButtonPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  titleBlock: {
    gap: spacing[1],
  },
});
