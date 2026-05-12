import { CONTACT_EMAIL, WHATSAPP_PHONE } from '../config/store';

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
      <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">
        Contact BeetGlow concierge
      </h1>
      <p className="mt-6 leading-relaxed text-neutral-700">
        Need help customizing a COD drop for your mohalla or matching the right pack
        size for hostel life? Ping us —
      </p>
      <ul className="mt-6 space-y-3 text-neutral-900">
        <li>
          <span className="font-semibold">Email:</span>{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-brand underline underline-offset-4 hover:text-brand-dark"
          >
            {CONTACT_EMAIL}
          </a>
        </li>
        <li className="tabular-nums">
          <span className="font-semibold">WhatsApp / voice:</span> +
          {WHATSAPP_PHONE}
        </li>
      </ul>
      <p className="mt-8 text-sm text-neutral-600">
        Response windows: Mon–Sat, 11:00 AM – 7:30 PM PKT. Sunday dispatch only
        for prepaid VIP lane.
      </p>
    </div>
  );
}
