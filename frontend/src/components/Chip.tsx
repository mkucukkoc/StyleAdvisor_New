// ============================================================
// StyleAdvisor AI - Chip & Tag Components
// ============================================================

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'default' | 'outline';
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  icon,
  variant = 'default',
  size = 'medium',
  style,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: size === 'small' ? theme.spacing.xs : theme.spacing.sm,
      paddingHorizontal: size === 'small' ? theme.spacing.sm : theme.spacing.md,
      borderRadius: theme.borderRadius.full,
      backgroundColor:
        variant === 'outline'
          ? 'transparent'
          : selected
          ? theme.colors.primary
          : theme.colors.surface,
      borderWidth: variant === 'outline' ? 1 : 0,
      borderColor: selected ? theme.colors.primary : theme.colors.border,
    },
    label: {
      fontSize: size === 'small' ? theme.fontSize.xs : theme.fontSize.sm,
      fontWeight: theme.fontWeight.medium,
      color: selected ? theme.colors.white : theme.colors.text,
    },
    icon: {
      marginRight: theme.spacing.xs,
    },
  });

  const content = (
    <>
      {icon && (
        <Ionicons
          name={icon}
          size={size === 'small' ? 14 : 16}
          color={selected ? theme.colors.white : theme.colors.textSecondary}
          style={styles.icon}
        />
      )}
      <Text style={styles.label}>{label}</Text>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[styles.container, style]}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.container, style]}>{content}</View>;
};

interface TagProps {
  label: string;
  color?: string;
  variant?: 'filled' | 'outline';
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export const Tag: React.FC<TagProps> = ({
  label,
  color,
  variant = 'filled',
  size = 'small',
  style,
}) => {
  const { theme } = useTheme();
  const tagColor = color || theme.colors.primary;

  const styles = StyleSheet.create({
    container: {
      paddingVertical: size === 'small' ? 2 : theme.spacing.xs,
      paddingHorizontal: size === 'small' ? theme.spacing.sm : theme.spacing.md,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: variant === 'filled' ? tagColor : 'transparent',
      borderWidth: variant === 'outline' ? 1 : 0,
      borderColor: tagColor,
    },
    label: {
      fontSize: size === 'small' ? theme.fontSize.xs : theme.fontSize.sm,
      fontWeight: theme.fontWeight.medium,
      color: variant === 'filled' ? theme.colors.white : tagColor,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default { Chip, Tag };
