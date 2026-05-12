export const defaultBusinessSettings = {
  sender: {
    name: 'BeetGlow',
    address: '123 Business Avenue, Commercial District',
    phone: '+92 300 1234567',
    email: 'info@beetglow.com'
  },
  delivery: {
    charge: 250,
    description: 'Standard Delivery'
  },
  invoice: {
    prefix: 'BG',
    startNumber: 1,
    currentYear: new Date().getFullYear()
  },
  metaPixelId: ''
};

export const getBusinessSettings = () => {
  const saved = localStorage.getItem('businessSettings');
  return saved ? JSON.parse(saved) : defaultBusinessSettings;
};

export const saveBusinessSettings = (settings) => {
  localStorage.setItem('businessSettings', JSON.stringify(settings));
};

export const generateInvoiceId = () => {
  const settings = getBusinessSettings();
  const currentOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  const orderCount = currentOrders.length + settings.invoice.startNumber;
  return `${settings.invoice.prefix}-${settings.invoice.currentYear}-${orderCount.toString().padStart(3, '0')}`;
};
