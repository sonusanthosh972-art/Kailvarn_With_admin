'use client';

import React from 'react';
import Link from 'next/link';
import { Palette } from 'lucide-react';
import { portfolioData } from '@/constants/portfolioData.js';

// `liveCategories` ([{ name, count }] from /api/designs) switches the tabs to
// the admin-managed portfolio; without it the legacy static data is used.
function PortfolioFilterBar({ activeFilter, setActiveFilter, liveCategories, liveTotal }) {
  const categories = liveCategories
    ? ['All', ...liveCategories.map((c) => c.name)]
    : ['All', 'Full Home', 'Kitchen', 'Furniture', 'Painting', 'Commercial'];

  const getCount = (category) => {
    if (liveCategories) return category === 'All' ? liveTotal : liveCategories.find((c) => c.name === category)?.count || 0;
    if (category === 'All') return portfolioData.length;
    return portfolioData.filter(item => item.category === category).length;
  };

  return (
    <div className="sticky top-[68px] lg:top-[80px] z-40 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#0B103B]/10 py-4">
      <div className="kv-wrap">
        <div className="flex overflow-x-auto hide-scrollbar gap-2 justify-start lg:justify-center snap-x snap-mandatory pb-1">
          {categories.map((category) => {
            const count = getCount(category);
            const isActive = activeFilter === category;
            
            return (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                aria-pressed={isActive}
                className={`snap-center shrink-0 text-[11.5px] font-extrabold uppercase tracking-[0.18em] px-5 py-3 rounded-md transition-colors duration-300 border ${
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
            className="snap-center shrink-0 flex items-center gap-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.18em] px-5 py-3 rounded-md transition-colors duration-300 border border-dashed border-[#D9A441] text-[#8A6A1C] hover:bg-[#F2B21B]/10"
          >
            <Palette className="w-4 h-4" />
            Visualize Paint
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PortfolioFilterBar;