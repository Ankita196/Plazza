import { CartItem, BillBreakdown } from '../types';
import { CouponRegistry } from './couponRules';

export const DELIVERY_FEE_AMOUNT = 40;
export const FREE_DELIVERY_THRESHOLD = 499;

export interface BillCalculationOptions {
  itemTotal: number;
  items: CartItem[];
  appliedCouponCode: string | null;
  isFirstOrder?: boolean;
}

export function calculateBill({
  itemTotal,
  items,
  appliedCouponCode,
  isFirstOrder = true,
}: BillCalculationOptions): BillBreakdown {
  if (itemTotal <= 0) {
    return {
      itemTotal: 0,
      discount: 0,
      deliveryFee: 0,
      grandTotal: 0,
      appliedCouponCode: null,
    };
  }

  // Delivery fee logic: ₹40 if strictly less than ₹499, otherwise free
  let baseDeliveryFee = itemTotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE_AMOUNT : 0;
  let discount = 0;
  let validatedCouponCode: string | null = null;

  if (appliedCouponCode) {
    const rule = CouponRegistry.getRule(appliedCouponCode);
    if (rule) {
      const validation = rule.validate({ itemTotal, items, isFirstOrder });
      if (validation.isValid) {
        validatedCouponCode = rule.code;

        // If coupon waives delivery fee (e.g. FREEDEL)
        if (rule.waivesDeliveryFee) {
          baseDeliveryFee = 0;
        }

        const calculatedDiscount = rule.calculateDiscount({
          itemTotal,
          deliveryFee: baseDeliveryFee,
          items,
        });

        // Spec Invariant: The Discount can never exceed the Item Total
        discount = Math.min(Math.max(0, calculatedDiscount), itemTotal);
      }
    }
  }

  const grandTotal = Math.max(0, itemTotal - discount + baseDeliveryFee);

  return {
    itemTotal,
    discount,
    deliveryFee: baseDeliveryFee,
    grandTotal,
    appliedCouponCode: validatedCouponCode,
  };
}
