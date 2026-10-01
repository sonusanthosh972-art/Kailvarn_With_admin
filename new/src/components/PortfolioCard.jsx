'use client';

import React from 'react';
import Link from 'next/link';
import { ZoomIn, Box } from 'lucide-react';
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
      className="group relative w-full aspect-[4/3] rounded-[12px] overflow-hidden cursor-pointer bg-muted"
      onClick={onClick}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-[rgba(15,15,30,0.72)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
        
        {/* Top left badge */}
        <div className="self-start bg-[#C9A84C] text-[#1A1A2E] font-nunito font-semibold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
          {item.subcategory}
        </div>

        {/* Center zoom icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 delay-100">
            <ZoomIn className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Bottom content */}
        <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
          <h4 className="font-nunito font-semibold text-[16px] text-white mb-1 leading-tight">
            {item.title}
          </h4>
          <p className="font-nunito font-normal text-[13px] text-white/70 line-clamp-1">
            {item.description}
          </p>
        </div>
      </div>

      {/* Try in AR: always visible (not hover-gated) so it works on touch devices */}
      {hasAR && (
        <Link
          href={AR_DESIGN.route}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 bg-[#C9A84C] hover:bg-[#b59540] text-[#1A1A2E] font-nunito font-semibold text-[12px] px-3.5 py-1.5 rounded-full shadow-lg transition-colors duration-300"
        >
          <Box className="w-3.5 h-3.5" />
          Try in AR
        </Link>
      )}
    </motion.div>
  );
}

export default PortfolioCard;