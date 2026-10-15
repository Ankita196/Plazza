import { PermissionsAndroid, Platform, Linking } from 'react-native';
import { PermissionStatus, PermissionsState, LocationCoordinates } from '../types';

const DEFAULT_COORDINATES: LocationCoordinates = {
  latitude: 12.9716,
  longitude: 77.5946,
};

// Internal cache for blocked status across checks
let isLocationBlocked = false;
let isNotificationBlocked = false;

export const PermissionService = {
  async checkPermissions(): Promise<{ location: PermissionStatus; notification: PermissionStatus }> {
    if (Platform.OS !== 'android') {
      return { location: 'granted', notification: 'granted' };
    }

    const hasLocation = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    let hasNotification = true;
    if (Platform.Version >= 33) {
      hasNotification = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }

    // If granted, reset blocked flag
    if (hasLocation) isLocationBlocked = false;
    if (hasNotification) isNotificationBlocked = false;

    return {
      location: hasLocation ? 'granted' : isLocationBlocked ? 'blocked' : 'denied',
      notification: hasNotification ? 'granted' : isNotificationBlocked ? 'blocked' : 'denied',
    };
  },

  async requestLocationPermission(): Promise<PermissionStatus> {
    if (Platform.OS !== 'android') return 'granted';

    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Plazza needs access to your location to deliver medicines to your doorstep.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        isLocationBlocked = false;
        return 'granted';
      } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        isLocationBlocked = true;
        return 'blocked';
      } else {
        return 'denied';
      }
    } catch (err) {
      console.warn('Error requesting location permission', err);
      return 'denied';
    }
  },

  async requestNotificationPermission(): Promise<PermissionStatus> {
    if (Platform.OS !== 'android' || Platform.Version < 33) {
      return 'granted';
    }

    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'Plazza needs notification access to send order and delivery updates.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        isNotificationBlocked = false;
        return 'granted';
      } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        isNotificationBlocked = true;
        return 'blocked';
      } else {
        return 'denied';
      }
    } catch (err) {
      console.warn('Error requesting notification permission', err);
      return 'denied';
    }
  },

  async requestAllPermissions(): Promise<PermissionsState> {
    const locStatus = await this.requestLocationPermission();
    const notifStatus = await this.requestNotificationPermission();

    return {
      location: locStatus,
      notification: notifStatus,
      coordinates: locStatus === 'granted' ? DEFAULT_COORDINATES : null,
    };
  },

  openAppSettings(): Promise<void> {
    return Linking.openSettings();
  },

  getDefaultCoordinates(): LocationCoordinates {
    return DEFAULT_COORDINATES;
  },
};
