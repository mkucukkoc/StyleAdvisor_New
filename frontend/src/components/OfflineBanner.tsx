// ============================================================
// StyleAdvisor AI - OfflineBanner Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useUIStore } from '../stores';

export const OfflineBanner: React.FC = () => {
  const { theme } = useTheme();
  const isOnline = useUIStore((state) => state.isOnline);

  if (isOnline) return null;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.warning,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: theme.colors.black,
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.medium,
      marginLeft: theme.spacing.sm,
    },
  });

  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={18} color={theme.colors.black} />
      <Text style={styles.text}>You are offline</Text>
    </View>
  );
};

export default OfflineBanner;
