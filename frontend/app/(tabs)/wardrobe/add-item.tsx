// ============================================================
// StyleAdvisor AI - Add Wardrobe Item Screen
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { Button, Input, Chip } from '../../../src/components';
import { useWardrobeStore, useUIStore } from '../../../src/stores';
import { WardrobeCategory } from '../../../src/types';
import { analytics } from '../../../src/services';

export default function AddWardrobeItemScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const addItem = useWardrobeStore((state) => state.addItem);
  const showToast = useUIStore((state) => state.showToast);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<WardrobeCategory>('tops');
  const [color, setColor] = useState('#000000');
  const [brand, setBrand] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const categories: WardrobeCategory[] = [
    'tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'bags', 'jewelry',
  ];

  const colorOptions = [
    '#000000', '#FFFFFF', '#1E3A5F', '#808080', '#D2B48C',
    '#8B4513', '#DC143C', '#006400', '#4169E1', '#FFD700',
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImageBase64(result.assets[0].base64);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      showToast({ type: 'warning', message: 'Please enter a name' });
      return;
    }

    setLoading(true);

    const newItem = {
      id: `wardrobe-${Date.now()}`,
      name: name.trim(),
      category,
      color,
      brand: brand.trim() || undefined,
      imageBase64: imageBase64 || undefined,
      timesWorn: 0,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    addItem(newItem);
    analytics.track('wardrobe_add_item', { category });
    showToast({ type: 'success', message: t('wardrobe.addItem.success') });
    setLoading(false);
    router.back();
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
    title: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    photoSection: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    photoPlaceholder: {
      width: 150,
      height: 150,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: theme.colors.border,
    },
    photoText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.sm,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionLabel: {
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    categoriesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    colorsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    colorOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 3,
      borderColor: 'transparent',
    },
    colorOptionSelected: {
      borderColor: theme.colors.primary,
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
        <Text style={styles.title}>{t('wardrobe.addItem.title')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.photoSection}>
          <TouchableOpacity style={styles.photoPlaceholder} onPress={pickImage}>
            {imageBase64 ? (
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  backgroundColor: color,
                }}
              />
            ) : (
              <Ionicons name="camera-outline" size={40} color={theme.colors.textTertiary} />
            )}
          </TouchableOpacity>
          <Text style={styles.photoText}>{t('wardrobe.addItem.takePhoto')}</Text>
        </View>

        <Input
          label={t('wardrobe.addItem.nameLabel')}
          placeholder={t('wardrobe.addItem.namePlaceholder')}
          value={name}
          onChangeText={setName}
          leftIcon="pricetag-outline"
        />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('wardrobe.addItem.categoryLabel')}</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={t(`wardrobe.home.categories.${cat}`)}
                selected={category === cat}
                onPress={() => setCategory(cat)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('wardrobe.addItem.colorLabel')}</Text>
          <View style={styles.colorsGrid}>
            {colorOptions.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorOption,
                  { backgroundColor: c },
                  color === c && styles.colorOptionSelected,
                ]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>
        </View>

        <Input
          label={t('wardrobe.addItem.brandLabel')}
          placeholder={t('wardrobe.addItem.brandPlaceholder')}
          value={brand}
          onChangeText={setBrand}
          leftIcon="bag-outline"
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('wardrobe.addItem.saveButton')}
          onPress={handleSave}
          loading={loading}
          fullWidth
        />
      </View>
    </KeyboardAvoidingView>
  );
}
