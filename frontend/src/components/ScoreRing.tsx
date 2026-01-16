// ============================================================
// StyleAdvisor AI - ScoreRing Component
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { colors } from '../../theme/tokens';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showPercentage?: boolean;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 120,
  strokeWidth = 10,
  label,
  showPercentage = true,
}) => {
  const { theme } = useTheme();

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getScoreColor = (): string => {
    if (score >= 80) return colors.scoreExcellent;
    if (score >= 60) return colors.scoreGood;
    if (score >= 40) return colors.scoreAverage;
    return colors.scorePoor;
  };

  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center',
    },
    svg: {
      position: 'absolute',
      transform: [{ rotate: '-90deg' }],
    },
    scoreContainer: {
      alignItems: 'center',
    },
    score: {
      fontSize: size / 3.5,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    label: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getScoreColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.scoreContainer}>
        <Text style={styles.score}>
          {score}
          {showPercentage && <Text style={{ fontSize: size / 6 }}>%</Text>}
        </Text>
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
    </View>
  );
};

export default ScoreRing;
