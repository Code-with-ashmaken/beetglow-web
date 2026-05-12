import { WHATSAPP_PHONE } from '../config/store';

const BRAND = 'BeetGlow';

export function buildGeneralOrderWhatsAppUrl() {
  const text = `Hi ${BRAND}, I want to place an order with you.`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

export function buildCartWhatsAppUrl(items) {
  const lines = items
    .map(
      (i) =>
        `${i.name} (${i.variantLabel}) × ${i.qty} — ${i.priceDisplay} each`,
    )
    .join('\n');
  const text = `Hi ${BRAND},\n\nI'd like to order:\n\n${lines}\n\nPlease confirm totals. Thank you.`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}
