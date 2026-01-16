// ============================================================
// StyleAdvisor AI - Analyze Start Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { useSubscriptionStore, useUIStore, useAnalysisStore } from '../../../src/stores';
import { analytics } from '../../../src/services';

export default function AnalyzeStartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const checkPremium = useSubscriptionStore((state) => state.checkAndHandlePremiumLock);
  const showModal = useUIStore((state) => state.showModal);
  const clearAnalysis = useAnalysisStore((state) => state.clearCurrentAnalysis);

  const handlePhotoOption = () => {
    const result = checkPremium('analysis');
    if (result.action === 'limit-modal') {
      showModal({ type: 'limit-reached' });
      return;
    }
    clearAnalysis();
    analytics.track('analyze_start', { method: 'photo' });
    router.push('/(tabs)/analyze/photo-capture');
  };

  const handleTextOption = () => {
    const result = checkPremium('analysis');
    if (result.action === 'limit-modal') {
      showModal({ type: 'limit-reached' });
      return;
    }
    clearAnalysis();
    analytics.track('analyze_start', { method: 'text' });
    router.push('/(tabs)/analyze/text-request');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingTop: insets.top + theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
    },
    header: {
      marginBottom: theme.spacing['2xl'],
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
    optionsContainer: {
      gap: theme.spacing.md,
    },
    optionCard: {
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
    },
    optionGradient: {
      padding: theme.spacing.xl,
      flexDirection: 'row',
      alignItems: 'center',
    },
    optionIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.lg,
    },
    optionContent: {
      flex: 1,
    },
    optionTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.white,
      marginBottom: theme.spacing.xs,
    },
    optionDescription: {
      fontSize: theme.fontSize.sm,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    optionArrow: {
      marginLeft: theme.spacing.md,
    },
    recentSection: {
      marginTop: theme.spacing['2xl'],
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: theme.spacing['2xl'],
    },
    emptyIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    emptyText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('analyze.start.title')}</Text>
          <Text style={styles.subtitle}>{t('analyze.start.subtitle')}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {/* Photo Option */}
          <TouchableOpacity style={styles.optionCard} onPress={handlePhotoOption} activeOpacity={0.8}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.optionGradient}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="camera" size={28} color={theme.colors.white} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{t('analyze.start.photoOption')}</Text>
                <Text style={styles.optionDescription}>{t('analyze.start.photoDescription')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.white} style={styles.optionArrow} />
            </LinearGradient>
          </TouchableOpacity>

          {/* Text Option */}
          <TouchableOpacity style={styles.optionCard} onPress={handleTextOption} activeOpacity={0.8}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.optionGradient}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="chatbubble-ellipses" size={28} color={theme.colors.white} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{t('analyze.start.textOption')}</Text>
                <Text style={styles.optionDescription}>{t('analyze.start.textDescription')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.white} style={styles.optionArrow} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Recent Analyses */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>{t('analyze.start.recentTitle')}</Text>
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="time-outline" size={28} color={theme.colors.textTertiary} />
            </View>
            <Text style={styles.emptyText}>{t('home.recentAnalyses.empty')}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
