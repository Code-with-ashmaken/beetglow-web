import { X, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { buildCartWhatsAppUrl } from '../utils/whatsapp';
import { trackInitiateCheckout } from '../utils/fbPixel';
import WhatsAppGlyph from './icons/WhatsAppGlyph';
import { useCheckout } from '../context/CheckoutContext';

export default function CartDrawer({ open, onClose }) {
  const { items, subtotal, removeItem, setQty } = useCart();
  const { openCheckout } = useCheckout();

  if (!open) return null;

  const waUrl = items.length ? buildCartWhatsAppUrl(items) : '#';

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 bg-black/40"
        aria-label="Close cart overlay"
        onClick={onClose}
      />
      <aside
        className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">Your cart</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <p className="text-center text-sm text-neutral-500">
              Your cart is empty — explore the shop below.
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((line) => (
                <li
                  key={line.cartKey}
                  className="flex gap-3 rounded-xl border border-neutral-200 bg-brand-muted/40 p-3"
                >
                  <img
                    src={line.image}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                    width={64}
                    height={64}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-neutral-900">{line.name}</p>
                    <p className="text-xs text-neutral-500">{line.variantLabel}</p>
                    <p className="text-sm text-brand">{line.priceDisplay} each</p>
                    <div className="mt-2 flex items-center gap-2">
                      <label className="sr-only" htmlFor={`qty-${line.cartKey}`}>
                        Quantity
                      </label>
                      <input
                        id={`qty-${line.cartKey}`}
                        type="number"
                        min={1}
                        value={line.qty}
                        onChange={(e) =>
                          setQty(
                            line.cartKey,
                            parseInt(e.target.value, 10) || 1,
                          )
                        }
                        className="w-16 rounded border border-neutral-200 px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(line.cartKey)}
                        className="text-neutral-400 hover:text-red-600"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-neutral-200 px-4 py-4 space-y-3">
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Subtotal</span>
            <span className="font-semibold text-neutral-900">
              {items.length ? `Rs ${Math.round(subtotal).toLocaleString()}` : '—'}
            </span>
          </div>
          <button
            type="button"
            disabled={!items.length}
            onClick={() => {
              if (!items.length) return;
              onClose();
              openCheckout(
                items.map((line) => ({
                  productId: line.productId,
                  name: line.name,
                  variantId: line.variantId,
                  variantLabel: line.variantLabel,
                  qty: line.qty,
                  unitPrice: line.price,
                  priceDisplay: line.priceDisplay,
                })),
              );
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            Proceed to checkout
          </button>
          <a
            href={items.length ? waUrl : undefined}
            className={`flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white ${
              items.length
                ? 'bg-[#25D366] hover:bg-[#20bd5a]'
                : 'pointer-events-none bg-neutral-300'
            }`}
            onClick={(e) => {
              if (!items.length) {
                e.preventDefault();
                return;
              }
              trackInitiateCheckout(
                subtotal,
                items.map((i) => i.productId),
              );
            }}
          >
            <WhatsAppGlyph className="h-5 w-5 shrink-0 text-white" />
            Chat order on WhatsApp
          </a>
        </div>
      </aside>
    </>
  );
}
