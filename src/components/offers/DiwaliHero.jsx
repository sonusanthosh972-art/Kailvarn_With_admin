'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Palette, PaintRoller, Gem, House, Timer, Trophy, ShieldCheck, Users } from 'lucide-react';

import { useWhatsAppLink } from '@/hooks/useWhatsAppLink.js';
import { DIWALI_OFFER, DIWALI_HERO_IMAGE } from '@/constants/offers.js';
import Diya from '@/components/offers/Diya.jsx';
import { Crest, Mandala, Scroll } from '@/components/offers/Ornaments.jsx';
import { cinzel } from '@/components/offers/fonts.js';

const EASE = [0.16, 1, 0.3, 1];

const features = [
  { icon: PaintRoller, label: ['All Paint', 'Brands'] },
  { icon: Gem, label: ['Premium', 'Finish'] },
  { icon: House, label: ['Full Home', 'Interior & Painting'] },
  { icon: Timer, label: ['Limited', 'Time Offer'] },
];

const trust = [
  { icon: Trophy, text: '100+ Homes Delivered' },
  { icon: ShieldCheck, text: '5-Year Warranty' },
  { icon: Users, text: 'Serving Silvassa & Vapi' },
];

// Fixed positions (not random) so server and client render the same markup.
const embers = [
  { left: '4%', bottom: '10%', size: 6, delay: '0s', dur: '7s', drift: '14px' },
  { left: '9%', bottom: '22%', size: 4, delay: '1.8s', dur: '8s', drift: '-10px' },
  { left: '14%', bottom: '6%', size: 5, delay: '3.2s', dur: '6.5s', drift: '8px' },
  { left: '19%', bottom: '30%', size: 3, delay: '0.9s', dur: '9s', drift: '18px' },
  { left: '26%', bottom: '14%', size: 4, delay: '4.4s', dur: '7.5s', drift: '-6px' },
  { left: '33%', bottom: '40%', size: 3, delay: '2.6s', dur: '8.5s', drift: '12px' },
  { left: '41%', bottom: '8%', size: 5, delay: '5.1s', dur: '7s', drift: '-14px' },
  { left: '52%', bottom: '18%', size: 3, delay: '1.2s', dur: '9.5s', drift: '10px' },
  { left: '61%', bottom: '34%', size: 4, delay: '3.8s', dur: '8s', drift: '-8px' },
  { left: '70%', bottom: '12%', size: 3, delay: '0.4s', dur: '7.5s', drift: '16px' },
  { left: '79%', bottom: '26%', size: 5, delay: '2.2s', dur: '8.5s', drift: '-12px' },
  { left: '87%', bottom: '9%', size: 4, delay: '4.8s', dur: '6.8s', drift: '9px' },
  { left: '94%', bottom: '38%', size: 3, delay: '1.5s', dur: '9s', drift: '-16px' },
];

const fadeUp = (delay, y = 18) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
});

const btnSize = '!min-h-[48px] !px-6 !tracking-[0.08em]';

