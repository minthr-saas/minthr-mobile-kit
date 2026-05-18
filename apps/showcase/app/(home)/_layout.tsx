import { Stack } from 'expo-router';

import { fontFamily, fontWeight, lightColors } from '@minthr-saas/mobile-ui-kit';

export default function HomeStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: lightColors.surfacePage },
        headerShadowVisible: false,
        headerTintColor: lightColors.textPrimary,
        headerTitleStyle: {
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.medium,
        },
        contentStyle: { backgroundColor: lightColors.surfacePage },
      }}>
      <Stack.Screen name="index" options={{ title: 'MintHR UI kit' }} />
    </Stack>
  );
}
