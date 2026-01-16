// ============================================================
// StyleAdvisor AI - Paywall Screen
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button } from '../../src/components';
import { useSubscriptionStore, useUIStore } from '../../src/stores';
import { subscriptionApi } from '../../src/services/api';
import { analytics } from '../../src/services';

type PlanType = 'monthly' | 'yearly';

interface PlanOption {
  id: PlanType;
  titleKey: string;
  priceKey: string;
  descriptionKey: string;
  badge?: string;
}

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const setPremium = useSubscriptionStore((state) => state.setPremium);
  const showToast = useUIStore((state) => state.showToast);

  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');
  const [loading, setLoading] = useState(false);

  const plans: PlanOption[] = [
    {
      id: 'yearly',
      titleKey: 'premium.paywall.plans.yearly.title',
      priceKey: 'premium.paywall.plans.yearly.price',
      descriptionKey: 'premium.paywall.plans.yearly.description',
      badge: t('premium.paywall.plans.yearly.badge'),
    },
    {
      id: 'monthly',
      titleKey: 'premium.paywall.plans.monthly.title',
      priceKey: 'premium.paywall.plans.monthly.price',
      descriptionKey: 'premium.paywall.plans.monthly.description',
    },
  ];

  const features = [
    { icon: 'infinite', key: 'unlimitedAnalyses' },
    { icon: 'shirt', key: 'allSuggestions' },
    { icon: 'sparkles', key: 'advancedInsights' },
    { icon: 'headset', key: 'prioritySupport' },
    { icon: 'star', key: 'exclusiveContent' },
    { icon: 'close-circle', key: 'noAds' },
  ];

  const handleSubscribe = async () => {
    setLoading(true);
    analytics.track('paywall_subscribe_tap', { plan: selectedPlan });

    try {
      // Mock subscription - In production, this would integrate with App Store / Play Store
      await subscriptionApi.subscribe(selectedPlan);
      setPremium(true);
      showToast({ type: 'success', message: t('premium.success.title') });
      router.back();
    } catch (error: any) {
      showToast({ type: 'error', message: error.message || 'Subscription failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    analytics.track('paywall_restore_tap');

    try {
      const response = await subscriptionApi.restore();
      if (response.success && response.data?.isPremium) {
        setPremium(true);
        showToast({ type: 'success', message: 'Subscription restored!' });
        router.back();
      } else {
        showToast({ type: 'info', message: 'No active subscription found' });
      }
    } catch (error) {
      showToast({ type: 'error', message: 'Restore failed' });
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    closeButton: {
      position: 'absolute',
      top: insets.top + theme.spacing.md,
      right: theme.spacing.lg,
      zIndex: 10,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroGradient: {
      paddingTop: insets.top + theme.spacing['3xl'],
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing['2xl'],
      alignItems: 'center',
    },
    crownContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(212, 175, 55, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: theme.fontSize['2xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.white,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: theme.fontSize.md,
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    featuresContainer: {
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    featureIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: theme.colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    featureText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
      flex: 1,
    },
    plansContainer: {
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    planCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.xl,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    planCardSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryMuted,
    },
    planRadio: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    planRadioSelected: {
      borderColor: theme.colors.primary,
    },
    planRadioInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.primary,
    },
    planContent: {
      flex: 1,
    },
    planTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    planTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
    },
    planBadge: {
      marginLeft: theme.spacing.sm,
      paddingVertical: 2,
      paddingHorizontal: theme.spacing.sm,
      backgroundColor: '#D4AF37',
      borderRadius: theme.borderRadius.sm,
    },
    planBadgeText: {
      fontSize: theme.fontSize.xs,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.black,
    },
    planDescription: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    planPrice: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.primary,
    },
    footer: {
      padding: theme.spacing.lg,
      paddingBottom: insets.bottom + theme.spacing.lg,
    },
    restoreButton: {
      alignSelf: 'center',
      marginTop: theme.spacing.md,
    },
    restoreText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.primary,
    },
    termsNote: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textTertiary,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
  });

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Ionicons name="close" size={24} color={theme.colors.white} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.crownContainer}>
            <Ionicons name="diamond" size={40} color="#D4AF37" />
          </View>
          <Text style={styles.title}>{t('premium.paywall.title')}</Text>
          <Text style={styles.subtitle}>{t('premium.paywall.subtitle')}</Text>
        </LinearGradient>

        <View style={styles.content}>
          {/* Features */}
          <View style={styles.featuresContainer}>
            {features.map((feature) => (
              <View key={feature.key} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon as any} size={20} color={theme.colors.primary} />
                </View>
                <Text style={styles.featureText}>
                  {t(`premium.paywall.features.${feature.key}`)}
                </Text>
                <Ionicons name="checkmark-circle" size={22} color={theme.colors.success} />
              </View>
            ))}
          </View>

          {/* Plans */}
          <View style={styles.plansContainer}>
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.planCardSelected,
                ]}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.planRadio,
                    selectedPlan === plan.id && styles.planRadioSelected,
                  ]}
                >
                  {selectedPlan === plan.id && <View style={styles.planRadioInner} />}
                </View>
                <View style={styles.planContent}>
                  <View style={styles.planTitleRow}>
                    <Text style={styles.planTitle}>{t(plan.titleKey)}</Text>
                    {plan.badge && (
                      <View style={styles.planBadge}>
                        <Text style={styles.planBadgeText}>{plan.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.planDescription}>{t(plan.descriptionKey)}</Text>
                </View>
                <Text style={styles.planPrice}>{t(plan.priceKey)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title={loading ? '' : t('premium.paywall.continueButton')}
          onPress={handleSubscribe}
          fullWidth
          disabled={loading}
          loading={loading}
        />
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={loading}
        >
          <Text style={styles.restoreText}>{t('premium.paywall.restorePurchases')}</Text>
        </TouchableOpacity>
        <Text style={styles.termsNote}>{t('premium.paywall.termsNote')}</Text>
      </View>
    </View>
  );
}
