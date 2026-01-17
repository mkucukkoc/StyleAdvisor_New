// ============================================================
// StyleAdvisor AI - Wardrobe Home Screen
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { Button, Chip, EmptyState } from '../../../src/components';
import { useWardrobeStore } from '../../../src/stores';
import { WardrobeCategory } from '../../../src/types';

export default function WardrobeHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const items = useWardrobeStore((state) => state.items);
  const selectedCategory = useWardrobeStore((state) => state.selectedCategory);
  const setSelectedCategory = useWardrobeStore((state) => state.setSelectedCategory);
  const getItemsByCategory = useWardrobeStore((state) => state.getItemsByCategory);

  const categories: (WardrobeCategory | 'all')[] = [
    'all', 'tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'bags', 'jewelry',
  ];

  const filteredItems = getItemsByCategory(selectedCategory);

  const stats = {
    total: items.length,
    categories: new Set(items.map((i) => i.category)).size,
    favorites: items.filter((i) => i.isFavorite).length,
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingTop: insets.top + theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: theme.fontSize['2xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    addButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statsContainer: {
      flexDirection: 'row',
      marginTop: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    statItem: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
    },
    statValue: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    statLabel: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    categoriesContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    categoriesScroll: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    itemCard: {
      width: '47%',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
    },
    itemImage: {
      width: '100%',
      aspectRatio: 1,
      backgroundColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemInfo: {
      padding: theme.spacing.sm,
    },
    itemName: {
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.text,
    },
    itemMeta: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    favoriteIcon: {
      position: 'absolute',
      top: theme.spacing.sm,
      right: theme.spacing.sm,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>{t('wardrobe.home.title')}</Text>
            <Text style={styles.subtitle}>{t('wardrobe.home.subtitle')}</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/(tabs)/wardrobe/add-item')}
          >
            <Ionicons name="add" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>{t('wardrobe.home.stats.totalItems')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.categories}</Text>
            <Text style={styles.statLabel}>{t('wardrobe.home.stats.categories')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.favorites}</Text>
            <Text style={styles.statLabel}>{t('wardrobe.home.stats.favorites')}</Text>
          </View>
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={t(`wardrobe.home.categories.${cat}`)}
              selected={selectedCategory === cat}
              onPress={() => setSelectedCategory(cat)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredItems.length === 0 ? (
          <EmptyState
            icon="shirt-outline"
            title={t('wardrobe.home.empty')}
            message={t('wardrobe.home.emptySubtitle')}
            actionLabel={t('wardrobe.home.addItem')}
            onAction={() => router.push('/(tabs)/wardrobe/add-item')}
          />
        ) : (
          <View style={styles.grid}>
            {filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemCard}
                onPress={() => router.push({
                  pathname: '/(tabs)/wardrobe/item-detail',
                  params: { id: item.id },
                })}
              >
                <View style={styles.itemImage}>
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 12,
                        backgroundColor: item.color,
                      }}
                    />
                  )}
                  {item.isFavorite && (
                    <Ionicons
                      name="heart"
                      size={18}
                      color={theme.colors.error}
                      style={styles.favoriteIcon}
                    />
                  )}
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemMeta}>
                    {item.brand || item.category} · {item.timesWorn}x worn
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
