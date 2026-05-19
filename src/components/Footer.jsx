import { Link } from 'react-router-dom';
import { Camera, Globe, Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import {
  STORE_NAME,
  STORE_TAGLINE,
  CONTACT_EMAIL,
  WHATSAPP_PHONE,
} from '../config/store';
import TikTokGlyph from './icons/TikTokGlyph';
import { useSiteData } from '../context/SiteDataContext';

const linkTone =
  'text-neutral-600 transition hover:text-brand';

export default function Footer() {
  const { settings } = useSiteData();
  const quickLinks = settings.footer?.quickLinks || [];
  const socials = settings.footer?.socials || [];
  const copyrightText = settings.footer?.copyrightText || '';
  const showQuickLinks = settings.footer?.showQuickLinks !== false;
  const socialIcon = {
    Facebook: Globe,
    Instagram: Camera,
    TikTok: TikTokGlyph,
    WhatsApp: MessageCircle,
    Email: Mail,
  };

  return (
    <footer className="border-t border-neutral-200 bg-brand-muted/70">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <section>
          <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-brand">
            About us
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            {STORE_NAME} is a premium organic skincare line built around
            Beetroot powders and cosmetic-grade Multani mud — ethically tuned
            for Pakistan’s humid cities and dusty winters alike.
          </p>
          <Link to="/about" className={`mt-4 inline-block text-sm font-semibold ${linkTone}`}>
            Read full story →
          </Link>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-brand">
            Contact us
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-neutral-600">
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <a href={`mailto:${CONTACT_EMAIL}`} className={`${linkTone} underline-offset-4 hover:underline`}>
                {CONTACT_EMAIL}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <span className="tabular-nums">+{WHATSAPP_PHONE}</span>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              Online-first · Dispatch Karachi & Lahore hubs
            </li>
          </ul>
          <Link to="/contact" className={`mt-5 inline-block text-sm font-semibold ${linkTone}`}>
            Leave a detailed message →
          </Link>
        </section>

        {showQuickLinks ? (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-brand">
              Quick links
            </h2>
            <ul className="mt-4 space-y-2 text-sm font-medium">
              {quickLinks.map((item) => (
                <li key={`${item.label}-${item.to}`}>
                  <Link to={item.to} className={linkTone}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <section />
        )}

        <section>
          <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-brand">
            Newsletter
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            Masking cheatsheets, COD updates, humid-day skincare tips Lahore /
            Karachi edition.
          </p>
          <Link
            to="/#skin-care-routine"
            className={`mt-4 inline-block rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark`}
          >
            Get checklist
          </Link>
          <div className="mt-5 flex flex-wrap gap-2">
            {socials.map((social) => {
              const Icon = socialIcon[social.platform] || MessageCircle;
              return (
                <a
                  key={`${social.platform}-${social.url}`}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-brand transition hover:bg-brand-muted"
                  aria-label={social.platform}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </section>
      </div>

      <div className="border-t border-neutral-200 bg-white/80 px-4 py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center text-xs text-neutral-500 md:flex-row md:text-left">
          <p>
            {copyrightText.replace('{year}', String(new Date().getFullYear())) ||
              `© ${new Date().getFullYear()} ${STORE_NAME}. ${STORE_TAGLINE}.`}
          </p>
          <p className="text-neutral-400">
            Ingredients lists may evolve — patch test forever.
          </p>
        </div>
      </div>
    </footer>
  );
}
