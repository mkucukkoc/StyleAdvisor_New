// ============================================================
// StyleAdvisor AI - Budget & Retailers Screen (Onboarding)
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button, Chip } from '../../src/components';
import { useUserStore } from '../../src/stores';

export default function BudgetRetailersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const updateProfile = useUserStore((state) => state.updateProfile);

  const [budgetRange, setBudgetRange] = useState<number>(1);
  const [selectedRetailers, setSelectedRetailers] = useState<string[]>([]);

  const budgetOptions = [
    { id: 0, label: '$0 - $50', min: 0, max: 50 },
    { id: 1, label: '$50 - $150', min: 50, max: 150 },
    { id: 2, label: '$150 - $300', min: 150, max: 300 },
    { id: 3, label: '$300 - $500', min: 300, max: 500 },
    { id: 4, label: '$500+', min: 500, max: 999 },
  ];

  const retailers = [
    'Zara', 'H&M', 'Mango', 'COS', 'Uniqlo',
    'Massimo Dutti', 'ASOS', 'Nordstrom', 'Net-a-Porter',
    'Everlane', 'Reformation', 'Other',
  ];

  const toggleRetailer = (retailer: string) => {
    setSelectedRetailers((prev) =>
      prev.includes(retailer) ? prev.filter((r) => r !== retailer) : [...prev, retailer]
    );
  };

  const handleNext = () => {
    const selected = budgetOptions[budgetRange];
    updateProfile({
      budgetRange: { min: selected.min, max: selected.max, currency: 'USD' },
      preferredRetailers: selectedRetailers,
    });
    router.push('/(onboarding)/notification-opt-in');
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
    backButton: {
      marginBottom: theme.spacing.lg,
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
    stepDotDone: {
      backgroundColor: theme.colors.primary,
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
    budgetContainer: {
      gap: theme.spacing.sm,
    },
    budgetOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    budgetOptionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryMuted,
    },
    budgetLabel: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
    },
    retailersGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    retailerChip: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    retailerChipSelected: {
      backgroundColor: theme.colors.primaryMuted,
      borderColor: theme.colors.primary,
    },
    retailerLabel: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.text,
    },
    footer: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: insets.bottom + theme.spacing.lg,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.stepIndicator}>
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <View
                key={step}
                style={[
                  styles.stepDot,
                  step === 4 && styles.stepDotActive,
                  step < 4 && styles.stepDotDone,
                ]}
              />
            ))}
          </View>
          <Text style={styles.title}>{t('onboarding.budget.title')}</Text>
          <Text style={styles.subtitle}>{t('onboarding.budget.subtitle')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('onboarding.budget.budgetLabel')}</Text>
          <View style={styles.budgetContainer}>
            {budgetOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.budgetOption,
                  budgetRange === option.id && styles.budgetOptionSelected,
                ]}
                onPress={() => setBudgetRange(option.id)}
              >
                <Text style={styles.budgetLabel}>{option.label}</Text>
                {budgetRange === option.id && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('onboarding.budget.retailersLabel')}</Text>
          <Text style={[styles.subtitle, { marginBottom: theme.spacing.md }]}>
            {t('onboarding.budget.retailersSubtitle')}
          </Text>
          <View style={styles.retailersGrid}>
            {retailers.map((retailer) => (
              <TouchableOpacity
                key={retailer}
                style={[
                  styles.retailerChip,
                  selectedRetailers.includes(retailer) && styles.retailerChipSelected,
                ]}
                onPress={() => toggleRetailer(retailer)}
              >
                <Text style={styles.retailerLabel}>{retailer}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title={t('common.next')} onPress={handleNext} fullWidth />
      </View>
    </View>
  );
}
