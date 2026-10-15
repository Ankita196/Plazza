export interface Medicine {
  id: string;
  name: string;
  salt: string;
  price: number;
  maxQty: number;
  rx: boolean;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export type PermissionStatus = 'granted' | 'denied' | 'blocked' | 'checking';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface PermissionsState {
  location: PermissionStatus;
  notification: PermissionStatus;
  coordinates: LocationCoordinates | null;
}

export type CouponCode = 'FLAT50' | 'SAVE10' | 'FREEDEL' | 'FIRST100';

export interface CouponValidationContext {
  itemTotal: number;
  items: CartItem[];
  isFirstOrder?: boolean;
}

export interface CouponCalculationContext {
  itemTotal: number;
  deliveryFee: number;
  items: CartItem[];
}

export interface CouponRule {
  code: CouponCode | string;
  title: string;
  description: string;
  validate: (context: CouponValidationContext) => { isValid: boolean; reason?: string };
  calculateDiscount: (context: CouponCalculationContext) => number;
  waivesDeliveryFee?: boolean;
}

export interface BillBreakdown {
  itemTotal: number;
  discount: number;
  deliveryFee: number;
  grandTotal: number;
  appliedCouponCode: string | null;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
}
