import { Stack } from 'expo-router';

import {
  fontFamily,
  fontWeight,
  kitComponents,
  lightColors,
} from '@minthr-saas/mobile-ui-kit';

import { DemoHeader } from './_components/DemoHeader';

export default function HomeStackLayout() {
  return (
    <Stack
      screenOptions={({ route, navigation }) => {
        const entry = kitComponents.find((c) => c.path === `/${route.name}`);
        return {
          headerStyle: { backgroundColor: lightColors.surfacePage },
          headerShadowVisible: false,
          headerTintColor: lightColors.textPrimary,
          headerTitleStyle: {
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.medium,
          },
          contentStyle: { backgroundColor: lightColors.surfacePage },
          header: entry
            ? () => (
                <DemoHeader
                  name={entry.name}
                  category={entry.category}
                  description={entry.description}
                  onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
                />
              )
            : undefined,
        };
      }}>
      <Stack.Screen name="index" options={{ title: 'MintHR UI kit', headerShown: false }} />
    </Stack>
  );
}
