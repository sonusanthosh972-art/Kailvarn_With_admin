'use client';

import React from 'react';
import Link from 'next/link';
import { Box } from 'lucide-react';
import { motion } from 'framer-motion';
import { AR_DESIGN } from '@/constants/arConfig.js';

function PortfolioCard({ item, onClick, index }) {
  const hasAR = item.title === AR_DESIGN.name;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 > 0.5 ? 0 : index * 0.05 }}
      className="group relative w-full aspect-[4/3] rounded-md overflow-hidden cursor-pointer bg-[#11184D]"
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } }}
      role="button"
      tabIndex={0}
      aria-label={`Play walkthrough video for ${item.title}`}
    >
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.title}
          loading="lazy"
          className="kv-photo w-full h-full object-cover"
        />
      ) : (
        // No photo in the data for this design yet: a navy panel with a thin
        // architectural frame, instead of the browser's broken-image icon.
        <div className="absolute inset-0 bg-[#0B103B] flex items-center justify-center p-6" role="img" aria-label={item.title}>
          <span className="absolute inset-4 border border-[#F2B21B]/25 rounded-[3px]" aria-hidden="true" />
          <span className="absolute left-4 right-4 top-1/2 h-px bg-[#F2B21B]/15" aria-hidden="true" />
          <span className="absolute top-4 bottom-4 left-1/3 w-px bg-[#F2B21B]/15" aria-hidden="true" />
        </div>
      )}

      {/* Caption veil — always shown on touch screens, on hover for mouse */}
      <div className={`absolute inset-0 flex flex-col justify-end p-4 md:p-5 bg-gradient-to-t from-[#070A25]/90 via-[#070A25]/30 to-transparent transition-opacity duration-500 ease-kv-out ${item.imageUrl ? '[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100' : ''}`}>
        <span className="text-[10px] md:text-[10.5px] font-extrabold uppercase tracking-[0.26em] text-[#F2B21B] mb-1.5 line-clamp-1">
          {item.subcategory}
        </span>
        <h4 className="font-serif text-[15px] md:text-[19px] leading-snug text-white">
          {item.title}
        </h4>
        <p className="hidden md:block mt-1 text-[12.5px] text-white/70 line-clamp-1">
          {item.description}
        </p>
        {item.photoCount > 1 && (
          <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">{item.photoCount} photos</span>
        )}
        <span className="mt-2.5 block h-[2px] w-12 bg-[#F2B21B] origin-left [@media(hover:hover)]:scale-x-0 [@media(hover:hover)]:group-hover:scale-x-100 transition-transform duration-500 delay-100 ease-kv-out" aria-hidden="true" />
      </div>

      {/* Try in AR: always visible (not hover-gated) so it works on touch devices */}
      {hasAR && (
        <Link
          href={AR_DESIGN.route}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 bg-[#F2B21B] hover:bg-[#D9A441] text-[#0B103B] text-[10.5px] font-extrabold uppercase tracking-[0.14em] px-3 py-2 rounded-md shadow-lg transition-colors duration-300"
        >
          <Box className="w-3.5 h-3.5" />
          Try in AR
        </Link>
      )}
    </motion.div>
  );
}

export default PortfolioCard;