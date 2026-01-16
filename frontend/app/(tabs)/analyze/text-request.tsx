// ============================================================
// StyleAdvisor AI - Text Request Screen
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { Button, Chip } from '../../../src/components';
import { useAnalysisStore, useUIStore } from '../../../src/stores';

export default function TextRequestScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ prefill?: string }>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const updateRequest = useAnalysisStore((state) => state.updateCurrentRequest);
  const showToast = useUIStore((state) => state.showToast);

  const [description, setDescription] = useState(params.prefill || '');
  const [occasion, setOccasion] = useState<string | null>(null);

  const occasions = [
    { id: 'work', label: t('analyze.textRequest.occasions.work') },
    { id: 'casual', label: t('analyze.textRequest.occasions.casual') },
    { id: 'date', label: t('analyze.textRequest.occasions.date') },
    { id: 'formal', label: t('analyze.textRequest.occasions.formal') },
    { id: 'party', label: t('analyze.textRequest.occasions.party') },
    { id: 'wedding', label: t('analyze.textRequest.occasions.wedding') },
  ];

  const handleAnalyze = () => {
    if (!description.trim()) {
      showToast({ type: 'warning', message: 'Please describe your outfit' });
      return;
    }

    updateRequest({
      type: 'text',
      textPrompt: description,
      occasion: occasion || undefined,
    });

    router.push('/(tabs)/analyze/review');
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
    inputContainer: {
      marginBottom: theme.spacing.xl,
    },
    textInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      minHeight: 150,
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
      textAlignVertical: 'top',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    characterCount: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textTertiary,
      textAlign: 'right',
      marginTop: theme.spacing.xs,
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
    occasionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    footer: {
      padding: theme.spacing.lg,
      paddingBottom: insets.bottom + theme.spacing.lg,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{t('analyze.textRequest.title')}</Text>
          <Text style={styles.subtitle}>{t('analyze.textRequest.subtitle')}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder={t('analyze.textRequest.placeholder')}
            placeholderTextColor={theme.colors.textTertiary}
            value={description}
            onChangeText={setDescription}
            maxLength={500}
          />
          <Text style={styles.characterCount}>{description.length}/500</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('analyze.textRequest.occasionLabel')}</Text>
          <View style={styles.occasionsGrid}>
            {occasions.map((occ) => (
              <Chip
                key={occ.id}
                label={occ.label}
                selected={occasion === occ.id}
                onPress={() => setOccasion(occ.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('analyze.textRequest.analyzeButton')}
          onPress={handleAnalyze}
          fullWidth
          disabled={!description.trim()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
