// ============================================================
// StyleAdvisor AI - Terms of Use Screen
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';

export default function TermsOfUseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const sections = [
    {
      title: t('legal.terms.sections.acceptance.title'),
      content: t('legal.terms.sections.acceptance.content'),
    },
    {
      title: t('legal.terms.sections.services.title'),
      content: t('legal.terms.sections.services.content'),
    },
    {
      title: t('legal.terms.sections.userContent.title'),
      content: t('legal.terms.sections.userContent.content'),
    },
    {
      title: t('legal.terms.sections.premium.title'),
      content: t('legal.terms.sections.premium.content'),
    },
    {
      title: t('legal.terms.sections.liability.title'),
      content: t('legal.terms.sections.liability.content'),
    },
    {
      title: t('legal.terms.sections.termination.title'),
      content: t('legal.terms.sections.termination.content'),
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingTop: insets.top + theme.spacing.md,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      flex: 1,
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      textAlign: 'center',
      marginRight: 40,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    lastUpdated: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textTertiary,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    sectionContent: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      lineHeight: 24,
    },
    footer: {
      padding: theme.spacing.lg,
      paddingBottom: insets.bottom + theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    footerText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textTertiary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('legal.terms.title')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>
          {t('legal.terms.lastUpdated')}: January 2025
        </Text>

        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {t('legal.terms.footer')}
        </Text>
      </View>
    </View>
  );
}
