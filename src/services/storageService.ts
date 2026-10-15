import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '../types';

export const CURRENT_STORAGE_VERSION = 1;

export interface StorageEnvelope<T> {
  version: number;
  timestamp: number;
  data: T;
}

export const STORAGE_KEYS = {
  CART: '@plazza_cart_v1',
  RECENT_SEARCHES: '@plazza_recent_searches_v1',
  USED_COUPONS: '@plazza_used_coupons_v1',
} as const;

export const StorageService = {
  /**
   * Safely serializes and persists data with a versioned envelope
   */
  async setItem<T>(key: string, data: T): Promise<boolean> {
    try {
      const envelope: StorageEnvelope<T> = {
        version: CURRENT_STORAGE_VERSION,
        timestamp: Date.now(),
        data,
      };
      await AsyncStorage.setItem(key, JSON.stringify(envelope));
      return true;
    } catch (error) {
      console.warn(`[StorageService] Failed to set item for key "${key}":`, error);
      return false;
    }
  },

  /**
   * Robust reader: Handles missing keys, corrupt JSON, and unversioned/mismatched data
   * Never throws or crashes the app.
   */
  async getItem<T>(key: string, fallback: T): Promise<T> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) {
        return fallback;
      }

      const parsed = JSON.parse(raw);

      // Verify envelope shape and version
      if (
        parsed &&
        typeof parsed === 'object' &&
        'version' in parsed &&
        'data' in parsed
      ) {
        // Migration hook could be placed here if version changed
        if (parsed.version === CURRENT_STORAGE_VERSION) {
          return parsed.data as T;
        }
      }

      // If legacy or corrupted envelope, safely return fallback
      return fallback;
    } catch (error) {
      console.warn(`[StorageService] Corrupt or unparseable data for key "${key}", falling back:`, error);
      return fallback;
    }
  },

  /**
   * Cart persistence
   */
  async saveCart(cart: CartItem[]): Promise<boolean> {
    // Sanitize cart items before saving
    const validItems = Array.isArray(cart)
      ? cart.filter(
          item =>
            item &&
            item.medicine &&
            typeof item.medicine.id === 'string' &&
            typeof item.quantity === 'number' &&
            item.quantity > 0,
        )
      : [];
    return this.setItem<CartItem[]>(STORAGE_KEYS.CART, validItems);
  },

  async loadCart(): Promise<CartItem[]> {
    return this.getItem<CartItem[]>(STORAGE_KEYS.CART, []);
  },

  /**
   * Recent searches persistence (strictly capped at 5)
   */
  async saveRecentSearches(searches: string[]): Promise<boolean> {
    const sanitized = Array.isArray(searches)
      ? searches
          .filter(s => typeof s === 'string' && s.trim().length > 0)
          .slice(0, 5)
      : [];
    return this.setItem<string[]>(STORAGE_KEYS.RECENT_SEARCHES, sanitized);
  },

  async loadRecentSearches(): Promise<string[]> {
    return this.getItem<string[]>(STORAGE_KEYS.RECENT_SEARCHES, []);
  },

  /**
   * Used coupons persistence (e.g. FIRST100 one-time use)
   */
  async markCouponUsed(couponCode: string): Promise<boolean> {
    const used = await this.loadUsedCoupons();
    if (!used.includes(couponCode)) {
      used.push(couponCode);
      return this.setItem<string[]>(STORAGE_KEYS.USED_COUPONS, used);
    }
    return true;
  },

  async isCouponUsed(couponCode: string): Promise<boolean> {
    const used = await this.loadUsedCoupons();
    return used.includes(couponCode);
  },

  async loadUsedCoupons(): Promise<string[]> {
    return this.getItem<string[]>(STORAGE_KEYS.USED_COUPONS, []);
  },

  async clearCart(): Promise<boolean> {
    return this.saveCart([]);
  },
};
