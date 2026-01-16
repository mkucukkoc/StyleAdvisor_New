// ============================================================
// StyleAdvisor AI - Checkout Screen (IAP Placeholder)
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
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button } from '../../src/components';
import { useSubscriptionStore, useUIStore } from '../../src/stores';
import { analytics } from '../../src/services';

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ plan: string }>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const setPremium = useSubscriptionStore((state) => state.setPremium);
  const showToast = useUIStore((state) => state.showToast);

  const [processing, setProcessing] = useState(false);

  const plan = params.plan || 'yearly';
  const planDetails = {
    yearly: {
      title: t('premium.checkout.plans.yearly.title'),
      price: '$59.99/year',
      pricePerMonth: '$4.99/mo',
      savings: '58%',
    },
    monthly: {
      title: t('premium.checkout.plans.monthly.title'),
      price: '$11.99/month',
      pricePerMonth: '$11.99/mo',
      savings: null,
    },
  };

  const selectedPlan = planDetails[plan as keyof typeof planDetails] || planDetails.yearly;

  const handlePurchase = async () => {
    setProcessing(true);
    analytics.track('checkout_purchase_tap', { plan });

    try {
      // Mock IAP - In production, this would integrate with App Store / Play Store
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setPremium(true);
      router.replace('/(modals)/premium-success');
    } catch (error: any) {
      showToast({ type: 'error', message: error.message || 'Purchase failed' });
    } finally {
      setProcessing(false);
    }
  };

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
    planCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius['2xl'],
      padding: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    planHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    planIcon: {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: theme.colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    planTitleContainer: {
      flex: 1,
    },
    planTitle: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    planSubtitle: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    savingsBadge: {
      backgroundColor: theme.colors.success,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
    },
    savingsText: {
      fontSize: theme.fontSize.xs,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.white,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    price: {
      fontSize: theme.fontSize['4xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    pricePerMonth: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.lg,
    },
    summaryTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    summaryLabel: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
    },
    summaryValue: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.md,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    totalLabel: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    totalValue: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.primary,
    },
    securityNote: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing.xl,
    },
    securityText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textTertiary,
      marginLeft: theme.spacing.sm,
    },
    footer: {
      padding: theme.spacing.lg,
      paddingBottom: insets.bottom + theme.spacing.lg,
    },
    terms: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textTertiary,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
    termsLink: {
      color: theme.colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('premium.checkout.title')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <View style={styles.planIcon}>
              <Ionicons name="diamond" size={28} color={theme.colors.primary} />
            </View>
            <View style={styles.planTitleContainer}>
              <Text style={styles.planTitle}>{selectedPlan.title}</Text>
              <Text style={styles.planSubtitle}>StyleAdvisor Premium</Text>
            </View>
            {selectedPlan.savings && (
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsText}>-{selectedPlan.savings}</Text>
              </View>
            )}
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{selectedPlan.price}</Text>
          </View>
        </View>

        <Text style={styles.summaryTitle}>{t('premium.checkout.summary')}</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{selectedPlan.title}</Text>
          <Text style={styles.summaryValue}>{selectedPlan.price}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('premium.checkout.tax')}</Text>
          <Text style={styles.summaryValue}>$0.00</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t('premium.checkout.total')}</Text>
          <Text style={styles.totalValue}>{selectedPlan.price}</Text>
        </View>

        <View style={styles.securityNote}>
          <Ionicons name="shield-checkmark" size={16} color={theme.colors.success} />
          <Text style={styles.securityText}>{t('premium.checkout.securePayment')}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={processing ? '' : t('premium.checkout.purchaseButton')}
          onPress={handlePurchase}
          fullWidth
          disabled={processing}
          loading={processing}
        />
        <Text style={styles.terms}>
          {t('premium.checkout.termsNote')}{' '}
          <Text style={styles.termsLink}>{t('premium.checkout.termsLink')}</Text>
        </Text>
      </View>
    </View>
  );
}
