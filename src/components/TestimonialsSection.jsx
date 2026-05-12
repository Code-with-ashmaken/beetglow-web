import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

const STAR_COUNT = 5;

export default function TestimonialsSection() {
  const { settings } = useSiteData();
  const reviews = settings.testimonials || [];
  const [i, setI] = useState(0);
  const safe = reviews.length ? i % reviews.length : 0;

  const next = useCallback(() => {
    if (!reviews.length) return;
    setI((x) => (x + 1) % reviews.length);
  }, [reviews.length]);

  useEffect(() => {
    const t = setInterval(next, 8000);
    return () => clearInterval(t);
  }, [next]);

  const r = reviews[safe];
  if (!r) return null;

  return (
    <section
      id="reviews"
      className="scroll-mt-28 border-t border-neutral-200 bg-white px-4 py-14 md:py-16"
      aria-labelledby="reviews-heading"
    >
      <div className="mx-auto max-w-3xl">
        <h2
          id="reviews-heading"
          className="text-center text-2xl font-bold text-neutral-900 md:text-3xl"
        >
          Rang-e-Pak testimonials
        </h2>
        <p className="mt-2 text-center text-neutral-600 md:text-lg">
          Honest slips from girls who COD every month — BeetGlow appreciates the
          love.
        </p>

        <div className="relative mt-10 min-h-[220px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={r.quote}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.4 }}
              className="relative rounded-3xl border border-brand-beige bg-brand-muted/40 p-8 shadow-sm md:p-10"
              role="group"
              aria-roledescription="slide"
              aria-label={`Review ${safe + 1} of ${reviews.length}`}
            >
              <div className="mb-4 flex justify-center gap-0.5" aria-hidden>
                {Array.from({ length: Math.max(1, Math.min(STAR_COUNT, r.stars || STAR_COUNT)) }).map((_, si) => (
                  <Star
                    key={si}
                    className="h-5 w-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <blockquote className="text-center text-lg font-medium italic leading-snug text-neutral-800 md:text-xl">
                “{r.quote}”
              </blockquote>
              <footer className="mt-8 text-center text-sm font-semibold text-brand">
                {r.name}
                <span className="block text-xs font-normal text-neutral-600">
                  {r.detail}
                </span>
              </footer>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-center gap-6">
            <button
              type="button"
              disabled={!reviews.length}
              onClick={() =>
                setI((x) => (x - 1 + reviews.length) % reviews.length)
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-brand shadow-sm hover:bg-brand-beige"
              aria-label="Previous review"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              disabled={!reviews.length}
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-brand shadow-sm hover:bg-brand-beige"
              aria-label="Next review"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {reviews.map((_, dot) => (
              <button
                key={`rev-dot-${dot}`}
                type="button"
                onClick={() => setI(dot)}
                className={`h-2 rounded-full transition-all ${
                  dot === safe ? 'w-8 bg-brand' : 'w-2 bg-neutral-300'
                }`}
                aria-label={`Show review ${dot + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
