import { useState, useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { PermissionsState } from '../types';
import { PermissionService } from '../services/permissionService';

export function usePermissions() {
  const [permissions, setPermissions] = useState<PermissionsState>({
    location: 'checking',
    notification: 'checking',
    coordinates: null,
  });

  const check = useCallback(async () => {
    const status = await PermissionService.checkPermissions();
    setPermissions(prev => ({
      location: status.location,
      notification: status.notification,
      coordinates:
        status.location === 'granted'
          ? prev.coordinates || PermissionService.getDefaultCoordinates()
          : null,
    }));
  }, []);

  const request = useCallback(async () => {
    const result = await PermissionService.requestAllPermissions();
    setPermissions(result);
  }, []);

  useEffect(() => {
    // Initial request on app launch
    request();

    // Listen to AppState when user returns from Settings
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        check();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [check, request]);

  const hasBlocked = permissions.location === 'blocked' || permissions.notification === 'blocked';

  return {
    permissions,
    hasBlocked,
    requestPermissions: request,
    checkPermissions: check,
    openAppSettings: PermissionService.openAppSettings,
  };
}
