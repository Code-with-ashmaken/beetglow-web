import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useCheckout } from '../context/CheckoutContext';
import { checkoutOrderTotal } from '../utils/checkout';
import { trackInitiateCheckout } from '../utils/fbPixel';

const STORAGE_LEADS = 'beetglow_checkouts';
const EVENT_ORDERS_UPDATED = 'beetglow:orders-updated';

function persistLead(payload) {
  try {
    const raw = localStorage.getItem(STORAGE_LEADS);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(payload);
    localStorage.setItem(STORAGE_LEADS, JSON.stringify(list.slice(0, 200)));
    window.dispatchEvent(new Event(EVENT_ORDERS_UPDATED));
  } catch {
    /* ignore */
  }
}

export default function CheckoutModal() {
  const { open, lines, closeCheckout } = useCheckout();
  const total = useMemo(() => checkoutOrderTotal(lines), [lines]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [postal, setPostal] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onEsc = (e) => {
      if (e.key === 'Escape') closeCheckout();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, closeCheckout]);

  useEffect(() => {
    if (!open) return;
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setCity('');
    setAddress('');
    setPostal('');
    setError('');
    setSuccess(false);
  }, [open]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!lines.length) {
      closeCheckout();
      return;
    }
    const trimmedPhone = phone.replace(/\D/g, '');
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      trimmedPhone.length < 10 ||
      !email.includes('@') ||
      !city.trim() ||
      !address.trim().replace(/\s/g, '')
    ) {
      setError(
        'Please complete all required fields — mobile must be valid (10+ digits).',
      );
      return;
    }
    setError('');
    persistLead({
      id: crypto.randomUUID?.() ?? `order-${Date.now()}`,
      at: new Date().toISOString(),
      status: 'Pending',
      customer: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: trimmedPhone,
        email: email.trim(),
        city: city.trim(),
        address: address.trim(),
        postal: postal.trim(),
      },
      lines,
      totals: total,
    });
    trackInitiateCheckout(total, lines.map((l) => l.productId));
    setSuccess(true);
  }

  function handleDismiss() {
    closeCheckout();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            aria-label="Close checkout"
            onClick={handleDismiss}
          />
          <motion.div
            layout
            className="relative z-10 m-4 max-h-[92vh] w-full max-w-lg overflow-hidden rounded-t-3xl rounded-b-none border border-neutral-200 bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-b-3xl"
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 bg-brand-muted/50 px-5 py-4">
              <h2
                id="checkout-title"
                className="text-lg font-bold text-neutral-900"
              >
                Checkout
              </h2>
              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-full p-2 text-neutral-500 hover:bg-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(92vh-4rem)] overflow-y-auto px-5 py-5 sm:max-h-[70vh]">
              {success ? (
                <div className="space-y-4 py-4 text-center">
                  <p className="text-lg font-semibold text-brand">
                    Thank you {firstName}! Your BeetGlow concierge will contact
                    you shortly.
                  </p>
                  <p className="text-sm text-neutral-600">
                    Order reference saved securely on this device — you can WhatsApp us if COD window shifts.
                  </p>
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="rounded-full bg-brand px-8 py-3 font-semibold text-white hover:bg-brand-dark"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6 rounded-xl border border-brand-soft bg-brand-muted/40 p-3 text-sm">
                    <ul className="space-y-1.5">
                      {lines.map((ln) => (
                        <li
                          key={`${ln.productId}-${ln.variantId}`}
                          className="flex justify-between gap-2 text-neutral-800"
                        >
                          <span>
                            {ln.name}{' '}
                            <span className="text-neutral-500">
                              ({ln.variantLabel}) × {ln.qty}
                            </span>
                          </span>
                          <span className="tabular-nums">
                            Rs {(ln.unitPrice * ln.qty).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 flex justify-between border-t border-neutral-200/80 pt-2 font-semibold text-brand">
                      <span>Estimated</span>
                      <span className="tabular-nums">
                        Rs {total.toLocaleString()}
                      </span>
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error ? (
                      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
                        {error}
                      </p>
                    ) : null}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                        First name *
                        <input
                          required
                          type="text"
                          value={firstName}
                          onChange={(ev) => setFirstName(ev.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2.5 normal-case tracking-normal placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                          placeholder="Ayesha"
                          autoComplete="given-name"
                        />
                      </label>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                        Last name *
                        <input
                          required
                          type="text"
                          value={lastName}
                          onChange={(ev) => setLastName(ev.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2.5 normal-case tracking-normal placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                          placeholder="Khan"
                          autoComplete="family-name"
                        />
                      </label>
                    </div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                      Phone (WhatsApp) *
                      <input
                        required
                        type="tel"
                        inputMode="numeric"
                        value={phone}
                        onChange={(ev) => setPhone(ev.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2.5 normal-case tracking-normal placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                        placeholder="+92 300 1234567"
                        autoComplete="tel"
                      />
                    </label>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                      Email *
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2.5 normal-case tracking-normal focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                        placeholder="hello@yourmail.com"
                        autoComplete="email"
                      />
                    </label>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                      City *
                      <input
                        required
                        type="text"
                        value={city}
                        onChange={(ev) => setCity(ev.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2.5 normal-case tracking-normal focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                        placeholder="Lahore, Karachi, Islamabad…"
                        autoComplete="address-level2"
                      />
                    </label>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                      Full address *
                      <textarea
                        required
                        rows={3}
                        value={address}
                        onChange={(ev) => setAddress(ev.target.value)}
                        className="mt-1.5 w-full resize-y rounded-xl border border-neutral-200 px-3 py-2.5 normal-case tracking-normal focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                        placeholder="House / street , near landmark"
                        autoComplete="street-address"
                      />
                    </label>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                      Postal code *
                      <input
                        required
                        type="text"
                        inputMode="numeric"
                        pattern="[\d\s-]{4,}"
                        title="Postal or area code"
                        value={postal}
                        onChange={(ev) => setPostal(ev.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2.5 normal-case tracking-normal focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                        placeholder="54000"
                        autoComplete="postal-code"
                      />
                    </label>

                    <button
                      type="submit"
                      className="w-full rounded-full bg-brand py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-brand-dark"
                    >
                      Submit order request
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
