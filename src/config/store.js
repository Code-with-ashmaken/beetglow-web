/**
 * BeetGlow — edit store settings (catalog: src/data/products.js)
 */
export const STORE_NAME = 'BeetGlow';

export const STORE_TAGLINE = 'Organic Skin Care';

/** WhatsApp: digits only with country code, no + */
export const WHATSAPP_PHONE = '923001234567';

/** Public contact email (shown in header + footer) */
export const CONTACT_EMAIL = 'hello@beetglow.pk';

/** Editable social & contact URLs */
export const SOCIAL = {
  facebook: 'https://www.facebook.com',
  instagram: 'https://www.instagram.com',
  tiktok: 'https://www.tiktok.com',
  whatsapp: `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hi BeetGlow, I want to know more about your skincare.')}`,
  mailto: `mailto:${CONTACT_EMAIL}`,
};

export const CURRENCY = 'PKR';

export const FB_PIXEL_ID = process.env.REACT_APP_FB_PIXEL_ID || '';

export const ADMIN_PASSWORD =
  process.env.REACT_APP_ADMIN_PASSWORD || 'beetglow-admin';
