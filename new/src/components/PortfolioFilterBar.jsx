'use client';

import React from 'react';
import Link from 'next/link';
import { Palette } from 'lucide-react';
import { portfolioData } from '@/constants/portfolioData.js';

function PortfolioFilterBar({ activeFilter, setActiveFilter }) {
  const categories = ['All', 'Full Home', 'Kitchen', 'Furniture', 'Painting', 'Commercial'];

  const getCount = (category) => {
    if (category === 'All') return portfolioData.length;
    return portfolioData.filter(item => item.category === category).length;
  };

  return (
    <div className="sticky top-[80px] z-40 bg-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] py-4">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto hide-scrollbar gap-3 justify-start lg:justify-center snap-x snap-mandatory pb-1">
          {categories.map((category) => {
            const count = getCount(category);
            const isActive = activeFilter === category;
            
            return (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`snap-center shrink-0 font-nunito font-semibold text-[14px] px-[28px] py-[10px] rounded-full transition-all duration-300 border ${
                  isActive
                    ? 'bg-[#C9A84C] text-[#1A1A2E] border-[#C9A84C] shadow-[0_4px_14px_rgba(201,168,76,0.3)]'
                    : 'bg-[#EFEBE4] text-[#555] border-[#E0D8CE] hover:bg-[#E8D5A3]/50'
                }`}
              >
                {category} <span className="opacity-70 font-normal ml-1">({count})</span>
              </button>
            );
          })}

          <Link
            href="/paint-visualizer"
            className="snap-center shrink-0 flex items-center gap-1.5 font-nunito font-semibold text-[14px] px-[24px] py-[10px] rounded-full transition-all duration-300 border border-dashed border-[#C9A84C] text-[#8a6d1f] hover:bg-[#C9A84C]/10"
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