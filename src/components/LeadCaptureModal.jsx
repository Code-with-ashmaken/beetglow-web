import { useEffect, useState } from 'react';
import { Gift, X } from 'lucide-react';

const STORAGE_DISMISS = 'beetglow_lead_popup_dismissed';
const STORAGE_LEADS = 'beetglow_leads';

function saveLead(email) {
  try {
    const raw = localStorage.getItem(STORAGE_LEADS);
    const list = raw ? JSON.parse(raw) : [];
    list.push({ email, at: new Date().toISOString() });
    localStorage.setItem(STORAGE_LEADS, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export default function LeadCaptureModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_DISMISS)) return;
    } catch {
      return;
    }
    const t = setTimeout(() => setOpen(true), 4500);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_DISMISS, '1');
    } catch {
      /* ignore */
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) return;
    saveLead(trimmed);
    setSubmitted(true);
    setTimeout(() => {
      dismiss();
    }, 1600);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-title"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 rounded-full p-2 text-gray-500 hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="bg-gradient-to-r from-brand to-brand-light px-6 py-8 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <Gift className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <h2 id="lead-title" className="text-xl font-bold">
                BeetGlow insider savings
              </h2>
              <p className="text-sm text-white/85">
                Organic skin care tips, Multani + beet routiners, and launches.
              </p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
          {submitted ? (
            <p className="text-center font-medium text-brand">
              You’re in — check your inbox soon.
            </p>
          ) : (
            <>
              <label className="block text-sm font-medium text-gray-700">
                Email
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Unlock discount
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="w-full text-center text-sm text-gray-500 underline-offset-2 hover:underline"
              >
                No thanks
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
