// ============================================================
// StyleAdvisor AI - Subscription Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { Button } from '../../../src/components';
import { useSubscriptionStore } from '../../../src/stores';

export default function SubscriptionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const subscription = useSubscriptionStore((state) => state.status);

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
    planCard: {
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
      marginBottom: theme.spacing.xl,
    },
    planGradient: {
      padding: theme.spacing.xl,
    },
    planLabel: {
      fontSize: theme.fontSize.sm,
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: theme.spacing.xs,
    },
    planName: {
      fontSize: theme.fontSize['2xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.white,
      marginBottom: theme.spacing.md,
    },
    planMeta: {
      fontSize: theme.fontSize.sm,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
    },
    featureIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    featureContent: {
      flex: 1,
    },
    featureName: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
    },
    featureDescription: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    featureStatus: {
      marginLeft: theme.spacing.sm,
    },
    footer: {
      padding: theme.spacing.lg,
      paddingBottom: insets.bottom + theme.spacing.lg,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('profile.subscription.title')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Plan */}
        <View style={styles.planCard}>
          <LinearGradient
            colors={subscription.isPremium ? ['#D4AF37', '#B8860B'] : [theme.colors.primary, theme.colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.planGradient}
          >
            <Text style={styles.planLabel}>{t('profile.subscription.currentPlan')}</Text>
            <Text style={styles.planName}>
              {t(`profile.subscription.plans.${subscription.plan}`)}
            </Text>
            <Text style={styles.planMeta}>
              {subscription.isPremium
                ? t('profile.subscription.unlimited')
                : t('profile.subscription.analysisRemaining', { count: subscription.analysisRemaining })}
            </Text>
          </LinearGradient>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.subscription.features')}</Text>
          {subscription.features.map((feature) => (
            <View key={feature.id} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons
                  name={feature.isAvailable ? 'checkmark' : 'lock-closed'}
                  size={18}
                  color={feature.isAvailable ? theme.colors.success : theme.colors.textTertiary}
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureName}>{feature.name}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {subscription.isPremium ? (
          <Button
            title={t('profile.subscription.managePlan')}
            onPress={() => {}}
            variant="outline"
            fullWidth
          />
        ) : (
          <Button
            title={t('profile.subscription.upgradePlan')}
            onPress={() => router.push('/(modals)/paywall')}
            fullWidth
          />
        )}
      </View>
    </View>
  );
}
