'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Horizontal scroll-snap slider (native swipe, no library). The track uses
// .kv-track; add breakpoint classes in `trackClassName` to turn it back into
// a grid on larger screens (e.g. 'lg:grid lg:grid-cols-3 lg:mx-0 lg:px-0
// lg:overflow-visible') — the arrows/dots hide themselves when nothing scrolls.
export default function SnapSlider({ children, as: Track = 'div', trackClassName = '', className = '', dark = false, label, autoPlay = 0 }) {
  const track = useRef(null);
  const stops = useRef([0]);
  const [count, setCount] = useState(1);
  const [index, setIndex] = useState(0);
  const paused = useRef(false);

  const nearest = (x) => {
    let best = 0;
    stops.current.forEach((s, i) => { if (Math.abs(s - x) < Math.abs(stops.current[best] - x)) best = i; });
    return best;
  };

  // Snap positions = where each card's left edge lands, clamped to the end
  // of the track, so several cards in view collapse into one dot.
  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    const max = el.scrollWidth - el.clientWidth;
    const next = [];
    for (const child of el.children) {
      const x = Math.max(0, Math.min(child.offsetLeft - pad, max));
      if (!next.length || x - next[next.length - 1] > 4) next.push(x);
    }
    stops.current = next.length ? next : [0];
    setCount(max > 4 ? stops.current.length : 1);
    setIndex(nearest(el.scrollLeft));
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setIndex(nearest(el.scrollLeft)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => { el.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);

  const go = useCallback((i) => {
    const el = track.current;
    if (!el) return;
    const n = stops.current.length;
    el.scrollTo({ left: stops.current[((i % n) + n) % n], behavior: 'smooth' });
  }, []);

  // Touch swiping is native (overflow scroll). Mouse users get the same by
  // click-and-drag; snapping is paused while dragging, then we glide to the
  // nearest card. A drag never counts as a click on a link inside a card.
  const drag = useRef(null);
  const onPointerDown = (e) => {
    const el = track.current;
    if (e.pointerType !== 'mouse' || e.button !== 0 || !el || count < 2) return;
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false };
  };
  const onPointerMove = (e) => {
    const el = track.current;
    const d = drag.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) < 6) return;
    if (!d.moved) {
      d.moved = true;
      el.style.scrollSnapType = 'none';
      el.style.cursor = 'grabbing';
      el.setPointerCapture?.(e.pointerId);
    }
    el.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    const el = track.current;
    const d = drag.current;
    drag.current = null;
    if (!d?.moved || !el) return;
    el.style.cursor = '';
    const moved = el.scrollLeft - d.left;
    const from = nearest(d.left);
    let target = nearest(el.scrollLeft);
    // A short flick still moves one card in the drag direction.
    if (target === from && Math.abs(moved) > 40) target = from + Math.sign(moved);
    target = Math.max(0, Math.min(target, stops.current.length - 1));
    el.scrollTo({ left: stops.current[target], behavior: 'smooth' });
    setTimeout(() => { el.style.scrollSnapType = ''; }, 450);
    // Swallow the click that follows the drag (fires right after pointerup).
    const swallow = (ev) => { ev.preventDefault(); ev.stopPropagation(); };
    el.addEventListener('click', swallow, { capture: true });
    setTimeout(() => el.removeEventListener('click', swallow, { capture: true }), 0);
  };

  // Optional autoplay: pauses while hovered/focused/touched, and never runs
  // for people who asked for reduced motion.
  useEffect(() => {
    if (!autoPlay || count < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      if (!paused.current && document.visibilityState === 'visible') go(index + 1);
    }, autoPlay);
    return () => clearInterval(id);
  }, [autoPlay, count, index, go]);

  const pause = () => { paused.current = true; };
  const resume = () => { paused.current = false; };

  const arrow = `w-11 h-11 rounded-full border flex items-center justify-center transition-colors duration-300 ${
    dark
      ? 'border-white/30 text-white hover:bg-[#F2B21B] hover:border-[#F2B21B] hover:text-[#0B103B]'
      : 'border-[#0B103B]/25 text-[#0B103B] hover:bg-[#0B103B] hover:border-[#0B103B] hover:text-white'
  }`;

  return (
    <div
      className={className}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={pause}
      onPointerLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
      onTouchStart={pause}
    >
      <Track
        ref={track}
        className={`kv-track relative ${count > 1 ? 'cursor-grab select-none' : ''} ${trackClassName}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragStart={(e) => count > 1 && e.preventDefault()}
      >
        {children}
      </Track>

      {count > 1 && (
        <div className="mt-7 flex items-center justify-center gap-4">
          <button type="button" onClick={() => go(index - 1)} aria-label="Previous" className={arrow}>
            <ChevronLeft className="w-5 h-5" strokeWidth={1.75} />
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: count }, (_, i) => (
              <button key={i} type="button" onClick={() => go(i)} aria-label={`Go to slide ${i + 1}`} aria-current={i === index} className="p-1.5">
                <span
                  className={`block h-2 rounded-full transition-all duration-500 ease-kv-expo ${
                    i === index ? 'w-6 bg-[#D9A441]' : `w-2 ${dark ? 'bg-white/30' : 'bg-[#0B103B]/20'}`
                  }`}
                />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => go(index + 1)} aria-label="Next" className={arrow}>
            <ChevronRight className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>
      )}
    </div>
  );
}
