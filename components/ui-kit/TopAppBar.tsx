/**
 * TopAppBar — persistent top screen chrome.
 * Title (+ optional subtitle), optional back button or custom left slot,
 * and a slot for trailing icon actions.
 *
 * Distinct from PageHeader: PageHeader is a content-area scroll hero,
 * TopAppBar is the actual nav bar. Pair with `Stack.Screen options={{
 * headerShown: false }}` if you want it to replace expo-router's header.
 *
 * Usage:
 *   <TopAppBar
 *     title="Inbox"
 *     onBack={() => router.back()}
 *     rightActions={[
 *       { icon: 'search', accessibilityLabel: 'Search', onPress: openSearch },
 *       { icon: 'more-vertical', accessibilityLabel: 'More', onPress: openMenu },
 *     ]}
 *   />
 */
import { Feather } from '@expo/vector-icons';
import { type ComponentProps, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from './IconButton';
import { Text } from './Text';
import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { spacing } from './tokens/spacing';

export type TopAppBarVariant = 'default' | 'centered';

export interface TopAppBarAction {
  icon: ComponentProps<typeof Feather>['name'];
  accessibilityLabel: string;
  onPress: () => void;
  disabled?: boolean;
}

export interface TopAppBarProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  /** Overrides the back button when provided. */
  leftSlot?: ReactNode;
  rightActions?: readonly TopAppBarAction[];
  /** 'centered' = iOS-style; 'default' = start-aligned (Android-style). */
  variant?: TopAppBarVariant;
  /** Hide the hairline bottom border. */
  transparent?: boolean;
}

const BAR_HEIGHT = 44;

export function TopAppBar({
  title,
  subtitle,
  onBack,
  leftSlot,
  rightActions,
  variant = 'default',
  transparent = false,
}: TopAppBarProps) {
  const insets = useSafeAreaInsets();
  const centered = variant === 'centered';

  const leading = leftSlot ?? (onBack ? <BackButton onPress={onBack} /> : null);

  const trailing =
    rightActions && rightActions.length > 0 ? (
      <View style={styles.rightActions}>
        {rightActions.map((action, idx) => (
          <IconButton
            key={idx}
            icon={action.icon}
            accessibilityLabel={action.accessibilityLabel}
            onPress={action.onPress}
            disabled={action.disabled}
            variant="ghost"
            size="md"
          />
        ))}
      </View>
    ) : null;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
        !transparent && styles.containerBordered,
        transparent && styles.containerTransparent,
      ]}>
      <View style={styles.bar}>
        <View style={[styles.leftSlot, centered && styles.sideSlotCentered]}>
          {leading}
        </View>

        {centered ? (
          <View pointerEvents="none" style={styles.centerOverlay}>
            <TitleBlock title={title} subtitle={subtitle} center />
          </View>
        ) : (
          <View style={styles.titleBlockDefault}>
            <TitleBlock title={title} subtitle={subtitle} />
          </View>
        )}

        <View style={[styles.rightSlot, centered && styles.sideSlotCentered]}>
          {trailing}
        </View>
      </View>
    </View>
  );
}

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}>
      <Feather name="chevron-left" size={20} color={lightColors.textPrimary} />
    </Pressable>
  );
}

function TitleBlock({
  title,
  subtitle,
  center,
}: {
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <View style={center ? styles.titleStackCentered : styles.titleStack}>
      <Text variant="subtitle" numberOfLines={1} style={center ? styles.titleCentered : undefined}>
        {title}
      </Text>
      {subtitle ? (
        <Text
          variant="caption"
          tone="secondary"
          numberOfLines={1}
          style={center ? styles.subtitleCentered : undefined}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const SIDE_SLOT_MIN_WIDTH = 44;

const styles = StyleSheet.create({
  container: {
    backgroundColor: lightColors.surfacePrimary,
  },
  containerBordered: {
    borderBottomWidth: borders.hair,
    borderBottomColor: lightColors.border,
  },
  containerTransparent: {
    backgroundColor: 'transparent',
  },
  bar: {
    height: BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    gap: spacing[2],
  },
  leftSlot: {
    minWidth: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightSlot: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  sideSlotCentered: {
    minWidth: SIDE_SLOT_MIN_WIDTH,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  titleBlockDefault: {
    flex: 1,
    minWidth: 0,
  },
  titleStack: {
    gap: 1,
  },
  titleStackCentered: {
    alignItems: 'center',
    gap: 1,
  },
  titleCentered: {
    textAlign: 'center',
  },
  subtitleCentered: {
    textAlign: 'center',
  },
  centerOverlay: {
    position: 'absolute',
    start: 0,
    end: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: -spacing[1],
    borderRadius: 14,
  },
  backButtonPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
});
