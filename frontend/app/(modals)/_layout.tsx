// ============================================================
// StyleAdvisor AI - Modals Layout
// ============================================================

import { Stack } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';

export default function ModalsLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="paywall" />
    </Stack>
  );
}
