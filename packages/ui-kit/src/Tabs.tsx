import { Pressable, ScrollView, StyleSheet, View, type ViewProps } from 'react-native';

import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { spacing } from './tokens/spacing';
import { Text } from './Text';

export interface TabOption<T extends string = string> {
  value: T;
  label: string;
}

export interface TabsProps<T extends string = string> extends ViewProps {
  options: readonly TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Wrap many tabs into a horizontal scroller. Defaults to true. */
  scrollable?: boolean;
}

export function Tabs<T extends string = string>({
  options,
  value,
  onChange,
  scrollable = true,
  style,
  ...rest
}: TabsProps<T>) {
  const inner = (
    <View style={styles.row}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(opt.value)}
            style={[styles.tab, selected && styles.tabSelected]}>
            <Text
              variant="body"
              tone={selected ? 'primary' : 'secondary'}
              style={selected ? styles.labelSelected : undefined}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View {...rest} style={[styles.container, style]}>
      {scrollable ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {inner}
        </ScrollView>
      ) : (
        inner
      )}
      <View style={styles.baseline} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  row: {
    flexDirection: 'row',
    gap: spacing[1],
  },
  baseline: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    height: borders.hair,
    backgroundColor: lightColors.border,
  },
  tab: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabSelected: {
    borderBottomColor: lightColors.brand,
  },
  labelSelected: {
    fontWeight: '500',
  },
});
