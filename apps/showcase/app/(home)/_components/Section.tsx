import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Text,
  borders,
  lightColors,
  radius,
  spacing,
  fontWeight,
} from '@minthr-saas/mobile-ui-kit';

export interface SectionProps {
  label: string;
  description?: string;
  children: ReactNode;
  /** Disable the inset preview background. Use for full-bleed demos. */
  flush?: boolean;
}

export function Section({ label, description, children, flush = false }: SectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text variant="caption" tone="primary" style={styles.label}>
          {label}
        </Text>
        {description ? (
          <Text variant="caption" tone="muted">
            {description}
          </Text>
        ) : null}
      </View>
      <View style={[styles.preview, flush && styles.previewFlush]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing[2],
  },
  header: {
    paddingHorizontal: spacing[1],
    gap: 2,
  },
  label: {
    fontWeight: fontWeight.medium,
  },
  preview: {
    backgroundColor: lightColors.surfaceSubtle,
    borderRadius: radius.lg,
    borderWidth: borders.hair,
    borderColor: lightColors.border,
    padding: spacing[4],
    gap: spacing[3],
  },
  previewFlush: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
  },
});
