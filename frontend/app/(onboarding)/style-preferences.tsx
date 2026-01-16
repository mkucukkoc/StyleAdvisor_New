// ============================================================
// StyleAdvisor AI - Style Preferences Screen (Onboarding)
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

export default function StylePreferencesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const updateProfile = useUserStore((state) => state.updateProfile);

  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [favoriteColors, setFavoriteColors] = useState<string[]>([]);

  const styleOptions = [
    { id: 'casual', label: t('onboarding.stylePreferences.styles.casual'), icon: 'sunny-outline' },
    { id: 'formal', label: t('onboarding.stylePreferences.styles.formal'), icon: 'briefcase-outline' },
    { id: 'streetwear', label: t('onboarding.stylePreferences.styles.streetwear'), icon: 'walk-outline' },
    { id: 'bohemian', label: t('onboarding.stylePreferences.styles.bohemian'), icon: 'leaf-outline' },
    { id: 'minimalist', label: t('onboarding.stylePreferences.styles.minimalist'), icon: 'square-outline' },
    { id: 'vintage', label: t('onboarding.stylePreferences.styles.vintage'), icon: 'time-outline' },
    { id: 'sporty', label: t('onboarding.stylePreferences.styles.sporty'), icon: 'fitness-outline' },
    { id: 'elegant', label: t('onboarding.stylePreferences.styles.elegant'), icon: 'sparkles-outline' },
    { id: 'edgy', label: t('onboarding.stylePreferences.styles.edgy'), icon: 'flash-outline' },
    { id: 'preppy', label: t('onboarding.stylePreferences.styles.preppy'), icon: 'school-outline' },
  ];

  const colorOptions = [
    { id: '#000000', name: 'Black' },
    { id: '#FFFFFF', name: 'White' },
    { id: '#1E3A5F', name: 'Navy' },
    { id: '#808080', name: 'Gray' },
    { id: '#D2B48C', name: 'Beige' },
    { id: '#8B4513', name: 'Brown' },
    { id: '#DC143C', name: 'Red' },
    { id: '#006400', name: 'Green' },
    { id: '#4169E1', name: 'Blue' },
    { id: '#FFD700', name: 'Gold' },
    { id: '#FFC0CB', name: 'Pink' },
    { id: '#800080', name: 'Purple' },
  ];

  const toggleStyle = (styleId: string) => {
    setSelectedStyles((prev) =>
      prev.includes(styleId) ? prev.filter((s) => s !== styleId) : [...prev, styleId]
    );
  };

  const toggleColor = (colorId: string) => {
    setFavoriteColors((prev) =>
      prev.includes(colorId) ? prev.filter((c) => c !== colorId) : [...prev, colorId]
    );
  };

  const handleNext = () => {
    updateProfile({
      stylePreferences: selectedStyles.map((s) => ({
        id: s,
        name: s,
        icon: styleOptions.find((o) => o.id === s)?.icon || 'star-outline',
        selected: true,
      })),
      favoriteColors,
    });
    router.push('/(onboarding)/budget-retailers');
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
    stylesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    styleItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    styleItemSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryMuted,
    },
    styleLabel: {
      marginLeft: theme.spacing.sm,
      fontSize: theme.fontSize.sm,
      color: theme.colors.text,
    },
    colorsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    colorItem: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 3,
      borderColor: 'transparent',
    },
    colorItemSelected: {
      borderColor: theme.colors.primary,
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
                  step === 3 && styles.stepDotActive,
                  step < 3 && styles.stepDotDone,
                ]}
              />
            ))}
          </View>
          <Text style={styles.title}>{t('onboarding.stylePreferences.title')}</Text>
          <Text style={styles.subtitle}>{t('onboarding.stylePreferences.subtitle')}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.stylesGrid}>
            {styleOptions.map((style) => (
              <TouchableOpacity
                key={style.id}
                style={[
                  styles.styleItem,
                  selectedStyles.includes(style.id) && styles.styleItemSelected,
                ]}
                onPress={() => toggleStyle(style.id)}
              >
                <Ionicons
                  name={style.icon as any}
                  size={18}
                  color={
                    selectedStyles.includes(style.id)
                      ? theme.colors.primary
                      : theme.colors.textSecondary
                  }
                />
                <Text style={styles.styleLabel}>{style.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            {t('onboarding.stylePreferences.favoriteColorsLabel')}
          </Text>
          <View style={styles.colorsGrid}>
            {colorOptions.map((color) => (
              <TouchableOpacity
                key={color.id}
                style={[
                  styles.colorItem,
                  { backgroundColor: color.id },
                  favoriteColors.includes(color.id) && styles.colorItemSelected,
                ]}
                onPress={() => toggleColor(color.id)}
              />
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
