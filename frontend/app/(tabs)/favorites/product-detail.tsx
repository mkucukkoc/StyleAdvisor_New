// ============================================================
// StyleAdvisor AI - Favorite Product Detail Screen
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { Button } from '../../../src/components';
import { useFavoritesStore, useUIStore } from '../../../src/stores';
import { mockProducts } from '../../../src/services/api/mockData';
import { analytics } from '../../../src/services';

export default function FavoriteProductDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const removeFavoriteProduct = useFavoritesStore((state) => state.removeFavoriteProduct);
  const showToast = useUIStore((state) => state.showToast);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Get product from mock data
  const product = mockProducts.find((p) => p.id === params.id) || mockProducts[0];

  const handleRemoveFavorite = () => {
    removeFavoriteProduct(product.id);
    showToast({ type: 'success', message: t('favorites.removedFromFavorites') });
    analytics.track('favorite_product_remove', { productId: product.id });
    router.back();
  };

  const handleBuyNow = () => {
    analytics.track('product_click', {
      productId: product.id,
      productName: product.name,
      price: product.price,
    });

    if (product.affiliateUrl) {
      Linking.openURL(product.affiliateUrl);
    } else {
      showToast({ type: 'info', message: t('favorites.openingStore') });
    }
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
      height: 350,
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius['2xl'],
      alignItems: 'center',
      justifyContent: 'center',
    },
    detailsContainer: {
      padding: theme.spacing.lg,
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    brand: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    rating: {
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginLeft: theme.spacing.xs,
    },
    reviewCount: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textTertiary,
      marginLeft: theme.spacing.xs,
    },
    productName: {
      fontSize: theme.fontSize['2xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: theme.spacing.lg,
    },
    price: {
      fontSize: theme.fontSize['3xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    originalPrice: {
      fontSize: theme.fontSize.lg,
      color: theme.colors.textTertiary,
      textDecorationLine: 'line-through',
      marginLeft: theme.spacing.md,
    },
    discountBadge: {
      backgroundColor: theme.colors.error,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      marginLeft: theme.spacing.md,
    },
    discountText: {
      fontSize: theme.fontSize.xs,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.white,
    },
    description: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      lineHeight: 24,
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    optionsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xl,
    },
    optionChip: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    optionChipSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryMuted,
    },
    optionText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
    },
    colorChip: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 3,
      borderColor: 'transparent',
    },
    colorChipSelected: {
      borderColor: theme.colors.primary,
    },
    retailerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    retailerIcon: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: theme.colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    retailerText: {
      flex: 1,
    },
    retailerName: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
    },
    retailerNote: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textTertiary,
    },
    footer: {
      padding: theme.spacing.lg,
      paddingBottom: insets.bottom + theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
  });

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('favorites.productDetail')}</Text>
        <TouchableOpacity style={styles.favoriteButton} onPress={handleRemoveFavorite}>
          <Ionicons name="heart" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Ionicons name="image-outline" size={64} color={theme.colors.textTertiary} />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.brandRow}>
            <Text style={styles.brand}>{product.brand}</Text>
            {product.rating && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.rating}>{product.rating}</Text>
                <Text style={styles.reviewCount}>({product.reviewCount})</Text>
              </View>
            )}
          </View>

          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price}</Text>
            {product.originalPrice && (
              <>
                <Text style={styles.originalPrice}>${product.originalPrice}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-{discount}%</Text>
                </View>
              </>
            )}
          </View>

          <Text style={styles.description}>{product.description}</Text>

          {product.sizes.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>{t('product.selectSize')}</Text>
              <View style={styles.optionsRow}>
                {product.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.optionChip,
                      selectedSize === size && styles.optionChipSelected,
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text style={styles.optionText}>{size}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {product.colors.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>{t('product.selectColor')}</Text>
              <View style={styles.optionsRow}>
                {product.colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorChip,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorChipSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </>
          )}

          <View style={styles.retailerInfo}>
            <View style={styles.retailerIcon}>
              <Ionicons name="storefront" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.retailerText}>
              <Text style={styles.retailerName}>{product.retailer}</Text>
              <Text style={styles.retailerNote}>{t('product.affiliateNote')}</Text>
            </View>
            <Ionicons name="open-outline" size={20} color={theme.colors.textTertiary} />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('product.buyNow')}
          onPress={handleBuyNow}
          fullWidth
          icon="cart-outline"
        />
      </View>
    </View>
  );
}
