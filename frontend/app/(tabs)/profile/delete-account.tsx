// ============================================================
// StyleAdvisor AI - Delete Account Screen
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { Button } from '../../../src/components';
import { useAuthStore, useUIStore } from '../../../src/stores';
import { analytics } from '../../../src/services';

export default function DeleteAccountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const logout = useAuthStore((state) => state.logout);
  const showToast = useUIStore((state) => state.showToast);

  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [understood, setUnderstood] = useState(false);

  const CONFIRM_WORD = 'DELETE';
  const canDelete = confirmText.toUpperCase() === CONFIRM_WORD && understood;

  const handleDelete = async () => {
    if (!canDelete) return;

    Alert.alert(
      t('profile.deleteAccount.finalConfirmTitle'),
      t('profile.deleteAccount.finalConfirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.deleteAccount.deleteButton'),
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            analytics.track('delete_account_confirm');

            try {
              // Mock API call - In production, call actual delete endpoint
              await new Promise((resolve) => setTimeout(resolve, 2000));
              
              logout();
              showToast({ type: 'info', message: t('profile.deleteAccount.success') });
              router.replace('/(auth)/welcome');
            } catch (error) {
              showToast({ type: 'error', message: t('profile.deleteAccount.error') });
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
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
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
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
      color: theme.colors.error,
      textAlign: 'center',
      marginRight: 40,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    warningCard: {
      backgroundColor: theme.colors.errorLight,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    warningIcon: {
      alignSelf: 'center',
      marginBottom: theme.spacing.md,
    },
    warningTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    warningText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
      textAlign: 'center',
      lineHeight: 22,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    bulletPoint: {
      flexDirection: 'row',
      marginBottom: theme.spacing.sm,
    },
    bullet: {
      fontSize: theme.fontSize.md,
      color: theme.colors.error,
      marginRight: theme.spacing.sm,
    },
    bulletText: {
      flex: 1,
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
    },
    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    checkboxChecked: {
      backgroundColor: theme.colors.error,
      borderColor: theme.colors.error,
    },
    checkboxLabel: {
      flex: 1,
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
    },
    inputLabel: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      fontSize: theme.fontSize.lg,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    footer: {
      padding: theme.spacing.lg,
      paddingBottom: insets.bottom + theme.spacing.lg,
    },
    deleteButton: {
      backgroundColor: canDelete ? theme.colors.error : theme.colors.border,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      alignItems: 'center',
    },
    deleteButtonText: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.white,
    },
  });

  const deletedItems = [
    t('profile.deleteAccount.items.profile'),
    t('profile.deleteAccount.items.wardrobe'),
    t('profile.deleteAccount.items.analyses'),
    t('profile.deleteAccount.items.favorites'),
    t('profile.deleteAccount.items.subscription'),
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile.deleteAccount.title')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.warningCard}>
          <Ionicons
            name="warning"
            size={48}
            color={theme.colors.error}
            style={styles.warningIcon}
          />
          <Text style={styles.warningTitle}>{t('profile.deleteAccount.warningTitle')}</Text>
          <Text style={styles.warningText}>{t('profile.deleteAccount.warningText')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.deleteAccount.whatWillBeDeleted')}</Text>
          {deletedItems.map((item, index) => (
            <View key={index} style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setUnderstood(!understood)}
        >
          <View style={[styles.checkbox, understood && styles.checkboxChecked]}>
            {understood && <Ionicons name="checkmark" size={16} color={theme.colors.white} />}
          </View>
          <Text style={styles.checkboxLabel}>
            {t('profile.deleteAccount.understandCheckbox')}
          </Text>
        </TouchableOpacity>

        <Text style={styles.inputLabel}>
          {t('profile.deleteAccount.typeToConfirm', { word: CONFIRM_WORD })}
        </Text>
        <TextInput
          style={styles.input}
          value={confirmText}
          onChangeText={setConfirmText}
          placeholder={CONFIRM_WORD}
          placeholderTextColor={theme.colors.textTertiary}
          autoCapitalize="characters"
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={!canDelete || loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.white} />
          ) : (
            <Text style={styles.deleteButtonText}>
              {t('profile.deleteAccount.deleteButton')}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
