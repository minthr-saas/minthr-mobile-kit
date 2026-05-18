import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Text, spacing } from '@minthr-saas/mobile-ui-kit';

export interface SectionProps {
  label: string;
  description?: string;
  children: ReactNode;
}

export function Section({ label, description, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text variant="caption" tone="muted">
          {label}
        </Text>
        {description ? (
          <Text variant="caption" tone="muted">
            {description}
          </Text>
        ) : null}
      </View>
      <Card>
        <View style={styles.body}>{children}</View>
      </Card>
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
  body: {
    gap: spacing[3],
  },
});
