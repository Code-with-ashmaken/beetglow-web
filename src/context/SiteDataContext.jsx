import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { products as defaultProducts } from '../data/products';
import { DEFAULT_THEME_COLOR } from '../data/siteDefaults';
import { DEFAULT_SITE_CONFIG } from '../data/siteConfig';

const PRODUCTS_KEY = 'beetglow_products';
const SETTINGS_KEY = 'beetglow_store_settings';
const LEADS_KEY = 'beetglow_orders';
const EVENT_ORDERS_UPDATED = 'beetglow:orders-updated';

const SiteDataContext = createContext(null);

function safeParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function toSlug(label) {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normaliseVariant(variant, index) {
  const price = Number(variant.price) || 0;
  const label = variant.label || variant.id || `Pack ${index + 1}`;
  return {
    id: variant.id || `${index + 1}`,
    label,
    price,
    priceDisplay: `Rs ${price.toLocaleString()}`,
  };
}

function normaliseProduct(item) {
  const variants = Array.isArray(item.variants)
    ? item.variants.map(normaliseVariant)
    : [];
  return {
    ...item,
    id: item.id || toSlug(item.name || `product-${Date.now()}`),
    variants,
    defaultVariantIndex:
      typeof item.defaultVariantIndex === 'number' ? item.defaultVariantIndex : 0,
    stockStatus: item.stockStatus || 'In Stock',
  };
}

function getDefaultSettings() {
  return clone(DEFAULT_SITE_CONFIG);
}

function getInitialProducts() {
  const stored = safeParse(localStorage.getItem(PRODUCTS_KEY), null);
  if (!stored) return clone(defaultProducts).map(normaliseProduct);
  return clone(stored).map(normaliseProduct);
}

function getInitialSettings() {
  const stored = safeParse(localStorage.getItem(SETTINGS_KEY), null);
  const defaults = getDefaultSettings();
  const merged = {
    ...defaults,
    ...(stored || {}),
  };
  return {
    ...merged,
    header: { ...defaults.header, ...(stored?.header || {}) },
    footer: { ...defaults.footer, ...(stored?.footer || {}) },
    homeSections:
      Array.isArray(stored?.homeSections) && stored.homeSections.length
        ? stored.homeSections
        : defaults.homeSections,
    sliderSlides:
      Array.isArray(stored?.sliderSlides) && stored.sliderSlides.length
        ? stored.sliderSlides
        : defaults.sliderSlides,
    benefits:
      Array.isArray(stored?.benefits) && stored.benefits.length
        ? stored.benefits
        : defaults.benefits,
    testimonials:
      Array.isArray(stored?.testimonials) && stored.testimonials.length
        ? stored.testimonials
        : defaults.testimonials,
    reviews:
      Array.isArray(stored?.reviews) ? stored.reviews : [],
  };
}

function getInitialOrders() {
  const orders = safeParse(localStorage.getItem(LEADS_KEY), []);
  if (!Array.isArray(orders)) return [];
  return orders.map((order, index) => ({
    ...order,
    id: order.id || `legacy-order-${index}-${order.at || Date.now()}`,
    status: order.status || 'Pending',
  }));
}

function applyThemeColor(themeColor) {
  const styleId = 'beetglow-theme-overrides';
  const css = `
  :root {
    --beetglow-primary: ${themeColor};
    --beetglow-primary-dark: color-mix(in srgb, ${themeColor} 68%, black);
    --beetglow-primary-soft: color-mix(in srgb, ${themeColor} 15%, white);
    --beetglow-primary-muted: color-mix(in srgb, ${themeColor} 8%, white);
  }
  .bg-brand, .bg-brand\\/92 { background-color: var(--beetglow-primary) !important; }
  .bg-brand-dark, .hover\\:bg-brand-dark:hover { background-color: var(--beetglow-primary-dark) !important; }
  .bg-brand-soft { background-color: var(--beetglow-primary-soft) !important; }
  .bg-brand-muted { background-color: var(--beetglow-primary-muted) !important; }
  .text-brand { color: var(--beetglow-primary) !important; }
  .border-brand, .ring-brand, .focus\\:border-brand:focus { border-color: var(--beetglow-primary) !important; }
  .hover\\:text-brand:hover { color: var(--beetglow-primary) !important; }
  .focus\\:ring-brand\\/20:focus, .focus\\:ring-brand\\/25:focus { --tw-ring-color: color-mix(in srgb, var(--beetglow-primary) 25%, transparent) !important; }
  `;
  let node = document.getElementById(styleId);
  if (!node) {
    node = document.createElement('style');
    node.id = styleId;
    document.head.appendChild(node);
  }
  node.textContent = css;
}

export function SiteDataProvider({ children }) {
  const [products, setProducts] = useState(getInitialProducts);
  const [settings, setSettings] = useState(getInitialSettings);
  const [orders, setOrders] = useState(getInitialOrders);

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    applyThemeColor(settings.themeColor || DEFAULT_THEME_COLOR);
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(LEADS_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    const onOrdersUpdated = () => setOrders(getInitialOrders());
    const onStorage = (event) => {
      if (!event.key) return;
      if (event.key === LEADS_KEY) setOrders(getInitialOrders());
      if (event.key === PRODUCTS_KEY) setProducts(getInitialProducts());
      if (event.key === SETTINGS_KEY) setSettings(getInitialSettings());
    };
    window.addEventListener(EVENT_ORDERS_UPDATED, onOrdersUpdated);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(EVENT_ORDERS_UPDATED, onOrdersUpdated);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const value = useMemo(
    () => ({
      products,
      setProducts,
      settings,
      setSettings,
      orders,
      setOrders,
    }),
    [products, settings, orders],
  );

  return (
    <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error('useSiteData must be used within SiteDataProvider');
  return ctx;
}
