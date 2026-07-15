import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  DevSettings,
  I18nManager,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  SearchBar,
  Text,
  borders,
  fontWeight,
  lightColors,
  palette,
  radius,
  spacing,
  type ComponentCategory,
  kitCategories,
  kitComponents,
} from '@minthr-saas/mobile-ui-kit';

import { ComponentShowcase } from './_components/ComponentShowcase';
import { demoRegistry } from './_components/demoRegistry';

const ALL_CATEGORY = 'All' as const;
type FilterCategory = typeof ALL_CATEGORY | ComponentCategory;

export default function KitIndex() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FilterCategory>(ALL_CATEGORY);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return kitComponents.filter((c) => {
      if (category !== ALL_CATEGORY && c.category !== category) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  const grouped = useMemo(() => {
    const map = new Map<ComponentCategory, typeof kitComponents[number][]>();
    for (const c of filtered) {
      if (!map.has(c.category)) map.set(c.category, []);
      map.get(c.category)!.push(c);
    }
    return kitCategories
      .map((cat) => ({ category: cat, items: map.get(cat) ?? [] }))
      .filter((g) => g.items.length > 0);
  }, [filtered]);

  const handlePress = (path: string) => router.push(path as never);

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled">
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroTopRow}>
          <Text variant="title" style={styles.heroTitle}>
            MintHR mobile kit
          </Text>
          <RTLToggle />
        </View>
        <View style={styles.heroMeta}>
          <Text variant="caption" tone="brand" style={styles.heroMetaItem}>
            {kitComponents.length} components
          </Text>
          <View style={styles.heroMetaDot} />
          <Text variant="caption" tone="muted">
            v0.1.0
          </Text>
        </View>
        <Text variant="body" tone="secondary">
          Sister to the web @minthr-saas/ui-kit. Every component is live below —
          grouped by category. Tap Open on any card for its full-screen demo.
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search components"
        />
      </View>

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
        keyboardShouldPersistTaps="handled">
        {[ALL_CATEGORY, ...kitCategories].map((cat) => (
          <CategoryChip
            key={cat}
            label={cat}
            selected={category === cat}
            onPress={() => setCategory(cat)}
          />
        ))}
      </ScrollView>

      {/* Results — live demos grouped by category */}
      {grouped.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="search" size={24} color={lightColors.textMuted} />
          <Text variant="body" tone="muted">
            No components match {`"${query}"`}.
          </Text>
        </View>
      ) : (
        grouped.map(({ category: cat, items }) => (
          <View key={cat} style={styles.categoryBlock}>
            <View style={styles.categoryHead}>
              <Text variant="caption" tone="brand" style={styles.categoryLabel}>
                {cat}
              </Text>
              <Text variant="caption" tone="muted">
                {items.length}
              </Text>
            </View>
            {items.map((item, idx) => {
              const entry = demoRegistry[item.path];
              if (!entry) return null;
              return (
                <View key={item.path}>
                  {idx > 0 ? <View style={styles.separator} /> : null}
                  <ComponentShowcase
                    name={item.name}
                    Body={entry.Body}
                    framed={entry.framed}
                    onOpen={() => handlePress(item.path)}
                  />
                </View>
              );
            })}
          </View>
        ))
      )}
    </ScrollView>
  );
}

function RTLToggle() {
  const rtl = I18nManager.isRTL;

  function handleToggle() {
    const next = !rtl;
    I18nManager.allowRTL(next);
    I18nManager.forceRTL(next);
    // Native: direction is locked at startup, so a reload is required.
    // Web: also reload — simpler than threading direction into every style.
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.reload();
    } else if (__DEV__) {
      DevSettings.reload();
    }
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Switch to ${rtl ? 'LTR' : 'RTL'} layout`}
      onPress={handleToggle}
      android_ripple={{ color: lightColors.surfaceSubtle, borderless: false }}
      style={({ pressed }) => [
        rtlStyles.button,
        pressed && rtlStyles.buttonPressed,
      ]}>
      <Feather name="repeat" size={12} color={lightColors.textSecondary} />
      <Text variant="caption" tone="secondary" style={rtlStyles.label}>
        {rtl ? 'RTL' : 'LTR'}
      </Text>
    </Pressable>
  );
}

function CategoryChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      android_ripple={{ color: lightColors.surfaceSubtle, borderless: false }}
      style={({ pressed }) => [
        chipStyles.chip,
        selected ? chipStyles.chipSelected : chipStyles.chipUnselected,
        pressed && !selected && chipStyles.chipPressed,
      ]}>
      <Text
        variant="caption"
        style={[
          chipStyles.label,
          { color: selected ? lightColors.onBrand : lightColors.textSecondary },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingVertical: spacing[5],
    gap: spacing[6],
    paddingBottom: spacing[16],
  },
  hero: {
    paddingHorizontal: spacing[5],
    gap: spacing[2],
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
  },
  heroTitle: {
    fontWeight: fontWeight.medium,
    flexShrink: 1,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  heroMetaItem: {
    fontWeight: fontWeight.medium,
  },
  heroMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: lightColors.textMuted,
  },
  searchRow: {
    paddingHorizontal: spacing[5],
  },
  chipsRow: {
    paddingHorizontal: spacing[5],
    gap: spacing[2],
  },
  categoryBlock: {
    gap: spacing[5],
    paddingHorizontal: spacing[5],
  },
  categoryHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[1],
    paddingBottom: spacing[1],
    borderBottomWidth: borders.hair,
    borderBottomColor: lightColors.border,
  },
  categoryLabel: {
    fontWeight: fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  separator: {
    height: borders.hair,
    backgroundColor: lightColors.border,
    marginBottom: spacing[5],
  },
  empty: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[10],
    alignItems: 'center',
    gap: spacing[2],
  },
});

const rtlStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
    borderWidth: borders.hair,
    borderColor: lightColors.border,
    backgroundColor: lightColors.surfacePrimary,
  },
  buttonPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  label: {
    fontWeight: fontWeight.medium,
  },
});

const chipStyles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.full,
    borderWidth: borders.hair,
    minHeight: 32,
    justifyContent: 'center',
  },
  chipUnselected: {
    backgroundColor: lightColors.surfacePrimary,
    borderColor: lightColors.border,
  },
  chipSelected: {
    backgroundColor: lightColors.brand,
    borderColor: lightColors.brand,
  },
  chipPressed: {
    backgroundColor: palette.gray[50],
  },
  label: {
    fontWeight: fontWeight.medium,
  },
});
