import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Medicine } from '../types';
import { Colors } from '../theme';

interface Props {
  medicine: Medicine;
  quantityInCart: number;
  onAddToCart: (medicine: Medicine) => void;
  onIncrement: (medicineId: string) => void;
  onDecrement: (medicineId: string) => void;
}

export const MedicineCard: React.FC<Props> = ({
  medicine,
  quantityInCart,
  onAddToCart,
  onIncrement,
  onDecrement,
}) => {
  const isMaxReached = quantityInCart >= medicine.maxQty;

  return (
    <View
      style={styles.card}
      accessibilityRole="text"
      accessibilityLabel={`${medicine.name}, ${medicine.salt}, Price ₹${medicine.price}${medicine.rx ? ', Prescription required' : ''}`}
    >
      <View style={styles.detailsCol}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{medicine.name}</Text>
          {medicine.rx && (
            <View
              style={styles.rxBadge}
              accessibilityRole="text"
              accessibilityLabel="Prescription Required"
            >
              <Text style={styles.rxText}>Rx</Text>
            </View>
          )}
        </View>

        <Text style={styles.salt} numberOfLines={1}>
          Contains: {medicine.salt}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.price}>₹{medicine.price}</Text>
          <Text style={styles.maxQtyNote}>Max: {medicine.maxQty} units</Text>
        </View>
      </View>

      <View style={styles.actionCol}>
        {quantityInCart === 0 ? (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => onAddToCart(medicine)}
            accessibilityRole="button"
            accessibilityLabel={`Add ${medicine.name} to cart`}
          >
            <Text style={styles.addButtonText}>+ ADD</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => onDecrement(medicine.id)}
              accessibilityRole="button"
              accessibilityLabel={`Decrease quantity of ${medicine.name}`}
            >
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>

            <View style={styles.qtyDisplay}>
              <Text style={styles.qtyText}>{quantityInCart}</Text>
            </View>

            <TouchableOpacity
              style={[styles.stepBtn, isMaxReached && styles.stepBtnDisabled]}
              onPress={() => !isMaxReached && onIncrement(medicine.id)}
              disabled={isMaxReached}
              accessibilityRole="button"
              accessibilityLabel={`Increase quantity of ${medicine.name}`}
            >
              <Text style={[styles.stepBtnText, isMaxReached && styles.stepBtnTextDisabled]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {isMaxReached && (
          <Text style={styles.maxReachedNotice}>Max limit</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  detailsCol: {
    flex: 1,
    paddingRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  rxBadge: {
    backgroundColor: Colors.rxBg,
    borderColor: Colors.rxBorder,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  rxText: {
    color: Colors.rxText,
    fontSize: 11,
    fontWeight: '800',
  },
  salt: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  price: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  maxQtyNote: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  actionCol: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  addButton: {
    backgroundColor: Colors.secondaryLight,
    borderColor: Colors.secondary,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
    minWidth: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: Colors.secondary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    overflow: 'hidden',
    height: 38,
  },
  stepBtn: {
    width: 32,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    backgroundColor: Colors.secondaryDisabled,
  },
  stepBtnText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  stepBtnTextDisabled: {
    color: '#D1FAE5',
  },
  qtyDisplay: {
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 26,
  },
  qtyText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '800',
  },
  maxReachedNotice: {
    fontSize: 10,
    color: Colors.danger,
    fontWeight: '600',
    marginTop: 4,
  },
});
