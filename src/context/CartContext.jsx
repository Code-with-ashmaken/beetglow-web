import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { defaultVariant } from '../data/products';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = useCallback((product, variant, qty = 1) => {
    const v = variant ?? defaultVariant(product);
    const cartKey = `${product.id}::${v.id}`;
    setItems((prev) => {
      const i = prev.findIndex((x) => x.cartKey === cartKey);
      if (i === -1)
        return [
          ...prev,
          {
            cartKey,
            productId: product.id,
            id: product.id,
            name: product.name,
            variantId: v.id,
            variantLabel: v.label,
            price: v.price,
            priceDisplay: v.priceDisplay,
            image: product.image,
            qty,
          },
        ];
      const next = [...prev];
      next[i] = { ...next[i], qty: next[i].qty + qty };
      return next;
    });
  }, []);

  const removeItem = useCallback((cartKey) => {
    setItems((prev) => prev.filter((x) => x.cartKey !== cartKey));
  }, []);

  const setQty = useCallback((cartKey, qty) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((x) => x.cartKey !== cartKey);
      return prev.map((x) => (x.cartKey === cartKey ? { ...x, qty } : x));
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalQty = useMemo(
    () => items.reduce((s, x) => s + x.qty, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((s, x) => s + x.price * x.qty, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      setQty,
      clearCart,
      totalQty,
      subtotal,
    }),
    [items, addItem, removeItem, setQty, clearCart, totalQty, subtotal],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
