import { Feather } from '@expo/vector-icons';
import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { lightColors } from './tokens/colors';
import { spacing } from './tokens/spacing';
import { Text } from './Text';

export interface PageHeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
  /** Show a back chevron. Provide `onBack` to handle taps. */
  onBack?: () => void;
  /** Right-aligned slot — typically Buttons or IconButtons. */
  actions?: ReactNode;
}

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
          hitSlop={8}
          onPress={onBack}
          style={styles.backButton}>
          <Feather name="chevron-left" size={20} color={lightColors.textPrimary} />
        </Pressable>
      ) : null}
      <View style={styles.text}>
        <Text variant="title" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="body" tone="secondary" numberOfLines={1}>
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    paddingVertical: spacing[2],
  },
  backButton: {
    marginTop: 4,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: -spacing[1],
  },
  text: {
    flex: 1,
    gap: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[2],
    alignItems: 'center',
  },
});
