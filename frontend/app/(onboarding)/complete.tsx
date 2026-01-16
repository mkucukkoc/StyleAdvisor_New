// ============================================================
// StyleAdvisor AI - Onboarding Complete Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button } from '../../src/components';
import { useAuthStore, useUserStore } from '../../src/stores';
import { analytics } from '../../src/services';

export default function OnboardingCompleteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const setOnboarded = useAuthStore((state) => state.setOnboarded);
  const updateProfile = useUserStore((state) => state.updateProfile);

  const features = [
    { icon: 'color-palette', label: t('onboarding.complete.features.analyze') },
    { icon: 'sparkles', label: t('onboarding.complete.features.suggestions') },
    { icon: 'shirt', label: t('onboarding.complete.features.wardrobe') },
    { icon: 'bag', label: t('onboarding.complete.features.shop') },
  ];

  const handleStart = () => {
    setOnboarded(true);
    updateProfile({ onboardingCompleted: true });
    analytics.track('onboarding_complete');
    router.replace('/(tabs)/home');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: insets.top + theme.spacing['2xl'],
      alignItems: 'center',
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(124, 58, 237, 0.15)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.xl,
    },
    title: {
      fontSize: theme.fontSize['3xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.white,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: theme.fontSize.lg,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing['2xl'],
    },
    featuresContainer: {
      width: '100%',
      gap: theme.spacing.md,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
    },
    featureIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: 'rgba(124, 58, 237, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    featureLabel: {
      flex: 1,
      fontSize: theme.fontSize.md,
      color: theme.colors.white,
    },
    footer: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: insets.bottom + theme.spacing.lg,
    },
  });

  return (
    <LinearGradient
      colors={[theme.colors.background, '#1a0a2e']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={64} color={theme.colors.primary} />
        </View>
        <Text style={styles.title}>{t('onboarding.complete.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.complete.subtitle')}</Text>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon as any} size={22} color={theme.colors.primary} />
              </View>
              <Text style={styles.featureLabel}>{feature.label}</Text>
              <Ionicons name="checkmark" size={20} color={theme.colors.success} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button title={t('onboarding.complete.startButton')} onPress={handleStart} fullWidth />
      </View>
    </LinearGradient>
  );
}
