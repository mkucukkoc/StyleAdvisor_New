// ============================================================
// StyleAdvisor AI - Settings Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme, ThemeMode } from '../../../src/theme/ThemeContext';
import { changeLanguage, SupportedLanguage, languageNames } from '../../../src/i18n';
import { analytics } from '../../../src/services';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, themeMode, setThemeMode } = useTheme();
  const { t, i18n } = useTranslation();

  const themeOptions: { id: ThemeMode; label: string }[] = [
    { id: 'light', label: t('profile.settings.themeOptions.light') },
    { id: 'dark', label: t('profile.settings.themeOptions.dark') },
    { id: 'system', label: t('profile.settings.themeOptions.system') },
  ];

  const languageOptions: { id: SupportedLanguage; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'tr', label: 'Türkçe' },
  ];

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    analytics.track('theme_change', { theme: mode });
  };

  const handleLanguageChange = async (lang: SupportedLanguage) => {
    await changeLanguage(lang);
    analytics.track('language_change', { language: lang });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: insets.top + theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    backButton: {
      marginRight: theme.spacing.md,
    },
    title: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.textTertiary,
      marginBottom: theme.spacing.sm,
      textTransform: 'uppercase',
    },
    optionsContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    optionLast: {
      borderBottomWidth: 0,
    },
    optionLabel: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
    },
    optionValue: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
    },
    checkmark: {
      marginLeft: theme.spacing.sm,
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
    },
    toggleLabel: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('profile.settings.title')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Theme */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings.theme')}</Text>
          <View style={styles.optionsContainer}>
            {themeOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.option, index === themeOptions.length - 1 && styles.optionLast]}
                onPress={() => handleThemeChange(option.id)}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
                {themeMode === option.id && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={theme.colors.primary}
                    style={styles.checkmark}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings.language')}</Text>
          <View style={styles.optionsContainer}>
            {languageOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.option, index === languageOptions.length - 1 && styles.optionLast]}
                onPress={() => handleLanguageChange(option.id)}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
                {i18n.language === option.id && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={theme.colors.primary}
                    style={styles.checkmark}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings.notifications')}</Text>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>{t('profile.settings.notificationTypes.push')}</Text>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>{t('profile.settings.notificationTypes.dailyOutfit')}</Text>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>{t('profile.settings.notificationTypes.deals')}</Text>
            <Switch
              value={false}
              onValueChange={() => {}}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
