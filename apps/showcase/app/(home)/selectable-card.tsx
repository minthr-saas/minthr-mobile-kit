import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  Badge,
  SelectableCard,
  Text,
  spacing,
} from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function SelectableCardDemo() {
  return (
    <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'SelectableCard' }} />
      <SelectableCardBody />
    </ScrollView>
  );
}

export function SelectableCardBody() {
  const [plan, setPlan] = useState<'starter' | 'pro' | 'team'>('pro');
  const [perks, setPerks] = useState<Set<string>>(new Set(['notifications']));

  const togglePerk = (key: string) => {
    setPerks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <>
      <Text variant="body" tone="secondary">
        Card-shaped selectable option with a radio or checkbox indicator. The
        whole card surface is the tap target — use for plan pickers, payment
        method choice, or any high-stakes selection.
      </Text>

      <Section label="Radio — pick one plan">
        <View style={{ gap: spacing[3] }}>
          <SelectableCard
            variant="radio"
            selected={plan === 'starter'}
            onPress={() => setPlan('starter')}>
            <Text variant="subtitle">Starter</Text>
            <Text variant="caption" tone="secondary">
              For solo founders. 1 user, 100 employees, basic reports.
            </Text>
            <Text variant="body" tone="brand">
              $0 / month
            </Text>
          </SelectableCard>

          <SelectableCard
            variant="radio"
            selected={plan === 'pro'}
            onPress={() => setPlan('pro')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
              <Text variant="subtitle">Pro</Text>
              <Badge label="Popular" variant="success" />
            </View>
            <Text variant="caption" tone="secondary">
              Growing teams. 10 users, 500 employees, custom reports.
            </Text>
            <Text variant="body" tone="brand">
              $49 / month
            </Text>
          </SelectableCard>

          <SelectableCard
            variant="radio"
            selected={plan === 'team'}
            onPress={() => setPlan('team')}>
            <Text variant="subtitle">Team</Text>
            <Text variant="caption" tone="secondary">
              Large orgs. Unlimited users, 5,000 employees, SSO + audit logs.
            </Text>
            <Text variant="body" tone="brand">
              $199 / month
            </Text>
          </SelectableCard>
        </View>
      </Section>

      <Section label="Checkbox — multi-select perks">
        <View style={{ gap: spacing[3] }}>
          <SelectableCard
            variant="checkbox"
            selected={perks.has('notifications')}
            onPress={() => togglePerk('notifications')}>
            <Text variant="subtitle">Push notifications</Text>
            <Text variant="caption" tone="secondary">
              Real-time alerts for approvals and mentions.
            </Text>
          </SelectableCard>

          <SelectableCard
            variant="checkbox"
            selected={perks.has('priority')}
            onPress={() => togglePerk('priority')}>
            <Text variant="subtitle">Priority support</Text>
            <Text variant="caption" tone="secondary">
              4-hour response time, dedicated Slack channel.
            </Text>
          </SelectableCard>

          <SelectableCard
            variant="checkbox"
            selected={perks.has('coaching')}
            onPress={() => togglePerk('coaching')}>
            <Text variant="subtitle">Onboarding coaching</Text>
            <Text variant="caption" tone="secondary">
              90-min kickoff call + monthly check-ins.
            </Text>
          </SelectableCard>
        </View>
      </Section>

      <Section label="Disabled state">
        <SelectableCard variant="radio" selected={false} onPress={() => {}} disabled>
          <Text variant="subtitle">Enterprise</Text>
          <Text variant="caption" tone="secondary">
            Contact sales — not available for self-serve.
          </Text>
        </SelectableCard>
      </Section>
    </>
  );
}
