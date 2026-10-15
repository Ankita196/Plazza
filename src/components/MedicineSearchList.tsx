import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Medicine } from '../types';
import { MedicineCard } from './MedicineCard';

interface Props {
  query: string;
  items: Medicine[];
  cartQuantities: Record<string, number>;
  isLoading: boolean;
  onAddToCart: (medicine: Medicine) => void;
  onIncrement: (medicineId: string) => void;
  onDecrement: (medicineId: string) => void;
}

export const MedicineSearchList: React.FC<Props> = ({
  query,
  items,
  cartQuantities,
  isLoading,
  onAddToCart,
  onIncrement,
  onDecrement,
}) => {
  if (isLoading) {
    return (
      <View style={styles.centerState} accessibilityRole="progressbar">
        <ActivityIndicator size="large" color="#0D9488" />
        <Text style={styles.stateTitle}>Searching medicine catalog...</Text>
      </View>
    );
  }

  // No results state
  if (query.trim().length > 0 && items.length === 0) {
    return (
      <View style={styles.centerState} accessibilityRole="text">
        <Text style={styles.stateIcon}>🔍</Text>
        <Text style={styles.stateTitle}>No medicines found</Text>
        <Text style={styles.stateDesc}>
          We couldn't find any medicine or salt matching "{query}".
        </Text>
        <Text style={styles.tipText}>
          Tip: Try searching by salt name like "Paracetamol" or common brands like "Dolo".
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => (
        <MedicineCard
          medicine={item}
          quantityInCart={cartQuantities[item.id] || 0}
          onAddToCart={onAddToCart}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
      )}
      ListHeaderComponent={
        query.trim().length > 0 ? (
          <View style={styles.headerInfo}>
            <Text style={styles.resultsCount}>
              Found {items.length} {items.length === 1 ? 'medicine' : 'medicines'} for "{query}"
            </Text>
          </View>
        ) : (
          <View style={styles.headerInfo}>
            <Text style={styles.sectionTitle}>All Available Medicines ({items.length})</Text>
            <Text style={styles.sectionSubtitle}>Authentic pharmacy supplies with 10-minute delivery</Text>
          </View>
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 40,
    paddingTop: 8,
  },
  headerInfo: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F766E',
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 320,
  },
  stateIcon: {
    fontSize: 44,
    marginBottom: 12,
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  stateDesc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 12,
    color: '#0D9488',
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    textAlign: 'center',
  },
});
