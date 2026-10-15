import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PermissionsState, PermissionStatus } from '../types';

interface Props {
  permissions: PermissionsState;
  onRequestAgain?: () => void;
  onOpenSettings?: () => void;
}

const getStatusColor = (status: PermissionStatus) => {
  switch (status) {
    case 'granted':
      return '#059669'; // Green
    case 'blocked':
      return '#DC2626'; // Red
    case 'denied':
      return '#D97706'; // Amber
    default:
      return '#6B7280'; // Gray
  }
};

export const PermissionDebugBanner: React.FC<Props> = ({
  permissions,
  onRequestAgain,
  onOpenSettings,
}) => {
  const isAnyNotGranted =
    permissions.location !== 'granted' || permissions.notification !== 'granted';

  return (
    <View style={styles.container} accessibilityRole="toolbar" accessibilityLabel="Permission debug banner">
      <View style={styles.contentRow}>
        <Text style={styles.title}>DEBUG PERMISSIONS:</Text>
        <View style={styles.badgeRow}>
          <View style={styles.item}>
            <Text style={styles.label}>Location: </Text>
            <Text style={[styles.status, { color: getStatusColor(permissions.location) }]}>
              {permissions.location.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.separator}>|</Text>
          <View style={styles.item}>
            <Text style={styles.label}>Notif: </Text>
            <Text style={[styles.status, { color: getStatusColor(permissions.notification) }]}>
              {permissions.notification.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {isAnyNotGranted && (
        <View style={styles.actionsRow}>
          {permissions.location === 'blocked' || permissions.notification === 'blocked' ? (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={onOpenSettings}
              accessibilityRole="button"
              accessibilityLabel="Open App Settings"
            >
              <Text style={styles.actionBtnText}>Open Settings</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={onRequestAgain}
              accessibilityRole="button"
              accessibilityLabel="Request Permissions"
            >
              <Text style={styles.actionBtnText}>Grant Permissions</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  title: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: '#CBD5E1',
    fontSize: 11,
  },
  status: {
    fontSize: 11,
    fontWeight: '700',
  },
  separator: {
    color: '#475569',
    marginHorizontal: 8,
    fontSize: 11,
  },
  actionsRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
});
