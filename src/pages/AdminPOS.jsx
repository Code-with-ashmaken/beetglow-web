import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, LogOut, Plus, Trash2 } from 'lucide-react';
import { ADMIN_PASSWORD } from '../config/store';
import { products, defaultVariant } from '../data/products';

const AUTH_KEY = 'beetglow_admin_auth';
const SALES_KEY = 'beetglow_pos_sales';

function loadSales() {
  try {
    const raw = localStorage.getItem(SALES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function AdminPOS() {
  const [authed, setAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [sales, setSales] = useState([]);
  const [productId, setProductId] = useState(products[0]?.id ?? '');
  const [qty, setQty] = useState(1);
  const [channel, setChannel] = useState('WhatsApp');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    try {
      setAuthed(sessionStorage.getItem(AUTH_KEY) === '1');
    } catch {
      setAuthed(false);
    }
    setSales(loadSales());
  }, []);

  const persistSales = useCallback((next) => {
    setSales(next);
    try {
      localStorage.setItem(SALES_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  function login(e) {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(AUTH_KEY, '1');
      } catch {
        /* ignore */
      }
      setAuthed(true);
      setPasswordInput('');
    }
  }

  function logout() {
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore */
    }
    setAuthed(false);
  }

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === productId),
    [productId],
  );

  function addSale(e) {
    e.preventDefault();
    if (!selectedProduct || qty < 1) return;
    const v = defaultVariant(selectedProduct);
    const row = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      at: new Date().toISOString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      variantLabel: v.label,
      qty,
      unitPrice: v.price,
      lineTotal: v.price * qty,
      channel,
      notes: notes.trim(),
    };
    persistSales([row, ...sales]);
    setNotes('');
    setQty(1);
  }

  function deleteSale(id) {
    persistSales(sales.filter((s) => s.id !== id));
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-muted px-4">
        <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
          <div className="mb-6 flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white">
              <Lock className="h-7 w-7" aria-hidden />
            </span>
          </div>
          <h1 className="text-center text-xl font-bold text-neutral-900">
            BeetGlow POS
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the admin password to log sales.
          </p>
          <form onSubmit={login} className="mt-6 space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              autoComplete="current-password"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-brand py-3 font-semibold text-white hover:bg-brand-dark"
            >
              Unlock
            </button>
          </form>
          <p className="mt-6 text-center">
            <Link to="/" className="text-sm text-brand hover:underline">
              ← Back to store
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-bold text-neutral-900">
            Manual sales (POS)
          </h1>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-sm font-medium text-brand hover:underline"
            >
              View store
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <form
          onSubmit={addSale}
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <h2 className="font-semibold text-gray-900">Record a sale</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-gray-700">
              Product
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {defaultVariant(p).priceDisplay}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) =>
                  setQty(Math.max(1, parseInt(e.target.value, 10) || 1))
                }
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Channel
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Instagram">Instagram</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-gray-700 sm:col-span-2">
              Notes (optional)
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Customer name, reference..."
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </label>
          </div>
          <button
            type="submit"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add sale
          </button>
        </form>

        <section className="mt-10">
          <h2 className="font-semibold text-gray-900">Recent entries</h2>
          <p className="mt-1 text-sm text-gray-500">
            Stored in this browser only (localStorage). Export by copying or add
            sync later.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-neutral-200 bg-brand-muted/80">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700">When</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Product
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Qty</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Pack
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Total
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Channel
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700" />
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No sales logged yet.
                    </td>
                  </tr>
                ) : (
                  sales.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-neutral-100 last:border-0"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                        {new Date(s.at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">
                          {s.productName}
                        </span>
                        {s.notes ? (
                          <span className="mt-0.5 block text-xs text-gray-500">
                            {s.notes}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">{s.qty}</td>
                      <td className="px-4 py-3 text-neutral-600">
                        {s.variantLabel ?? '—'}
                      </td>
                      <td className="px-4 py-3 font-medium">{s.lineTotal}</td>
                      <td className="px-4 py-3">{s.channel}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => deleteSale(s.id)}
                          className="text-gray-400 hover:text-red-600"
                          aria-label="Delete row"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
