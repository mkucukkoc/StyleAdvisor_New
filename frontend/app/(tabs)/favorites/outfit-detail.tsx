// ============================================================
// StyleAdvisor AI - Favorite Outfit Detail Screen
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { Button, Skeleton } from '../../../src/components';
import { useFavoritesStore, useUIStore } from '../../../src/stores';
import { mockOutfits } from '../../../src/services/api/mockData';
import { analytics } from '../../../src/services';

export default function FavoriteOutfitDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const removeFavoriteOutfit = useFavoritesStore((state) => state.removeFavoriteOutfit);
  const showToast = useUIStore((state) => state.showToast);

  const [loading, setLoading] = useState(false);

  // Get outfit from mock data
  const outfit = mockOutfits.find((o) => o.id === params.id) || mockOutfits[0];

  const handleRemoveFavorite = () => {
    removeFavoriteOutfit(outfit.id);
    showToast({ type: 'success', message: t('favorites.removedFromFavorites') });
    analytics.track('favorite_outfit_remove', { outfitId: outfit.id });
    router.back();
  };

  const handleShopItem = (itemId: string) => {
    analytics.track('outfit_item_shop', { outfitId: outfit.id, itemId });
    router.push(`/(tabs)/analyze/product-detail?id=${itemId}`);
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
      paddingHorizontal: theme.spacing.lg,
      paddingTop: insets.top + theme.spacing.md,
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
    headerTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
    },
    favoriteButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.errorLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
    },
    imageContainer: {
      height: 300,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius['2xl'],
      overflow: 'hidden',
    },
    placeholderImage: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    detailsContainer: {
      padding: theme.spacing.lg,
    },
    outfitName: {
      fontSize: theme.fontSize['2xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    outfitDescription: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      lineHeight: 24,
      marginBottom: theme.spacing.lg,
    },
    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xl,
    },
    tag: {
      backgroundColor: theme.colors.surface,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.full,
    },
    tagText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    itemCard: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    itemImage: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemDetails: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    itemName: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    itemBrand: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    itemPrice: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.primary,
    },
    shopButton: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      alignSelf: 'center',
    },
    shopButtonText: {
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.white,
    },
    totalPrice: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.md,
    },
    totalLabel: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
    },
    totalValue: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('favorites.outfitDetail')}</Text>
        <TouchableOpacity style={styles.favoriteButton} onPress={handleRemoveFavorite}>
          <Ionicons name="heart" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <View style={styles.placeholderImage}>
            <Ionicons name="shirt" size={64} color={theme.colors.primary} />
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.outfitName}>{outfit.name}</Text>
          <Text style={styles.outfitDescription}>{outfit.description}</Text>

          <View style={styles.tagsRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{outfit.occasion}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{outfit.style}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{outfit.season}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>{t('favorites.outfitItems')}</Text>

          {outfit.items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemImage}>
                <Ionicons name="shirt-outline" size={32} color={theme.colors.primary} />
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemBrand}>{item.brand}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
              </View>
              <TouchableOpacity
                style={styles.shopButton}
                onPress={() => handleShopItem(item.id)}
              >
                <Text style={styles.shopButtonText}>{t('common.shop')}</Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.totalPrice}>
            <Text style={styles.totalLabel}>{t('favorites.totalPrice')}</Text>
            <Text style={styles.totalValue}>${outfit.totalPrice}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
