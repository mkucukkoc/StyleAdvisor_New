// ============================================================
// StyleAdvisor AI - Profile Setup Screen (Onboarding)
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button, Input, Chip } from '../../src/components';
import { useUserStore } from '../../src/stores';
import { analytics } from '../../src/services';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const updateProfile = useUserStore((state) => state.updateProfile);
  const setProfile = useUserStore((state) => state.setProfile);

  const [gender, setGender] = useState<string | null>(null);
  const [age, setAge] = useState('');

  const genderOptions = [
    { id: 'female', label: t('onboarding.profile.genderOptions.female') },
    { id: 'male', label: t('onboarding.profile.genderOptions.male') },
    { id: 'non-binary', label: t('onboarding.profile.genderOptions.nonBinary') },
    { id: 'prefer-not-to-say', label: t('onboarding.profile.genderOptions.preferNot') },
  ];

  const handleNext = () => {
    // Initialize profile with basic data
    setProfile({
      id: 'profile-new',
      userId: 'user-1',
      gender: (gender as any) || 'prefer-not-to-say',
      age: age ? parseInt(age) : undefined,
      stylePreferences: [],
      favoriteColors: [],
      avoidColors: [],
      budgetRange: { min: 50, max: 200, currency: 'USD' },
      preferredRetailers: [],
      notificationsEnabled: false,
      onboardingCompleted: false,
    });
    analytics.track('onboarding_start');
    router.push('/(onboarding)/body-info');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: insets.top + theme.spacing.xl,
    },
    header: {
      marginBottom: theme.spacing['2xl'],
    },
    stepIndicator: {
      flexDirection: 'row',
      marginBottom: theme.spacing.lg,
    },
    stepDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.border,
      marginRight: theme.spacing.sm,
    },
    stepDotActive: {
      backgroundColor: theme.colors.primary,
      width: 24,
    },
    title: {
      fontSize: theme.fontSize['3xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionLabel: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    chipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    footer: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: insets.bottom + theme.spacing.lg,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.stepIndicator}>
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <View
                key={step}
                style={[styles.stepDot, step === 1 && styles.stepDotActive]}
              />
            ))}
          </View>
          <Text style={styles.title}>{t('onboarding.profile.title')}</Text>
          <Text style={styles.subtitle}>{t('onboarding.profile.subtitle')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('onboarding.profile.genderLabel')}</Text>
          <View style={styles.chipsContainer}>
            {genderOptions.map((option) => (
              <Chip
                key={option.id}
                label={option.label}
                selected={gender === option.id}
                onPress={() => setGender(option.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Input
            label={t('onboarding.profile.ageLabel')}
            placeholder={t('onboarding.profile.agePlaceholder')}
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            leftIcon="calendar-outline"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title={t('common.next')} onPress={handleNext} fullWidth />
      </View>
    </View>
  );
}
