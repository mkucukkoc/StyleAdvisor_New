// ============================================================
// StyleAdvisor AI - Photo Capture Screen
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../src/theme/ThemeContext';
import { Button } from '../../../src/components';
import { useAnalysisStore } from '../../../src/stores';

export default function PhotoCaptureScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const updateRequest = useAnalysisStore((state) => state.updateCurrentRequest);

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.7 });
        if (photo?.base64) {
          updateRequest({ type: 'photo', imageBase64: photo.base64 });
          router.push('/(tabs)/analyze/review');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take photo');
      }
    }
  };

  const handleChooseFromGallery = () => {
    router.push('/(tabs)/analyze/photo-picker');
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.black,
    },
    header: {
      position: 'absolute',
      top: insets.top + theme.spacing.md,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      zIndex: 10,
    },
    closeButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    flipButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    camera: {
      flex: 1,
    },
    instructions: {
      position: 'absolute',
      top: insets.top + 70,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    instructionsText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.white,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.full,
    },
    controls: {
      position: 'absolute',
      bottom: insets.bottom + theme.spacing.xl,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    captureButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 4,
      borderColor: theme.colors.primary,
    },
    captureButtonInner: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.primary,
    },
    galleryButton: {
      marginTop: theme.spacing.lg,
    },
    permissionContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    permissionIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    permissionTitle: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    permissionMessage: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
  });

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.permissionContainer}>
          <View style={styles.permissionIcon}>
            <Ionicons name="camera-outline" size={40} color={theme.colors.textSecondary} />
          </View>
          <Text style={styles.permissionTitle}>{t('common.loading')}</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.permissionContainer}>
          <View style={styles.permissionIcon}>
            <Ionicons name="camera-outline" size={40} color={theme.colors.primary} />
          </View>
          <Text style={styles.permissionTitle}>{t('analyze.photoCapture.permissionTitle')}</Text>
          <Text style={styles.permissionMessage}>{t('analyze.photoCapture.permissionMessage')}</Text>
          <Button
            title={t('analyze.photoCapture.grantPermission')}
            onPress={requestPermission}
          />
          <Button
            title={t('analyze.photoCapture.chooseFromGallery')}
            onPress={handleChooseFromGallery}
            variant="outline"
            style={{ marginTop: theme.spacing.md }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.colors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleCameraFacing} style={styles.flipButton}>
            <Ionicons name="camera-reverse" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionsText}>{t('analyze.photoCapture.instructions')}</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.captureButton} onPress={handleTakePhoto}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.galleryButton} onPress={handleChooseFromGallery}>
            <Text style={{ color: theme.colors.white, fontSize: theme.fontSize.sm }}>
              {t('analyze.photoCapture.chooseFromGallery')}
            </Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}
