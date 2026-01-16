// ============================================================
// StyleAdvisor AI - Data Export Screen
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { Button } from '../../../src/components';
import { useUIStore } from '../../../src/stores';
import { analytics } from '../../../src/services';

type ExportStatus = 'idle' | 'processing' | 'ready' | 'error';

export default function DataExportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const showToast = useUIStore((state) => state.showToast);

  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['all']);

  const dataTypes = [
    { id: 'all', label: t('profile.dataExport.types.all'), icon: 'layers' },
    { id: 'profile', label: t('profile.dataExport.types.profile'), icon: 'person' },
    { id: 'wardrobe', label: t('profile.dataExport.types.wardrobe'), icon: 'shirt' },
    { id: 'analyses', label: t('profile.dataExport.types.analyses'), icon: 'analytics' },
    { id: 'favorites', label: t('profile.dataExport.types.favorites'), icon: 'heart' },
  ];

  const toggleDataType = (id: string) => {
    if (id === 'all') {
      setSelectedTypes(['all']);
    } else {
      const newTypes = selectedTypes.filter((t) => t !== 'all');
      if (newTypes.includes(id)) {
        setSelectedTypes(newTypes.filter((t) => t !== id));
      } else {
        setSelectedTypes([...newTypes, id]);
      }
    }
  };

  const handleRequestExport = async () => {
    setExportStatus('processing');
    analytics.track('data_export_request', { types: selectedTypes });

    try {
      // Mock API call - In production, this would trigger actual export
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setExportStatus('ready');
      showToast({ type: 'success', message: t('profile.dataExport.requestSuccess') });
    } catch (error) {
      setExportStatus('error');
      showToast({ type: 'error', message: t('profile.dataExport.requestError') });
    }
  };

  const handleDownload = () => {
    // Mock download - In production, this would download the file
    showToast({ type: 'info', message: t('profile.dataExport.downloadStarted') });
    analytics.track('data_export_download');
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
      color: theme.colors.text,
      textAlign: 'center',
      marginRight: 40,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    infoCard: {
      backgroundColor: theme.colors.infoLight,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      flexDirection: 'row',
    },
    infoIcon: {
      marginRight: theme.spacing.md,
    },
    infoText: {
      flex: 1,
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
      lineHeight: 22,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    dataTypeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    dataTypeCardSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryMuted,
    },
    dataTypeIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    dataTypeLabel: {
      flex: 1,
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.text,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    statusCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      alignItems: 'center',
      marginTop: theme.spacing.xl,
    },
    statusIcon: {
      marginBottom: theme.spacing.md,
    },
    statusTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    statusText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    footer: {
      padding: theme.spacing.lg,
      paddingBottom: insets.bottom + theme.spacing.lg,
    },
  });

  const renderStatusCard = () => {
    if (exportStatus === 'idle') return null;

    const statusConfig = {
      processing: {
        icon: null,
        title: t('profile.dataExport.status.processing'),
        text: t('profile.dataExport.status.processingText'),
      },
      ready: {
        icon: <Ionicons name="checkmark-circle" size={48} color={theme.colors.success} />,
        title: t('profile.dataExport.status.ready'),
        text: t('profile.dataExport.status.readyText'),
      },
      error: {
        icon: <Ionicons name="close-circle" size={48} color={theme.colors.error} />,
        title: t('profile.dataExport.status.error'),
        text: t('profile.dataExport.status.errorText'),
      },
    };

    const config = statusConfig[exportStatus];

    return (
      <View style={styles.statusCard}>
        <View style={styles.statusIcon}>
          {exportStatus === 'processing' ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            config.icon
          )}
        </View>
        <Text style={styles.statusTitle}>{config.title}</Text>
        <Text style={styles.statusText}>{config.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile.dataExport.title')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle"
            size={24}
            color={theme.colors.info}
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>{t('profile.dataExport.info')}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t('profile.dataExport.selectData')}</Text>

        {dataTypes.map((type) => {
          const isSelected =
            selectedTypes.includes('all') || selectedTypes.includes(type.id);

          return (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.dataTypeCard,
                isSelected && styles.dataTypeCardSelected,
              ]}
              onPress={() => toggleDataType(type.id)}
            >
              <View style={styles.dataTypeIcon}>
                <Ionicons
                  name={type.icon as any}
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.dataTypeLabel}>{type.label}</Text>
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && (
                  <Ionicons name="checkmark" size={14} color={theme.colors.white} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {renderStatusCard()}
      </ScrollView>

      <View style={styles.footer}>
        {exportStatus === 'ready' ? (
          <Button
            title={t('profile.dataExport.downloadButton')}
            onPress={handleDownload}
            fullWidth
            icon="download-outline"
          />
        ) : (
          <Button
            title={
              exportStatus === 'processing'
                ? t('profile.dataExport.processingButton')
                : t('profile.dataExport.requestButton')
            }
            onPress={handleRequestExport}
            fullWidth
            disabled={exportStatus === 'processing' || selectedTypes.length === 0}
            loading={exportStatus === 'processing'}
          />
        )}
      </View>
    </View>
  );
}
