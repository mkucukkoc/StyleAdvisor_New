// ============================================================
// StyleAdvisor AI - Root Layout
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

import { ThemeProvider, useTheme } from '../src/theme/ThemeContext';
import '../src/i18n';
import { loadSavedLanguage } from '../src/i18n';
import { ToastContainer, LimitReachedModal, OfflineBanner } from '../src/components';
import { colors } from '../src/theme/tokens';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function RootLayoutNav() {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <OfflineBanner />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="(modals)" 
          options={{ 
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }} 
        />
      </Stack>
      <ToastContainer />
      <LimitReachedModal />
    </>
  );
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts - with timeout for web compatibility
        const fontLoadPromise = Font.loadAsync({
          Inter_400Regular,
          Inter_500Medium,
          Inter_600SemiBold,
          Inter_700Bold,
        }).catch(() => {
          console.warn('Font loading failed, using system fonts');
        });
        
        // Set a timeout for font loading (web fallback - 2 seconds max)
        const timeoutPromise = new Promise<void>((resolve) => setTimeout(resolve, 2000));
        
        await Promise.race([fontLoadPromise, timeoutPromise]);
        
        // Load saved language preference with timeout
        try {
          await Promise.race([
            loadSavedLanguage(),
            new Promise<void>((resolve) => setTimeout(resolve, 1000))
          ]);
        } catch (langError) {
          console.warn('Language loading failed:', langError);
        }
      } catch (e) {
        console.warn('Error loading assets:', e);
      } finally {
        console.log('App is ready');
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <RootLayoutNav />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.dark.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
