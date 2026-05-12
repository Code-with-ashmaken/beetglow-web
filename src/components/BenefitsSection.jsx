import {
  Droplets,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Sparkles,
  SunMedium,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSiteData } from '../context/SiteDataContext';

const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.085,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function BenefitsSection() {
  const { settings } = useSiteData();
  const iconMap = {
    Leaf,
    Droplets,
    ShieldCheck,
    Sparkles,
    SunMedium,
    HeartHandshake,
  };
  const benefits = settings.benefits || [];

  return (
    <section
      id="benefits"
      className="scroll-mt-28 border-y border-brand-dark/25 bg-brand px-4 py-14 md:py-20"
      aria-labelledby="benefits-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2
            id="benefits-heading"
            className="text-2xl font-bold tracking-tight text-white md:text-3xl"
          >
            Why Karachi &amp; Lahore beauties trust BeetGlow
          </h2>
          <p className="mt-3 text-brand-beige md:text-lg">
            Forest-green formulations with desert-climate logic — earthy beige
            contrasts keep your feed luxe AF.
          </p>
        </div>
        <motion.ul
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
        >
          {benefits.map(({ icon, title, text }) => {
            const Icon = iconMap[icon] || Sparkles;
            return (
            <motion.li
              key={title}
              variants={itemVariants}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-sm transition hover:bg-white/[0.08]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-beige text-brand">
                <Icon className="h-6 w-6" aria-hidden strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-soft">
                {text}
              </p>
            </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
