import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import HeaderTopBar from '../components/HeaderTopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import CheckoutModal from '../components/CheckoutModal';
import LeadCaptureModal from '../components/LeadCaptureModal';
import WhatsAppFab from '../components/WhatsAppFab';
import { useCart } from '../context/CartContext';

export default function MainLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  const { totalQty } = useCart();
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (!el) return;
    window.requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <HeaderTopBar />
      <Navbar
        cartCount={totalQty}
        onCartClick={() => setCartOpen(true)}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <LeadCaptureModal />
      <CheckoutModal />
      <WhatsAppFab />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
