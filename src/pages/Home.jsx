import { useMemo } from 'react';
import Hero from '../components/Hero';
import BenefitsSection from '../components/BenefitsSection';
import SkinCareRoutineSection from '../components/SkinCareRoutineSection';
import ProductCard from '../components/ProductCard';
import TestimonialsSection from '../components/TestimonialsSection';
import CustomerReviews from '../components/CustomerReviews';
import { defaultVariant } from '../data/products';
import { STORE_NAME } from '../config/store';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import { useSiteData } from '../context/SiteDataContext';
import { trackAddToCart } from '../utils/fbPixel';

export default function Home() {
  const { searchQuery } = useSearch();
  const { addItem } = useCart();
  const { products, settings } = useSiteData();

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    );
  }, [searchQuery, products]);

  function handleAddToCart(product) {
    const v = defaultVariant(product);
    trackAddToCart(product, 1, v.price);
    addItem(product, v, 1);
  }

  const productsSection = (
    <section
      key="products"
      id="shop"
      className="scroll-mt-28 border-t border-neutral-200 bg-neutral-50/80 px-4 py-14 md:py-16"
    >
      <div className="mx-auto max-w-6xl rounded-3xl border border-neutral-200 bg-white px-5 py-10 shadow-sm md:px-10">
        <div id="products-beetroot" className="scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
            BeetGlow shop — Beetroot powders & Multani clay
          </h2>
          <p className="mt-2 max-w-3xl text-neutral-600 md:text-lg">
            Select <span className="font-semibold text-brand">{STORE_NAME}</span>{' '}
            favourites — <span className="font-semibold">tap an image for full ingredients & pack sizes,</span>{' '}
            or <span className="font-semibold text-brand-dark">Buy Now</span> for checkout.
          </p>
        </div>
        <div
          id="collection"
          className="scroll-mt-24 mt-10 border-t border-brand-beige/80 pt-8"
        />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-16 text-center text-neutral-500">
            Nothing matches — try beet, multani, or mud.
          </p>
        )}
      </div>
    </section>
  );

  const mapSection = {
    hero: <Hero key="hero" />,
    products: productsSection,
    benefits: <BenefitsSection key="benefits" />,
    routine: <SkinCareRoutineSection key="routine" />,
    testimonials: <TestimonialsSection key="testimonials" />,
    reviews: <CustomerReviews key="reviews" />,
  };

  const orderedSections = (settings.homeSections || [])
    .filter((s) => s.enabled)
    .map((s) => {
      if (s.type === 'custom') {
        return (
          <section
            key={s.id}
            className="border-t border-neutral-200 bg-white px-4 py-14 md:py-16"
          >
            <div className="mx-auto max-w-6xl rounded-2xl border border-neutral-200 bg-neutral-50 p-8">
              <h2 className="text-2xl font-bold text-neutral-900">{s.title || 'Custom section'}</h2>
              <p className="mt-3 whitespace-pre-wrap text-neutral-700">{s.content || ''}</p>
            </div>
          </section>
        );
      }
      return mapSection[s.type] || null;
    })
    .filter(Boolean);

  return (
    <>
      {orderedSections}
    </>
  );
}
