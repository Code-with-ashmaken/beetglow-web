import { CURRENCY } from '../config/store';

function fbqReady() {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
}

export function trackViewContent(product, value) {
  if (!fbqReady()) return;
  const numericValue = typeof value === 'number' ? value : 0;
  window.fbq('track', 'ViewContent', {
    content_ids: [String(product.id)],
    content_name: product.name,
    content_type: 'product',
    value: numericValue,
    currency: CURRENCY,
  });
}

export function trackAddToCart(product, quantity = 1, unitPrice = 0) {
  if (!fbqReady()) return;
  window.fbq('track', 'AddToCart', {
    content_ids: [String(product.id)],
    content_name: product.name,
    content_type: 'product',
    value: unitPrice * quantity,
    currency: CURRENCY,
  });
}

/** Checkout intent */
export function trackInitiateCheckout(value, contentIds = []) {
  if (!fbqReady()) return;
  window.fbq('track', 'InitiateCheckout', {
    value,
    currency: CURRENCY,
    content_ids: contentIds.map(String),
    num_items: contentIds.length || 1,
  });
}
