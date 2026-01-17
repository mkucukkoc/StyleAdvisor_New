// ============================================================
// StyleAdvisor AI - Home Screen
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../src/theme/ThemeContext';
import { Card, Chip, Button, Skeleton } from '../../../src/components';
import { useAuthStore, useSubscriptionStore } from '../../../src/stores';
import { mockTrends, mockDailyOutfitIdeas } from '../../../src/services/api/mockData';
import { analytics } from '../../../src/services';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const subscription = useSubscriptionStore((state) => state.status);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const quickActions = [
    { id: 'analyze', icon: 'scan', label: t('home.quickActions.analyze'), route: '/(tabs)/analyze' },
    { id: 'wardrobe', icon: 'shirt', label: t('home.quickActions.wardrobe'), route: '/(tabs)/wardrobe' },
    { id: 'trends', icon: 'trending-up', label: t('home.quickActions.trends'), route: '/(tabs)/home/trends' },
    { id: 'favorites', icon: 'heart', label: t('home.quickActions.favorites'), route: '/(tabs)/favorites' },
  ];

  const promptChips = [
    { id: 'work', label: t('home.promptChips.work') },
    { id: 'date', label: t('home.promptChips.date') },
    { id: 'casual', label: t('home.promptChips.casual') },
    { id: 'formal', label: t('home.promptChips.formal') },
  ];

  const handlePromptChip = (prompt: string) => {
    router.push({
      pathname: '/(tabs)/analyze/text-request',
      params: { prefill: prompt },
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingTop: insets.top + theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    greeting: {
      fontSize: theme.fontSize['2xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: theme.fontSize.md,
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
    quickActionsContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    quickActionItem: {
      width: '47%',
      aspectRatio: 1.6,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
    },
    quickActionGradient: {
      flex: 1,
      padding: theme.spacing.md,
      justifyContent: 'space-between',
    },
    quickActionIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickActionLabel: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.white,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    dailyOutfitCard: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
    },
    dailyOutfitGradient: {
      padding: theme.spacing.lg,
    },
    dailyOutfitTitle: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.white,
      marginBottom: theme.spacing.xs,
    },
    dailyOutfitDescription: {
      fontSize: theme.fontSize.sm,
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: theme.spacing.md,
    },
    promptChipsContainer: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    promptChipsScroll: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    trendsContainer: {
      paddingHorizontal: theme.spacing.lg,
    },
    trendsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    seeAllText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.primary,
      fontWeight: theme.fontWeight.medium,
    },
    trendsGrid: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    trendItem: {
      flex: 1,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
    },
    trendColor: {
      width: 32,
      height: 32,
      borderRadius: 8,
      marginBottom: theme.spacing.sm,
    },
    trendTitle: {
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
    },
  });

  const getQuickActionColors = (index: number): [string, string] => {
    const colorSets: [string, string][] = [
      [theme.colors.primary, theme.colors.primaryDark],
      ['#10B981', '#059669'],
      ['#F59E0B', '#D97706'],
      ['#EC4899', '#DB2777'],
    ];
    return colorSets[index % colorSets.length];
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {user?.name ? t('home.greeting', { name: user.name }) : t('home.greetingDefault')}
        </Text>
        <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
        {subscription.isPremium ? (
          <View style={styles.premiumBadge}>
            <Ionicons name="diamond" size={14} color="#D4AF37" />
            <Text style={styles.premiumBadgeText}>Premium</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.premiumBadge}
            onPress={() => router.push('/(modals)/paywall')}
          >
            <Ionicons name="sparkles" size={14} color="#D4AF37" />
            <Text style={styles.premiumBadgeText}>
              {subscription.analysisRemaining}/{subscription.analysisLimit} analyses
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionItem}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={getQuickActionColors(index)}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickActionGradient}
              >
                <View style={styles.quickActionIcon}>
                  <Ionicons name={action.icon as any} size={20} color={theme.colors.white} />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Daily Outfit Idea */}
      <Text style={styles.sectionTitle}>{t('home.dailyOutfit.title')}</Text>
      <TouchableOpacity style={styles.dailyOutfitCard} activeOpacity={0.8}>
        <LinearGradient
          colors={['#7C3AED', '#5B21B6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.dailyOutfitGradient}
        >
          <Text style={styles.dailyOutfitTitle}>
            {mockDailyOutfitIdeas[0]?.title || 'Monday Power Look'}
          </Text>
          <Text style={styles.dailyOutfitDescription}>
            {mockDailyOutfitIdeas[0]?.description || 'Start your week with confidence'}
          </Text>
          <Button
            title={t('home.dailyOutfit.viewDetails')}
            onPress={() => {}}
            variant="secondary"
            size="small"
            style={{ alignSelf: 'flex-start' }}
          />
        </LinearGradient>
      </TouchableOpacity>

      {/* Prompt Chips */}
      <Text style={styles.sectionTitle}>{t('home.promptChips.title')}</Text>
      <View style={styles.promptChipsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promptChipsScroll}
        >
          {promptChips.map((chip) => (
            <Chip
              key={chip.id}
              label={chip.label}
              onPress={() => handlePromptChip(chip.label)}
              icon="chatbubble-outline"
            />
          ))}
        </ScrollView>
      </View>

      {/* Trends */}
      <View style={styles.trendsContainer}>
        <View style={styles.trendsHeader}>
          <Text style={styles.sectionTitle}>{t('home.trends.title')}</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/home/trends')}>
            <Text style={styles.seeAllText}>{t('home.trends.seeAll')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.trendsGrid}>
          {mockTrends.slice(0, 2).map((trend) => (
            <View key={trend.id} style={styles.trendItem}>
              <View style={[styles.trendColor, { backgroundColor: trend.color }]} />
              <Text style={styles.trendTitle}>{trend.title}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
