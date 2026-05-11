import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import {
  Badge,
  Card,
  Text,
  borders,
  lightColors,
  radius,
  spacing,
} from '@/components/ui-kit';
import {
  type ComponentCategory,
  type KitComponentEntry,
  kitCategories,
  kitComponents,
} from '@/components/ui-kit/_registry';

export default function KitIndex() {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.intro}>
        <Text variant="body" tone="secondary">
          Mobile components for MintHR — sister to the web @minthr-saas/ui-kit. Tap any item to
          open its dedicated demo screen.
        </Text>
      </View>

      {kitCategories.map((category) => {
        const items = kitComponents.filter((c) => c.category === category);
        if (items.length === 0) return null;
        return <CategoryBlock key={category} category={category} items={items} />;
      })}
    </ScrollView>
  );
}

function CategoryBlock({
  category,
  items,
}: {
  category: ComponentCategory;
  items: readonly KitComponentEntry[];
}) {
  return (
    <View style={styles.category}>
      <Text variant="caption" tone="muted" style={styles.categoryLabel}>
        {category}
      </Text>
      <Card padding="none">
        {items.map((item, idx) => (
          <View key={item.path}>
            {idx > 0 ? <View style={styles.rowDivider} /> : null}
            <Link href={item.path as never} asChild>
              <Pressable
                android_ripple={{ color: lightColors.surfaceSubtle }}
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
                <View style={styles.rowText}>
                  <Text variant="subtitle">{item.name}</Text>
                  <Text variant="caption" tone="muted">
                    {item.description}
                  </Text>
                </View>
                {item.status !== 'ready' ? (
                  <Badge label={item.status} variant={item.status === 'beta' ? 'info' : 'neutral'} />
                ) : null}
              </Pressable>
            </Link>
          </View>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[5],
    gap: spacing[6],
  },
  intro: {
    gap: spacing[2],
  },
  category: {
    gap: spacing[2],
  },
  categoryLabel: {
    paddingHorizontal: spacing[1],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: radius.lg,
  },
  rowPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  rowText: {
    flexShrink: 1,
    gap: 2,
  },
  rowDivider: {
    height: borders.hair,
    backgroundColor: lightColors.border,
    marginHorizontal: spacing[4],
  },
});
