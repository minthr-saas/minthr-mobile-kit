/**
 * PullToRefresh — ScrollView with kit-tinted RefreshControl wired up.
 * Mobile-idiomatic pull-down-to-refresh gesture.
 *
 * Usage:
 *   const [refreshing, setRefreshing] = useState(false);
 *   const onRefresh = async () => { setRefreshing(true); await reload(); setRefreshing(false); };
 *
 *   <PullToRefresh refreshing={refreshing} onRefresh={onRefresh}>
 *     {…content…}
 *   </PullToRefresh>
 *
 * For FlatList consumers: pass <KitRefreshControl ... /> to the `refreshControl` prop.
 */
import {
  RefreshControl,
  type RefreshControlProps,
  ScrollView,
  type ScrollViewProps,
} from 'react-native';

import { lightColors } from './tokens/colors';

export interface KitRefreshControlProps
  extends Omit<RefreshControlProps, 'tintColor' | 'colors' | 'progressBackgroundColor'> {
  /** Override the spinner / progress color. Defaults to lightColors.brand. */
  tint?: string;
}

/** Pre-styled RefreshControl. Pass to `refreshControl` on ScrollView / FlatList. */
export function KitRefreshControl({ tint, ...rest }: KitRefreshControlProps) {
  const color = tint ?? lightColors.brand;
  return (
    <RefreshControl
      {...rest}
      tintColor={color}
      colors={[color]}
      progressBackgroundColor={lightColors.surfacePrimary}
    />
  );
}

export interface PullToRefreshProps extends Omit<ScrollViewProps, 'refreshControl'> {
  refreshing: boolean;
  onRefresh: () => void;
  /** Override the spinner / progress color. Defaults to lightColors.brand. */
  tint?: string;
}

export function PullToRefresh({
  refreshing,
  onRefresh,
  tint,
  children,
  ...rest
}: PullToRefreshProps) {
  return (
    <ScrollView
      {...rest}
      refreshControl={
        <KitRefreshControl refreshing={refreshing} onRefresh={onRefresh} tint={tint} />
      }>
      {children}
    </ScrollView>
  );
}
