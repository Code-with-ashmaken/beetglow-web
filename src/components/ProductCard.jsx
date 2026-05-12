import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import {
  trackInitiateCheckout,
  trackViewContent,
} from '../utils/fbPixel';
import { defaultVariant } from '../data/products';
import { checkoutLineFromProduct } from '../utils/checkout';
import { useCheckout } from '../context/CheckoutContext';
import { useSiteData } from '../context/SiteDataContext';
import { buttonClass } from './ui/Button';
import StarRating from './StarRating';

export default function ProductCard({ product, onAddToCart }) {
  const seen = useRef(false);
  const cardRef = useRef(null);
  const { openCheckout } = useCheckout();
  const { settings } = useSiteData();
  const dv = defaultVariant(product);
  const isOutOfStock = product.stockStatus === 'Out of Stock';
  const isPurchasable = settings.enableGlobalShopping !== false && product.purchasable !== false;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || seen.current) return;
        seen.current = true;
        trackViewContent(product, dv.price);
      },
      { threshold: 0.35 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [product, dv.price]);

  return (
    <article
      ref={cardRef}
      className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm transition hover:border-brand-soft hover:shadow-md"
    >
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-[4/5] overflow-hidden bg-brand-muted outline-none ring-brand focus-visible:ring-2"
      >
        <img
          src={product.image}
          alt=""
          className="h-full w-full object-cover transition hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
          width={600}
          height={750}
        />
        <span className="pointer-events-none absolute inset-x-2 bottom-2 rounded-full bg-brand/92 py-1.5 text-center text-[11px] font-semibold text-white backdrop-blur-sm sm:text-xs">
          Tap image for sizes & details
        </span>
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white shadow-sm">
            {product.badge}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold leading-snug text-neutral-900">
          <Link to={`/product/${product.id}`} className="hover:text-brand">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
          {product.shortDescription}
        </p>
        <p className="mt-3 text-lg font-bold text-brand">{dv.priceDisplay}</p>
        <div className="mt-2">
          <StarRating rating={product.rating || 0} size="sm" showValue />
        </div>
        {isOutOfStock ? (
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-red-600">
            Out of stock
          </p>
        ) : null}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          {isPurchasable ? (
            <>
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={() => onAddToCart(product)}
                className={`${buttonClass({ variant: 'outline' })} flex-1`}
              >
                Add to Cart
              </button>
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={() => {
                  openCheckout([checkoutLineFromProduct(product, dv, 1)]);
                  trackInitiateCheckout(dv.price, [product.id]);
                }}
                className={`${buttonClass({ variant: 'solid' })} flex-1`}
              >
                <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden />
                Buy Now
              </button>
            </>
          ) : (
            <button
              type="button"
              className={`${buttonClass({ variant: 'outline' })} flex-1`}
              disabled
            >
              Inquiry Only
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
