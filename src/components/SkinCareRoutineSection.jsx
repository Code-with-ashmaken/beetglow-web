import { useState } from 'react';
import { Check, Mail, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'beetglow_routine_interest';

function saveLead(payload) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.push(payload);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

const STEPS = [
  {
    title: 'Cleanse',
    body: 'Sweep away SPF and city dust with a gentle, sulfate-free wash.',
  },
  {
    title: 'Treat — Beet or Multani',
    body: 'Use beetroot powder blended with water or rose water for glow, or Multani mud for oil control — never on the same night.',
  },
  {
    title: 'Moisturize & protect',
    body: 'Lock in hydration and finish with SPF in the daytime for lasting results.',
  },
];

export default function SkinCareRoutineSection() {
  const [email, setEmail] = useState('');
  const [skinType, setSkinType] = useState('combination');
  const [done, setDone] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) return;
    saveLead({
      email: trimmed,
      skinType,
      source: 'routine_section',
      at: new Date().toISOString(),
    });
    setDone(true);
    setEmail('');
  }

  return (
    <section
      id="skin-care-routine"
      aria-labelledby="routine-heading"
      className="scroll-mt-28 border-y border-brand-beige/80 bg-brand-beige/35 py-14 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand ring-1 ring-brand/15">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Lead magnet
            </p>
            <h2
              id="routine-heading"
              className="mt-3 text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl"
            >
              Skin Care Routine
            </h2>
            <p className="mt-3 max-w-md text-neutral-600">
              Get a concise BeetGlow cheat sheet plus tips for pairing Beetroot
              Powder with Multani Mud — built for Pakistani weather and oily /
              combo skin.
            </p>
            <ul className="mt-8 space-y-4">
              {STEPS.map((s) => (
                <li
                  key={s.title}
                  className="flex gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                    <Check className="h-4 w-4 stroke-[3]" aria-hidden />
                  </span>
                  <div>
                    <p className="font-semibold text-neutral-900">{s.title}</p>
                    <p className="mt-1 text-sm text-neutral-600">{s.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-lg font-semibold text-neutral-900 md:text-xl">
                Send me the printable routine checklist
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                We’ll email a one-page PDF overview. No spam — unsubscribe anytime.
              </p>
              {done ? (
                <p className="mt-6 rounded-2xl border border-brand-soft bg-brand-muted px-4 py-4 text-center font-medium text-brand">
                  You&apos;re set — thanks. Check your inbox in a minute.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <label className="block text-sm font-medium text-neutral-800">
                    Email
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </label>
                  <label className="block text-sm font-medium text-neutral-800">
                    Skin type
                    <select
                      value={skinType}
                      onChange={(e) => setSkinType(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    >
                      <option value="dry">Dry</option>
                      <option value="oily">Oily</option>
                      <option value="combination">Combination</option>
                      <option value="sensitive">Sensitive</option>
                    </select>
                  </label>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-white transition hover:bg-brand-dark md:w-auto md:min-w-[200px]"
                  >
                    <Mail className="h-4 w-4" aria-hidden />
                    Email my routine guide
                  </button>
                  <p className="text-center text-xs text-neutral-500 md:text-left">
                    Prefer chat? Tap the WhatsApp bubble — say “routine guide”.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
