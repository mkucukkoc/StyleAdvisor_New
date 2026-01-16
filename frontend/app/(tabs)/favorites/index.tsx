// ============================================================
// StyleAdvisor AI - Favorites Home Screen
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { EmptyState } from '../../../src/components';
import { useFavoritesStore } from '../../../src/stores';

export default function FavoritesHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const outfits = useFavoritesStore((state) => state.outfits);
  const products = useFavoritesStore((state) => state.products);

  const [activeTab, setActiveTab] = useState<'outfits' | 'products'>('outfits');

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
    title: {
      fontSize: theme.fontSize['2xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    tabs: {
      flexDirection: 'row',
      marginTop: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xs,
    },
    tab: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      alignItems: 'center',
      borderRadius: theme.borderRadius.md,
    },
    tabActive: {
      backgroundColor: theme.colors.primary,
    },
    tabText: {
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.textSecondary,
    },
    tabTextActive: {
      color: theme.colors.white,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    outfitCard: {
      width: '100%',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    outfitName: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    outfitMeta: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    productCard: {
      width: '47%',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
    },
    productImage: {
      width: '100%',
      aspectRatio: 1,
      backgroundColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    productInfo: {
      padding: theme.spacing.sm,
    },
    productName: {
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.text,
    },
    productPrice: {
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginTop: theme.spacing.xs,
    },
  });

  const renderOutfits = () => {
    if (outfits.length === 0) {
      return (
        <EmptyState
          icon="heart-outline"
          title={t('favorites.home.emptyOutfits')}
          message={t('favorites.home.emptyOutfitsSubtitle')}
          actionLabel="Browse Outfits"
          onAction={() => router.push('/(tabs)/analyze')}
        />
      );
    }

    return (
      <View>
        {outfits.map((outfit) => (
          <TouchableOpacity key={outfit.id} style={styles.outfitCard}>
            <Text style={styles.outfitName}>{outfit.name}</Text>
            <Text style={styles.outfitMeta}>
              {outfit.occasion} · {outfit.items.length} items · ${outfit.totalPrice}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderProducts = () => {
    if (products.length === 0) {
      return (
        <EmptyState
          icon="bag-outline"
          title={t('favorites.home.emptyProducts')}
          message={t('favorites.home.emptyProductsSubtitle')}
          actionLabel="Shop Now"
          onAction={() => router.push('/(tabs)/analyze')}
        />
      );
    }

    return (
      <View style={styles.grid}>
        {products.map((product) => (
          <TouchableOpacity key={product.id} style={styles.productCard}>
            <View style={styles.productImage}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                  backgroundColor: product.colors[0] || theme.colors.primary,
                }}
              />
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
              <Text style={styles.productPrice}>${product.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('favorites.home.title')}</Text>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'outfits' && styles.tabActive]}
            onPress={() => setActiveTab('outfits')}
          >
            <Text style={[styles.tabText, activeTab === 'outfits' && styles.tabTextActive]}>
              {t('favorites.home.tabs.outfits')} ({outfits.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'products' && styles.tabActive]}
            onPress={() => setActiveTab('products')}
          >
            <Text style={[styles.tabText, activeTab === 'products' && styles.tabTextActive]}>
              {t('favorites.home.tabs.products')} ({products.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'outfits' ? renderOutfits() : renderProducts()}
      </ScrollView>
    </View>
  );
}
