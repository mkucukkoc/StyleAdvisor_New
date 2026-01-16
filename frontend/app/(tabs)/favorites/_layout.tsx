// ============================================================
// StyleAdvisor AI - Favorites Tab Stack
// ============================================================

import { Stack } from 'expo-router';
import { useTheme } from '../../../src/theme/ThemeContext';

export default function FavoritesLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
