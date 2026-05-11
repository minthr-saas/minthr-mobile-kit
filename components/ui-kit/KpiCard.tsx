import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text as RNText, View, type ViewProps } from 'react-native';

import { borders } from './tokens/borders';
import { lightColors, palette } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontFamily, fontSize, fontWeight } from './tokens/typography';
import { Text } from './Text';

export type KpiTrend = 'up' | 'down' | 'flat';

export interface KpiCardProps extends ViewProps {
  label: string;
  value: string;
  /** Optional delta caption (e.g. "+12% MoM"). Pair with `trend` for a colored arrow. */
  delta?: string;
  trend?: KpiTrend;
  /** Hint shown under the value, e.g. "Across all departments". */
  hint?: string;
}

const trendIcon: Record<KpiTrend, React.ComponentProps<typeof Feather>['name']> = {
  up: 'arrow-up-right',
  down: 'arrow-down-right',
  flat: 'minus',
};

const trendColor: Record<KpiTrend, string> = {
  up: palette.success[700],
  down: palette.danger[700],
  flat: lightColors.textMuted,
};

export function KpiCard({ label, value, delta, trend, hint, style, ...rest }: KpiCardProps) {
  return (
    <View {...rest} style={[styles.card, style]}>
      <Text variant="caption" tone="muted">
        {label}
      </Text>
      <View style={styles.valueRow}>
        <RNText style={styles.value} allowFontScaling={false}>
          {value}
        </RNText>
        {delta && trend ? (
          <View style={[styles.delta, { backgroundColor: trendBgColor[trend] }]}>
            <Feather name={trendIcon[trend]} size={12} color={trendColor[trend]} />
            <RNText style={[styles.deltaLabel, { color: trendColor[trend] }]}>{delta}</RNText>
          </View>
        ) : null}
      </View>
      {hint ? (
        <Text variant="caption" tone="muted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const trendBgColor: Record<KpiTrend, string> = {
  up: lightColors.successSubtle,
  down: lightColors.dangerSubtle,
  flat: lightColors.surfaceSubtle,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: lightColors.surfacePrimary,
    borderColor: lightColors.border,
    borderWidth: borders.hair,
    borderRadius: radius.lg,
    padding: spacing[4],
    gap: spacing[1],
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: 2,
  },
  value: {
    fontFamily: fontFamily.sans,
    fontSize: 28,
    fontWeight: fontWeight.medium,
    color: lightColors.textPrimary,
    letterSpacing: -0.5,
  },
  delta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  deltaLabel: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
});
