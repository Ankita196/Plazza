import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { BillBreakdown, ToastMessage } from '../types';
import { useCart } from './CartContext';
import { CouponRegistry } from '../services/couponRules';
import { calculateBill } from '../services/billCalculator';
import { StorageService } from '../services/storageService';

interface PromotionContextValue {
  appliedCouponCode: string | null;
  bill: BillBreakdown;
  toast: ToastMessage | null;
  isFirstOrder: boolean;
  applyCoupon: (code: string) => { success: boolean; reason?: string };
  removeCoupon: () => void;
  dismissToast: () => void;
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  placeOrder: () => Promise<boolean>;
}

const PromotionContext = createContext<PromotionContextValue | null>(null);

export const PromotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { items, itemTotal, clearCart } = useCart();
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [isFirstOrder, setIsFirstOrder] = useState<boolean>(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Check if FIRST100 has been used previously
  useEffect(() => {
    StorageService.isCouponUsed('FIRST100').then(isUsed => {
      setIsFirstOrder(!isUsed);
    });
  }, []);

  const showToast = useCallback(
    (title: string, message: string, type: ToastMessage['type'] = 'info') => {
      setToast({
        id: Date.now().toString(),
        title,
        message,
        type,
      });
    },
    [],
  );

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  // Previous item total and items to detect actual changes and avoid infinite loops
  const prevItemTotalRef = useRef(itemTotal);

  // SPEC REQUIREMENT: If the user alters the cart (e.g., removing an item) and the
  // cart no longer meets the coupon's criteria, the coupon must be auto-removed.
  // When this happens, trigger a toast notification explaining why.
  useEffect(() => {
    if (appliedCouponCode) {
      const rule = CouponRegistry.getRule(appliedCouponCode);
      if (rule) {
        const validation = rule.validate({ itemTotal, items, isFirstOrder });
        if (!validation.isValid) {
          // Auto-remove coupon
          setAppliedCouponCode(null);
          showToast(
            `Coupon ${rule.code} Removed`,
            validation.reason || `Cart criteria no longer met for ${rule.code}`,
            'warning',
          );
        }
      }
    }
    prevItemTotalRef.current = itemTotal;
  }, [itemTotal, items, appliedCouponCode, isFirstOrder, showToast]);

  const applyCoupon = useCallback(
    (rawCode: string) => {
      const code = rawCode.trim().toUpperCase();
      const rule = CouponRegistry.getRule(code);

      if (!rule) {
        showToast('Invalid Coupon', `Coupon code "${code}" is not recognized.`, 'error');
        return { success: false, reason: 'Invalid coupon code' };
      }

      const validation = rule.validate({ itemTotal, items, isFirstOrder });
      if (!validation.isValid) {
        showToast(
          'Coupon Not Applicable',
          validation.reason || `Criteria not met for ${rule.code}`,
          'warning',
        );
        return { success: false, reason: validation.reason };
      }

      setAppliedCouponCode(rule.code);
      showToast('Coupon Applied! 🎉', `${rule.code} applied successfully.`, 'success');
      return { success: true };
    },
    [itemTotal, items, isFirstOrder, showToast],
  );

  const removeCoupon = useCallback(() => {
    if (appliedCouponCode) {
      const oldCode = appliedCouponCode;
      setAppliedCouponCode(null);
      showToast('Coupon Removed', `${oldCode} has been removed from your cart.`, 'info');
    }
  }, [appliedCouponCode, showToast]);

  const placeOrder = useCallback(async () => {
    if (itemTotal <= 0) return false;

    // Record one-time coupon as used
    if (appliedCouponCode === 'FIRST100') {
      await StorageService.markCouponUsed('FIRST100');
      setIsFirstOrder(false);
    }

    const currentCoupon = appliedCouponCode;
    setAppliedCouponCode(null);
    await clearCart();

    showToast(
      'Order Placed! 🚀',
      `Your order is confirmed and delivering in 10 minutes.${
        currentCoupon ? ` (${currentCoupon} used)` : ''
      }`,
      'success',
    );
    return true;
  }, [itemTotal, appliedCouponCode, clearCart, showToast]);

  // Dynamic bill breakdown
  const bill = calculateBill({
    itemTotal,
    items,
    appliedCouponCode,
    isFirstOrder,
  });

  return (
    <PromotionContext.Provider
      value={{
        appliedCouponCode,
        bill,
        toast,
        isFirstOrder,
        applyCoupon,
        removeCoupon,
        dismissToast,
        showToast,
        placeOrder,
      }}
    >
      {children}
    </PromotionContext.Provider>
  );
};

export function usePromotion() {
  const context = useContext(PromotionContext);
  if (!context) {
    throw new Error('usePromotion must be used within a PromotionProvider');
  }
  return context;
}
