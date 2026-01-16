// ============================================================
// StyleAdvisor AI - LimitReachedModal Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useUIStore } from '../stores';
import { useRouter } from 'expo-router';
import Button from './Button';
import { useTranslation } from 'react-i18next';

export const LimitReachedModal: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const activeModal = useUIStore((state) => state.activeModal);
  const hideModal = useUIStore((state) => state.hideModal);

  const isVisible = activeModal?.type === 'limit-reached';

  const handleUpgrade = () => {
    hideModal();
    router.push('/(modals)/paywall');
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.lg,
    },
    container: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius['2xl'],
      padding: theme.spacing.xl,
      width: '100%',
      maxWidth: 340,
      alignItems: 'center',
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.warningLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: theme.fontSize['2xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    message: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    waitMessage: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textTertiary,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
    closeButton: {
      position: 'absolute',
      top: theme.spacing.md,
      right: theme.spacing.md,
    },
  });

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity onPress={hideModal} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.iconContainer}>
            <Ionicons name="time-outline" size={32} color={theme.colors.warning} />
          </View>
          <Text style={styles.title}>{t('premium.limitReached.title')}</Text>
          <Text style={styles.message}>{t('premium.limitReached.message')}</Text>
          <Button
            title={t('premium.limitReached.upgradeButton')}
            onPress={handleUpgrade}
            fullWidth
          />
          <Text style={styles.waitMessage}>
            {t('premium.limitReached.waitMessage')}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default LimitReachedModal;
