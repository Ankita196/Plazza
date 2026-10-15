import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Medicine, CartItem } from '../types';
import { StorageService } from '../services/storageService';

interface CartContextValue {
  items: CartItem[];
  itemTotal: number;
  totalItemCount: number;
  cartQuantities: Record<string, number>;
  isRestored: boolean;
  addToCart: (medicine: Medicine) => void;
  increment: (medicineId: string) => void;
  decrement: (medicineId: string) => void;
  removeItem: (medicineId: string) => void;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isRestored, setIsRestored] = useState(false);

  // Restore cart on mount
  useEffect(() => {
    StorageService.loadCart().then(restoredItems => {
      setItems(restoredItems);
      setIsRestored(true);
    });
  }, []);

  // Persist cart whenever it changes (after initial restoration)
  const updateItems = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    StorageService.saveCart(newItems);
  }, []);

  const addToCart = useCallback(
    (medicine: Medicine) => {
      setItems(prev => {
        const existingIndex = prev.findIndex(item => item.medicine.id === medicine.id);
        let next: CartItem[];

        if (existingIndex >= 0) {
          const current = prev[existingIndex];
          if (current.quantity >= medicine.maxQty) {
            // Already capped by maxQty
            return prev;
          }
          next = [...prev];
          next[existingIndex] = {
            ...current,
            quantity: Math.min(current.quantity + 1, medicine.maxQty),
          };
        } else {
          next = [...prev, { medicine, quantity: 1 }];
        }

        StorageService.saveCart(next);
        return next;
      });
    },
    [],
  );

  const increment = useCallback((medicineId: string) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.medicine.id === medicineId);
      if (existingIndex < 0) return prev;

      const current = prev[existingIndex];
      if (current.quantity >= current.medicine.maxQty) {
        return prev;
      }

      const next = [...prev];
      next[existingIndex] = {
        ...current,
        quantity: current.quantity + 1,
      };

      StorageService.saveCart(next);
      return next;
    });
  }, []);

  const decrement = useCallback((medicineId: string) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.medicine.id === medicineId);
      if (existingIndex < 0) return prev;

      const current = prev[existingIndex];
      let next: CartItem[];

      if (current.quantity <= 1) {
        // Remove item from cart
        next = prev.filter(item => item.medicine.id !== medicineId);
      } else {
        next = [...prev];
        next[existingIndex] = {
          ...current,
          quantity: current.quantity - 1,
        };
      }

      StorageService.saveCart(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((medicineId: string) => {
    setItems(prev => {
      const next = prev.filter(item => item.medicine.id !== medicineId);
      StorageService.saveCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(async () => {
    setItems([]);
    await StorageService.clearCart();
  }, []);

  const itemTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0);
  }, [items]);

  const totalItemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const cartQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of items) {
      map[item.medicine.id] = item.quantity;
    }
    return map;
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        itemTotal,
        totalItemCount,
        cartQuantities,
        isRestored,
        addToCart,
        increment,
        decrement,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
