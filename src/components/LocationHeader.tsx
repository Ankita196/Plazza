import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LocationCoordinates } from '../types';
import { Colors } from '../theme';

interface Props {
  coordinates: LocationCoordinates | null;
  locationPermission: string;
}

export const LocationHeader: React.FC<Props> = ({ coordinates, locationPermission }) => {
  const getDeliveryText = () => {
    if (locationPermission === 'granted' && coordinates) {
      return `Delivering to: ${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}`;
    }
    if (locationPermission === 'blocked') {
      return 'Delivering to: Location permission blocked (Tap Settings)';
    }
    if (locationPermission === 'denied') {
      return 'Delivering to: Location permission denied';
    }
    return 'Delivering to: Detecting location...';
  };

  return (
    <View style={styles.header} accessibilityRole="header" accessibilityLabel="Delivery location header">
      <View style={styles.badge}>
        <Text style={styles.pinIcon}>📍</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>Plazza Express Delivery (10 mins)</Text>
        <Text style={styles.locationText} numberOfLines={1}>
          {getDeliveryText()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.primaryDark,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  pinIcon: {
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: Colors.primaryBorder,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textInverse,
    fontWeight: '700',
    marginTop: 2,
  },
});
