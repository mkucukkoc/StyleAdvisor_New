// ============================================================
// StyleAdvisor AI - Simple Profile Screens (Placeholders)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';

export default function StyleProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();

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
    headerContent: {
      flex: 1,
    },
    title: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholder: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{t('profile.styleProfile.title')}</Text>
          <Text style={styles.subtitle}>{t('profile.styleProfile.subtitle')}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Ionicons name="sparkles" size={64} color={theme.colors.textTertiary} />
        <Text style={styles.placeholder}>Style preferences editor coming soon</Text>
      </View>
    </View>
  );
}
