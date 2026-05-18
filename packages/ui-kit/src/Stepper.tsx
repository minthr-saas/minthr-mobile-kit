import { Feather } from '@expo/vector-icons';
import { Fragment } from 'react';
import { StyleSheet, Text as RNText, View, type ViewProps } from 'react-native';

import { borders } from './tokens/borders';
import { lightColors, palette } from './tokens/colors';
import { spacing } from './tokens/spacing';
import { fontFamily, fontSize, fontWeight } from './tokens/typography';
import { Text } from './Text';

export interface StepperStep {
  label: string;
  description?: string;
}

export interface StepperProps extends ViewProps {
  steps: readonly StepperStep[];
  /** Index of the current step (0-based). All earlier steps are marked complete. */
  currentStep: number;
}

const CIRCLE_SIZE = 24;

export function Stepper({ steps, currentStep, style, ...rest }: StepperProps) {
  return (
    <View {...rest} style={[styles.container, style]}>
      {steps.map((step, idx) => {
        const status = idx < currentStep ? 'complete' : idx === currentStep ? 'current' : 'upcoming';
        return (
          <Fragment key={`${idx}-${step.label}`}>
            <View style={styles.stepBlock}>
              <View
                style={[
                  styles.circle,
                  status === 'complete' && styles.circleComplete,
                  status === 'current' && styles.circleCurrent,
                  status === 'upcoming' && styles.circleUpcoming,
                ]}>
                {status === 'complete' ? (
                  <Feather name="check" size={14} color={lightColors.onBrand} />
                ) : (
                  <RNText
                    style={[
                      styles.circleLabel,
                      status === 'current' && styles.circleLabelCurrent,
                      status === 'upcoming' && styles.circleLabelUpcoming,
                    ]}>
                    {idx + 1}
                  </RNText>
                )}
              </View>
              <View style={styles.text}>
                <Text
                  variant="caption"
                  tone={status === 'upcoming' ? 'muted' : 'primary'}
                  style={status !== 'upcoming' ? styles.labelStrong : undefined}>
                  {step.label}
                </Text>
                {step.description ? (
                  <Text variant="caption" tone="muted">
                    {step.description}
                  </Text>
                ) : null}
              </View>
            </View>
            {idx < steps.length - 1 ? (
              <View
                style={[
                  styles.connector,
                  idx < currentStep ? styles.connectorComplete : styles.connectorUpcoming,
                ]}
              />
            ) : null}
          </Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[1],
  },
  stepBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  circleComplete: {
    backgroundColor: lightColors.brand,
  },
  circleCurrent: {
    backgroundColor: lightColors.surfacePrimary,
    borderWidth: borders.thin,
    borderColor: lightColors.brand,
  },
  circleUpcoming: {
    backgroundColor: lightColors.surfacePrimary,
    borderWidth: borders.thin,
    borderColor: lightColors.borderStrong,
  },
  circleLabel: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  circleLabelCurrent: {
    color: lightColors.brand,
  },
  circleLabelUpcoming: {
    color: lightColors.textMuted,
  },
  text: {
    flex: 1,
    gap: 2,
    paddingTop: 2,
    paddingBottom: spacing[2],
  },
  labelStrong: {
    fontWeight: '500',
  },
  connector: {
    marginStart: CIRCLE_SIZE / 2 - 0.5,
    width: 1,
    height: spacing[3],
    marginVertical: -spacing[1],
  },
  connectorComplete: {
    backgroundColor: lightColors.brand,
  },
  connectorUpcoming: {
    backgroundColor: palette.gray[200],
  },
});
