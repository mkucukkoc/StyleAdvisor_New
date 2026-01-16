// ============================================================
// StyleAdvisor AI - Premium Success Screen
// ============================================================

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button } from '../../src/components';
import { analytics } from '../../src/services';

export default function PremiumSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    analytics.track('purchase_success');

    // Animate entrance
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.loop(
        Animated.sequence([
          Animated.timing(confettiAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(confettiAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  const handleContinue = () => {
    router.replace('/(tabs)/home');
  };

  const features = [
    { icon: 'infinite', text: t('premium.success.features.unlimited') },
    { icon: 'shirt', text: t('premium.success.features.suggestions') },
    { icon: 'sparkles', text: t('premium.success.features.insights') },
    { icon: 'star', text: t('premium.success.features.exclusive') },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: insets.top + theme.spacing['3xl'],
      paddingBottom: insets.bottom + theme.spacing.lg,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.xl,
    },
    checkmark: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: theme.fontSize['3xl'],
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.white,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: theme.fontSize.lg,
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
      marginBottom: theme.spacing['2xl'],
    },
    featuresContainer: {
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: theme.borderRadius['2xl'],
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    featureIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    featureText: {
      flex: 1,
      fontSize: theme.fontSize.md,
      color: theme.colors.white,
    },
    footer: {
      width: '100%',
    },
    continueButton: {
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      alignItems: 'center',
    },
    continueButtonText: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.primary,
    },
    confetti: {
      position: 'absolute',
      top: 50,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Confetti decoration */}
        <Animated.View
          style={[
            styles.confetti,
            {
              opacity: confettiAnim,
              transform: [
                {
                  translateY: confettiAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 20],
                  }),
                },
              ],
            },
          ]}
        >
          <Ionicons name="sparkles" size={32} color="rgba(255, 255, 255, 0.5)" />
        </Animated.View>

        <View style={styles.content}>
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            <View style={styles.checkmark}>
              <Ionicons name="checkmark" size={48} color={theme.colors.primary} />
            </View>
          </Animated.View>

          <Animated.Text style={[styles.title, { opacity: opacityAnim }]}>
            {t('premium.success.title')}
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, { opacity: opacityAnim }]}>
            {t('premium.success.subtitle')}
          </Animated.Text>

          <Animated.View style={[styles.featuresContainer, { opacity: opacityAnim }]}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon as any} size={20} color={theme.colors.white} />
                </View>
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <Button
            title={t('premium.success.continueButton')}
            onPress={handleContinue}
            variant="secondary"
            fullWidth
          />
        </View>
      </LinearGradient>
    </View>
  );
}
