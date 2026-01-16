// ============================================================
// StyleAdvisor AI - Toast Component
// ============================================================

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useUIStore } from '../stores';
import { Toast as ToastType } from '../../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ToastItem: React.FC<{ toast: ToastType }> = ({ toast }) => {
  const { theme } = useTheme();
  const hideToast = useUIStore((state) => state.hideToast);
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  }, []);

  const getToastStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          backgroundColor: theme.colors.success,
          icon: 'checkmark-circle' as const,
        };
      case 'error':
        return {
          backgroundColor: theme.colors.error,
          icon: 'alert-circle' as const,
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.warning,
          icon: 'warning' as const,
        };
      default:
        return {
          backgroundColor: theme.colors.info,
          icon: 'information-circle' as const,
        };
    }
  };

  const toastStyle = getToastStyle();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: toastStyle.backgroundColor,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      ...theme.shadows.lg,
    },
    message: {
      flex: 1,
      color: theme.colors.white,
      fontSize: theme.fontSize.md,
      marginLeft: theme.spacing.sm,
    },
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <Ionicons name={toastStyle.icon} size={24} color={theme.colors.white} />
      <Text style={styles.message}>{toast.message}</Text>
      <TouchableOpacity onPress={() => hideToast(toast.id)}>
        <Ionicons name="close" size={20} color={theme.colors.white} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export const ToastContainer: React.FC = () => {
  const insets = useSafeAreaInsets();
  const activeToasts = useUIStore((state) => state.activeToasts);

  if (activeToasts.length === 0) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: insets.top + 10,
        left: 0,
        right: 0,
        zIndex: 999,
      }}
    >
      {activeToasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </View>
  );
};

export default ToastContainer;
