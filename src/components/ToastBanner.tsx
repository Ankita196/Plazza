import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ToastMessage } from '../types';

interface Props {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const ToastBanner: React.FC<Props> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isWarning = toast.type === 'warning';
  const isSuccess = toast.type === 'success';

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onDismiss}
        style={[
          styles.card,
          isWarning && styles.warningCard,
          isSuccess && styles.successCard,
        ]}
        accessibilityRole="alert"
        accessibilityLabel={`${toast.title}: ${toast.message}`}
      >
        <Text style={styles.icon}>
          {isWarning ? '⚠️' : isSuccess ? '🎉' : 'ℹ️'}
        </Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{toast.title}</Text>
          <Text style={styles.message}>{toast.message}</Text>
        </View>
        <Text style={styles.closeIcon}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  warningCard: {
    backgroundColor: '#7F1D1D', // Dark Red/Burgundy for warnings
    borderColor: '#DC2626',
  },
  successCard: {
    backgroundColor: '#064E3B', // Dark Emerald for success
    borderColor: '#059669',
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    marginBottom: 2,
  },
  message: {
    color: '#E2E8F0',
    fontSize: 12,
    lineHeight: 16,
  },
  closeIcon: {
    color: '#94A3B8',
    fontSize: 14,
    paddingLeft: 8,
    fontWeight: '700',
  },
});
