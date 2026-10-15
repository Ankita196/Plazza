import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PermissionsState, PermissionStatus } from '../types';
import { Colors } from '../theme';

interface Props {
  permissions: PermissionsState;
  onRequestAgain?: () => void;
  onOpenSettings?: () => void;
}

const getStatusColor = (status: PermissionStatus) => {
  switch (status) {
    case 'granted':
      return Colors.success;
    case 'blocked':
      return Colors.danger;
    case 'denied':
      return Colors.warning;
    default:
      return Colors.textMuted;
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
    backgroundColor: Colors.darkContainer,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkContainerBorder,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  title: {
    color: Colors.textMuted,
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
    backgroundColor: Colors.info,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  actionBtnText: {
    color: Colors.textInverse,
    fontSize: 11,
    fontWeight: '600',
  },
});
