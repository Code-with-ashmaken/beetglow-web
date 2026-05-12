import { Mail, MessageCircle } from 'lucide-react';
import { SOCIAL } from '../config/store';
import { useSiteData } from '../context/SiteDataContext';
import TikTokGlyph from './icons/TikTokGlyph';

const ICON_WRAP =
  'flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20';

function IconFacebook(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M22 12.06C22 6.49 17.52 2 11.94 2S2 6.49 2 12.06c0 4.93 3.66 9.03 8.43 9.78v-6.93H8.89v-2.87h1.54V9.41c0-1.52.9-2.35 2.28-2.35.66 0 1.37.12 1.37.12v2.52h-.77c-.76 0-1 .47-1 .95v1.66h2.71l-.43 2.87h-2.28v6.93c4.78-.75 8.43-4.84 8.43-9.78z" />
    </svg>
  );
}

function IconInstagram(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.66-4.43a1.07 1.07 0 1 1-2.14 0 1.07 1.07 0 0 1 2.14 0z" />
    </svg>
  );
}

export default function HeaderTopBar() {
  const { settings } = useSiteData();
  return (
    <div className="bg-brand-dark text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 text-xs">
        <p className="font-medium tracking-wide text-brand-beige opacity-95">
          {settings.announcementText}
        </p>
        <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2">
          <a
            href={SOCIAL.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className={ICON_WRAP}
            aria-label="Facebook"
          >
            <IconFacebook className="h-3.5 w-3.5" />
          </a>
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={ICON_WRAP}
            aria-label="Instagram"
          >
            <IconInstagram className="h-3.5 w-3.5" />
          </a>
          <a
            href={SOCIAL.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className={ICON_WRAP}
            aria-label="TikTok"
          >
            <TikTokGlyph className="h-3.5 w-3.5" />
          </a>
          <a
            href={SOCIAL.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={ICON_WRAP}
            aria-label="WhatsApp"
          >
            <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.75} />
          </a>
          <a href={SOCIAL.mailto} className={ICON_WRAP} aria-label="Gmail email">
            <Mail className="h-3.5 w-3.5" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </div>
  );
}
