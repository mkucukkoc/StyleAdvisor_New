// ============================================================
// StyleAdvisor AI - Wardrobe Tab Stack
// ============================================================

import { Stack } from 'expo-router';
import { useTheme } from '../../../src/theme/ThemeContext';

export default function WardrobeLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="add-item" />
      <Stack.Screen name="item-detail" />
    </Stack>
  );
}
