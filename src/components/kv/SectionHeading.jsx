import Reveal from '@/components/kv/Reveal.jsx';

// Eyebrow + serif heading + optional lead, in the studio's editorial style.
// `emphasis` italicises (and golds) a trailing part of the SAME title text —
// styling only, the words are unchanged.
export default function SectionHeading({ eyebrow, title, emphasis, lead, dark = false, align = 'left', split = false, className = '' }) {
  const center = align === 'center';
  let main = title;
  let em = null;
  if (emphasis && title.endsWith(emphasis)) {
    main = title.slice(0, title.length - emphasis.length);
    em = emphasis;
  }
  return (
    <Reveal
      className={`${split ? 'flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-12' : ''} ${center ? 'text-center' : ''} mb-12 lg:mb-16 ${className}`}
    >
      <div className={center ? 'mx-auto max-w-[820px]' : 'max-w-[760px]'}>
        {eyebrow && (
          <span className={`kv-eyebrow ${center ? 'kv-eyebrow--center' : ''} ${dark ? 'kv-eyebrow--dark' : ''}`}>{eyebrow}</span>
        )}
        <h2 className={`kv-h2 ${dark ? 'kv-h2--dark' : ''}`}>
          {main}
          {em && <em>{em}</em>}
        </h2>
      </div>
      {lead && (
        <p className={`kv-lead ${dark ? 'kv-lead--dark' : ''} ${center ? 'mx-auto mt-5' : split ? 'lg:max-w-[420px] lg:pb-2' : 'mt-5'}`}>
          {lead}
        </p>
      )}
    </Reveal>
  );
}
