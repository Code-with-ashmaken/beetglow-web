import { useSiteData } from '../context/SiteDataContext';

export default function AboutPage() {
  const { settings } = useSiteData();
  const paragraphs = (settings.aboutStory || '')
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
      <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">
        About BeetGlow
      </h1>
      {paragraphs.map((text, idx) => (
        <p
          key={text}
          className={idx === 0 ? 'mt-6 text-lg leading-relaxed text-neutral-600' : 'mt-4 leading-relaxed text-neutral-700'}
        >
          {text}
        </p>
      ))}
    </div>
  );
}
