// ============================================================
// StyleAdvisor AI - PremiumLockOverlay Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { useRouter } from 'expo-router';

interface PremiumLockOverlayProps {
  message?: string;
  compact?: boolean;
}

export const PremiumLockOverlay: React.FC<PremiumLockOverlayProps> = ({
  message = 'Unlock with Premium',
  compact = false,
}) => {
  const { theme } = useTheme();
  const router = useRouter();

  const handleUpgrade = () => {
    router.push('/(modals)/paywall');
  };

  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
    },
    blur: {
      ...StyleSheet.absoluteFillObject,
    },
    content: {
      alignItems: 'center',
      padding: compact ? theme.spacing.sm : theme.spacing.lg,
    },
    iconContainer: {
      width: compact ? 32 : 48,
      height: compact ? 32 : 48,
      borderRadius: compact ? 16 : 24,
      backgroundColor: 'rgba(212, 175, 55, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: compact ? theme.spacing.xs : theme.spacing.sm,
    },
    message: {
      fontSize: compact ? theme.fontSize.xs : theme.fontSize.sm,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.white,
      textAlign: 'center',
    },
    button: {
      marginTop: compact ? theme.spacing.xs : theme.spacing.sm,
      paddingVertical: compact ? theme.spacing.xs : theme.spacing.sm,
      paddingHorizontal: compact ? theme.spacing.sm : theme.spacing.md,
      backgroundColor: '#D4AF37',
      borderRadius: theme.borderRadius.full,
    },
    buttonText: {
      fontSize: compact ? theme.fontSize.xs : theme.fontSize.sm,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.black,
    },
  });

  return (
    <View style={styles.container}>
      <BlurView intensity={20} tint="dark" style={styles.blur} />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="lock-closed"
            size={compact ? 16 : 24}
            color="#D4AF37"
          />
        </View>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={handleUpgrade} style={styles.button}>
          <Text style={styles.buttonText}>Go Premium</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PremiumLockOverlay;
