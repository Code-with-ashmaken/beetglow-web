export default function FaqsPage() {
  const faqs = [
    [
      'Beet stains my sink — legit?',
      'Yes — pigments are real. rinse immediately warm water + soda paste on porcelain weekly.',
    ],
    [
      'Multani dries me flaky — okay?',
      'Shorten masking time oily zones only hydrate after with BeetGlow balm or plain aloe.',
    ],
    [
      'Shelf life powders?',
      'Seal airtight away from lahori steam — approximate 24 months virgin batch.',
    ],
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
      <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">
        Frequently asked beet & clay questions
      </h1>
      <dl className="mt-10 space-y-8">
        {faqs.map(([q, a]) => (
          <div key={q}>
            <dt className="text-lg font-semibold text-neutral-900">{q}</dt>
            <dd className="mt-2 text-neutral-700">{a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
