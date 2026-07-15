# Pattern: List screen

A **pattern**, not a component — the canonical mobile "index" screen: a scrollable list of records with search, pull-to-refresh, swipe actions, an empty state, and a floating create action. It's the mobile answer to the web's DataTable + FilterBar + pagination toolbar. Composed from `SearchBar`, `PullToRefresh` / `KitRefreshControl`, `ListItem` (+ `List` / `ListSection`), `SwipeableRow`, `EmptyState`, `Skeleton`, and `FAB`.

## When to use

Any screen whose job is "browse a collection and drill in": employee directory, leave requests, expense claims, documents, notifications.

## Visual anatomy

```
┌─────────────────────────────┐
│  Requests                    │  PageHeader (title + optional filter action)
│ ┌─────────────────────────┐  │
│ │ 🔍  Search              │  │  SearchBar
│ └─────────────────────────┘  │
│ ─ Pending ──────────────────│  ListSection header
│  🟠  Annual leave        ›   │  ListItem (leading, title/subtitle, chevron)
│  🟠  Sick leave          ›   │  ← swipe left reveals Approve / Reject (SwipeableRow)
│ ─ Approved ─────────────────│
│  🟢  Remote day          ›   │
│                             │
│                        ╭───╮ │
│                        │ ＋│ │  FAB — new request
│                        ╰───╯ │
└─────────────────────────────┘
   ↕ pull down to refresh
```

## The pattern

Prefer `FlatList` (virtualized) for real data; use the kit's `KitRefreshControl` as its `refreshControl`. Render each row as a `ListItem`, wrapped in `SwipeableRow` when it has row actions.

```tsx
import { FlatList, View } from 'react-native';
import {
  SearchBar, ListItem, ListSection, SwipeableRow, EmptyState, Skeleton,
  KitRefreshControl, FAB, Badge, spacing, lightColors,
} from '@minthr-saas/mobile-ui-kit';
import { Feather } from '@expo/vector-icons';

export function RequestsScreen() {
  const [query, setQuery] = useState('');
  const { data, loading, refreshing, refresh } = useRequests(query);

  if (loading) {
    return (
      <View style={{ padding: spacing[4], gap: spacing[3] }}>
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} height={64} />)}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: spacing[4] }}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search requests" />
      </View>

      <FlatList
        data={data}
        keyExtractor={(r) => r.id}
        refreshControl={<KitRefreshControl refreshing={refreshing} onRefresh={refresh} />}
        ListEmptyComponent={
          <EmptyState
            icon="inbox"
            title="No requests"
            description="New requests will show up here."
          />
        }
        renderItem={({ item }) => (
          <SwipeableRow
            rightActions={[
              { label: 'Approve', icon: 'check', variant: 'primary', onPress: () => approve(item.id) },
              { label: 'Reject', icon: 'x', variant: 'danger', onPress: () => reject(item.id) },
            ]}>
            <ListItem
              title={item.type}
              subtitle={item.dates}
              leading={<Feather name="calendar" size={20} color={lightColors.textMuted} />}
              trailing={<Badge variant={item.status} label={item.statusLabel} />}
              onPress={() => open(item.id)}
            />
          </SwipeableRow>
        )}
      />

      <FAB icon="plus" accessibilityLabel="New request" onPress={openCreate} />
    </View>
  );
}
```

> Check the exact prop names against each component's spec — `SwipeableRow` action shape and `ListItem` slot names come from their source. See [`../08-layout/SwipeableRow.md`](../08-layout/SwipeableRow.md), [`../08-layout/ListItem.md`](../08-layout/ListItem.md), and [`../08-layout/PullToRefresh.md`](../08-layout/PullToRefresh.md).

## Rules

- **Virtualize real lists.** `FlatList`/`SectionList` with `KitRefreshControl`, not a giant `ScrollView`. Use `PullToRefresh` (which wraps a `ScrollView`) only for short, non-virtualized content.
- **Three states, always:** loading (`Skeleton` rows matching the row shape), empty ([`EmptyState`](../04-display/EmptyState.md) with a real message + optional create action), and populated. Never a bare spinner or "No data".
- **Grouping** via `ListSection` headers (status, date, A–Z) when the collection has natural buckets.
- **Row actions belong in `SwipeableRow`**, not inline buttons crammed into the row — that's the mobile idiom and it keeps rows tappable.
- **One `FAB`** for the primary create action; offset it above any [`BottomTabBar`](../07-navigation/BottomTabBar.md) or [`SelectionBar`](../05-feedback/SelectionBar.md).
- **Search filters in place**; don't navigate to a separate results screen. For faceted filtering add a [`FilterBar`](../03-forms/FilterBar.md) below the `SearchBar`.
- **Bulk selection** → enter a selection mode and show a [`SelectionBar`](../05-feedback/SelectionBar.md) with the count and batch actions.
- **No pagination controls.** Infinite scroll (`onEndReached`) + pull-to-refresh replace the web pager.
- **Status as `Badge`** in the trailing slot — color + label, never color alone.

## When NOT to use

- A single record's details → a detail screen built from [`Card`](../08-layout/Card.md) / `ListItem` rows, or the [sectioned-form](./sectioned-form.md) for editing.
- A short, fixed set of choices → a [`Select`](../03-forms/Select.md) or [`BottomSheet`](../06-overlays/BottomSheet.md), not a full list screen.
