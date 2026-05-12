import { buildGeneralOrderWhatsAppUrl } from '../utils/whatsapp';
import { trackInitiateCheckout } from '../utils/fbPixel';
import WhatsAppGlyph from './icons/WhatsAppGlyph';

const FAB_LABEL = 'Order on WhatsApp';

export default function WhatsAppFab() {
  const url = buildGeneralOrderWhatsAppUrl();

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackInitiateCheckout(0, [])}
      className="fixed bottom-5 right-5 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl ring-4 ring-white transition hover:scale-[1.04] hover:bg-[#20bd5a]"
      aria-label={FAB_LABEL}
      title={FAB_LABEL}
    >
      <WhatsAppGlyph className="h-9 w-9 text-white" />
    </a>
  );
}
