import { defaultVariant } from '../data/products';

export function checkoutLineFromProduct(product, variant, qty) {
  const v = variant ?? defaultVariant(product);
  return {
    productId: product.id,
    name: product.name,
    variantId: v.id,
    variantLabel: v.label,
    qty: Math.max(1, Number(qty) || 1),
    unitPrice: v.price,
    priceDisplay: v.priceDisplay,
  };
}

export function checkoutLineTotal(line) {
  return line.unitPrice * line.qty;
}

export function checkoutOrderTotal(lines) {
  return lines.reduce((sum, l) => sum + checkoutLineTotal(l), 0);
}
