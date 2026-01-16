// ============================================================
// StyleAdvisor AI - Notification Opt-In Screen (Onboarding)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button } from '../../src/components';
import { useUserStore } from '../../src/stores';

export default function NotificationOptInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const updateProfile = useUserStore((state) => state.updateProfile);

  const notificationTypes = [
    { id: 'dailyOutfit', icon: 'shirt-outline', label: t('onboarding.notifications.types.dailyOutfit') },
    { id: 'deals', icon: 'pricetag-outline', label: t('onboarding.notifications.types.deals') },
    { id: 'trends', icon: 'trending-up-outline', label: t('onboarding.notifications.types.trends') },
    { id: 'reminders', icon: 'notifications-outline', label: t('onboarding.notifications.types.reminders') },
  ];

  const handleEnable = () => {
    updateProfile({ notificationsEnabled: true });
    router.push('/(onboarding)/complete');
  };

  const handleSkip = () => {
    updateProfile({ notificationsEnabled: false });
    router.push('/(onboarding)/complete');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: insets.top + theme.spacing.xl,
      paddingBottom: insets.bottom + theme.spacing.lg,
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
    content: {
      flex: 1,
    },
    bellIcon: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: theme.spacing.xl,
    },
    notificationList: {
      gap: theme.spacing.md,
    },
    notificationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
    },
    notificationIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    notificationLabel: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
    },
    footer: {
      gap: theme.spacing.md,
    },
  });

  return (
    <View style={styles.container}>
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
                step === 5 && styles.stepDotActive,
                step < 5 && styles.stepDotDone,
              ]}
            />
          ))}
        </View>
        <Text style={styles.title}>{t('onboarding.notifications.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.notifications.subtitle')}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.bellIcon}>
          <Ionicons name="notifications" size={48} color={theme.colors.primary} />
        </View>

        <View style={styles.notificationList}>
          {notificationTypes.map((type) => (
            <View key={type.id} style={styles.notificationItem}>
              <View style={styles.notificationIcon}>
                <Ionicons name={type.icon as any} size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.notificationLabel}>{type.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button title={t('onboarding.notifications.enableButton')} onPress={handleEnable} fullWidth />
        <Button
          title={t('onboarding.notifications.skipButton')}
          onPress={handleSkip}
          variant="ghost"
          fullWidth
        />
      </View>
    </View>
  );
}
