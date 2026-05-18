import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import {
  Input,
  PasswordStrength,
  Text,
  lightColors,
  spacing,
} from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function PasswordStrengthDemo() {
  const [pwd, setPwd] = useState('');
  const [shown, setShown] = useState(false);

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'PasswordStrength' }} />

      <Text variant="body" tone="secondary">
        Client-side strength hint — pair with server-side validation. Heuristic only: length,
        case mix, digits, special characters.
      </Text>

      <Section label="Live meter">
        <View style={{ gap: spacing[2] }}>
          <Input
            label="Choose a password"
            placeholder="At least 8 characters"
            value={pwd}
            onChangeText={setPwd}
            secureTextEntry={!shown}
            autoCapitalize="none"
            rightIcon={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={shown ? 'Hide password' : 'Show password'}
                hitSlop={6}
                onPress={() => setShown((v) => !v)}>
                <Feather
                  name={shown ? 'eye-off' : 'eye'}
                  size={14}
                  color={lightColors.textMuted}
                />
              </Pressable>
            }
          />
          <PasswordStrength password={pwd} />
        </View>
      </Section>

      <Section label="Sample states">
        <View style={{ gap: spacing[3] }}>
          <View style={{ gap: spacing[1] }}>
            <Text variant="caption" tone="muted">
              empty
            </Text>
            <PasswordStrength password="" />
          </View>
          <View style={{ gap: spacing[1] }}>
            <Text variant="caption" tone="muted">
              &quot;hello&quot;
            </Text>
            <PasswordStrength password="hello" />
          </View>
          <View style={{ gap: spacing[1] }}>
            <Text variant="caption" tone="muted">
              &quot;Hello123&quot;
            </Text>
            <PasswordStrength password="Hello123" />
          </View>
          <View style={{ gap: spacing[1] }}>
            <Text variant="caption" tone="muted">
              &quot;Hello123!@minthr&quot;
            </Text>
            <PasswordStrength password="Hello123!@minthr" />
          </View>
        </View>
      </Section>
    </ScrollView>
  );
}
