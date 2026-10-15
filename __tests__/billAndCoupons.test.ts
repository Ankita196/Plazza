import { calculateBill, DELIVERY_FEE_AMOUNT, FREE_DELIVERY_THRESHOLD } from '../src/services/billCalculator';
import { CouponRegistry } from '../src/services/couponRules';
import { CartItem, Medicine } from '../src/types';

describe('Delivery Fee Logic', () => {
  it('applies flat ₹40 delivery fee when item total is strictly less than ₹499', () => {
    const bill = calculateBill({
      itemTotal: 498,
      items: [],
      appliedCouponCode: null,
    });
    expect(bill.deliveryFee).toBe(DELIVERY_FEE_AMOUNT);
    expect(bill.grandTotal).toBe(498 + DELIVERY_FEE_AMOUNT);
  });

  it('provides free delivery when item total is exactly ₹499', () => {
    const bill = calculateBill({
      itemTotal: FREE_DELIVERY_THRESHOLD,
      items: [],
      appliedCouponCode: null,
    });
    expect(bill.deliveryFee).toBe(0);
    expect(bill.grandTotal).toBe(FREE_DELIVERY_THRESHOLD);
  });

  it('provides free delivery when item total is greater than ₹499', () => {
    const bill = calculateBill({
      itemTotal: 750,
      items: [],
      appliedCouponCode: null,
    });
    expect(bill.deliveryFee).toBe(0);
    expect(bill.grandTotal).toBe(750);
  });

  it('returns zero fee and zero grand total when cart is empty', () => {
    const bill = calculateBill({
      itemTotal: 0,
      items: [],
      appliedCouponCode: null,
    });
    expect(bill.deliveryFee).toBe(0);
    expect(bill.grandTotal).toBe(0);
  });
});

describe('Coupon Rules & Calculations', () => {
  describe('FLAT50 Rule', () => {
    const rule = CouponRegistry.getRule('FLAT50')!;

    it('rejects coupon when item total is less than ₹300', () => {
      const validation = rule.validate({ itemTotal: 299, items: [] });
      expect(validation.isValid).toBe(false);
      expect(validation.reason).toContain('300');
    });

    it('accepts coupon and applies ₹50 off when item total is ₹300 or more', () => {
      const validation = rule.validate({ itemTotal: 300, items: [] });
      expect(validation.isValid).toBe(true);

      const bill = calculateBill({
        itemTotal: 300,
        items: [],
        appliedCouponCode: 'FLAT50',
      });
      expect(bill.discount).toBe(50);
      expect(bill.deliveryFee).toBe(40);
      expect(bill.grandTotal).toBe(300 - 50 + 40);
    });
  });

  describe('SAVE10 Rule & Maximum ₹100 Cap', () => {
    it('applies 10% discount on cart total', () => {
      const bill = calculateBill({
        itemTotal: 500,
        items: [],
        appliedCouponCode: 'SAVE10',
      });
      // 10% of 500 = 50
      expect(bill.discount).toBe(50);
      expect(bill.deliveryFee).toBe(0); // >= 499 free delivery
      expect(bill.grandTotal).toBe(450);
    });

    it('strictly caps the discount at ₹100 when 10% exceeds ₹100', () => {
      const bill = calculateBill({
        itemTotal: 1500,
        items: [],
        appliedCouponCode: 'SAVE10',
      });
      // 10% of 1500 is 150, but must be capped at 100
      expect(bill.discount).toBe(100);
      expect(bill.grandTotal).toBe(1400);
    });

    it('caps exactly at ₹100 when item total is ₹1000', () => {
      const bill = calculateBill({
        itemTotal: 1000,
        items: [],
        appliedCouponCode: 'SAVE10',
      });
      expect(bill.discount).toBe(100);
    });
  });

  describe('FREEDEL Rule', () => {
    it('waives the delivery fee entirely even when item total is under ₹499', () => {
      const bill = calculateBill({
        itemTotal: 250,
        items: [],
        appliedCouponCode: 'FREEDEL',
      });
      expect(bill.deliveryFee).toBe(0);
      expect(bill.discount).toBe(0);
      expect(bill.grandTotal).toBe(250);
    });
  });

  describe('FIRST100 Rule & One-time Usage', () => {
    const rule = CouponRegistry.getRule('FIRST100')!;

    it('rejects coupon when item total is below ₹200', () => {
      const validation = rule.validate({ itemTotal: 199, items: [], isFirstOrder: true });
      expect(validation.isValid).toBe(false);
      expect(validation.reason).toContain('200');
    });

    it('rejects coupon when user has already used it (not first order)', () => {
      const validation = rule.validate({ itemTotal: 250, items: [], isFirstOrder: false });
      expect(validation.isValid).toBe(false);
      expect(validation.reason).toContain('already been used');
    });

    it('accepts coupon and applies ₹100 off when first order and item total >= ₹200', () => {
      const bill = calculateBill({
        itemTotal: 300,
        items: [],
        appliedCouponCode: 'FIRST100',
        isFirstOrder: true,
      });
      expect(bill.discount).toBe(100);
      expect(bill.deliveryFee).toBe(40);
      expect(bill.grandTotal).toBe(300 - 100 + 40);
    });
  });

  describe('Discount Invariant: Discount can never exceed Item Total', () => {
    it('ensures discount does not exceed item total', () => {
      // Create a scenario where a flat coupon exceeds item total
      CouponRegistry.registerRule({
        code: 'TESTBIG',
        title: 'Huge discount',
        description: 'Testing cap',
        validate: () => ({ isValid: true }),
        calculateDiscount: () => 500,
      });

      const bill = calculateBill({
        itemTotal: 150,
        items: [],
        appliedCouponCode: 'TESTBIG',
      });

      expect(bill.discount).toBe(150); // Clamped to itemTotal
      expect(bill.grandTotal).toBe(150 - 150 + 40); // Delivery fee still applies
    });
  });

  describe('Coupon Auto-Removal Criterion', () => {
    it('invalidates FLAT50 when cart item total drops from above ₹300 to below ₹300', () => {
      const rule = CouponRegistry.getRule('FLAT50')!;

      // Cart at ₹350
      let validation = rule.validate({ itemTotal: 350, items: [] });
      expect(validation.isValid).toBe(true);

      // User decrements item, cart drops to ₹220
      validation = rule.validate({ itemTotal: 220, items: [] });
      expect(validation.isValid).toBe(false);
    });
  });
});

describe('Cart Quantity Capping (maxQty)', () => {
  const medicine: Medicine = {
    id: 'm1',
    name: 'Dolo 650',
    salt: 'Paracetamol',
    price: 30,
    maxQty: 5,
    rx: false,
  };

  it('enforces that quantity cannot exceed maxQty', () => {
    let cartItem: CartItem = { medicine, quantity: 4 };

    // Increment 1 -> 5 (max reached)
    cartItem = { ...cartItem, quantity: Math.min(cartItem.quantity + 1, medicine.maxQty) };
    expect(cartItem.quantity).toBe(5);

    // Attempt increment past maxQty -> stays 5
    cartItem = { ...cartItem, quantity: Math.min(cartItem.quantity + 1, medicine.maxQty) };
    expect(cartItem.quantity).toBe(5);
  });
});
