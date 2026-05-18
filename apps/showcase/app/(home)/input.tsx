import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { Input, Text, lightColors, spacing } from '@minthr-saas/mobile-ui-kit';

import { Section } from './_components/Section';

export default function InputDemo() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [search, setSearch] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: spacing[5], gap: spacing[5] }}>
      <Stack.Screen options={{ title: 'Input' }} />

      <Text variant="body" tone="secondary">
        Single-line text field. Optional label, hint, error, and `leftIcon` / `rightIcon` slots.
        Border switches to brand on focus.
      </Text>

      <Section label="Plain">
        <Input placeholder="Type something" />
      </Section>

      <Section label="With label and hint">
        <Input
          label="Full name"
          placeholder="Jane Doe"
          value={name}
          onChangeText={setName}
          hint="Used on your profile and HR documents."
        />
      </Section>

      <Section label="With error">
        <Input
          label="Email"
          placeholder="name@minthr.com"
          value={email}
          onChangeText={setEmail}
          error="Email is required."
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </Section>

      <Section label="With left icon">
        <Input
          placeholder="Search..."
          value={search}
          onChangeText={setSearch}
          leftIcon={<Feather name="search" size={14} color={lightColors.textMuted} />}
        />
      </Section>

      <Section label="Password (with right icon toggle)">
        <Input
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          rightIcon={
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              hitSlop={6}
              onPress={() => setShowPassword((v) => !v)}>
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={14}
                color={lightColors.textMuted}
              />
            </Pressable>
          }
        />
      </Section>

      <Section label="Both icons">
        <Input
          label="Workspace URL"
          placeholder="acme"
          leftIcon={<Feather name="link" size={14} color={lightColors.textMuted} />}
          rightIcon={
            <Text variant="caption" tone="muted">
              .minthr.com
            </Text>
          }
        />
      </Section>

      <Section label="Disabled">
        <View style={{ gap: spacing[2] }}>
          <Input label="Department" value="Operations" editable={false} />
        </View>
      </Section>
    </ScrollView>
  );
}
