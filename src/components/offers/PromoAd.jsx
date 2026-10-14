'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CalendarCheck, CalendarClock, ChevronLeft, Gem, Palette, PaintRoller, ShieldCheck, X } from 'lucide-react';

import { DIWALI_OFFER } from '@/constants/offers.js';
import { fillPromoText, usePromo } from '@/components/offers/PromoProvider.jsx';
import Diya from '@/components/offers/Diya.jsx';
import { Crest, Mandala } from '@/components/offers/Ornaments.jsx';
import { cinzel } from '@/components/offers/fonts.js';

const EASE = [0.16, 1, 0.3, 1];
const FEATURE_ICONS = [PaintRoller, Gem, ShieldCheck, CalendarClock];
// Scrolling the page this far closes the advertisement.
const SCROLL_CLOSE_PX = 40;

// Remembers that the visitor has seen this version of the ad (editing it in
// admin shows it once more). Storage can be unavailable (private mode).
function seenKey(promo) {
  return `kv-promo-seen:${promo.version}`;
}
function hasSeen(promo) {
  if (promo.popup === 'always') return false;
  try {
    if (promo.popup === 'daily') return localStorage.getItem(seenKey(promo)) === new Date().toDateString();
    return sessionStorage.getItem(seenKey(promo)) === '1';
  } catch {
    return false;
  }
}
function markSeen(promo) {
  if (promo.popup === 'always') return;
  try {
    if (promo.popup === 'daily') localStorage.setItem(seenKey(promo), new Date().toDateString());
    else sessionStorage.setItem(seenKey(promo), '1');
  } catch { /* ignore */ }
}

// Site-wide advertisement. On the homepage it is the first thing a visitor
// sees: a card centred on screen (¾ of the height, 86% of the width).
// It closes with the ✕ button, Escape, a click outside it, or as soon as the
// visitor scrolls. A sticky tab on the right edge of every page reopens it.
export default function PromoAd() {
  const promo = usePromo();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedByVisitor, setOpenedByVisitor] = useState(false);
  const tabRef = useRef(null);

  // Homepage: open straight away, on every load/refresh by default (or once per
  // visit / per day, per the admin setting).
  useEffect(() => {
    if (!promo.active || promo.popup === 'tab' || pathname !== '/' || hasSeen(promo)) return;
    setOpenedByVisitor(false);
    setOpen(true);
    markSeen(promo);
  }, [promo, pathname]);

  // Close when navigating (e.g. after pressing the offer button).
  useEffect(() => { setOpen(false); }, [pathname]);

  const reopen = useCallback(() => {
    setOpenedByVisitor(true);
    setOpen(true);
  }, []);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    markSeen(promo);
    // Hand focus back to the tab so keyboard users aren't lost.
    if (returnFocus) requestAnimationFrame(() => tabRef.current?.focus({ preventScroll: true }));
  }, [promo]);

  if (!promo.active) return null;

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="tab"
            ref={tabRef}
            type="button"
            onClick={reopen}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            aria-label={`Open ${promo.tabLabel}`}
            className="fixed right-0 top-1/2 z-[60] flex -translate-y-1/2 flex-col items-center gap-2 rounded-l-xl border border-r-0 border-[#E9B949] bg-[linear-gradient(180deg,#7A1418_0%,#4A0A0D_100%)] px-1.5 py-3 text-[#FBE7B0] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] transition-[padding] hover:pr-2.5 sm:px-2 sm:py-4"
          >
            <ChevronLeft className="h-4 w-4 text-[#F6D47C]" aria-hidden="true" />
            <span className="rotate-180 font-nunito text-[12px] font-extrabold uppercase tracking-[0.12em] [writing-mode:vertical-rl] sm:text-[13px]">
              {promo.tabLabel}
            </span>
            <Diya className="h-6 w-7" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && <PromoCard promo={promo} onClose={close} focusOnOpen={openedByVisitor} />}
      </AnimatePresence>
    </>
  );
}

// Built-in photos: wide for laptops/desktops, closer to square for phones/tablets.
const PHOTO_DESKTOP = {
  src: '/offers/ad-desktop-1600.jpg',
  srcSet: '/offers/ad-desktop-1280.webp 1280w, /offers/ad-desktop-1920.webp 1920w',
};
const PHOTO_MOBILE = {
  src: '/offers/ad-mobile-1080.jpg',
  srcSet: '/offers/ad-mobile-640.webp 640w, /offers/ad-mobile-1080.webp 1080w',
};

