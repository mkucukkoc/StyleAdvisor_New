// ============================================================
// StyleAdvisor AI - Onboarding Stack Layout
// ============================================================

import { Stack } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';

export default function OnboardingLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="profile-setup" />
      <Stack.Screen name="body-info" />
      <Stack.Screen name="style-preferences" />
      <Stack.Screen name="budget-retailers" />
      <Stack.Screen name="notification-opt-in" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
