import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { CheckoutProvider } from './context/CheckoutContext';
import { SearchProvider } from './context/SearchContext';
import { SiteDataProvider } from './context/SiteDataContext';
import FacebookPixel from './components/FacebookPixel';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ShippingPage from './pages/ShippingPage';
import FaqsPage from './pages/FaqsPage';
import PrivacyPage from './pages/PrivacyPage';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <SiteDataProvider>
      <SearchProvider>
        <CheckoutProvider>
          <CartProvider>
            <BrowserRouter>
              <FacebookPixel />
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/shipping" element={<ShippingPage />} />
                  <Route path="/faqs" element={<FaqsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                </Route>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route element={<ProtectedAdminRoute />}>
                  <Route path="/admin" element={<AdminPanel />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </CheckoutProvider>
      </SearchProvider>
    </SiteDataProvider>
  );
}

export default App;