const GOLD = '#FFD45A';
// The two buttons under "Claim": ivory outline on the photo, gold fill on hover.
const SECONDARY_BTN = 'inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-[#F6E3B4]/70 bg-[#1A0A04]/40 px-3 text-center text-[clamp(10.5px,min(1.9cqh,2.9cqw),13.5px)] font-bold uppercase leading-tight tracking-[0.06em] text-[#FFF8EC] backdrop-blur-[3px] transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#F2B21B] hover:bg-[#F2B21B] hover:text-[#3A0A0C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9B949] active:translate-y-0';
// Wide (laptop/desktop) card layout = [@container(min-width:820px)], written
// out in full in each class so Tailwind can see and generate it.

const rise = (delay) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE },
});

// Headline with the emphasised words painted in: a paint-roller swash sweeps
// across them and the gold lettering is revealed on it, the one
// signature motion of the ad (it's a painting offer).
function Headline({ text, emphasis }) {
  const reduce = useReducedMotion();
  const i = emphasis ? text.indexOf(emphasis) : -1;
  if (i < 0) return <>{text}</>;
  const before = text.slice(0, i);
  const after = text.slice(i + emphasis.length);
  return (
    <>
      {before}
      <span className="relative inline-block whitespace-nowrap">
        <motion.span
          aria-hidden="true"
          className="absolute -inset-x-[0.12em] bottom-[0.06em] top-[0.42em] -z-10 origin-left rounded-[0.35em_0.2em_0.4em_0.15em] bg-[linear-gradient(90deg,rgba(142,27,31,0.82),rgba(163,36,42,0.92)_55%,rgba(122,20,24,0.8))]"
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
        />
        <motion.span
          className="inline-block"
          style={{ color: GOLD }}
          initial={reduce ? false : { clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
        >
          {emphasis}
        </motion.span>
      </span>
      {after}
    </>
  );
}

// The card is a size container: every size inside uses cqh/cqw (percent of
// the card's height/width), so the design scales with the card on any screen.
// The photo stays clear; a warm-dark shade sits only behind the text (left side
// on wide cards, lighter all over on narrow ones) and the text is light.
function PromoCard({ promo, onClose, focusOnOpen }) {
  const closeRef = useRef(null);
  const t = (text) => fillPromoText(text, promo);
  const pct = promo.discount;
  const features = [promo.feature1, promo.feature2, promo.feature3, promo.feature4]
    .map((text, i) => ({ text: t(text), Icon: FEATURE_ICONS[i] }))
    .filter((f) => f.text);

  // Escape or scrolling the page closes it. Focus moves to ✕ only when the
  // visitor opened it from the tab (an automatic popup shouldn't steal focus).
  useEffect(() => {
    if (focusOnOpen) closeRef.current?.focus({ preventScroll: true });
    const startY = window.scrollY;
    const onScroll = () => { if (Math.abs(window.scrollY - startY) > SCROLL_CLOSE_PX) onClose(false); };
    // A wheel/swipe on the backdrop when the page can't move still means "go away".
    const onWheel = (e) => { if (Math.abs(e.deltaY) > 20 && !e.target.closest?.('[data-promo-card]')) onClose(false); };
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose, focusOnOpen]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[45] bg-[#1A0B05]/55 backdrop-blur-[3px]"
    >
      <motion.section
        data-promo-card
        aria-label={`${promo.title} offer: ${pct}% off`}
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
        transition={{ duration: 0.6, ease: EASE }}
        className="absolute inset-x-[7vw] inset-y-[12.5vh] isolate overflow-hidden rounded-2xl bg-[#1A0A04] text-white shadow-[0_40px_90px_-30px_rgba(20,6,2,0.85)] ring-1 ring-[#E9B949]/60 [container-type:size] selection:bg-[#F2B21B]/50 selection:text-[#1A0A04] supports-[height:100svh]:inset-y-[12.5svh]"
      >
        {/* Photo: settles from a slight zoom; admin upload replaces both built-in photos */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          {promo.customImage ? (
            <img src={promo.customImage} alt="" decoding="async" className="kv-settle h-full w-full object-cover" />
          ) : (
            <picture>
              <source media="(min-width: 1024px)" srcSet={PHOTO_DESKTOP.srcSet} sizes="86vw" type="image/webp" />
              <source srcSet={PHOTO_MOBILE.srcSet} sizes="86vw" type="image/webp" />
              <img
                src={PHOTO_MOBILE.src}
                alt=""
                decoding="async"
                className="kv-settle h-full w-full object-cover object-[70%_bottom] [@media(min-width:1024px)]:object-[78%_center]"
              />
            </picture>
          )}
          {/* No wash over the photo: only a warm-dark shade behind the text so it reads clearly.
              Narrow cards: the text covers the photo, so an even shade, a little lighter at the bottom. */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,10,4,0.62)_0%,rgba(26,10,4,0.55)_55%,rgba(26,10,4,0.42)_100%)] [@container(min-width:820px)]:hidden" />
          {/* Wide cards: shade on the left behind the text only; the painters on the right stay fully clear */}
          <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(26,10,4,0.86)_0%,rgba(26,10,4,0.78)_32%,rgba(26,10,4,0.5)_48%,rgba(26,10,4,0.12)_60%,rgba(26,10,4,0)_68%)] [@container(min-width:820px)]:block" />
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={() => onClose()}
          aria-label="Close offer"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-[#2A1408] shadow-[0_4px_14px_-4px_rgba(42,20,8,0.45)] ring-1 ring-[#2A1408]/10 transition-[background-color,transform] duration-200 hover:scale-105 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8E1B1F]"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Content column: full width on narrow cards, the left ~56% on wide ones.
            Scrolls inside the card only if a tiny screen can't fit it. */}
        <div className={`flex h-full w-full flex-col items-center justify-center overflow-y-auto px-[6cqw] py-[3cqh] text-center [@container(min-width:820px)]:w-[56%] [@container(min-width:820px)]:px-[3.5cqw] [@container(min-width:820px)]:py-[2.2cqh]`}>
          <motion.div {...rise(0.05)} className="flex flex-col items-center">
            <Diya className="h-[clamp(26px,5.4cqh,44px)] w-[clamp(32px,6.6cqh,54px)]" />
            {promo.eyebrow && (
              <p className={`${cinzel.className} mt-[0.6cqh] flex items-center gap-3 text-[clamp(11px,min(2.5cqh,3.6cqw),17px)] font-semibold uppercase tracking-[0.22em] text-[#F6E3B4] [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]`}>
                <span className="h-px w-[clamp(18px,5cqw,56px)] bg-gradient-to-r from-transparent to-[#E9B949]" aria-hidden="true" />
                {t(promo.eyebrow)}
                <span className="h-px w-[clamp(18px,5cqw,56px)] bg-gradient-to-l from-transparent to-[#E9B949]" aria-hidden="true" />
              </p>
            )}
          </motion.div>

          <motion.h2
            {...rise(0.15)}
            className={`mt-[1.2cqh] max-w-[14ch] text-balance font-serif text-[clamp(26px,min(7.4cqh,9.4cqw),64px)] font-bold leading-[1.04] tracking-[-0.02em] text-[#FFF8EC] [text-shadow:0_2px_18px_rgba(0,0,0,0.55)] [@container(min-width:820px)]:text-[clamp(30px,min(7.6cqh,5cqw),68px)]`}
          >
            <Headline text={t(promo.headline)} emphasis={t(promo.headlineEmphasis)} />
          </motion.h2>

          {promo.lead && (
            <motion.p {...rise(0.25)} className="mt-[1.4cqh] max-w-[46ch] text-pretty text-[clamp(12px,min(2.3cqh,3.5cqw),17px)] leading-[1.5] text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]">
              {t(promo.lead)}
            </motion.p>
          )}

          {/* Offer plaque: maroon panel with mandala wings, diyas on its corners and a gold ribbon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            className="relative mt-[2.6cqh] w-full max-w-[min(520px,88cqw)] px-[clamp(22px,7cqw,46px)] pb-[clamp(12px,2.4cqh,18px)]"
          >
            <Mandala className="absolute left-0 top-[44%] w-[clamp(44px,min(13cqh,13cqw),96px)] -translate-y-1/2 opacity-90" />
            <Mandala className="absolute right-0 top-[44%] w-[clamp(44px,min(13cqh,13cqw),96px)] -translate-y-1/2 opacity-90" />
            <div className="kv-offer-aura relative rounded-[14px] border-2 border-[#E9B949] bg-[radial-gradient(ellipse_at_50%_30%,#A3242A_0%,#7A1418_55%,#4E0B0E_100%)] px-4 pb-[clamp(18px,3.4cqh,28px)] pt-[clamp(8px,1.6cqh,14px)] text-white shadow-[inset_0_0_0_3px_#5E0E12,inset_0_0_0_4px_rgba(246,212,124,0.5),0_16px_34px_-16px_rgba(78,11,14,0.8)]">
              <Crest className="absolute -top-[12px] left-1/2 w-[96px] -translate-x-1/2" />
              <p className="flex flex-col items-center leading-none">
                <span className="text-[clamp(11px,min(2.2cqh,3.2cqw),16px)] font-extrabold uppercase tracking-[0.18em] text-[#FBE7B0]">Get</span>
                <span className="mt-[0.3em] whitespace-nowrap bg-[linear-gradient(180deg,#FFF6CF_0%,#FFD45A_45%,#E9A115_78%,#C47F0C_100%)] bg-clip-text font-sans text-[clamp(34px,min(9.6cqh,13cqw),74px)] font-extrabold leading-[0.9] tracking-[-0.03em] text-transparent [filter:drop-shadow(0_2px_0_rgba(60,10,0,0.5))]">
                  {pct}<span className="text-[0.8em]">%</span> OFF
                </span>
                {promo.offerText && (
                  <span className="mt-[0.45em] text-[clamp(11px,min(2.4cqh,3.4cqw),18px)] font-bold uppercase tracking-[0.12em] text-white">{t(promo.offerText)}</span>
                )}
              </p>
            </div>
            <Diya className="absolute bottom-[clamp(18px,3.6cqh,30px)] left-[clamp(10px,4cqw,30px)] h-[clamp(18px,3.6cqh,28px)] w-[clamp(22px,4.4cqh,34px)]" />
            <Diya className="absolute bottom-[clamp(18px,3.6cqh,30px)] right-[clamp(10px,4cqw,30px)] h-[clamp(18px,3.6cqh,28px)] w-[clamp(22px,4.4cqh,34px)]" />
            {promo.ribbonText && (
              <p className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[linear-gradient(180deg,#FFE7A0_0%,#F2B21B_60%,#D9971A_100%)] px-[1.4em] py-[0.45em] text-[clamp(10px,min(2cqh,2.9cqw),14px)] font-extrabold uppercase tracking-[0.06em] text-[#3A0A0C] shadow-[0_6px_14px_-6px_rgba(120,70,0,0.7)]">
                {t(promo.ribbonText)}
              </p>
            )}
          </motion.div>

          {features.length > 0 && (
            <motion.ul {...rise(0.5)} className="mt-[2.4cqh] grid w-full max-w-[540px] grid-cols-4 [@container(min-width:820px)]:mt-[2cqh]">
              {features.map(({ text, Icon }, i) => (
                <li key={i} className={`flex flex-col items-center px-[1cqw] ${i > 0 ? 'border-l border-[#E9B949]/40' : ''}`}>
                  <span className="flex h-[clamp(30px,6.4cqh,50px)] w-[clamp(30px,6.4cqh,50px)] items-center justify-center rounded-full border-[1.5px] border-[#F6D47C]/80 bg-[#1A0A04]/35 text-[#F6D47C] backdrop-blur-[2px]">
                    <Icon className="h-[52%] w-[52%]" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <span className="mt-[0.8cqh] text-[clamp(8.5px,min(1.6cqh,2.4cqw),12px)] font-extrabold uppercase leading-[1.25] tracking-[0.03em] text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]">{text}</span>
                </li>
              ))}
            </motion.ul>
          )}

          <motion.div {...rise(0.6)} className="mt-[2.6cqh] flex w-full flex-col items-center [@container(min-width:820px)]:mt-[2cqh]">
            <div className="flex w-full max-w-[420px] items-center justify-center gap-[clamp(6px,1.4cqw,14px)]">
              <Mandala className="hidden w-[clamp(26px,5cqh,40px)] shrink-0 opacity-80 [@container(min-width:380px)]:block" />
              <Link
                href={promo.ctaHref}
                onClick={() => onClose(false)}
                className="group relative inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-[linear-gradient(180deg,#A3242A_0%,#7A1418_100%)] px-6 text-[clamp(12px,min(2.3cqh,3.4cqw),16px)] font-extrabold uppercase tracking-[0.1em] text-white shadow-[0_12px_26px_-12px_rgba(122,20,24,0.9),inset_0_1px_0_rgba(255,255,255,0.25)] ring-1 ring-[#E9B949]/70 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#E9B949] active:translate-y-0 active:scale-[0.98]"
              >
                {/* light sweep across the button on hover */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(105deg,transparent_30%,rgba(255,236,170,0.45)_50%,transparent_70%)] transition-transform duration-700 ease-out group-hover:translate-x-full" aria-hidden="true" />
                {t(promo.ctaLabel)}
                <ArrowRight className="h-[1.15em] w-[1.15em] transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Mandala className="hidden w-[clamp(26px,5cqh,40px)] shrink-0 opacity-80 [@container(min-width:380px)]:block" />
            </div>
            {(promo.showVisualizer || promo.showConsultation) && (
              <div className={`mt-[1.4cqh] grid w-full max-w-[420px] gap-[clamp(6px,1.2cqw,12px)] ${promo.showVisualizer && promo.showConsultation ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {promo.showVisualizer && (
                  <Link href={DIWALI_OFFER.visualizerPath} onClick={() => onClose(false)} className={SECONDARY_BTN}>
                    <Palette className="h-[1.2em] w-[1.2em] shrink-0" strokeWidth={1.75} aria-hidden="true" /> Visualise Colours
                  </Link>
                )}
                {promo.showConsultation && (
                  <Link href={DIWALI_OFFER.consultationPath} onClick={() => onClose(false)} className={SECONDARY_BTN}>
                    <CalendarCheck className="h-[1.2em] w-[1.2em] shrink-0" strokeWidth={1.75} aria-hidden="true" /> Paint Consultation
                  </Link>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
}
