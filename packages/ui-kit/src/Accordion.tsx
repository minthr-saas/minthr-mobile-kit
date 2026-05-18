import { Feather } from '@expo/vector-icons';
import { createContext, type ReactNode, useContext, useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, UIManager, View } from 'react-native';

import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { Text } from './Text';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionContextValue {
  expanded: ReadonlySet<string>;
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionProps {
  /** Allow more than one item open at a time. Defaults to false. */
  multiple?: boolean;
  /** Item ids to start expanded. */
  defaultExpanded?: readonly string[];
  children: ReactNode;
}

export function Accordion({ multiple = false, defaultExpanded = [], children }: AccordionProps) {
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set(defaultExpanded));

  const toggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!multiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <AccordionContext.Provider value={{ expanded, toggle }}>
      <View style={styles.list}>{children}</View>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function AccordionItem({ id, title, children }: AccordionItemProps) {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error('AccordionItem must be used inside an Accordion.');
  }
  const isOpen = ctx.expanded.has(id);

  return (
    <View style={styles.item}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPress={() => ctx.toggle(id)}
        style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}>
        <Text variant="body" style={styles.title}>
          {title}
        </Text>
        <Feather
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={lightColors.textSecondary}
        />
      </Pressable>
      {isOpen ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: lightColors.surfacePrimary,
    borderRadius: radius.lg,
    borderWidth: borders.hair,
    borderColor: lightColors.border,
    overflow: 'hidden',
  },
  item: {
    borderTopWidth: borders.hair,
    borderTopColor: lightColors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  headerPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  title: {
    flex: 1,
    fontWeight: '500',
  },
  body: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
    paddingTop: 0,
    gap: spacing[2],
  },
});
