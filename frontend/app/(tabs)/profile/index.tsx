// ============================================================
// StyleAdvisor AI - Profile Home Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { useAuthStore, useSubscriptionStore } from '../../../src/stores';
import { analytics } from '../../../src/services';

export default function ProfileHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isPremium = useSubscriptionStore((state) => state.status.isPremium);

  const handleLogout = () => {
    Alert.alert(
      t('profile.home.menuItems.logout'),
      'Are you sure you want to log out?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.home.menuItems.logout'),
          style: 'destructive',
          onPress: () => {
            logout();
            analytics.track('logout');
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  const menuSections = [
    {
      title: t('profile.home.sections.style'),
      items: [
        { id: 'style-profile', icon: 'sparkles-outline', label: t('profile.home.menuItems.styleProfile'), route: '/(tabs)/profile/style-profile' },
      ],
    },
    {
      title: t('profile.home.sections.subscription'),
      items: [
        { id: 'subscription', icon: 'diamond-outline', label: t('profile.home.menuItems.subscription'), route: '/(tabs)/profile/subscription', badge: isPremium ? 'Premium' : undefined },
      ],
    },
    {
      title: t('profile.home.sections.settings'),
      items: [
        { id: 'settings', icon: 'settings-outline', label: t('profile.home.menuItems.settings'), route: '/(tabs)/profile/settings' },
      ],
    },
    {
      title: t('profile.home.sections.help'),
      items: [
        { id: 'help', icon: 'help-circle-outline', label: t('profile.home.menuItems.help'), route: '/(tabs)/profile/help' },
        { id: 'report-issue', icon: 'bug-outline', label: t('profile.home.menuItems.reportIssue'), route: '/(tabs)/profile/report-issue' },
      ],
    },
    {
      title: t('profile.home.sections.legal'),
      items: [
        { id: 'terms', icon: 'document-text-outline', label: t('profile.home.menuItems.terms'), route: '/(tabs)/profile/terms' },
        { id: 'privacy', icon: 'shield-outline', label: t('profile.home.menuItems.privacy'), route: '/(tabs)/profile/privacy' },
        { id: 'affiliate', icon: 'link-outline', label: t('profile.home.menuItems.affiliate'), route: '/(tabs)/profile/affiliate' },
      ],
    },
    {
      title: '',
      items: [
        { id: 'export-data', icon: 'download-outline', label: t('profile.home.menuItems.exportData'), route: '/(tabs)/profile/export-data' },
        { id: 'delete-account', icon: 'trash-outline', label: t('profile.home.menuItems.deleteAccount'), route: '/(tabs)/profile/delete-account', danger: true },
      ],
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingTop: insets.top + theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
    title: {
      fontSize: theme.fontSize['2xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
    },
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    avatarText: {
      fontSize: theme.fontSize['2xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.primary,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
    },
    profileEmail: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    premiumBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(212, 175, 55, 0.15)',
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      alignSelf: 'flex-start',
      marginTop: theme.spacing.sm,
    },
    premiumBadgeText: {
      fontSize: theme.fontSize.xs,
      color: '#D4AF37',
      fontWeight: theme.fontWeight.semibold,
      marginLeft: theme.spacing.xs,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.textTertiary,
      marginBottom: theme.spacing.sm,
      textTransform: 'uppercase',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
    },
    menuIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    menuLabel: {
      flex: 1,
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
    },
    menuLabelDanger: {
      color: theme.colors.error,
    },
    menuBadge: {
      fontSize: theme.fontSize.xs,
      color: '#D4AF37',
      fontWeight: theme.fontWeight.semibold,
      backgroundColor: 'rgba(212, 175, 55, 0.15)',
      paddingVertical: 2,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      marginRight: theme.spacing.sm,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginBottom: insets.bottom + theme.spacing.lg,
    },
    logoutText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.error,
      fontWeight: theme.fontWeight.medium,
      marginLeft: theme.spacing.sm,
    },
  });

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('profile.home.title')}</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
            {isPremium && (
              <View style={styles.premiumBadge}>
                <Ionicons name="diamond" size={12} color="#D4AF37" />
                <Text style={styles.premiumBadgeText}>Premium</Text>
              </View>
            )}
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}
            {section.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => router.push(item.route as any)}
              >
                <View style={styles.menuIcon}>
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={item.danger ? theme.colors.error : theme.colors.text}
                  />
                </View>
                <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>
                  {item.label}
                </Text>
                {item.badge && <Text style={styles.menuBadge}>{item.badge}</Text>}
                <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
          <Text style={styles.logoutText}>{t('profile.home.menuItems.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
