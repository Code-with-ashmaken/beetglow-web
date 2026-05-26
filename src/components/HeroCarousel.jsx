import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { buttonClass } from './ui/Button';

const AUTOPLAY_MS = 6200;

const fade = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function HeroCarousel() {
  const { settings } = useSiteData();
  const slides = settings.sliderSlides || [];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = slides.length;

  useEffect(() => {
    if (index > total - 1) setIndex(0);
  }, [index, total]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, goNext]);

  const slide = slides[index];
  if (!slide) return null;

  return (
    <section
      className="relative w-full bg-brand-dark"
      aria-roledescription="carousel"
      aria-label="BeetGlow featured story"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="relative aspect-[10/13] min-h-[300px] sm:aspect-[4/5] md:aspect-[21/9] md:min-h-[320px] lg:min-h-[380px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.id}
            variants={fade}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 overflow-hidden bg-brand-dark"
          >
            {slide.layout === 'dual' ? (
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={slide.leftImage}
                  alt=""
                  className="h-full w-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                />
                <img
                  src={slide.rightImage}
                  alt=""
                  className="hidden"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ) : (
              <img
                src={slide.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover md:object-center"
                loading="lazy"
              />
            )}

            <div
              className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/75 to-transparent md:bg-gradient-to-r md:from-brand-dark/92 md:via-brand/55 md:to-transparent"
              aria-hidden
            />

            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end px-4 pb-12 pt-24 md:justify-center md:pb-14 md:pl-12 md:pt-14 lg:pb-16">
              <div className="mx-auto max-w-6xl md:mx-0 lg:mx-auto lg:w-full lg:max-w-6xl">
                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.45 }}
                  className="max-w-2xl text-2xl font-bold leading-snug tracking-tight text-white sm:text-4xl md:text-5xl"
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.45 }}
                  className="mt-3 max-w-xl text-sm text-brand-beige sm:text-base md:text-lg"
                >
                  {slide.subtitle}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.45 }}
                  className="mt-7"
                >
                  <a
                    href={slide.ctaHref}
                    className={buttonClass({ variant: 'light' })}
                  >
                    {slide.ctaLabel}
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2 md:bottom-6">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`pointer-events-auto h-2.5 rounded-full transition-all ${
                i === index
                  ? 'w-8 bg-white shadow'
                  : 'w-2.5 bg-white/40 hover:bg-white/75'
              }`}
              aria-label={`Slide ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goPrev}
          className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 rounded-full border border-white/35 bg-white/95 text-brand shadow-md backdrop-blur-sm transition hover:bg-white sm:h-10 sm:w-10 md:left-4 md:h-11 md:w-11"
          aria-label="Previous"
        >
          <ChevronLeft className="m-auto h-6 w-6" aria-hidden />
        </button>
        <button
          type="button"
          onClick={goNext}
          className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 rounded-full border border-white/35 bg-white/95 text-brand shadow-md backdrop-blur-sm transition hover:bg-white sm:h-10 sm:w-10 md:right-4 md:h-11 md:w-11"
          aria-label="Next"
        >
          <ChevronRight className="m-auto h-6 w-6" aria-hidden />
        </button>
      </div>
    </section>
  );
}