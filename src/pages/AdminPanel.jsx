import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Plus, Save, Star, Trash2, Printer, Eye, X } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { getBusinessSettings, saveBusinessSettings } from '../data/businessSettings';
import OrderManageModal from '../components/admin/OrderManageModal';
import AWBPrint from '../components/admin/AWBPrint';
import Invoice from '../components/Invoice';

const TABS = ['products', 'orders', 'reviews', 'header-footer', 'homepage', 'branding', 'business'];

function defaultProduct() {
  return {
    id: `product-${Date.now()}`,
    name: '',
    shortDescription: '',
    description: '',
    image: '',
    imageSecondary: '',
    stockStatus: 'In Stock',
    variants: [
      { id: '50g', label: '50 g', price: 0, priceDisplay: 'Rs 0' },
      { id: '100g', label: '100 g', price: 0, priceDisplay: 'Rs 0' },
      { id: '250g', label: '250 g', price: 0, priceDisplay: 'Rs 0' },
    ],
    defaultVariantIndex: 1,
    purchasable: true,
    createdAt: new Date().toISOString(),
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

function moveItem(list, from, to) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const { products, setProducts, settings, setSettings, orders, setOrders } =
    useSiteData();
  const [activeTab, setActiveTab] = useState('products');
  const [draft, setDraft] = useState(defaultProduct);
  const [editingId, setEditingId] = useState('');
  const [draftSettings, setDraftSettings] = useState(settings);
  const [uploadError, setUploadError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderManage, setShowOrderManage] = useState(false);
  const [showAWB, setShowAWB] = useState(false);
  const [showInvoicePrint, setShowInvoicePrint] = useState(false);
  const [businessSettings, setBusinessSettings] = useState(getBusinessSettings());

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === editingId),
    [products, editingId],
  );

  useEffect(() => {
    setDraftSettings(settings);
  }, [settings]);

  // Refresh orders from localStorage when component mounts
  useEffect(() => {
    const refreshOrders = () => {
      const storedOrders = JSON.parse(localStorage.getItem('beetglow_orders') || '[]');
      setOrders(storedOrders);
    };
    
    // Initial refresh
    refreshOrders();
    
    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'beetglow_orders') {
        refreshOrders();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for immediate updates
    const interval = setInterval(refreshOrders, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [setOrders]);

  function logout() {
    localStorage.removeItem('beetglow_admin_remember');
    sessionStorage.removeItem('beetglow_admin_session');
    navigate('/admin/login', { replace: true });
  }

  function updateDraft(key, value) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function updateVariant(index, price) {
    setDraft((prev) => {
      const next = [...prev.variants];
      const value = Number(price) || 0;
      next[index] = {
        ...next[index],
        price: value,
        priceDisplay: `Rs ${value.toLocaleString()}`,
      };
      return { ...prev, variants: next };
    });
  }

  function resetEditor() {
    setEditingId('');
    setDraft(defaultProduct());
  }

  function handlePrintInvoice(order) {
    // Update order status to 'Processing' when printed
    setOrders((prev) => 
      prev.map((o) => 
        o.id === order.id ? { ...o, status: 'Processing' } : o
      )
    );
    setShowInvoicePrint(true);
  }

  function startEdit(product) {
    setEditingId(product.id);
    setDraft({
      ...product,
      variants: product.variants.map((v) => ({ ...v })),
    });
  }

  function saveProduct(e) {
    e.preventDefault();
    if (!draft.name.trim()) return;
    const payload = {
      ...draft,
      id: draft.id || `product-${Date.now()}`,
      name: draft.name.trim(),
      shortDescription: draft.shortDescription.trim(),
      description: draft.description.trim(),
      image: (draft.image || '').trim(),
      imageSecondary: (draft.imageSecondary || '').trim(),
    };
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === payload.id);
      if (!exists) return [payload, ...prev];
      return prev.map((p) => (p.id === payload.id ? payload : p));
    });
    resetEditor();
  }

  function removeProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) resetEditor();
  }

  function updateOrderStatus(id, status) {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === id ? { ...ord, status } : ord)),
    );
  }

  function updateSettings(path, value) {
    setDraftSettings((prev) => ({ ...prev, [path]: value }));
  }

  function saveSettings() {
    setSettings(draftSettings);
  }

  async function uploadImageToDraft(event, key) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      setUploadError('Only JPG, PNG, and WEBP files are allowed.');
      return;
    }
    if (file.size > 1024 * 1024) {
      setUploadError('Please upload images under 1MB for better speed.');
      return;
    }
    try {
      const data = await readFileAsDataUrl(file);
      setUploadError('');
      updateDraft(key, data);
    } catch (err) {
      setUploadError(err.message);
    }
  }

  async function uploadImageToSettings(event, updater) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      setUploadError('Only JPG, PNG, and WEBP files are allowed.');
      return;
    }
    if (file.size > 1024 * 1024) {
      setUploadError('Please upload images under 1MB for better speed.');
      return;
    }
    try {
      const data = await readFileAsDataUrl(file);
      setUploadError('');
      updater(data);
    } catch (err) {
      setUploadError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <img
              src={`${process.env.PUBLIC_URL || ''}/beetglow-logo.svg`}
              alt="BeetGlow"
              className="h-9 w-auto"
            />
          </div>
          <nav className="space-y-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm font-semibold ${
                  activeTab === tab
                    ? 'bg-brand text-white'
                    : 'text-neutral-700 hover:bg-brand-muted'
                }`}
              >
                {tab === 'products'
                  ? 'Products'
                  : tab === 'orders'
                    ? 'Orders'
                    : tab === 'reviews'
                      ? 'Reviews'
                      : tab === 'header-footer'
                        ? 'Header & Footer'
                        : tab === 'homepage'
                          ? 'Homepage Builder'
                          : 'Branding'}
              </button>
            ))}
          </nav>
          <div className="mt-8 space-y-3">
            <Link to="/" className="block text-sm text-brand hover:underline">
              View storefront
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </aside>

        <main className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          {uploadError ? (
            <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
              {uploadError}
            </p>
          ) : null}
          {activeTab === 'products' ? (
            <section>
              <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
              <p className="mt-1 text-sm text-neutral-500">
                Add, edit, and delete catalog items with live updates.
              </p>
              <form onSubmit={saveProduct} className="mt-5 grid gap-3 md:grid-cols-2">
                <input
                  value={draft.name}
                  onChange={(e) => updateDraft('name', e.target.value)}
                  placeholder="Product name"
                  className="rounded-xl border border-neutral-200 px-3 py-2"
                  required
                />
                <input
                  value={draft.id}
                  onChange={(e) => updateDraft('id', e.target.value)}
                  placeholder="Product slug/id"
                  className="rounded-xl border border-neutral-200 px-3 py-2"
                />
                <label className="rounded-xl border border-neutral-200 px-3 py-2 md:col-span-2">
                  <span className="text-sm font-medium text-neutral-700">Main image upload (JPG/PNG/WEBP)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => uploadImageToDraft(e, 'image')}
                    className="mt-1 block w-full text-sm"
                  />
                </label>
                <label className="rounded-xl border border-neutral-200 px-3 py-2 md:col-span-2">
                  <span className="text-sm font-medium text-neutral-700">Secondary image upload</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => uploadImageToDraft(e, 'imageSecondary')}
                    className="mt-1 block w-full text-sm"
                  />
                </label>
                <textarea
                  value={draft.shortDescription}
                  onChange={(e) => updateDraft('shortDescription', e.target.value)}
                  placeholder="Short description for product cards"
                  className="rounded-xl border border-neutral-200 px-3 py-2"
                  rows={2}
                  required
                />
                <label className="flex items-center gap-3 text-sm font-medium text-neutral-700">
                  <input
                    type="checkbox"
                    checked={draft.purchasable !== false}
                    onChange={(e) => updateDraft('purchasable', e.target.checked)}
                    className="w-4 h-4 text-brand border-neutral-300 rounded focus:ring-brand"
                  />
                  Purchasable (Show "Add to Cart" button)
                </label>
                <textarea
                  value={draft.description}
                  onChange={(e) => updateDraft('description', e.target.value)}
                  placeholder="Description"
                  rows={3}
                  className="rounded-xl border border-neutral-200 px-3 py-2 md:col-span-2"
                />
                <select
                  value={draft.stockStatus}
                  onChange={(e) => updateDraft('stockStatus', e.target.value)}
                  className="rounded-xl border border-neutral-200 px-3 py-2"
                >
                  <option>In Stock</option>
                  <option>Out of Stock</option>
                </select>
                <div className="grid grid-cols-3 gap-2 md:col-span-2">
                  {draft.variants.map((variant, index) => (
                    <label key={variant.id} className="text-xs text-neutral-500">
                      {variant.label} (PKR)
                      <input
                        type="number"
                        min={0}
                        value={variant.price}
                        onChange={(e) => updateVariant(index, e.target.value)}
                        className="mt-1 w-full rounded-lg border border-neutral-200 px-2 py-2 text-sm"
                      />
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 md:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    <Plus className="h-4 w-4" />
                    {editingId ? 'Update product' : 'Add product'}
                  </button>
                  {editingId ? (
                    <button
                      type="button"
                      onClick={resetEditor}
                      className="rounded-full border border-neutral-200 px-5 py-2.5 text-sm"
                    >
                      Cancel edit
                    </button>
                  ) : null}
                </div>
              </form>

              <div className="mt-8 overflow-x-auto rounded-xl border border-neutral-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-brand-muted">
                    <tr>
                      <th className="px-3 py-2">Product</th>
                      <th className="px-3 py-2">Stock</th>
                      <th className="px-3 py-2">50g</th>
                      <th className="px-3 py-2">100g</th>
                      <th className="px-3 py-2">250g</th>
                      <th className="px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-t border-neutral-100">
                        <td className="px-3 py-2">{p.name}</td>
                        <td className="px-3 py-2">{p.stockStatus || 'In Stock'}</td>
                        {p.variants.slice(0, 3).map((v) => (
                          <td key={v.id} className="px-3 py-2">
                            Rs {v.price}
                          </td>
                        ))}
                        <td className="px-3 py-2">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => startEdit(p)}
                              className="text-brand hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => removeProduct(p.id)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {selectedProduct ? null : null}
            </section>
          ) : null}

          {activeTab === 'orders' ? (
            <section>
              <h1 className="text-2xl font-bold text-neutral-900">Orders</h1>
              <p className="mt-1 text-sm text-neutral-500">
                Captured from Buy Now checkout form.
              </p>
              <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-brand-muted">
                    <tr>
                      <th className="px-3 py-2">Customer</th>
                      <th className="px-3 py-2">Phone</th>
                      <th className="px-3 py-2">City</th>
                      <th className="px-3 py-2">Address</th>
                      <th className="px-3 py-2">Products</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-t border-neutral-100">
                        <td className="px-3 py-2">
                          {order.customerName || `${order.customer?.firstName} ${order.customer?.lastName}`}
                        </td>
                        <td className="px-3 py-2">{order.phone || order.customer?.phone}</td>
                        <td className="px-3 py-2">{order.city || order.customer?.city}</td>
                        <td className="px-3 py-2">{order.address || order.customer?.shippingAddress}</td>
                        <td className="px-3 py-2">
                          {order.productName} {order.variant ? `(${order.variant})` : ''}
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={order.status || 'Pending'}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="rounded-lg border border-neutral-200 px-2 py-1"
                          >
                            <option>Pending</option>
                            <option>Shipped</option>
                            <option>Delivered</option>
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderManage(true);
                              }}
                              className="px-3 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors text-sm"
                              title="View Order"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePrintInvoice(order)}
                              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                              title="Print Invoice"
                            >
                              <Printer className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowAWB(true);
                              }}
                              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                              title="Print AWB"
                            >
                              <Printer className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setOrders((prev) => prev.filter((x) => x.id !== order.id))
                              }
                              className="text-neutral-400 hover:text-red-600"
                              title="Delete Order"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!orders.length ? (
                      <tr>
                        <td colSpan={7} className="px-3 py-8 text-center text-neutral-500">
                          No orders yet.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {activeTab === 'reviews' ? (
            <section>
              <h1 className="text-2xl font-bold text-neutral-900">Customer Reviews</h1>
              <p className="mt-1 text-sm text-neutral-500">
                Approve or delete customer-submitted reviews.
              </p>
              <div className="mt-6 space-y-4">
                {(settings.reviews || []).map((review) => (
                  <div key={review.id} className="rounded-xl border border-neutral-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-neutral-900">{review.name}</h3>
                          <span className="text-xs text-neutral-500">{review.email}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            review.approved 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {review.approved ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                        <div className="flex gap-1 mb-2">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-neutral-700 text-sm">{review.message}</p>
                        <p className="text-xs text-neutral-500 mt-2">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!review.approved && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = settings.reviews.map(r => 
                                r.id === review.id ? { ...r, approved: true } : r
                              );
                              setSettings(prev => ({ ...prev, reviews: updated }));
                            }}
                            className="rounded-lg border border-green-200 px-3 py-2 text-sm text-green-600 hover:bg-green-50"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setSettings(prev => ({
                              ...prev,
                              reviews: prev.reviews.filter(r => r.id !== review.id)
                            }));
                          }}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {(settings.reviews || []).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-neutral-500">No customer reviews submitted yet.</p>
                  </div>
                )}
              </div>
            </section>
          ) : null}

          {activeTab === 'header-footer' ? (
            <section className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Header & Footer Manager</h1>
                <p className="mt-1 text-sm text-neutral-500">
                  Control logo, menu links, footer links, socials and copyright.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 p-4">
                <h2 className="text-lg font-semibold text-neutral-900">Header</h2>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <label className="text-sm">
                    Logo type
                    <select
                      value={draftSettings.header.logoType}
                      onChange={(e) =>
                        setDraftSettings((prev) => ({
                          ...prev,
                          header: { ...prev.header, logoType: e.target.value },
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
                    >
                      <option value="image">Image</option>
                      <option value="text">Text</option>
                    </select>
                  </label>
                  <label className="text-sm">
                    Logo text
                    <input
                      value={draftSettings.header.logoText}
                      onChange={(e) =>
                        setDraftSettings((prev) => ({
                          ...prev,
                          header: { ...prev.header, logoText: e.target.value },
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
                    />
                  </label>
                  <label className="text-sm md:col-span-2">
                    Logo image upload
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) =>
                        uploadImageToSettings(e, (data) =>
                          setDraftSettings((prev) => ({
                            ...prev,
                            header: { ...prev.header, logoImage: data },
                          })),
                        )
                      }
                      className="mt-1 block w-full text-sm"
                    />
                  </label>
                </div>
                <p className="mt-4 text-sm font-medium text-neutral-700">Menu links</p>
                <div className="mt-2 space-y-2">
                  {(draftSettings.header.menuLinks || []).map((link, index) => (
                    <div key={`${link.label}-${index}`} className="grid gap-2 rounded-lg border border-neutral-200 p-2 md:grid-cols-[1fr_2fr_auto]">
                      <input
                        value={link.label}
                        onChange={(e) =>
                          setDraftSettings((prev) => {
                            const next = [...prev.header.menuLinks];
                            next[index] = { ...next[index], label: e.target.value };
                            return { ...prev, header: { ...prev.header, menuLinks: next } };
                          })
                        }
                        placeholder="Label"
                        className="rounded-lg border border-neutral-200 px-2 py-2 text-sm"
                      />
                      <input
                        value={link.to}
                        onChange={(e) =>
                          setDraftSettings((prev) => {
                            const next = [...prev.header.menuLinks];
                            next[index] = { ...next[index], to: e.target.value };
                            return { ...prev, header: { ...prev.header, menuLinks: next } };
                          })
                        }
                        placeholder="/about or /#shop"
                        className="rounded-lg border border-neutral-200 px-2 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setDraftSettings((prev) => {
                            const next = prev.header.menuLinks.filter((_, i) => i !== index);
                            return { ...prev, header: { ...prev.header, menuLinks: next } };
                          })
                        }
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600"
                        aria-label="Remove menu link"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setDraftSettings((prev) => ({
                      ...prev,
                      header: {
                        ...prev.header,
                        menuLinks: [...prev.header.menuLinks, { label: 'New Link', to: '/', type: 'route' }],
                      },
                    }))
                  }
                  className="mt-3 rounded-full border border-neutral-200 px-4 py-2 text-sm"
                >
                  + Add menu link
                </button>
              </div>

              <div className="rounded-xl border border-neutral-200 p-4">
                <h2 className="text-lg font-semibold text-neutral-900">Footer</h2>
                <label className="mt-3 flex items-center gap-2 text-sm font-medium text-neutral-700">
                  <input
                    type="checkbox"
                    checked={draftSettings.footer.showQuickLinks !== false}
                    onChange={(e) =>
                      setDraftSettings((prev) => ({
                        ...prev,
                        footer: { ...prev.footer, showQuickLinks: e.target.checked },
                      }))
                    }
                  />
                  Show quick links section
                </label>
                <p className="mt-3 text-sm font-medium text-neutral-700">Quick links</p>
                <div className="mt-2 space-y-2">
                  {(draftSettings.footer.quickLinks || []).map((link, index) => (
                    <div key={`${link.label}-${index}`} className="grid gap-2 rounded-lg border border-neutral-200 p-2 md:grid-cols-[1fr_2fr_auto]">
                      <input
                        value={link.label}
                        onChange={(e) =>
                          setDraftSettings((prev) => {
                            const next = [...prev.footer.quickLinks];
                            next[index] = { ...next[index], label: e.target.value };
                            return { ...prev, footer: { ...prev.footer, quickLinks: next } };
                          })
                        }
                        className="rounded-lg border border-neutral-200 px-2 py-2 text-sm"
                      />
                      <input
                        value={link.to}
                        onChange={(e) =>
                          setDraftSettings((prev) => {
                            const next = [...prev.footer.quickLinks];
                            next[index] = { ...next[index], to: e.target.value };
                            return { ...prev, footer: { ...prev.footer, quickLinks: next } };
                          })
                        }
                        className="rounded-lg border border-neutral-200 px-2 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setDraftSettings((prev) => {
                            const next = prev.footer.quickLinks.filter((_, i) => i !== index);
                            return { ...prev, footer: { ...prev.footer, quickLinks: next } };
                          })
                        }
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600"
                        aria-label="Remove footer link"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setDraftSettings((prev) => ({
                      ...prev,
                      footer: {
                        ...prev.footer,
                        quickLinks: [...prev.footer.quickLinks, { label: 'New link', to: '/' }],
                      },
                    }))
                  }
                  className="mt-3 rounded-full border border-neutral-200 px-4 py-2 text-sm"
                >
                  + Add quick link
                </button>

                <p className="mt-5 text-sm font-medium text-neutral-700">Social links</p>
                <div className="mt-2 space-y-2">
                  {(draftSettings.footer.socials || []).map((social, index) => (
                    <div key={`${social.platform}-${index}`} className="grid gap-2 rounded-lg border border-neutral-200 p-2 md:grid-cols-[1fr_2fr_auto]">
                      <input
                        value={social.platform}
                        onChange={(e) =>
                          setDraftSettings((prev) => {
                            const next = [...prev.footer.socials];
                            next[index] = { ...next[index], platform: e.target.value };
                            return { ...prev, footer: { ...prev.footer, socials: next } };
                          })
                        }
                        className="rounded-lg border border-neutral-200 px-2 py-2 text-sm"
                        placeholder="Facebook / Instagram / TikTok / WhatsApp"
                      />
                      <input
                        value={social.url}
                        onChange={(e) =>
                          setDraftSettings((prev) => {
                            const next = [...prev.footer.socials];
                            next[index] = { ...next[index], url: e.target.value };
                            return { ...prev, footer: { ...prev.footer, socials: next } };
                          })
                        }
                        className="rounded-lg border border-neutral-200 px-2 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setDraftSettings((prev) => {
                            const next = prev.footer.socials.filter((_, i) => i !== index);
                            return { ...prev, footer: { ...prev.footer, socials: next } };
                          })
                        }
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600"
                        aria-label="Remove social link"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setDraftSettings((prev) => ({
                      ...prev,
                      footer: {
                        ...prev.footer,
                        socials: [...prev.footer.socials, { platform: 'Instagram', url: 'https://www.instagram.com' }],
                      },
                    }))
                  }
                  className="mt-3 rounded-full border border-neutral-200 px-4 py-2 text-sm"
                >
                  + Add social
                </button>

                <label className="mt-5 block text-sm font-medium text-neutral-700">
                  Copyright text
                  <input
                    value={draftSettings.footer.copyrightText}
                    onChange={(e) =>
                      setDraftSettings((prev) => ({
                        ...prev,
                        footer: { ...prev.footer, copyrightText: e.target.value },
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={saveSettings}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white"
              >
                <Save className="h-4 w-4" />
                Save Header & Footer
              </button>
            </section>
          ) : null}

          {activeTab === 'homepage' ? (
            <section className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Homepage Section Builder</h1>
                <p className="mt-1 text-sm text-neutral-500">
                  Manage slider content, benefits and testimonials.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 p-4">
                <h2 className="text-lg font-semibold text-neutral-900">Slider</h2>
                <div className="mt-3 space-y-3">
                  {(draftSettings.sliderSlides || []).map((slide, index) => (
                    <div key={slide.id} className="rounded-xl border border-neutral-200 p-3">
                      <input
                        value={slide.title}
                        onChange={(e) => {
                          const next = [...draftSettings.sliderSlides];
                          next[index] = { ...next[index], title: e.target.value };
                          updateSettings('sliderSlides', next);
                        }}
                        className="w-full rounded-lg border border-neutral-200 px-2 py-2 text-sm font-semibold"
                        placeholder="Main heading"
                      />
                      <textarea
                        rows={2}
                        value={slide.subtitle}
                        onChange={(e) => {
                          const next = [...draftSettings.sliderSlides];
                          next[index] = { ...next[index], subtitle: e.target.value };
                          updateSettings('sliderSlides', next);
                        }}
                        className="mt-2 w-full rounded-lg border border-neutral-200 px-2 py-2 text-sm"
                        placeholder="Subtitle"
                      />
                      <div className="mt-2 grid gap-2 md:grid-cols-2">
                        <input
                          value={slide.ctaLabel || ''}
                          onChange={(e) => {
                            const next = [...draftSettings.sliderSlides];
                            next[index] = { ...next[index], ctaLabel: e.target.value };
                            updateSettings('sliderSlides', next);
                          }}
                          className="rounded-lg border border-neutral-200 px-2 py-2 text-sm"
                          placeholder="Button label"
                        />
                        <input
                          value={slide.ctaHref || ''}
                          onChange={(e) => {
                            const next = [...draftSettings.sliderSlides];
                            next[index] = { ...next[index], ctaHref: e.target.value };
                            updateSettings('sliderSlides', next);
                          }}
                          className="rounded-lg border border-neutral-200 px-2 py-2 text-sm"
                          placeholder="Button link"
                        />
                      </div>
                     <div className="mt-2">
              <label className="rounded-lg border border-neutral-200 p-4 block cursor-pointer hover:bg-neutral-50">
                <span className="block text-sm font-medium text-neutral-700 mb-1">Slider Banner Image Upload</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) =>
                    uploadImageToSettings(e, (data) => {
                      const next = [...draftSettings.sliderSlides];
                      next[index] = { ...next[index], leftImage: data };
                      updateSettings('sliderSlides', next);
                    })
                  }
                  className="mt-1 block w-full text-xs"
                />
              </label>
            </div>
                      ) : (
                        <label className="mt-2 block rounded-lg border border-neutral-200 px-2 py-2 text-sm">
                          Slide image upload
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) =>
                              uploadImageToSettings(e, (data) => {
                                const next = [...draftSettings.sliderSlides];
                                next[index] = { ...next[index], image: data };
                                updateSettings('sliderSlides', next);
                              })
                            }
                            className="mt-1 block w-full text-xs"
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 p-4">
                <h2 className="text-lg font-semibold text-neutral-900">Layout & Section Manager</h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Reorder, show/hide, add custom sections, or remove sections globally.
                </p>
                <div className="mt-3 space-y-2">
                  {(draftSettings.homeSections || []).map((section, index) => (
                    <div key={section.id} className="rounded-lg border border-neutral-200 p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="checkbox"
                          checked={section.enabled !== false}
                          onChange={(e) => {
                            const next = [...draftSettings.homeSections];
                            next[index] = { ...next[index], enabled: e.target.checked };
                            updateSettings('homeSections', next);
                          }}
                        />
                        <span className="text-sm font-semibold text-neutral-800">
                          {section.label || section.type}
                        </span>
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() =>
                            updateSettings(
                              'homeSections',
                              moveItem(draftSettings.homeSections, index, index - 1),
                            )
                          }
                          className="rounded border border-neutral-200 px-2 py-1 text-xs disabled:opacity-40"
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          disabled={index === draftSettings.homeSections.length - 1}
                          onClick={() =>
                            updateSettings(
                              'homeSections',
                              moveItem(draftSettings.homeSections, index, index + 1),
                            )
                          }
                          className="rounded border border-neutral-200 px-2 py-1 text-xs disabled:opacity-40"
                        >
                          Down
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateSettings(
                              'homeSections',
                              draftSettings.homeSections.filter((_, i) => i !== index),
                            )
                          }
                          className="rounded border border-red-200 px-2 py-1 text-xs text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                      {section.type === 'custom' ? (
                        <div className="mt-2 grid gap-2">
                          <input
                            value={section.title || ''}
                            onChange={(e) => {
                              const next = [...draftSettings.homeSections];
                              next[index] = { ...next[index], title: e.target.value, label: e.target.value || 'Custom' };
                              updateSettings('homeSections', next);
                            }}
                            className="rounded-lg border border-neutral-200 px-2 py-2 text-sm"
                            placeholder="Custom section title"
                          />
                          <textarea
                            rows={3}
                            value={section.content || ''}
                            onChange={(e) => {
                              const next = [...draftSettings.homeSections];
                              next[index] = { ...next[index], content: e.target.value };
                              updateSettings('homeSections', next);
                            }}
                            className="rounded-lg border border-neutral-200 px-2 py-2 text-sm"
                            placeholder="Custom section content"
                          />
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSettings('homeSections', [
                      ...(draftSettings.homeSections || []),
                      {
                        id: `custom-${Date.now()}`,
                        type: 'custom',
                        label: 'Custom Section',
                        title: 'Custom Section',
                        content: 'Add your custom content here.',
                        enabled: true,
                      },
                    ])
                  }
                  className="mt-3 rounded-full border border-neutral-200 px-4 py-2 text-sm"
                >
                  + Add custom section
                </button>
              </div>

              <div className="rounded-xl border border-neutral-200 p-4">
                <h2 className="text-lg font-semibold text-neutral-900">Benefits Section</h2>
                <div className="mt-3 space-y-2">
                  {(draftSettings.benefits || []).map((item, index) => (
                    <div key={`${item.title}-${index}`} className="grid gap-2 rounded-lg border border-neutral-200 p-2 md:grid-cols-[1fr_1fr_2fr_auto]">
                      <input
                        value={item.icon}
                        onChange={(e) => {
                          const next = [...draftSettings.benefits];
                          next[index] = { ...next[index], icon: e.target.value };
                          updateSettings('benefits', next);
                        }}
                        className="rounded-lg border border-neutral-200 px-2 py-2 text-sm"
                        placeholder="Icon: Leaf, Droplets..."
                      />
                      <input
                        value={item.title}
                        onChange={(e) => {
                          const next = [...draftSettings.benefits];
                          next[index] = { ...next[index], title: e.target.value };
                          updateSettings('benefits', next);
                        }}
                        className="rounded-lg border border-neutral-200 px-2 py-2 text-sm"
                        placeholder="Title"
                      />
                      <input
                        value={item.text}
                        onChange={(e) => {
                          const next = [...draftSettings.benefits];
                          next[index] = { ...next[index], text: e.target.value };
                          updateSettings('benefits', next);
                        }}
                        className="rounded-lg border border-neutral-200 px-2 py-2 text-sm"
                        placeholder="Description"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = draftSettings.benefits.filter((_, i) => i !== index);
                          updateSettings('benefits', next);
                        }}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600"
                        aria-label="Remove benefit item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSettings('benefits', [
                      ...(draftSettings.benefits || []),
                      { icon: 'Sparkles', title: 'New Benefit', text: 'Describe this benefit.' },
                    ])
                  }
                  className="mt-3 rounded-full border border-neutral-200 px-4 py-2 text-sm"
                >
                  + Add New Benefit
                </button>
              </div>

              <div className="rounded-xl border border-neutral-200 p-4">
                <h2 className="text-lg font-semibold text-neutral-900">Testimonials</h2>
                <div className="mt-3 space-y-2">
                  {(draftSettings.testimonials || []).map((item, index) => (
                    <div key={`${item.name}-${index}`} className="grid gap-2 rounded-lg border border-neutral-200 p-2 md:grid-cols-4">
                      <input
                        value={item.name}
                        onChange={(e) => {
                          const next = [...draftSettings.testimonials];
                          next[index] = { ...next[index], name: e.target.value };
                          updateSettings('testimonials', next);
                        }}
                        className="rounded-lg border border-neutral-200 px-2 py-2 text-sm"
                        placeholder="Customer name"
                      />
                      <input
                        value={item.detail}
                        onChange={(e) => {
                          const next = [...draftSettings.testimonials];
                          next[index] = { ...next[index], detail: e.target.value };
                          updateSettings('testimonials', next);
                        }}
                        className="rounded-lg border border-neutral-200 px-2 py-2 text-sm"
                        placeholder="City/area"
                      />
                      <input
                        value={item.stars}
                        type="number"
                        min={1}
                        max={5}
                        onChange={(e) => {
                          const next = [...draftSettings.testimonials];
                          next[index] = { ...next[index], stars: Number(e.target.value) || 5 };
                          updateSettings('testimonials', next);
                        }}
                        className="rounded-lg border border-neutral-200 px-2 py-2 text-sm"
                        placeholder="Stars"
                      />
                      <input
                        value={item.quote}
                        onChange={(e) => {
                          const next = [...draftSettings.testimonials];
                          next[index] = { ...next[index], quote: e.target.value };
                          updateSettings('testimonials', next);
                        }}
                        className="rounded-lg border border-neutral-200 px-2 py-2 text-sm md:col-span-4"
                        placeholder="Review text"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = draftSettings.testimonials.filter((_, i) => i !== index);
                          updateSettings('testimonials', next);
                        }}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 md:col-span-4 md:justify-self-end"
                        aria-label="Remove testimonial"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSettings('testimonials', [
                      ...(draftSettings.testimonials || []),
                      {
                        name: 'New Customer',
                        detail: 'City',
                        stars: 5,
                        quote: 'Write customer feedback here.',
                      },
                    ])
                  }
                  className="mt-3 rounded-full border border-neutral-200 px-4 py-2 text-sm"
                >
                  + Add New Review
                </button>
              </div>

              <button
                type="button"
                onClick={saveSettings}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white"
              >
                <Save className="h-4 w-4" />
                Save Homepage Sections
              </button>
            </section>
          ) : null}

          {activeTab === 'branding' ? (
            <section className="space-y-6">
              <h1 className="text-2xl font-bold text-neutral-900">Branding</h1>
              <label className="block text-sm font-medium text-neutral-700">
                Announcement bar text
                <input
                  value={draftSettings.announcementText}
                  onChange={(e) => updateSettings('announcementText', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
                />
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-neutral-700">
                <input
                  type="checkbox"
                  checked={draftSettings.enableGlobalShopping !== false}
                  onChange={(e) => updateSettings('enableGlobalShopping', e.target.checked)}
                  className="w-4 h-4 text-brand border-neutral-300 rounded focus:ring-brand"
                />
                Enable Global Shopping (Show "Add to Cart" buttons)
              </label>
              <label className="block text-sm font-medium text-neutral-700">
                Primary theme color
                <input
                  type="color"
                  value={draftSettings.themeColor}
                  onChange={(e) => updateSettings('themeColor', e.target.value)}
                  className="mt-1 h-12 w-24 rounded-lg border border-neutral-200"
                />
              </label>
              <label className="block text-sm font-medium text-neutral-700">
                About us / Our story
                <textarea
                  rows={6}
                  value={draftSettings.aboutStory}
                  onChange={(e) => updateSettings('aboutStory', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
                />
              </label>
              <label className="block text-sm font-medium text-neutral-700">
                Branding image upload (uses header logo)
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) =>
                    uploadImageToSettings(e, (data) =>
                      setDraftSettings((prev) => ({
                        ...prev,
                        header: { ...prev.header, logoImage: data },
                      })),
                    )
                  }
                  className="mt-1 block w-full text-sm"
                />
              </label>
              <button
                type="button"
                onClick={saveSettings}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white"
              >
                <Save className="h-4 w-4" />
                Save Branding
              </button>
            </section>
          ) : null}

          {activeTab === 'business' ? (
            <section className="space-y-6">
              <h1 className="text-2xl font-bold text-neutral-900">Business Settings</h1>
              
              {/* Sender Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-neutral-800">Sender Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block text-sm font-medium text-neutral-700">
                    Business Name
                    <input
                      type="text"
                      value={businessSettings.sender.name}
                      onChange={(e) => setBusinessSettings(prev => ({
                        ...prev,
                        sender: { ...prev.sender, name: e.target.value }
                      }))}
                      className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
                    />
                  </label>
                  
                  <label className="block text-sm font-medium text-neutral-700">
                    Phone Number
                    <input
                      type="text"
                      value={businessSettings.sender.phone}
                      onChange={(e) => setBusinessSettings(prev => ({
                        ...prev,
                        sender: { ...prev.sender, phone: e.target.value }
                      }))}
                      className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
                    />
                  </label>
                </div>
                
                <label className="block text-sm font-medium text-neutral-700">
                  Email Address
                  <input
                    type="email"
                    value={businessSettings.sender.email}
                    onChange={(e) => setBusinessSettings(prev => ({
                      ...prev,
                      sender: { ...prev.sender, email: e.target.value }
                    }))}
                    className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
                  />
                </label>
                
                <label className="block text-sm font-medium text-neutral-700">
                  Business Address
                  <textarea
                    rows={3}
                    value={businessSettings.sender.address}
                    onChange={(e) => setBusinessSettings(prev => ({
                      ...prev,
                      sender: { ...prev.sender, address: e.target.value }
                    }))}
                    className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
                  />
                </label>
              </div>

              {/* Delivery Settings */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-neutral-800">Delivery Settings</h2>
                
                <label className="block text-sm font-medium text-neutral-700">
                  Delivery Charges (RS)
                  <input
                    type="number"
                    value={businessSettings.delivery.charge}
                    onChange={(e) => setBusinessSettings(prev => ({
                      ...prev,
                      delivery: { ...prev.delivery, charge: Number(e.target.value) || 0 }
                    }))}
                    className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
                  />
                </label>
                
                <label className="block text-sm font-medium text-neutral-700">
                  Delivery Description
                  <input
                    type="text"
                    value={businessSettings.delivery.description}
                    onChange={(e) => setBusinessSettings(prev => ({
                      ...prev,
                      delivery: { ...prev.delivery, description: e.target.value }
                    }))}
                    className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
                  />
                </label>
              </div>

              {/* Invoice Settings */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-neutral-800">Invoice Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block text-sm font-medium text-neutral-700">
                    Invoice Prefix
                    <input
                      type="text"
                      value={businessSettings.invoice.prefix}
                      onChange={(e) => setBusinessSettings(prev => ({
                        ...prev,
                        invoice: { ...prev.invoice, prefix: e.target.value }
                      }))}
                      className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
                    />
                  </label>
                  
                  <label className="block text-sm font-medium text-neutral-700">
                    Starting Number
                    <input
                      type="number"
                      value={businessSettings.invoice.startNumber}
                      onChange={(e) => setBusinessSettings(prev => ({
                        ...prev,
                        invoice: { ...prev.invoice, startNumber: Number(e.target.value) || 1 }
                      }))}
                      className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
                    />
                  </label>
                </div>
              </div>

              {/* Meta Pixel Settings */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-neutral-800">Meta Pixel Settings</h2>
                
                <label className="block text-sm font-medium text-neutral-700">
                  Meta Pixel ID
                  <input
                    type="text"
                    value={businessSettings.metaPixelId || ''}
                    onChange={(e) => setBusinessSettings(prev => ({
                      ...prev,
                      metaPixelId: e.target.value
                    }))}
                    placeholder="Enter your Facebook Meta Pixel ID (optional)"
                    className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => {
                  saveBusinessSettings(businessSettings);
                  alert('Business settings saved successfully!');
                }}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white"
              >
                <Save className="h-4 w-4" />
                Save Business Settings
              </button>
            </section>
          ) : null}
        </main>
      </div>

      {/* Order Management Modal */}
      {showOrderManage && selectedOrder && (
        <OrderManageModal
          order={selectedOrder}
          products={products}
          onClose={() => {
            setShowOrderManage(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {/* AWB Print Modal */}
      {showAWB && selectedOrder && (
        <AWBPrint
          order={selectedOrder}
          onClose={() => {
            setShowAWB(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {/* Invoice Print Modal */}
      {showInvoicePrint && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">Print Invoice</h2>
              <button
                onClick={() => {
                  setShowInvoicePrint(false);
                  setSelectedOrder(null);
                }}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Invoice Component */}
            <Invoice order={selectedOrder} showPrintButton={false} />
            
            {/* Print Actions */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Now
              </button>
              <button
                onClick={() => {
                  setShowInvoicePrint(false);
                  setSelectedOrder(null);
                }}
                className="flex-1 bg-neutral-200 text-neutral-800 px-6 py-3 rounded-lg hover:bg-neutral-300 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
