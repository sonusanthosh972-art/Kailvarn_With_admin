'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Palette } from 'lucide-react';
import { portfolioData } from '@/constants/portfolioData.js';

// `liveCategories` ([{ name, count }] from /api/designs) switches the tabs to
// the admin-managed portfolio; without it the legacy static data is used.
//
// The tab row scrolls sideways when it's wider than the screen. Arrow
// buttons and edge fades appear only while there's more to see, the mouse
// wheel scrolls it sideways, and the active tab is kept in view. Tabs are
// centred only when they all fit (auto margins on the first/last child) --
// plain justify-center pushes overflowing tabs past the left edge where
// they can't be scrolled to.
function PortfolioFilterBar({ activeFilter, setActiveFilter, liveCategories, liveTotal }) {
  const categories = liveCategories
    ? ['All', ...liveCategories.map((c) => c.name)]
    : ['All', 'Full Home', 'Kitchen', 'Furniture', 'Painting', 'Commercial'];

  const getCount = (category) => {
    if (liveCategories) return category === 'All' ? liveTotal : liveCategories.find((c) => c.name === category)?.count || 0;
    if (category === 'All') return portfolioData.length;
    return portfolioData.filter(item => item.category === category).length;
  };

  const rowRef = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const updateEdges = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    setEdges({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return undefined;
    updateEdges();
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    // A vertical mouse wheel scrolls the row sideways while it can move;
    // at either end the page scrolls as normal.
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX) || el.scrollWidth <= el.clientWidth) return;
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => { ro.disconnect(); el.removeEventListener('wheel', onWheel); };
  }, [updateEdges, categories.length]);

  // Keep the selected tab visible (e.g. after picking one near an edge).
  useEffect(() => {
    const el = rowRef.current;
    const active = el?.querySelector('[aria-pressed="true"]');
    if (!active) return;
    const left = active.offsetLeft - el.offsetLeft;
    if (left < el.scrollLeft || left + active.offsetWidth > el.scrollLeft + el.clientWidth) {
      el.scrollTo({ left: left - (el.clientWidth - active.offsetWidth) / 2, behavior: 'smooth' });
    }
  }, [activeFilter]);

  const scrollBy = (dir) => {
    const el = rowRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: 'smooth' });
  };

  return (
    <div className="sticky top-[68px] lg:top-[80px] z-40 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#0B103B]/10 py-4">
      <div className="kv-wrap relative">
        <div
          ref={rowRef}
          onScroll={updateEdges}
          className="flex overflow-x-auto hide-scrollbar gap-2 scroll-smooth pb-1 [&>*:first-child]:ml-auto [&>*:last-child]:mr-auto"
        >
          {categories.map((category) => {
            const count = getCount(category);
            const isActive = activeFilter === category;

            return (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                aria-pressed={isActive}
                className={`shrink-0 text-[11.5px] font-extrabold uppercase tracking-[0.18em] px-5 py-3 rounded-md transition-colors duration-300 border ${
                  isActive
                    ? 'bg-[#F2B21B] text-[#0B103B] border-[#F2B21B]'
                    : 'bg-transparent text-[#0B103B]/75 border-[#0B103B]/20 hover:border-[#D9A441] hover:text-[#8A6A1C]'
                }`}
              >
                {category} <span className="opacity-60 ml-1">({count})</span>
              </button>
            );
          })}

          <Link
            href="/paint-visualizer"
            className="shrink-0 flex items-center gap-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.18em] px-5 py-3 rounded-md transition-colors duration-300 border border-dashed border-[#D9A441] text-[#8A6A1C] hover:bg-[#F2B21B]/10"
          >
            <Palette className="w-4 h-4" />
            Visualize Paint
          </Link>
        </div>

        {/* Edge fades + arrows, only while more tabs are hidden that side */}
        <EdgeControl side="left" visible={edges.left} onClick={() => scrollBy(-1)} />
        <EdgeControl side="right" visible={edges.right} onClick={() => scrollBy(1)} />
      </div>
    </div>
  );
}

function EdgeControl({ side, visible, onClick }) {
  const isLeft = side === 'left';
  const Icon = isLeft ? ChevronLeft : ChevronRight;
  return (
    <div
      className={`pointer-events-none absolute inset-y-0 ${isLeft ? 'left-0 pl-4 sm:pl-6 bg-gradient-to-r' : 'right-0 pr-4 sm:pr-6 bg-gradient-to-l'} from-[#FAFAF7] via-[#FAFAF7]/90 to-transparent flex items-center w-24 ${isLeft ? 'justify-start' : 'justify-end'} transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
      aria-hidden={!visible}
    >
      <button
        type="button"
        onClick={onClick}
        tabIndex={visible ? 0 : -1}
        aria-label={isLeft ? 'Show earlier categories' : 'Show more categories'}
        className={`${visible ? 'pointer-events-auto' : ''} mb-1 flex h-9 w-9 items-center justify-center rounded-full border border-[#0B103B]/15 bg-white text-[#0B103B] shadow-[0_4px_12px_-4px_rgba(11,16,59,0.3)] transition-colors hover:border-[#D9A441] hover:text-[#8A6A1C]`}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export default PortfolioFilterBar;
