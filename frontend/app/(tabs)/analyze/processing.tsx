// ============================================================
// StyleAdvisor AI - Processing Screen
// ============================================================

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { useAnalysisStore, useSubscriptionStore } from '../../../src/stores';
import { analysisApi, mockAnalysisResult } from '../../../src/services/api';
import { analytics } from '../../../src/services';

export default function ProcessingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const setCurrentResult = useAnalysisStore((state) => state.setCurrentResult);
  const addToHistory = useAnalysisStore((state) => state.addToHistory);
  const decrementAnalysis = useSubscriptionStore((state) => state.decrementAnalysis);

  const [currentStep, setCurrentStep] = useState(0);
  const spinValue = new Animated.Value(0);

  const steps = [
    { key: 'uploading', label: t('analyze.processing.steps.uploading'), icon: 'cloud-upload' },
    { key: 'analyzing', label: t('analyze.processing.steps.analyzing'), icon: 'color-palette' },
    { key: 'matching', label: t('analyze.processing.steps.matching'), icon: 'search' },
    { key: 'generating', label: t('analyze.processing.steps.generating'), icon: 'sparkles' },
  ];

  useEffect(() => {
    // Spin animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();

    // Simulate processing steps
    const stepTimers: NodeJS.Timeout[] = [];
    steps.forEach((_, index) => {
      const timer = setTimeout(() => {
        setCurrentStep(index);
      }, index * 2000);
      stepTimers.push(timer);
    });

    // Complete and navigate
    const completeTimer = setTimeout(async () => {
      try {
        // Use mock result
        const result = { ...mockAnalysisResult, id: `analysis-${Date.now()}` };
        setCurrentResult(result);
        addToHistory(result);
        decrementAnalysis();
        analytics.track('analyze_success');
        router.replace('/(tabs)/analyze/result');
      } catch (error) {
        analytics.track('analyze_failure');
        router.back();
      }
    }, 8000);

    return () => {
      stepTimers.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      alignItems: 'center',
      justifyContent: 'center',
    },
    spinnerContainer: {
      marginBottom: theme.spacing['2xl'],
    },
    spinner: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 3,
      borderColor: theme.colors.border,
      borderTopColor: theme.colors.primary,
    },
    title: {
      fontSize: theme.fontSize['2xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xl,
    },
    stepsContainer: {
      width: '80%',
    },
    step: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      opacity: 0.4,
    },
    stepActive: {
      opacity: 1,
    },
    stepComplete: {
      opacity: 0.6,
    },
    stepIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    stepIconActive: {
      backgroundColor: theme.colors.primaryMuted,
    },
    stepLabel: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
    },
    tip: {
      position: 'absolute',
      bottom: insets.bottom + theme.spacing.xl,
      fontSize: theme.fontSize.sm,
      color: theme.colors.textTertiary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.spinnerContainer}>
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
      </View>

      <Text style={styles.title}>{t('analyze.processing.title')}</Text>

      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View
            key={step.key}
            style={[
              styles.step,
              index === currentStep && styles.stepActive,
              index < currentStep && styles.stepComplete,
            ]}
          >
            <View style={[styles.stepIcon, index === currentStep && styles.stepIconActive]}>
              {index < currentStep ? (
                <Ionicons name="checkmark" size={20} color={theme.colors.success} />
              ) : (
                <Ionicons
                  name={step.icon as any}
                  size={20}
                  color={index === currentStep ? theme.colors.primary : theme.colors.textTertiary}
                />
              )}
            </View>
            <Text style={styles.stepLabel}>{step.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.tip}>{t('analyze.processing.tip')}</Text>
    </View>
  );
}
