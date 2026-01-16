// ============================================================
// StyleAdvisor AI - Analyze Tab Stack
// ============================================================

import { Stack } from 'expo-router';
import { useTheme } from '../../../src/theme/ThemeContext';

export default function AnalyzeLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="photo-capture" />
      <Stack.Screen name="photo-picker" />
      <Stack.Screen name="text-request" />
      <Stack.Screen name="review" />
      <Stack.Screen name="processing" />
      <Stack.Screen name="result" />
      <Stack.Screen name="improvements" />
      <Stack.Screen name="outfit-suggestions" />
      <Stack.Screen name="outfit-detail" />
      <Stack.Screen name="shop-the-look" />
      <Stack.Screen name="product-detail" />
      <Stack.Screen name="share-result" />
    </Stack>
  );
}
