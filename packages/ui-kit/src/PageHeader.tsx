import { Feather } from '@expo/vector-icons';
import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { lightColors } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { Text } from './Text';
import { backChevron } from './utils/rtl';

export interface PageHeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
  /** Show a back chevron above the title. Provide `onBack` to handle taps. */
  onBack?: () => void;
  /** Action slot rendered on its own row below the title. */
  actions?: ReactNode;
}

const BACK_TARGET = 44;

export function PageHeader({
  title,
  subtitle,
  onBack,
  actions,
  style,
  ...rest
}: PageHeaderProps) {
  return (
    <View {...rest} style={[styles.container, style]}>
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
          <Feather name={backChevron()} size={24} color={lightColors.textPrimary} />
        </Pressable>
      ) : null}

      <View style={styles.titleStack}>
        <Text variant="title" numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="body" tone="secondary" numberOfLines={3}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[3],
    paddingVertical: spacing[2],
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
  titleStack: {
    gap: spacing[1],
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    alignItems: 'center',
    marginTop: spacing[1],
  },
});