// Desktop sizes follow the screen height (lg: values in vh) so the whole
// banner, buttons included, fits above the fold on laptops.
export default function DiwaliHero() {
  const { openWhatsApp } = useWhatsAppLink();
  const pct = DIWALI_OFFER.discount;

  return (
    <section
      className="relative isolate flex items-center min-h-[calc(100svh-68px)] lg:min-h-[calc(100svh-80px)] overflow-hidden bg-[#160904] text-white"
      aria-label={`Diwali offer: ${pct}% off painting`}
    >
      {/* ---- Photo + lighting ---- */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <img
          src={DIWALI_HERO_IMAGE.src}
          srcSet={DIWALI_HERO_IMAGE.srcSet}
          sizes="100vw"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="kv-settle w-full h-full object-cover object-[14%_center] md:object-[24%_center] lg:object-center"
        />
        {/* Phones & tablets: copy covers the photo, so a soft shade centred on it */}
        <div className="absolute inset-0 lg:hidden bg-[radial-gradient(ellipse_90%_60%_at_50%_48%,rgba(30,6,6,0.78)_0%,rgba(30,6,6,0.55)_60%,rgba(30,6,6,0.35)_100%)]" />
        {/* Desktop: shade only behind the copy; diyas, marigolds and sofa stay bright */}
        <div className="absolute inset-0 hidden lg:block bg-[radial-gradient(ellipse_32%_58%_at_36%_50%,rgba(28,5,5,0.82)_0%,rgba(28,5,5,0.55)_55%,rgba(28,5,5,0)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#120703]/70 to-transparent" />
        {/* Breathing lamp-light over the diyas and lanterns */}
        <div className="kv-diwali-glow absolute inset-0 mix-blend-screen bg-[radial-gradient(ellipse_30%_30%_at_6%_85%,rgba(255,130,20,0.4),transparent_70%),radial-gradient(ellipse_25%_35%_at_12%_25%,rgba(255,150,40,0.3),transparent_70%)]" />
        <div className="absolute inset-0 pointer-events-none">
          {embers.map((e, i) => (
            <span
              key={i}
              className={`kv-ember ${i % 2 ? 'hidden sm:block' : ''}`}
              style={{ left: e.left, bottom: e.bottom, width: e.size * 2, height: e.size * 2, '--kv-delay': e.delay, '--kv-dur': e.dur, '--kv-drift': e.drift }}
            />
          ))}
        </div>
      </div>

      {/* ---- Copy: centred on phones/tablets; on desktop centred at ~36% of the width, over the photo's dark side ---- */}
      <div className="w-full px-4 sm:px-8 py-10 sm:py-14 lg:px-0 lg:py-[3.5vh]">
        <div className="mx-auto w-full max-w-[720px] lg:mx-0 lg:ml-[max(24px,calc(36vw-390px))] lg:max-w-[780px] text-center">
          <motion.p
            {...fadeUp(0.1, 0)}
            className={`${cinzel.className} flex items-center justify-center gap-3 sm:gap-5 text-[12px] sm:text-[15px] lg:text-[clamp(13px,2.1vh,17px)] font-semibold uppercase tracking-[0.3em] text-[#FBEBC4] [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]`}
          >
            <span className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#E9B949]" aria-hidden="true" />
            This Festive Season
            <span className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#E9B949]" aria-hidden="true" />
          </motion.p>

          {/* Diwali + Special Offer */}
          <motion.h1 {...fadeUp(0.25, 28)} className="mt-8 sm:mt-10 lg:mt-[3.6vh]">
            <span className="relative inline-block font-serif font-bold leading-[0.92] tracking-[-0.01em] text-[clamp(78px,23vw,150px)] lg:text-[clamp(92px,16vh,160px)]">
              {/* Diya resting on top of the word */}
              <Diya className="absolute left-[51%] -translate-x-1/2 top-[-0.26em] w-[0.5em] h-[0.4em] [filter:drop-shadow(0_0_14px_rgba(255,170,40,0.85))]" />
              <span className="kv-gold-text block pb-[0.06em] [filter:drop-shadow(0_0_22px_rgba(255,170,40,0.55))_drop-shadow(0_3px_0_rgba(110,50,0,0.6))]">
                Diwali
              </span>
            </span>
            <span className={`${cinzel.className} mt-1 lg:mt-[0.6vh] flex items-center justify-center gap-2.5 sm:gap-4 font-semibold uppercase tracking-[0.04em] text-[clamp(25px,7.4vw,48px)] lg:text-[clamp(32px,6vh,52px)] text-[#F7D987] [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]`}>
              <Scroll className="w-[1.5em] sm:w-[1.9em] shrink-0 -scale-x-100" />
              Special Offer
              <Scroll className="w-[1.5em] sm:w-[1.9em] shrink-0" />
            </span>
            <span className="sr-only">: Get {pct}% off painting services with any paint brand</span>
          </motion.h1>

          {/* ---- Offer plaque: stacked up to tablets, one row from md; medallions sit on
               the ends and the side padding keeps the text clear of them ---- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
            className="relative mx-auto mt-7 sm:mt-8 lg:mt-[2.8vh] w-full max-w-[760px] px-5 md:px-10"
          >
            <Mandala className="absolute left-0 top-1/2 z-10 -translate-y-1/2 w-[46px] sm:w-[60px] md:w-[80px] lg:w-[clamp(72px,12vh,96px)] [filter:drop-shadow(0_0_10px_rgba(242,178,27,0.45))]" />
            <Mandala className="absolute right-0 top-1/2 z-10 -translate-y-1/2 w-[46px] sm:w-[60px] md:w-[80px] lg:w-[clamp(72px,12vh,96px)] [filter:drop-shadow(0_0_10px_rgba(242,178,27,0.45))]" />
            <div className="kv-offer-aura relative rounded-[14px] border-2 border-[#E9B949] bg-[radial-gradient(ellipse_at_center,#8E1B1F_0%,#5E0E12_60%,#3A0709_100%)] shadow-[inset_0_0_0_4px_#4A0A0D,inset_0_0_0_5px_rgba(246,212,124,0.55),0_18px_44px_-16px_rgba(0,0,0,0.85)]">
              <Crest className="absolute left-1/2 -top-[13px] w-[110px] -translate-x-1/2" />
              <div className="flex flex-col md:flex-row items-center justify-center gap-2.5 md:gap-5 px-9 sm:px-12 py-5 md:px-[60px] lg:px-[clamp(56px,7.5vh,68px)] lg:py-[1.8vh]">
                <p className="flex flex-col items-center md:items-start leading-none">
                  <span className="text-[17px] sm:text-[20px] lg:text-[clamp(18px,3vh,24px)] font-extrabold uppercase tracking-[0.04em] text-[#FBE7B0]">Get</span>
                  <span className="whitespace-nowrap font-sans font-extrabold tracking-[-0.02em] leading-[0.95] text-[clamp(44px,13vw,66px)] md:text-[58px] lg:text-[clamp(48px,7.4vh,64px)] bg-[linear-gradient(180deg,#FFF6CF_0%,#FFD45A_42%,#E9A115_72%,#B8740A_100%)] bg-clip-text text-transparent [filter:drop-shadow(0_3px_0_rgba(80,20,0,0.55))_drop-shadow(0_0_16px_rgba(255,190,60,0.35))]">
                    {pct}<span className="text-[0.78em]">%</span> OFF
                  </span>
                </p>
                <span className="h-px w-28 md:h-16 md:w-px bg-gradient-to-r md:bg-gradient-to-b from-transparent via-[#E9B949] to-transparent" aria-hidden="true" />
                <div className="flex flex-col items-center gap-2 md:gap-2.5">
                  <p className="whitespace-nowrap text-[14px] sm:text-[16px] lg:text-[clamp(14px,2.3vh,19px)] font-bold uppercase tracking-[0.04em] text-white">On Painting Services</p>
                  <p className="whitespace-nowrap bg-[linear-gradient(180deg,#FFE9A6_0%,#F2B21B_55%,#C98A12_100%)] px-6 py-1.5 md:px-7 text-[11.5px] sm:text-[13px] lg:text-[clamp(12px,1.85vh,15px)] font-extrabold uppercase tracking-[0.03em] text-[#3A0A0C] [clip-path:polygon(0_0,100%_0,94%_50%,100%_100%,0_100%,6%_50%)]">
                    With Any Paint Brand
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ---- Features ---- */}
          <motion.ul {...fadeUp(0.75)} className="mx-auto mt-6 sm:mt-7 lg:mt-[2.4vh] grid max-w-[560px] grid-cols-4">
            {features.map(({ icon: Icon, label }, i) => (
              <li key={label.join(' ')} className={`flex flex-col items-center px-1 sm:px-3 ${i > 0 ? 'border-l border-[#E9B949]/35' : ''}`}>
                <Icon className="w-7 h-7 sm:w-9 sm:h-9 lg:w-[clamp(28px,4.6vh,38px)] lg:h-[clamp(28px,4.6vh,38px)] text-[#F2B21B]" strokeWidth={1.4} aria-hidden="true" />
                <span className="mt-2 text-[10px] sm:text-[12px] lg:text-[clamp(11px,1.75vh,13px)] font-bold uppercase leading-[1.3] tracking-[0.04em] text-white/90">
                  {label[0]}<br />{label[1]}
                </span>
              </li>
            ))}
          </motion.ul>

          {/* ---- Buttons ---- */}
          <motion.div
            {...fadeUp(0.9)}
            className="mt-7 sm:mt-8 lg:mt-[2.6vh] flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3"
          >
            <Link href={DIWALI_OFFER.quotePath} className={`btn-primary w-full sm:w-auto ${btnSize}`}>
              Claim {pct}% Off <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link href={DIWALI_OFFER.visualizerPath} className={`btn-outline w-full sm:w-auto ${btnSize} !bg-black/25`}>
              <Palette className="w-[18px] h-[18px]" strokeWidth={1.75} aria-hidden="true" /> Visualise Colours
            </Link>
            <button
              type="button"
              onClick={() => openWhatsApp('', `Hi KailVarn! I saw your Diwali offer (${pct}% off painting). Please share details for my home.`)}
              className={`btn-outline w-full sm:w-auto ${btnSize} !bg-black/25`}
            >
              <WhatsAppIcon className="w-[18px] h-[18px]" /> WhatsApp Us
            </button>
          </motion.div>

          {/* ---- Trust row ---- */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-8 sm:mt-9 lg:mt-[2.6vh] pt-5 lg:pt-[1.8vh] border-t border-white/20 flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-0 gap-y-3 text-[11px] sm:text-[12.5px] font-bold uppercase tracking-[0.1em] text-white/90"
          >
            {trust.map(({ icon: Icon, text }, i) => (
              <li key={text} className="flex items-center">
                {i > 0 && <span className="mx-6 hidden h-6 w-px bg-white/35 sm:block" aria-hidden="true" />}
                <Icon className="mr-2.5 w-5 h-5 sm:w-6 sm:h-6 text-[#F2B21B] fill-[#F2B21B]/80" strokeWidth={1.4} aria-hidden="true" />
                {text}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 8.23 8.24c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06a6.7 6.7 0 0 1-1.99-1.23 7.5 7.5 0 0 1-1.38-1.72c-.14-.25 0-.38.11-.5.11-.11.25-.29.37-.44.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  );
}
