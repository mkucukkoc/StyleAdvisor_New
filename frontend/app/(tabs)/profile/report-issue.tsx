// Report Issue Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { Button, Chip } from '../../../src/components';
import { useUIStore } from '../../../src/stores';
import { analytics } from '../../../src/services';

export default function ReportIssueScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const showToast = useUIStore((state) => state.showToast);
  const [issueType, setIssueType] = useState('bug');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const issueTypes = ['bug', 'feature', 'feedback', 'other'];

  const handleSubmit = async () => {
    if (!description.trim()) {
      showToast({ type: 'warning', message: 'Please describe the issue' });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    analytics.track('report_issue_submit', { type: issueType });
    showToast({ type: 'success', message: t('profile.reportIssue.success') });
    setLoading(false);
    router.back();
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      flexDirection: 'row', alignItems: 'center',
      paddingTop: insets.top + theme.spacing.md,
      paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.md,
    },
    backButton: { marginRight: theme.spacing.md },
    headerContent: { flex: 1 },
    title: { fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
    subtitle: { fontSize: theme.fontSize.sm, color: theme.colors.textSecondary, marginTop: theme.spacing.xs },
    content: { flex: 1, paddingHorizontal: theme.spacing.lg },
    section: { marginBottom: theme.spacing.xl },
    sectionLabel: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.medium, color: theme.colors.text, marginBottom: theme.spacing.sm },
    chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    textInput: {
      backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md, minHeight: 150, fontSize: theme.fontSize.md,
      color: theme.colors.text, textAlignVertical: 'top', borderWidth: 1, borderColor: theme.colors.border,
    },
    footer: { padding: theme.spacing.lg, paddingBottom: insets.bottom + theme.spacing.lg },
  });

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{t('profile.reportIssue.title')}</Text>
          <Text style={styles.subtitle}>{t('profile.reportIssue.subtitle')}</Text>
        </View>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('profile.reportIssue.typeLabel')}</Text>
          <View style={styles.chipsRow}>
            {issueTypes.map((type) => (
              <Chip key={type} label={t(`profile.reportIssue.types.${type}`)} selected={issueType === type} onPress={() => setIssueType(type)} />
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('profile.reportIssue.descriptionLabel')}</Text>
          <TextInput
            style={styles.textInput} multiline
            placeholder={t('profile.reportIssue.descriptionPlaceholder')}
            placeholderTextColor={theme.colors.textTertiary}
            value={description} onChangeText={setDescription} maxLength={1000}
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button title={t('profile.reportIssue.submitButton')} onPress={handleSubmit} loading={loading} fullWidth />
      </View>
    </KeyboardAvoidingView>
  );
}
