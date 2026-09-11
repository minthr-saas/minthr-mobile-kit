/**
 * Form — the vertical stack every form screen and form sheet shares.
 *
 * Owns the two things product forms otherwise re-declare by hand: the content
 * inset and the rhythm between fields. Drop kit controls (`Input`, `Select`,
 * `DatePicker`, `FormField`, …) straight in as children — no per-field wrapper
 * `View` is needed.
 *
 * Usage:
 *   <Form>
 *     <FormSection title="Personal">
 *       <FormRow>
 *         <Input label="First name" … />
 *         <Input label="Last name" … />
 *       </FormRow>
 *       <Select label="Gender" … />
 *     </FormSection>
 *   </Form>
 *
 * Layout only — it carries no submit, validation or state contract, so it
 * composes with Formik, react-hook-form or plain `useState` alike.
 */
import { Children, type ReactNode, isValidElement, useMemo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Divider } from './Divider';
import { Text } from './Text';
import { useTheme } from './Theme';
import { spacing } from './tokens/spacing';

/**
 * Content inset around the stack. `none` when the parent already insets;
 * `inline` for sheets, which supply their own vertical padding.
 */
export type FormPadding = 'none' | 'inline' | 'sm' | 'md' | 'lg';
/** Rhythm between fields. */
export type FormGap = 'xs' | 'sm' | 'md' | 'lg';

export interface FormProps extends ViewProps {
  children: ReactNode;
  padding?: FormPadding;
  gap?: FormGap;
}

export function Form({ children, padding = 'md', gap = 'md', style, ...rest }: FormProps) {
  return (
    <View {...rest} style={[paddingStyles[padding], gapStyles[gap], style]}>
      {children}
    </View>
  );
}

const paddingStyles = StyleSheet.create({
  none: { padding: 0 },
  inline: { paddingHorizontal: spacing[5] },
  sm: { padding: spacing[3] },
  md: { padding: spacing[5] },
  lg: { padding: spacing[6] },
});

const gapStyles = StyleSheet.create({
  xs: { gap: spacing[2] },
  sm: { gap: spacing[3] },
  md: { gap: spacing[5] },
  lg: { gap: spacing[6] },
});

/* ----- Subcomponents -------------------------------------------------- */

export interface FormRowProps extends ViewProps {
  children: ReactNode;
  /** Space between the columns. Defaults to the `sm` step. */
  gap?: FormGap;
}

/**
 * Side-by-side fields on one line. Each child gets an equal-width column, so
 * a `flex: 1` kit control (every field trigger is one) fills its share rather
 * than collapsing to its icon.
 */
export function FormRow({ children, gap = 'sm', style, ...rest }: FormRowProps) {
  const columns = Children.toArray(children).filter(Boolean);

  return (
    <View {...rest} style={[subStyles.row, gapStyles[gap], style]}>
      {columns.map((child, index) => (
        <View
          key={isValidElement(child) && child.key != null ? child.key : index}
          style={subStyles.column}>
          {child}
        </View>
      ))}
    </View>
  );
}

export interface FormSectionProps extends ViewProps {
  children: ReactNode;
  title?: string;
  description?: string;
  /** Draw a `Divider` above the section. Use to separate stacked sections. */
  divided?: boolean;
  /** Rhythm between the fields inside the section. */
  gap?: FormGap;
}

/** A titled group of fields inside a `Form`. */
export function FormSection({
  children,
  title,
  description,
  divided,
  gap = 'md',
  style,
  ...rest
}: FormSectionProps) {
  const { colors } = useTheme();
  const header = useMemo(() => {
    if (!title && !description) return null;
    return (
      <View style={subStyles.header}>
        {title ? (
          <Text variant="caption" color={colors.textMuted} style={subStyles.title}>
            {title}
          </Text>
        ) : null}
        {description ? (
          <Text variant="caption" tone="muted">
            {description}
          </Text>
        ) : null}
      </View>
    );
  }, [title, description, colors]);

  return (
    <View {...rest} style={[subStyles.section, style]}>
      {divided ? <Divider /> : null}
      {header}
      <View style={gapStyles[gap]}>{children}</View>
    </View>
  );
}

const subStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  column: {
    flex: 1,
  },
  section: {
    gap: spacing[3],
  },
  header: {
    gap: spacing[1],
  },
  title: {
    fontWeight: '500',
  },
});
