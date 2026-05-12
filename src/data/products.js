/**
 * BeetGlow catalog — edit prices, images, ingredients here.
 */

const WEIGHT_VARIANTS_STANDARD = [
  { id: '50g', label: '50 g', price: 749, priceDisplay: 'Rs 749' },
  { id: '100g', label: '100 g', price: 1399, priceDisplay: 'Rs 1,399' },
  { id: '250g', label: '250 g', price: 2899, priceDisplay: 'Rs 2,899' },
];

const WEIGHT_VARIANTS_PREMIUM = [
  { id: '50g', label: '50 g', price: 849, priceDisplay: 'Rs 849' },
  { id: '100g', label: '100 g', price: 1599, priceDisplay: 'Rs 1,599' },
  { id: '250g', label: '250 g', price: 3299, priceDisplay: 'Rs 3,299' },
];

const WEIGHT_BLEND = [
  { id: '50g', label: '50 g', price: 999, priceDisplay: 'Rs 999' },
  { id: '100g', label: '100 g', price: 1899, priceDisplay: 'Rs 1,899' },
  { id: '250g', label: '250 g', price: 3999, priceDisplay: 'Rs 3,999' },
];

export const products = [
  {
    id: 'organic-beetroot-powder',
    name: 'Organic Beetroot Powder',
    badge: 'Flagship',
    shortDescription:
      'Micro-milled beetroot for DIY masks — antioxidant blush-toned radiance.',
    description:
      'Our Organic Beetroot Powder is sun-dried, stone-ground, and sieved fine for silky mixing with rose water or plain yoghurt. Packed with natural betacyanins, it pairs beautifully into your weekly glow ritual without synthetic dyes.',
    ingredients:
      '100% Beta vulgaris (beetroot) root powder — food-grade organic source, silica-free milling.',
    usage:
      'Patch test behind the ear. Mix ½–1 tsp with rose water until smooth; apply evenly for 8–12 minutes — never bone-dry — then rinse lukewarm. Use 2–3× weekly. Follow SPF in AM.',
    image:
      'https://images.unsplash.com/photo-1510626176961-3b063d02d74b?w=900&q=85&auto=format&fit=crop',
    imageSecondary:
      'https://images.unsplash.com/photo-1563565375-f00305b759e7?w=900&q=85&auto=format&fit=crop',
    variants: WEIGHT_VARIANTS_STANDARD,
    defaultVariantIndex: 1,
  },
  {
    id: 'pure-multani-mud',
    name: "Pure Multani Mud (Fuller's Earth)",
    badge: 'Detox Hero',
    shortDescription:
      'Clay-grade Multani Mitti for shine control — tightens pores the natural way.',
    description:
      "Authentic Fuller's Earth from trusted mineral beds, triple-cleaned for cosmetic use. Ideal for Karachi–Lahore humidity swings when skin runs oily.",
    ingredients:
      "Naturally occurring aluminosilicate clay (Multani Mitti); no perfumes or artificial colours.",
    usage:
      'Blend with rose water into a yoghurt-thick paste. Apply T-zone first; widen if needed — 10–14 minutes max. Moisturise after. Sensitive skin: start with cheeks only.',
    image:
      'https://images.unsplash.com/photo-1647545715856-983b7bbea8e4?w=900&q=85&auto=format&fit=crop',
    imageSecondary:
      'https://images.unsplash.com/photo-1631515243349-ebcb06b086a5?w=900&q=85&auto=format&fit=crop',
    variants: WEIGHT_VARIANTS_STANDARD,
    defaultVariantIndex: 1,
  },
  {
    id: 'beet-multani-mask-blend',
    name: 'BeetGlow Clay & Beet Mask Blend',
    badge: 'Bestseller',
    shortDescription:
      'Pre-balanced beet actives plus Multani clay — salon-style glow home.',
    description:
      'Our lab-style ratio keeps beet chemistry bright while clay draws excess oil. Best for combination skin juggling glow with clarity.',
    ingredients:
      'Organic beetroot powder, cosmetic-grade Multani mud, colloidal oat ( soothing buffer ).',
    usage:
      'Use evening only unless following strict SPF routine. Thin layer weekly; hydrate generously after rinse.',
    image:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=900&q=85&auto=format&fit=crop',
    imageSecondary:
      'https://images.unsplash.com/photo-1556228841-a3c527cb84f9?w=900&q=85&auto=format&fit=crop',
    variants: WEIGHT_BLEND,
    defaultVariantIndex: 1,
  },
  {
    id: 'minimal-routine-duo',
    name: 'Minimal Routine Duo',
    badge: 'Save more',
    shortDescription:
      'Beetroot powder + Multani mud travel pouches — your AM/PM masking rotation.',
    description:
      'Two companion jars formulated for BeetGlow starters: alternate beet nights with clay detox nights for disciplined texture improvement.',
    ingredients:
      'As per Organic Beetroot Powder + Pure Multani Mud individual listings.',
    usage:
      'Alternate nights beet vs clay masks; moisturise nightly. One rest day weekly.',
    image:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900&q=85&auto=format&fit=crop',
    imageSecondary:
      'https://images.unsplash.com/photo-1598440947619-c60843fabf45?w=900&q=85&auto=format&fit=crop',
    variants: WEIGHT_VARIANTS_PREMIUM,
    defaultVariantIndex: 2,
  },
];

export function getProductById(id) {
  return products.find((p) => p.id === id);
}

export function defaultVariant(product) {
  const i =
    typeof product.defaultVariantIndex === 'number'
      ? product.defaultVariantIndex
      : Math.min(1, product.variants.length - 1);
  return product.variants[i] ?? product.variants[0];
}

export function variantById(product, variantId) {
  return (
    product.variants.find((v) => v.id === variantId) ?? defaultVariant(product)
  );
}
