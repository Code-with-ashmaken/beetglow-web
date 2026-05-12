export const DEFAULT_ANNOUNCEMENT =
  'Free shipping on prepaid orders Nationwide · COD available';

export const DEFAULT_THEME_COLOR = '#1B4332';

export const DEFAULT_ABOUT_STORY = `We started BeetGlow between humid Karachi summers and dry Lahore winter smog spells — bridging ancient Multani mitti rituals with nutrient-rich beetroot pigments that photograph beautifully without filters.

Every pouch is sifted finer than commercial cooking spice so masking never feels gritty. Our forest-green packaging pays homage to the Indus clay beds and Himalayan foothill farms partnering with Pakistani women-led co-ops wherever possible.`;

export const DEFAULT_SLIDES = [
  {
    id: 'beet-dual',
    title: 'From farm beetroot — to micron-fine BeetGlow powder',
    subtitle:
      'See the pigment-rich root next to lab-grade sieve — purity you can inspect.',
    layout: 'dual',
    leftImage:
      'https://images.unsplash.com/photo-1518977822532-9279dce6c6d4?w=1600&q=85&auto=format&fit=crop',
    rightImage:
      'https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=1600&q=85&auto=format&fit=crop',
    ctaLabel: 'Shop beetroot powders',
    ctaHref: '/#shop',
  },
  {
    id: 'multani-dual',
    title: 'Multani mineral bed — sifted finer than Fuller’s Earth folklore',
    subtitle:
      'Raw earthy stones meet cosmetic dust-light powder for PK humidity.',
    layout: 'dual',
    leftImage:
      'https://images.unsplash.com/photo-1578662996442-c48cdd17c9fb?w=1600&q=85&auto=format&fit=crop',
    rightImage:
      'https://images.unsplash.com/photo-1571875257727-256c39daae03?w=1600&q=85&auto=format&fit=crop',
    ctaLabel: 'Shop clay masks',
    ctaHref: '/#shop',
  },
  {
    id: 'lifestyle-mask',
    title: 'Morning ritual — luminous, soft-focus glow',
    subtitle:
      'BeetGlow is designed for masking nights that hydrate, never bleach.',
    layout: 'single',
    image:
      'https://images.unsplash.com/photo-1522335789203-abdffe003c8d?w=1920&q=85&auto=format&fit=crop',
    ctaLabel: 'Read reviews',
    ctaHref: '/#reviews',
  },
];

export const DEFAULT_HEADER = {
  logoType: 'image',
  logoText: 'BeetGlow',
  logoImage: '/beetglow-logo.svg',
  menuLinks: [
    { label: 'Home', to: '/', type: 'route' },
    { label: 'Shop', to: '/#shop', type: 'hash' },
    { label: 'About', to: '/about', type: 'route' },
    { label: 'Contact', to: '/contact', type: 'route' },
  ],
};

export const DEFAULT_FOOTER = {
  showQuickLinks: true,
  quickLinks: [
    { label: 'Shipping policy', to: '/shipping' },
    { label: 'FAQs', to: '/faqs' },
    { label: 'Privacy policy', to: '/privacy' },
    { label: 'Why BeetGlow', to: '/#benefits' },
    { label: 'Customer love', to: '/#reviews' },
  ],
  socials: [
    { platform: 'Facebook', url: 'https://www.facebook.com' },
    { platform: 'Instagram', url: 'https://www.instagram.com' },
    { platform: 'TikTok', url: 'https://www.tiktok.com' },
    { platform: 'WhatsApp', url: 'https://wa.me/923001234567' },
  ],
  copyrightText:
    '© {year} BeetGlow. Organic Skin Care. Lahore ♥ Karachi.',
};

export const DEFAULT_HOME_SECTIONS = [
  { id: 'hero', type: 'hero', label: 'Hero Slider', enabled: true },
  { id: 'products', type: 'products', label: 'Products', enabled: true },
  { id: 'benefits', type: 'benefits', label: 'Benefits', enabled: true },
  { id: 'routine', type: 'routine', label: 'Skin Care Routine', enabled: true },
  { id: 'testimonials', type: 'testimonials', label: 'Testimonials', enabled: true },
  { id: 'reviews', type: 'reviews', label: 'Customer Reviews', enabled: true },
];

export const DEFAULT_BENEFITS = [
  {
    icon: 'Leaf',
    title: '100% Organic focus',
    text: 'Cold-chain inspired sourcing ideals with lab-screened powders — no fillers listed on-pack.',
  },
  {
    icon: 'Droplets',
    title: 'Deep cleansing clay',
    text: 'Multani profiles tuned for pore clarity without stripping Karachi heat skin.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Chemical-lite philosophy',
    text: 'No synthetic dyes in our powders — earthy colour tells the QC story.',
  },
  {
    icon: 'Sparkles',
    title: 'Glow layering',
    text: 'Stack beet antioxidants with hydrating toners SPF mornings your friends notice.',
  },
];

export const DEFAULT_TESTIMONIALS = [
  {
    name: 'Ayesha Malik',
    detail: 'DHA Phase 8, Lahore',
    quote:
      'Mera T-zone Karachi ki garmi mai control ho gaya after Multani 100g — courier 3 din mai DHA pohanch gaya COD.',
    stars: 5,
  },
  {
    name: 'Fatima Rizvi',
    detail: 'Clifton Block 4',
    quote:
      'Beetroot powder mix rose water glow deta hai shaadi pics mai — no itch like random Instagram brands.',
    stars: 5,
  },
  {
    name: 'Hira Siddiqui',
    detail: 'F-11, Islamabad',
    quote:
      'Twin cities college routine ke liye 50g travel sizes perfect — WhatsApp pai tracking clear milti.',
    stars: 5,
  },
];
