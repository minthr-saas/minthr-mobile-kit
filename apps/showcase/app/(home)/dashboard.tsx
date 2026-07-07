import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { type ComponentProps, type ReactNode, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Avatar,
  AvatarGroup,
  Badge,
  BottomTabBar,
  type BottomTabBarItem,
  Button,
  Text,
  borders,
  fontWeight,
  lightColors,
  palette,
  radius,
  spacing,
  useSheet,
} from '@minthr-saas/mobile-ui-kit';

import { NavigationDrawer } from './_components/NavigationDrawer';
import { ProfileDrawer } from './_components/ProfileDrawer';
import {
  QuickActionsBody,
  QuickActionsHeader,
} from './_components/QuickActionsSheet';

// ─── Hero: brand-colored top bar + greeting ──────────────────────────────────

function Hero({
  onOpenMenu,
  onOpenProfile,
}: {
  onOpenMenu: () => void;
  onOpenProfile: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[heroStyles.root, { paddingTop: insets.top + spacing[3] }]}>
      <View style={heroStyles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          hitSlop={spacing[2]}
          onPress={onOpenMenu}
          style={heroStyles.iconTarget}>
          <Feather name="menu" size={22} color={lightColors.onBrand} />
        </Pressable>

        <View style={heroStyles.logoRow}>
          <View style={heroStyles.logoMark}>
            <View style={heroStyles.logoLeaf} />
          </View>
          <Text variant="subtitle" style={heroStyles.logoText}>
            Mint
          </Text>
          <Text variant="caption" style={heroStyles.logoSuffix}>
            HR
          </Text>
        </View>

        <View style={heroStyles.trailingRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            hitSlop={spacing[2]}
            style={heroStyles.iconTarget}>
            <View>
              <Feather name="bell" size={20} color={lightColors.onBrand} />
              <View style={heroStyles.bellDot} />
            </View>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open profile"
            hitSlop={spacing[2]}
            onPress={onOpenProfile}>
            <Avatar name="Jean Dupont" size="md" />
          </Pressable>
        </View>
      </View>

      <View style={heroStyles.greeting}>
        <Text variant="caption" style={heroStyles.greetingHello}>
          Bonsoir 👋
        </Text>
        <Text variant="title" style={heroStyles.greetingName}>
          Jean Dupont
        </Text>
        <Text variant="caption" style={heroStyles.greetingDate}>
          Lundi 18 mai 2026
        </Text>
      </View>
    </View>
  );
}

// ─── Clock-in card (overlaps the hero/content seam) ──────────────────────────

function ClockInCard() {
  return (
    <View style={clockStyles.card}>
      <View style={clockStyles.left}>
        <View style={clockStyles.statusRow}>
          <View style={clockStyles.statusDot} />
          <Text variant="caption" tone="secondary">
            Dernier pointage
          </Text>
        </View>
        <Text variant="title" style={clockStyles.time}>
          --:--:--
        </Text>
      </View>
      <Button label="Pointer l'entrée" onPress={() => {}} />
    </View>
  );
}

// ─── Quick actions row ───────────────────────────────────────────────────────

interface QuickAction {
  icon: ComponentProps<typeof Feather>['name'];
  label: string;
  background: string;
  iconColor: string;
}

const quickActions: readonly QuickAction[] = [
  {
    icon: 'calendar',
    label: 'Demande',
    background: lightColors.brandSubtle,
    iconColor: lightColors.brand,
  },
  {
    icon: 'credit-card',
    label: 'Note de frais',
    background: lightColors.warningSubtle,
    iconColor: palette.warning[700],
  },
  {
    icon: 'file-text',
    label: 'Documents',
    background: lightColors.infoSubtle,
    iconColor: palette.info[700],
  },
  {
    icon: 'users',
    label: 'Équipe',
    background: lightColors.dangerSubtle,
    iconColor: palette.danger[700],
  },
];

function QuickActions() {
  return (
    <View style={quickStyles.row}>
      {quickActions.map((a) => (
        <Pressable
          key={a.label}
          accessibilityRole="button"
          accessibilityLabel={a.label}
          style={({ pressed }) => [quickStyles.tile, pressed && quickStyles.tilePressed]}>
          <View style={[quickStyles.iconCircle, { backgroundColor: a.background }]}>
            <Feather name={a.icon} size={20} color={a.iconColor} />
          </View>
          <Text variant="caption" numberOfLines={1} style={quickStyles.label}>
            {a.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// ─── Section header (title + count pill + "Tout voir") ──────────────────────

function SectionHeader({
  title,
  count,
  onSeeMore,
}: {
  title: string;
  count?: number | string;
  onSeeMore?: () => void;
}) {
  return (
    <View style={sectionStyles.head}>
      <View style={sectionStyles.headLeft}>
        <Text variant="subtitle">{title}</Text>
        {count !== undefined ? (
          <View style={sectionStyles.countPill}>
            <Text variant="caption" tone="brand" style={sectionStyles.countText}>
              {count}
            </Text>
          </View>
        ) : null}
      </View>
      {onSeeMore ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Voir tout ${title}`}
          onPress={onSeeMore}
          hitSlop={spacing[2]}
          style={sectionStyles.seeMore}>
          <Text variant="caption" tone="brand" style={sectionStyles.seeMoreText}>
            Tout voir
          </Text>
          <Feather name="arrow-right" size={14} color={lightColors.brand} />
        </Pressable>
      ) : null}
    </View>
  );
}

// ─── Item row (icon-circle + title/subtitle + trailing) ─────────────────────

function ItemRow({
  icon,
  iconBg = lightColors.brandSubtle,
  iconColor = lightColors.brand,
  title,
  subtitle,
  trailing,
}: {
  icon: ComponentProps<typeof Feather>['name'];
  iconBg?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
}) {
  return (
    <View style={rowStyles.row}>
      <View style={[rowStyles.iconCircle, { backgroundColor: iconBg }]}>
        <Feather name={icon} size={16} color={iconColor} />
      </View>
      <View style={rowStyles.text}>
        <Text variant="body" numberOfLines={1} style={rowStyles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" tone="secondary" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing ? <View style={rowStyles.trailing}>{trailing}</View> : null}
    </View>
  );
}

// ─── Stat tile (leave-balance grid) ─────────────────────────────────────────

const STAT_THEMES = {
  rose: { background: lightColors.dangerSubtle },
  mint: { background: lightColors.successSubtle },
  blue: { background: lightColors.infoSubtle },
  peach: { background: lightColors.warningSubtle },
} as const;

type StatTheme = keyof typeof STAT_THEMES;

function StatTile({
  value,
  label,
  theme,
}: {
  value: string;
  label: string;
  theme: StatTheme;
}) {
  return (
    <View style={[statStyles.tile, { backgroundColor: STAT_THEMES[theme].background }]}>
      <Text variant="title" style={statStyles.value}>
        {value}
      </Text>
      <Text variant="caption" tone="secondary">
        {label}
      </Text>
    </View>
  );
}

// ─── Demo screen ─────────────────────────────────────────────────────────────

const tabItems: readonly BottomTabBarItem[] = [
  { key: 'home', label: 'Accueil', icon: 'home' },
  { key: 'people', label: 'Équipe', icon: 'users' },
  { key: 'add', label: 'Ajouter', icon: 'plus', kind: 'primary' },
  { key: 'chat', label: 'Discussion', icon: 'message-square', badge: 2 },
  { key: 'help', label: 'Aide', icon: 'help-circle' },
];

const teamOnLeaveToday = [
  { name: 'Marie Martin' },
  { name: 'Pierre Durand' },
  { name: 'Sophie Bernard' },
  { name: 'Lucas Petit' },
];

export default function DashboardExample() {
  const [activeTab, setActiveTab] = useState('home');
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const sheet = useSheet();

  function handleTabChange(key: string) {
    if (key === 'add') {
      sheet.open<void>({ body: QuickActionsBody, header: QuickActionsHeader });
      return;
    }
    setActiveTab(key);
  }

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Hero
          onOpenMenu={() => setNavOpen(true)}
          onOpenProfile={() => setProfileOpen(true)}
        />

        {/* Clock-in card overlaps the hero/content boundary */}
        <View style={styles.clockSlot}>
          <ClockInCard />
        </View>

        <View style={styles.body}>
          <QuickActions />

          {/* Announcement banner */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voir l'annonce"
            style={({ pressed }) => [annStyles.banner, pressed && annStyles.bannerPressed]}>
            <View style={annStyles.iconBubble}>
              <Feather name="bell" size={16} color={lightColors.brand} />
            </View>
            <View style={annStyles.text}>
              <Text variant="caption" tone="brand" style={styles.medium}>
                Annonce
              </Text>
              <Text variant="body" numberOfLines={1}>
                Voeux de fin d'année
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={lightColors.textMuted} />
          </Pressable>

          {/* Leave balance */}
          <View style={cardStyles.card}>
            <SectionHeader title="Mes congés" onSeeMore={() => {}} />
            <View style={statStyles.grid}>
              <StatTile value="0" label="Pris" theme="rose" />
              <StatTile value="0" label="Restants" theme="mint" />
              <StatTile value="3.5" label="En attente" theme="blue" />
              <StatTile value="0" label="Refusés" theme="peach" />
            </View>
          </View>

          {/* Absents aujourd'hui — glanceable summary */}
          <View style={cardStyles.card}>
            <View style={absentStyles.row}>
              <View style={absentStyles.text}>
                <Text variant="subtitle">Absents aujourd'hui</Text>
                <Text variant="caption" tone="secondary">
                  4 membres de votre équipe
                </Text>
              </View>
              <AvatarGroup items={teamOnLeaveToday} size="sm" max={3} />
            </View>
          </View>

          {/* Demandes à valider */}
          <View style={cardStyles.card}>
            <SectionHeader title="Demandes à valider" count={33} onSeeMore={() => {}} />
            <View style={cardStyles.body}>
              <ItemRow
                icon="calendar"
                title="Congés payés"
                subtitle="04 juin 2026 · 1 jour"
                trailing={
                  <View style={styles.trailingPair}>
                    <Badge label="En attente" variant="warning" dot />
                    <Avatar name="Marie Martin" size="sm" />
                  </View>
                }
              />
              <ItemRow
                icon="calendar"
                title="Congés payés"
                subtitle="02 juin 2026 · 1 jour"
                trailing={
                  <View style={styles.trailingPair}>
                    <Badge label="En attente" variant="warning" dot />
                    <Avatar name="Pierre Durand" size="sm" />
                  </View>
                }
              />
            </View>
          </View>

          {/* Notes de frais */}
          <View style={cardStyles.card}>
            <SectionHeader title="Notes de frais" count={114} onSeeMore={() => {}} />
            <View style={cardStyles.body}>
              <ItemRow
                icon="credit-card"
                iconBg={lightColors.warningSubtle}
                iconColor={palette.warning[700]}
                title="Déplacement client"
                subtitle="07 juil. 2025 · −1 200,00"
                trailing={<Avatar name="Emma Robert" size="sm" />}
              />
              <ItemRow
                icon="credit-card"
                iconBg={lightColors.warningSubtle}
                iconColor={palette.warning[700]}
                title="Déplacement chantier"
                subtitle="17 juil. 2025 · −1 500,00"
                trailing={<Avatar name="Hugo Moreau" size="sm" />}
              />
            </View>
          </View>

          {/* Documents récents */}
          <View style={cardStyles.card}>
            <SectionHeader title="Documents récents" count={120} onSeeMore={() => {}} />
            <View style={cardStyles.body}>
              <ItemRow
                icon="file-text"
                iconBg={lightColors.infoSubtle}
                iconColor={palette.info[700]}
                title="Attestation de travail"
                subtitle="10 juil. 2025"
                trailing={<Avatar name="Pierre Durand" size="sm" />}
              />
              <ItemRow
                icon="file-text"
                iconBg={lightColors.infoSubtle}
                iconColor={palette.info[700]}
                title="Bulletin de paie"
                subtitle="15 juil. 2025"
                trailing={<Avatar name="Sophie Bernard" size="sm" />}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomTabBar
        variant="compact"
        items={tabItems}
        active={activeTab}
        onChange={handleTabChange}
      />

      <NavigationDrawer visible={navOpen} onClose={() => setNavOpen(false)} />
      <ProfileDrawer
        visible={profileOpen}
        onClose={() => setProfileOpen(false)}
        name="Jean Dupont"
        jobTitle="IT"
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const CLOCK_OVERLAP = spacing[8]; // how far the clock card overlaps the body

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: lightColors.surfacePage,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing[6],
  },
  clockSlot: {
    paddingHorizontal: spacing[4],
    marginTop: -CLOCK_OVERLAP,
  },
  body: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[5],
    gap: spacing[4],
  },
  trailingPair: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  medium: {
    fontWeight: fontWeight.medium,
  },
});

const heroStyles = StyleSheet.create({
  root: {
    backgroundColor: lightColors.brand,
    paddingTop: spacing[5],
    paddingBottom: spacing[12],
    paddingHorizontal: spacing[4],
    borderBottomStartRadius: radius.xl,
    borderBottomEndRadius: radius.xl,
    gap: spacing[5],
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  iconTarget: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  logoMark: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    backgroundColor: lightColors.onBrand,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: spacing[1],
  },
  logoLeaf: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: lightColors.brand,
  },
  logoText: {
    color: lightColors.onBrand,
    fontWeight: fontWeight.medium,
  },
  logoSuffix: {
    color: lightColors.onBrand,
    marginBottom: 2,
  },
  trailingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  bellDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: lightColors.warning,
  },
  greeting: {
    paddingHorizontal: spacing[1],
    gap: spacing[1],
  },
  greetingHello: {
    color: palette.brand[100],
  },
  greetingName: {
    color: lightColors.onBrand,
  },
  greetingDate: {
    color: palette.brand[100],
  },
});

const clockStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: lightColors.surfacePrimary,
    borderRadius: radius.xl,
    borderWidth: borders.hair,
    borderColor: lightColors.border,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    gap: spacing[3],
  },
  left: {
    gap: spacing[1],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: lightColors.textMuted,
  },
  time: {
    color: lightColors.textPrimary,
    fontWeight: fontWeight.medium,
  },
});

const quickStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  tile: {
    flex: 1,
    backgroundColor: lightColors.surfacePrimary,
    borderRadius: radius.lg,
    borderWidth: borders.hair,
    borderColor: lightColors.border,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    alignItems: 'center',
    gap: spacing[2],
  },
  tilePressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: fontWeight.medium,
  },
});

const sectionStyles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  headLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  countPill: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: lightColors.brandSubtle,
  },
  countText: {
    fontWeight: fontWeight.medium,
  },
  seeMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  seeMoreText: {
    fontWeight: fontWeight.medium,
  },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: lightColors.surfacePrimary,
    borderRadius: radius.xl,
    borderWidth: borders.hair,
    borderColor: lightColors.border,
    padding: spacing[4],
  },
  body: {
    gap: spacing[2],
  },
});

const annStyles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: lightColors.brandSubtle,
    borderRadius: radius.xl,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  bannerPressed: {
    backgroundColor: palette.brand[100],
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: lightColors.surfacePrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: 2,
  },
});

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[2],
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    fontWeight: fontWeight.medium,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flexShrink: 0,
  },
});

const absentStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  text: {
    flex: 1,
    gap: 2,
  },
});

const statStyles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  tile: {
    flexBasis: '48%',
    flexGrow: 1,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: radius.lg,
    gap: spacing[1],
  },
  value: {
    fontWeight: fontWeight.medium,
  },
});
