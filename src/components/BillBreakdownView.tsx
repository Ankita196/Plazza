import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BillBreakdown } from '../types';
import { FREE_DELIVERY_THRESHOLD } from '../services/billCalculator';

interface Props {
  bill: BillBreakdown;
  onPlaceOrder: () => void;
  isPlacingOrder?: boolean;
}

export const BillBreakdownView: React.FC<Props> = ({
  bill,
  onPlaceOrder,
  isPlacingOrder = false,
}) => {
  const diffToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - bill.itemTotal);

  return (
    <View style={styles.container} accessibilityRole="summary" accessibilityLabel="Bill Summary">
      <Text style={styles.title}>BILL DETAILS</Text>

      {/* Free delivery prompt banner */}
      {bill.itemTotal > 0 && bill.deliveryFee > 0 && diffToFreeDelivery > 0 && (
        <View style={styles.freeDelPrompt}>
          <Text style={styles.promptIcon}>⚡</Text>
          <Text style={styles.promptText}>
            Add items worth <Text style={styles.bold}>₹{diffToFreeDelivery}</Text> more for <Text style={styles.boldGreen}>FREE DELIVERY</Text>!
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Item Total</Text>
          <Text style={styles.value}>₹{bill.itemTotal}</Text>
        </View>

        {bill.discount > 0 && (
          <View style={styles.row}>
            <View style={styles.discountLabelRow}>
              <Text style={styles.discountLabel}>Coupon Discount</Text>
              {bill.appliedCouponCode && (
                <View style={styles.couponTag}>
                  <Text style={styles.couponTagText}>{bill.appliedCouponCode}</Text>
                </View>
              )}
            </View>
            <Text style={styles.discountValue}>−₹{bill.discount}</Text>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>Delivery Fee</Text>
          {bill.deliveryFee === 0 ? (
            <View style={styles.freeDeliveryBadge}>
              {bill.itemTotal < FREE_DELIVERY_THRESHOLD && bill.appliedCouponCode === 'FREEDEL' && (
                <Text style={styles.strikethroughFee}>₹40</Text>
              )}
              <Text style={styles.freeText}>FREE</Text>
            </View>
          ) : (
            <Text style={styles.value}>₹{bill.deliveryFee}</Text>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.grandTotalRow}>
          <View>
            <Text style={styles.grandTotalLabel}>To Pay</Text>
            <Text style={styles.taxInclusiveNote}>(Inclusive of all taxes)</Text>
          </View>
          <Text style={styles.grandTotalValue}>₹{bill.grandTotal}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.placeOrderBtn, isPlacingOrder && styles.placeOrderBtnDisabled]}
        onPress={onPlaceOrder}
        disabled={isPlacingOrder || bill.itemTotal <= 0}
        accessibilityRole="button"
        accessibilityLabel={`Place Order for ₹${bill.grandTotal}`}
      >
        <Text style={styles.placeOrderBtnText}>
          {isPlacingOrder ? 'Processing...' : `Place Order • ₹${bill.grandTotal}`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  freeDelPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  promptIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  promptText: {
    fontSize: 12,
    color: '#92400E',
    flex: 1,
  },
  bold: {
    fontWeight: '700',
    color: '#78350F',
  },
  boldGreen: {
    fontWeight: '800',
    color: '#059669',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    color: '#475569',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  discountLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  discountLabel: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  couponTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  couponTagText: {
    fontSize: 10,
    color: '#166534',
    fontWeight: '700',
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  freeDeliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  strikethroughFee: {
    fontSize: 12,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  freeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  taxInclusiveNote: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0D9488',
  },
  placeOrderBtn: {
    backgroundColor: '#0D9488',
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    elevation: 3,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  placeOrderBtnDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  placeOrderBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
