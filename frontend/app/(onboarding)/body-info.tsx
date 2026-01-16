// ============================================================
// StyleAdvisor AI - Body Info Screen (Onboarding)
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button, Chip } from '../../src/components';
import { useUserStore } from '../../src/stores';

export default function BodyInfoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const updateProfile = useUserStore((state) => state.updateProfile);

  const [bodyType, setBodyType] = useState<string | null>(null);
  const [skinTone, setSkinTone] = useState<string | null>(null);

  const bodyTypes = [
    { id: 'slim', label: t('onboarding.bodyInfo.bodyTypes.slim') },
    { id: 'athletic', label: t('onboarding.bodyInfo.bodyTypes.athletic') },
    { id: 'average', label: t('onboarding.bodyInfo.bodyTypes.average') },
    { id: 'curvy', label: t('onboarding.bodyInfo.bodyTypes.curvy') },
    { id: 'plus-size', label: t('onboarding.bodyInfo.bodyTypes.plusSize') },
  ];

  const skinTones = [
    { id: 'fair', label: t('onboarding.bodyInfo.skinTones.fair'), color: '#FFE4C4' },
    { id: 'light', label: t('onboarding.bodyInfo.skinTones.light'), color: '#FFDAB9' },
    { id: 'medium', label: t('onboarding.bodyInfo.skinTones.medium'), color: '#D2B48C' },
    { id: 'tan', label: t('onboarding.bodyInfo.skinTones.tan'), color: '#C19A6B' },
    { id: 'dark', label: t('onboarding.bodyInfo.skinTones.dark'), color: '#8B6914' },
    { id: 'deep', label: t('onboarding.bodyInfo.skinTones.deep'), color: '#654321' },
  ];

  const handleNext = () => {
    updateProfile({
      bodyType: (bodyType as any) || undefined,
      skinTone: (skinTone as any) || undefined,
    });
    router.push('/(onboarding)/style-preferences');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: insets.top + theme.spacing.xl,
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
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionLabel: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    chipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    skinToneGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    skinToneItem: {
      alignItems: 'center',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    skinToneItemSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryMuted,
    },
    skinToneCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginBottom: theme.spacing.xs,
    },
    skinToneLabel: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textSecondary,
    },
    footer: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: insets.bottom + theme.spacing.lg,
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
                  step === 2 && styles.stepDotActive,
                  step < 2 && styles.stepDotDone,
                ]}
              />
            ))}
          </View>
          <Text style={styles.title}>{t('onboarding.bodyInfo.title')}</Text>
          <Text style={styles.subtitle}>{t('onboarding.bodyInfo.subtitle')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('onboarding.bodyInfo.bodyTypeLabel')}</Text>
          <View style={styles.chipsContainer}>
            {bodyTypes.map((type) => (
              <Chip
                key={type.id}
                label={type.label}
                selected={bodyType === type.id}
                onPress={() => setBodyType(type.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('onboarding.bodyInfo.skinToneLabel')}</Text>
          <View style={styles.skinToneGrid}>
            {skinTones.map((tone) => (
              <TouchableOpacity
                key={tone.id}
                style={[
                  styles.skinToneItem,
                  skinTone === tone.id && styles.skinToneItemSelected,
                ]}
                onPress={() => setSkinTone(tone.id)}
              >
                <View style={[styles.skinToneCircle, { backgroundColor: tone.color }]} />
                <Text style={styles.skinToneLabel}>{tone.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('common.skip')}
          onPress={() => router.push('/(onboarding)/style-preferences')}
          variant="ghost"
          style={{ flex: 1 }}
        />
        <Button title={t('common.next')} onPress={handleNext} style={{ flex: 2 }} />
      </View>
    </View>
  );
}
