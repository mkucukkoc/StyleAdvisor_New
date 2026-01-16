// Help Screen
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';

export default function HelpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const faqCategories = [
    { id: 'gettingStarted', icon: 'rocket-outline' },
    { id: 'analysis', icon: 'scan-outline' },
    { id: 'wardrobe', icon: 'shirt-outline' },
    { id: 'subscription', icon: 'diamond-outline' },
    { id: 'account', icon: 'person-outline' },
  ];

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      flexDirection: 'row', alignItems: 'center',
      paddingTop: insets.top + theme.spacing.md,
      paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.md,
    },
    backButton: { marginRight: theme.spacing.md },
    title: { fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
    content: { flex: 1, padding: theme.spacing.lg },
    categoryCard: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: theme.colors.surface, padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg, marginBottom: theme.spacing.md,
    },
    categoryIcon: {
      width: 44, height: 44, borderRadius: 12,
      backgroundColor: theme.colors.primaryMuted, alignItems: 'center', justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    categoryLabel: { flex: 1, fontSize: theme.fontSize.md, color: theme.colors.text },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('profile.help.title')}</Text>
      </View>
      <ScrollView style={styles.content}>
        {faqCategories.map((cat) => (
          <TouchableOpacity key={cat.id} style={styles.categoryCard}>
            <View style={styles.categoryIcon}>
              <Ionicons name={cat.icon as any} size={22} color={theme.colors.primary} />
            </View>
            <Text style={styles.categoryLabel}>{t(`profile.help.categories.${cat.id}`)}</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
