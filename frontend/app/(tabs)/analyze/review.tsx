// ============================================================
// StyleAdvisor AI - Review Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { Button, Card } from '../../../src/components';
import { useAnalysisStore } from '../../../src/stores';

export default function ReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const currentRequest = useAnalysisStore((state) => state.currentRequest);

  const handleSubmit = () => {
    router.push('/(tabs)/analyze/processing');
  };

  const handleEdit = () => {
    router.back();
  };

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
    headerContent: {
      flex: 1,
    },
    title: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    sectionLabel: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.text,
    },
    editButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    editText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.primary,
      marginLeft: theme.spacing.xs,
    },
    imageContainer: {
      aspectRatio: 3 / 4,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    descriptionCard: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
    },
    descriptionText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
      lineHeight: 24,
    },
    occasionBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primaryMuted,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      alignSelf: 'flex-start',
      marginTop: theme.spacing.sm,
    },
    occasionText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.primary,
      marginLeft: theme.spacing.xs,
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
        <View style={styles.headerContent}>
          <Text style={styles.title}>{t('analyze.review.title')}</Text>
          <Text style={styles.subtitle}>{t('analyze.review.subtitle')}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Photo Section */}
        {currentRequest?.imageBase64 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>{t('analyze.review.photoLabel')}</Text>
              <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <Ionicons name="pencil" size={16} color={theme.colors.primary} />
                <Text style={styles.editText}>{t('analyze.review.editButton')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: `data:image/jpeg;base64,${currentRequest.imageBase64}` }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          </View>
        )}

        {/* Description Section */}
        {currentRequest?.textPrompt && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>{t('analyze.review.descriptionLabel')}</Text>
              <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <Ionicons name="pencil" size={16} color={theme.colors.primary} />
                <Text style={styles.editText}>{t('analyze.review.editButton')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>{currentRequest.textPrompt}</Text>
              {currentRequest.occasion && (
                <View style={styles.occasionBadge}>
                  <Ionicons name="calendar-outline" size={14} color={theme.colors.primary} />
                  <Text style={styles.occasionText}>{currentRequest.occasion}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button title={t('analyze.review.submitButton')} onPress={handleSubmit} fullWidth />
      </View>
    </View>
  );
}
