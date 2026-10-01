'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, ChevronRight } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];
const sized = (url, w) => (url?.startsWith('https://images.unsplash.com') ? `${url}?auto=format&fit=crop&w=${w}&q=75` : url);

// Inner-page hero in the studio style: photograph under a navy wash,
// left-aligned serif title with an optional italic-gold ending (styling
// only — `emphasis` must be the literal end of `title`), gold-rule eyebrow,
// optional breadcrumb and tick badges.
export default function PageHero({ image, images, eyebrow, title, emphasis, lead, breadcrumb, badges }) {
  let main = title;
  let em = null;
  if (emphasis && title.endsWith(emphasis)) {
    main = title.slice(0, title.length - emphasis.length);
    em = emphasis;
  }
  const photos = (images || [image]).filter(Boolean);

  return (
    <section className="relative isolate overflow-hidden bg-[#070A25] text-white">
      <div className="absolute inset-0 -z-10">
        {photos.length > 1 ? (
          <div className="grid h-full grid-cols-2 md:grid-cols-4">
            {photos.map((src, i) => (
              <img key={src + i} src={sized(src, 700)} alt="" className={`kv-settle h-full w-full object-cover ${i > 1 ? 'hidden md:block' : ''}`} />
            ))}
          </div>
        ) : (
          photos[0] && <img src={sized(photos[0], 1800)} alt="" fetchPriority="high" className="kv-settle h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,37,0.62)_0%,rgba(7,10,37,0.84)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,10,37,0.55)_0%,rgba(7,10,37,0)_70%)]" />
      </div>

      {/* Architectural hairline frame, desktop only */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden lg:block" aria-hidden="true">
        <div className="kv-wrap">
          <div className="h-px bg-gradient-to-r from-[#F2B21B]/60 via-white/15 to-transparent" />
        </div>
      </div>

      <div className="kv-wrap pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24">
        {breadcrumb && (
          <motion.nav
            aria-label="Breadcrumb"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.18em] text-white/60"
          >
            <Link href="/" className="hover:text-[#F2B21B] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="text-white/90" aria-current="page">{breadcrumb}</span>
          </motion.nav>
        )}

        {eyebrow && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="kv-eyebrow kv-eyebrow--dark !mb-6"
          >
            {eyebrow}
          </motion.p>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: EASE }}
          className="font-serif text-[clamp(38px,5.4vw,76px)] leading-[1.06] tracking-[-0.02em] max-w-[15em] text-white"
        >
          {main}
          {em && <em className="italic text-[#F6D47C]">{em}</em>}
        </motion.h1>

        {lead && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
            className="mt-6 max-w-[620px] text-[16px] sm:text-[17px] leading-[1.75] text-white/75"
          >
            {lead}
          </motion.p>
        )}

        {badges && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-[12px] font-bold uppercase tracking-[0.16em] text-white/85"
          >
            {badges.map((badge) => (
              <li key={badge} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#F2B21B]" strokeWidth={1.75} aria-hidden="true" />
                {badge}
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
}
