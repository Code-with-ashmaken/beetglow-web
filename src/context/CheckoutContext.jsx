import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

/** @typedef {{ productId: string, name: string, variantId: string, variantLabel: string, qty: number, unitPrice: number, priceDisplay: string }} CheckoutLine */

const CheckoutContext = createContext(null);

export function CheckoutProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState(/** @type {CheckoutLine[]} */ ([]));

  const openCheckout = useCallback((/** @type {CheckoutLine[]} */ nextLines) => {
    setLines(nextLines);
    setOpen(true);
  }, []);

  const closeCheckout = useCallback(() => {
    setOpen(false);
    setLines([]);
  }, []);

  const value = useMemo(
    () => ({ open, lines, openCheckout, closeCheckout }),
    [open, lines, openCheckout, closeCheckout],
  );

  return (
    <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx)
    throw new Error('useCheckout must be used within CheckoutProvider');
  return ctx;
}
