import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CartItem } from '../types';

interface Props {
  item: CartItem;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
}

export const CartItemCard: React.FC<Props> = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  const { medicine, quantity } = item;
  const isMaxReached = quantity >= medicine.maxQty;
  const subtotal = medicine.price * quantity;

  return (
    <View
      style={styles.card}
      accessibilityRole="text"
      accessibilityLabel={`${medicine.name}, ${quantity} units, Subtotal ₹${subtotal}`}
    >
      <View style={styles.topRow}>
        <View style={styles.titleInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{medicine.name}</Text>
            {medicine.rx && (
              <View style={styles.rxBadge} accessibilityLabel="Prescription Item">
                <Text style={styles.rxText}>Rx</Text>
              </View>
            )}
          </View>
          <Text style={styles.salt} numberOfLines={1}>
            {medicine.salt}
          </Text>
          <Text style={styles.unitPrice}>₹{medicine.price} / unit</Text>
        </View>

        <TouchableOpacity
          onPress={() => onRemove(medicine.id)}
          style={styles.removeBtn}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${medicine.name} from cart`}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.removeText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.stepper}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => onDecrement(medicine.id)}
            accessibilityRole="button"
            accessibilityLabel={`Decrease ${medicine.name} quantity`}
          >
            <Text style={styles.stepBtnText}>−</Text>
          </TouchableOpacity>

          <View style={styles.qtyBox}>
            <Text style={styles.qtyText}>{quantity}</Text>
          </View>

          <TouchableOpacity
            style={[styles.stepBtn, isMaxReached && styles.stepBtnDisabled]}
            onPress={() => !isMaxReached && onIncrement(medicine.id)}
            disabled={isMaxReached}
            accessibilityRole="button"
            accessibilityLabel={`Increase ${medicine.name} quantity`}
          >
            <Text style={[styles.stepBtnText, isMaxReached && styles.stepBtnTextDisabled]}>
              +
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalLabel}>Item Total</Text>
          <Text style={styles.subtotalValue}>₹{subtotal}</Text>
        </View>
      </View>

      {isMaxReached && (
        <View style={styles.maxQtyNotice}>
          <Text style={styles.maxQtyText}>
            Maximum allowed purchase limit of {medicine.maxQty} units reached.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleInfo: {
    flex: 1,
    paddingRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  rxBadge: {
    backgroundColor: '#FEE2E2',
    borderColor: '#F87171',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  rxText: {
    color: '#DC2626',
    fontSize: 10,
    fontWeight: '800',
  },
  salt: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  unitPrice: {
    fontSize: 13,
    color: '#0D9488',
    fontWeight: '600',
    marginTop: 4,
  },
  removeBtn: {
    padding: 4,
  },
  removeText: {
    fontSize: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 8,
    overflow: 'hidden',
    height: 36,
  },
  stepBtn: {
    width: 34,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    backgroundColor: '#6EE7B7',
  },
  stepBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  stepBtnTextDisabled: {
    color: '#D1FAE5',
  },
  qtyBox: {
    paddingHorizontal: 12,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  subtotalContainer: {
    alignItems: 'flex-end',
  },
  subtotalLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  subtotalValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  maxQtyNotice: {
    marginTop: 8,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  maxQtyText: {
    fontSize: 11,
    color: '#B91C1C',
    fontWeight: '500',
  },
});
