import { CouponRule, CouponValidationContext, CouponCalculationContext } from '../types';

/**
 * Pluggable Coupon Rules Architecture:
 * To add a new coupon in the future (or during live extension exercises),
 * simply add a new CouponRule entry to COUPON_REGISTRY or call registerCouponRule().
 * Neither cart management nor bill calculation code ever needs to be modified.
 */

export const COUPON_RULES: Record<string, CouponRule> = {
  FLAT50: {
    code: 'FLAT50',
    title: '₹50 Flat Discount',
    description: 'Flat ₹50 off on orders with item total ₹300 or more',
    validate: (context: CouponValidationContext) => {
      if (context.itemTotal < 300) {
        return {
          isValid: false,
          reason: `Requires minimum item total of ₹300 (current: ₹${context.itemTotal})`,
        };
      }
      return { isValid: true };
    },
    calculateDiscount: () => 50,
  },

  SAVE10: {
    code: 'SAVE10',
    title: '10% Off Cart',
    description: 'Get 10% discount on cart total up to a maximum of ₹100',
    validate: (context: CouponValidationContext) => {
      if (context.itemTotal <= 0) {
        return { isValid: false, reason: 'Cart is empty' };
      }
      return { isValid: true };
    },
    calculateDiscount: (context: CouponCalculationContext) => {
      const tenPercent = Math.round(context.itemTotal * 0.1);
      return Math.min(tenPercent, 100); // Strict ₹100 cap
    },
  },

  FREEDEL: {
    code: 'FREEDEL',
    title: 'Free Delivery',
    description: 'Waives the delivery fee completely regardless of item total',
    waivesDeliveryFee: true,
    validate: (context: CouponValidationContext) => {
      if (context.itemTotal <= 0) {
        return { isValid: false, reason: 'Cart is empty' };
      }
      return { isValid: true };
    },
    calculateDiscount: () => 0,
  },

  FIRST100: {
    code: 'FIRST100',
    title: '₹100 First Order Discount',
    description: 'Flat ₹100 off on first order with item total ₹200 or more',
    validate: (context: CouponValidationContext) => {
      if (!context.isFirstOrder) {
        return {
          isValid: false,
          reason: 'Coupon FIRST100 has already been used for this account',
        };
      }
      if (context.itemTotal < 200) {
        return {
          isValid: false,
          reason: `Requires minimum item total of ₹200 (current: ₹${context.itemTotal})`,
        };
      }
      return { isValid: true };
    },
    calculateDiscount: () => 100,
  },
};

export const CouponRegistry = {
  getRule(code: string): CouponRule | undefined {
    return COUPON_RULES[code.trim().toUpperCase()];
  },

  getAllRules(): CouponRule[] {
    return Object.values(COUPON_RULES);
  },

  registerRule(rule: CouponRule): void {
    COUPON_RULES[rule.code.toUpperCase()] = rule;
  },
};
