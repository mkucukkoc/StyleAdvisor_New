// ============================================================
// StyleAdvisor AI - Card Component
// ============================================================

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outline';
  padding?: 'none' | 'small' | 'medium' | 'large';
  onPress?: () => void;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  onPress,
  style,
}) => {
  const { theme } = useTheme();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
    };

    // Padding
    switch (padding) {
      case 'none':
        break;
      case 'small':
        baseStyle.padding = theme.spacing.sm;
        break;
      case 'large':
        baseStyle.padding = theme.spacing.lg;
        break;
      default:
        baseStyle.padding = theme.spacing.md;
    }

    // Variant
    switch (variant) {
      case 'elevated':
        baseStyle.backgroundColor = theme.colors.surfaceElevated;
        Object.assign(baseStyle, theme.shadows.lg);
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = theme.colors.border;
        break;
      default:
        baseStyle.backgroundColor = theme.colors.surface;
    }

    return baseStyle;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[getCardStyle(), style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[getCardStyle(), style]}>{children}</View>;
};

export default Card;
