// ============================================================
// StyleAdvisor AI - Affiliate Disclosure Screen
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

export default function AffiliateDisclosureScreen() {
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
      padding: theme.spacing.lg,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: theme.fontSize['2xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    paragraph: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      lineHeight: 24,
      marginBottom: theme.spacing.lg,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    cardTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    cardContent: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      lineHeight: 22,
    },
    bulletPoint: {
      flexDirection: 'row',
      marginBottom: theme.spacing.sm,
    },
    bullet: {
      fontSize: theme.fontSize.md,
      color: theme.colors.primary,
      marginRight: theme.spacing.sm,
    },
    bulletText: {
      flex: 1,
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
    },
  });

  const bulletPoints = [
    t('legal.affiliate.bullets.commission'),
    t('legal.affiliate.bullets.prices'),
    t('legal.affiliate.bullets.honest'),
    t('legal.affiliate.bullets.support'),
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('legal.affiliate.title')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          <Ionicons name="link" size={36} color={theme.colors.primary} />
        </View>

        <Text style={styles.title}>{t('legal.affiliate.heading')}</Text>
        <Text style={styles.paragraph}>{t('legal.affiliate.intro')}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('legal.affiliate.howItWorks')}</Text>
          <Text style={styles.cardContent}>{t('legal.affiliate.howItWorksContent')}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('legal.affiliate.whatYouShouldKnow')}</Text>
          {bulletPoints.map((point, index) => (
            <View key={index} style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{point}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.paragraph}>{t('legal.affiliate.closing')}</Text>
      </ScrollView>
    </View>
  );
}
