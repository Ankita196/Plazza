import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { usePromotion } from '../context/PromotionContext';
import { CartItemCard } from '../components/CartItemCard';
import { CouponSection } from '../components/CouponSection';
import { BillBreakdownView } from '../components/BillBreakdownView';
import { Colors } from '../theme';

interface Props {
  onNavigateToHome: () => void;
}

export const CartScreen: React.FC<Props> = ({ onNavigateToHome }) => {
  const {
    items,
    itemTotal,
    totalItemCount,
    increment,
    decrement,
    removeItem,
    clearCart,
  } = useCart();

  const {
    appliedCouponCode,
    bill,
    isFirstOrder,
    applyCoupon,
    removeCoupon,
    placeOrder,
  } = usePromotion();

  const hasRxItem = items.some(item => item.medicine.rx);

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer} accessibilityRole="text">
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>
          Explore our medicine catalog and add required medicines to your cart.
        </Text>
        <TouchableOpacity
          style={styles.exploreBtn}
          onPress={onNavigateToHome}
          accessibilityRole="button"
          accessibilityLabel="Browse medicines on Home tab"
        >
          <Text style={styles.exploreBtnText}>Browse Medicines</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.headerTitle}>Order Summary</Text>
          <Text style={styles.headerSubtitle}>
            {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} in your basket
          </Text>
        </View>
        <TouchableOpacity
          onPress={clearCart}
          accessibilityRole="button"
          accessibilityLabel="Clear all items in cart"
        >
          <Text style={styles.clearCartText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Prescription Notice if Rx items exist */}
      {hasRxItem && (
        <View style={styles.rxNotice} accessibilityRole="alert">
          <Text style={styles.rxNoticeIcon}>📋</Text>
          <View style={styles.rxNoticeTextCol}>
            <Text style={styles.rxNoticeTitle}>Contains Prescription (Rx) Items</Text>
            <Text style={styles.rxNoticeDesc}>
              A pharmacist may review your items during order fulfillment.
            </Text>
          </View>
        </View>
      )}

      {/* Cart Items List */}
      <View style={styles.itemsSection}>
        {items.map(item => (
          <CartItemCard
            key={item.medicine.id}
            item={item}
            onIncrement={increment}
            onDecrement={decrement}
            onRemove={removeItem}
          />
        ))}
      </View>

      {/* Coupon Application Section */}
      <CouponSection
        appliedCouponCode={appliedCouponCode}
        itemTotal={itemTotal}
        isFirstOrder={isFirstOrder}
        onApplyCoupon={applyCoupon}
        onRemoveCoupon={removeCoupon}
      />

      {/* Bill Breakdown & Place Order */}
      <BillBreakdownView bill={bill} onPlaceOrder={placeOrder} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  clearCartText: {
    fontSize: 13,
    color: Colors.danger,
    fontWeight: '700',
  },
  rxNotice: {
    flexDirection: 'row',
    backgroundColor: Colors.infoLight,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  rxNoticeIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  rxNoticeTextCol: {
    flex: 1,
  },
  rxNoticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  rxNoticeDesc: {
    fontSize: 11,
    color: Colors.info,
    marginTop: 2,
  },
  itemsSection: {
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 280,
  },
  exploreBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    minHeight: 48,
    justifyContent: 'center',
  },
  exploreBtnText: {
    color: Colors.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
});
