import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { usePermissions } from '../hooks/usePermissions';
import { useMedicineSearch } from '../hooks/useMedicineSearch';
import { useCart } from '../context/CartContext';
import { PermissionDebugBanner } from '../components/PermissionDebugBanner';
import { PermissionRationaleModal } from '../components/PermissionRationaleModal';
import { LocationHeader } from '../components/LocationHeader';
import { SearchBar } from '../components/SearchBar';
import { RecentSearches } from '../components/RecentSearches';
import { MedicineSearchList } from '../components/MedicineSearchList';
import { Colors } from '../theme';

interface Props {
  onNavigateToCart: () => void;
}

export const HomeScreen: React.FC<Props> = ({ onNavigateToCart }) => {
  const {
    permissions,
    hasBlocked,
    requestPermissions,
    openAppSettings,
  } = usePermissions();

  const [isRationaleDismissed, setIsRationaleDismissed] = useState(false);

  const {
    query,
    setQuery,
    isLoading,
    searchResults,
    recentSearches,
    clearRecentSearches,
    handleSearchSubmit,
    selectRecentSearch,
    allMedicines,
  } = useMedicineSearch();

  const {
    cartQuantities,
    totalItemCount,
    itemTotal,
    addToCart,
    increment,
    decrement,
  } = useCart();

  const displayedMedicines = (query.trim().length > 0 ? searchResults : allMedicines) || [];

  return (
    <View style={styles.container}>
      {/* Debug Permission Banner */}
      <PermissionDebugBanner
        permissions={permissions}
        onRequestAgain={requestPermissions}
        onOpenSettings={openAppSettings}
      />

      {/* Delivering to <lat,lng> Header */}
      <LocationHeader
        coordinates={permissions.coordinates}
        locationPermission={permissions.location}
      />

      {/* Medicine Search Bar */}
      <SearchBar
        value={query}
        onChangeText={setQuery}
        onSubmit={handleSearchSubmit}
        onClear={() => setQuery('')}
        isLoading={isLoading}
      />

      {/* Persisted Recent Searches (max 5) */}
      <RecentSearches
        searches={recentSearches}
        onSelect={selectRecentSearch}
        onClear={clearRecentSearches}
      />

      {/* Medicine Catalog List */}
      <MedicineSearchList
        query={query}
        items={displayedMedicines}
        cartQuantities={cartQuantities}
        isLoading={isLoading}
        onAddToCart={addToCart}
        onIncrement={increment}
        onDecrement={decrement}
      />

      {/* Floating Cart Bar if items exist */}
      {totalItemCount > 0 && (
        <View style={styles.floatingCartBar}>
          <View>
            <Text style={styles.floatingCartItems}>
              {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} in cart
            </Text>
            <Text style={styles.floatingCartTotal}>₹{itemTotal}</Text>
          </View>
          <TouchableOpacity
            style={styles.viewCartBtn}
            onPress={onNavigateToCart}
            accessibilityRole="button"
            accessibilityLabel={`View Cart with ${totalItemCount} items, total ₹${itemTotal}`}
          >
            <Text style={styles.viewCartText}>View Cart →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Rationale Modal when permissions are blocked */}
      <PermissionRationaleModal
        visible={hasBlocked && !isRationaleDismissed}
        permissions={permissions}
        onOpenSettings={openAppSettings}
        onDismiss={() => setIsRationaleDismissed(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  floatingCartBar: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    backgroundColor: Colors.primaryDark,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  floatingCartItems: {
    color: Colors.primaryBorder,
    fontSize: 12,
    fontWeight: '600',
  },
  floatingCartTotal: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: '800',
  },
  viewCartBtn: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewCartText: {
    color: Colors.primaryDark,
    fontSize: 14,
    fontWeight: '800',
  },
});
