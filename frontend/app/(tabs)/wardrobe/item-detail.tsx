// ============================================================
// StyleAdvisor AI - Wardrobe Item Detail Screen
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { Button } from '../../../src/components';
import { useWardrobeStore, useUIStore } from '../../../src/stores';

export default function WardrobeItemDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const items = useWardrobeStore((state) => state.items);
  const markAsWorn = useWardrobeStore((state) => state.markAsWorn);
  const toggleFavorite = useWardrobeStore((state) => state.toggleFavorite);
  const removeItem = useWardrobeStore((state) => state.removeItem);
  const showToast = useUIStore((state) => state.showToast);

  const item = items.find((i) => i.id === id);

  if (!item) {
    return null;
  }

  const handleMarkAsWorn = () => {
    markAsWorn(item.id);
    showToast({ type: 'success', message: 'Marked as worn!' });
  };

  const handleDelete = () => {
    Alert.alert(
      t('wardrobe.itemDetail.deleteItem'),
      t('wardrobe.itemDetail.deleteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            removeItem(item.id);
            showToast({ type: 'success', message: 'Item deleted' });
            router.back();
          },
        },
      ]
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return t('wardrobe.itemDetail.neverWorn');
    return new Date(dateString).toLocaleDateString();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: insets.top + theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
    },
    imageContainer: {
      aspectRatio: 1,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    colorDisplay: {
      width: 120,
      height: 120,
      borderRadius: 24,
    },
    details: {
      padding: theme.spacing.lg,
    },
    name: {
      fontSize: theme.fontSize['2xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    metaBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      marginRight: theme.spacing.sm,
    },
    metaText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
    },
    statsContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    statLabel: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
    },
    statValue: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.text,
    },
    footer: {
      padding: theme.spacing.lg,
      paddingBottom: insets.bottom + theme.spacing.lg,
      gap: theme.spacing.sm,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => toggleFavorite(item.id)}>
            <Ionicons
              name={item.isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={item.isFavorite ? theme.colors.error : theme.colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={22} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <View style={[styles.colorDisplay, { backgroundColor: item.color }]} />
        </View>

        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaBadge}>
              <Ionicons name="shirt-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{item.category}</Text>
            </View>
            {item.brand && (
              <View style={styles.metaBadge}>
                <Ionicons name="pricetag-outline" size={14} color={theme.colors.textSecondary} />
                <Text style={styles.metaText}>{item.brand}</Text>
              </View>
            )}
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Times Worn</Text>
              <Text style={styles.statValue}>{item.timesWorn}x</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Last Worn</Text>
              <Text style={styles.statValue}>{formatDate(item.lastWorn)}</Text>
            </View>
            <View style={[styles.statRow, { marginBottom: 0 }]}>
              <Text style={styles.statLabel}>Added</Text>
              <Text style={styles.statValue}>{formatDate(item.createdAt)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('wardrobe.itemDetail.markAsWorn')}
          onPress={handleMarkAsWorn}
          icon="checkmark-circle-outline"
          fullWidth
        />
        <Button
          title={t('wardrobe.itemDetail.deleteItem')}
          onPress={handleDelete}
          variant="danger"
          icon="trash-outline"
          fullWidth
        />
      </View>
    </View>
  );
}
