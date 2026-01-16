// ============================================================
// StyleAdvisor AI - Privacy Policy Screen
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

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const sections = [
    {
      title: t('legal.privacy.sections.dataCollection.title'),
      content: t('legal.privacy.sections.dataCollection.content'),
    },
    {
      title: t('legal.privacy.sections.dataUsage.title'),
      content: t('legal.privacy.sections.dataUsage.content'),
    },
    {
      title: t('legal.privacy.sections.dataSharing.title'),
      content: t('legal.privacy.sections.dataSharing.content'),
    },
    {
      title: t('legal.privacy.sections.security.title'),
      content: t('legal.privacy.sections.security.content'),
    },
    {
      title: t('legal.privacy.sections.rights.title'),
      content: t('legal.privacy.sections.rights.content'),
    },
    {
      title: t('legal.privacy.sections.cookies.title'),
      content: t('legal.privacy.sections.cookies.content'),
    },
    {
      title: t('legal.privacy.sections.contact.title'),
      content: t('legal.privacy.sections.contact.content'),
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
    highlight: {
      backgroundColor: theme.colors.primaryMuted,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginTop: theme.spacing.lg,
    },
    highlightTitle: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
    },
    highlightText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('legal.privacy.title')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>
          {t('legal.privacy.lastUpdated')}: January 2025
        </Text>

        <View style={styles.highlight}>
          <Text style={styles.highlightTitle}>{t('legal.privacy.gdprTitle')}</Text>
          <Text style={styles.highlightText}>{t('legal.privacy.gdprText')}</Text>
        </View>

        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
