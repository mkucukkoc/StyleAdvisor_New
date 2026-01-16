// ============================================================
// StyleAdvisor AI - Profile Tab Stack
// ============================================================

import { Stack } from 'expo-router';
import { useTheme } from '../../../src/theme/ThemeContext';

export default function ProfileLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="subscription" />
      <Stack.Screen name="style-profile" />
      <Stack.Screen name="help" />
      <Stack.Screen name="report-issue" />
      <Stack.Screen name="terms" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="affiliate" />
      <Stack.Screen name="delete-account" />
      <Stack.Screen name="export-data" />
    </Stack>
  );
}
