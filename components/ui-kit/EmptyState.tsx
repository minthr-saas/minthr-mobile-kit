import { Feather } from '@expo/vector-icons';
import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { lightColors } from './tokens/colors';
import { spacing } from './tokens/spacing';
import { Text } from './Text';

export interface EmptyStateProps extends ViewProps {
  icon?: React.ComponentProps<typeof Feather>['name'];
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon = 'inbox',
  title,
  description,
  action,
  style,
  ...rest
}: EmptyStateProps) {
  return (
    <View {...rest} style={[styles.container, style]}>
      <View style={styles.iconBubble}>
        <Feather name={icon} size={20} color={lightColors.textMuted} />
      </View>
      <View style={styles.text}>
        <Text variant="subtitle">{title}</Text>
        {description ? (
          <Text variant="body" tone="secondary" style={styles.description}>
            {description}
          </Text>
        ) : null}
      </View>
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing[10],
    paddingHorizontal: spacing[5],
    gap: spacing[4],
  },
  iconBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: lightColors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    alignItems: 'center',
    gap: spacing[1],
    maxWidth: 320,
  },
  description: {
    textAlign: 'center',
  },
  action: {
    marginTop: spacing[2],
  },
});
