'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AR_DESIGN } from '@/constants/arConfig.js';

function Lightbox({ isOpen, onClose, images, currentIndex, onNavigate }) {
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  // Reset scale when image changes or closes
  useEffect(() => {
    setScale(1);
  }, [currentIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onNavigate('prev');
      else if (e.key === 'ArrowRight') onNavigate('next');
    };

    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNavigate]);

  const handleZoom = (increment) => {
    setScale(prev => Math.min(Math.max(1, prev + increment), 4));
  };

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY * -0.01;
      setScale(prev => Math.min(Math.max(1, prev + delta), 4));
    }
  };

  if (!isOpen || !images[currentIndex]) return null;

  const currentImage = images[currentIndex];

  // Drag configuration based on zoom
  const dragProps = scale > 1 ? { drag: true } : { drag: "x", dragConstraints: { left: 0, right: 0 }, dragElastic: 0.8 };

  const handleDragEnd = (e, info) => {
    if (scale === 1) {
      if (info.offset.x > 100) onNavigate('prev');
      else if (info.offset.x < -100) onNavigate('next');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.95)] flex flex-col"
          onClick={onClose}
          onWheel={handleWheel}
        >
          {/* Top Bar Controls */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); handleZoom(-0.5); }} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" aria-label="Zoom out">
                <ZoomOut className="w-5 h-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleZoom(0.5); }} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" aria-label="Zoom in">
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-white/60 font-nunito text-sm">
              {currentIndex + 1} / {images.length}
            </div>

            <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" aria-label="Close">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && scale === 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }} className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/40 hover:bg-white/20 text-white transition-colors border border-white/10" aria-label="Previous image">
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onNavigate('next'); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/40 hover:bg-white/20 text-white transition-colors border border-white/10" aria-label="Next image">
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Image Area */}
          <div className="flex-1 flex items-center justify-center overflow-hidden relative" ref={containerRef}>
            <motion.img
              key={currentImage.id}
              src={currentImage.imageUrl}
              alt={currentImage.title}
              className="max-w-[90vw] max-h-[85vh] object-contain cursor-grab active:cursor-grabbing"
              animate={{ scale }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              {...dragProps}
              onDragEnd={handleDragEnd}
            />
          </div>

          {/* Bottom Info Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none text-center">
            <div className="inline-block bg-[#C9A84C] text-[#1A1A2E] font-nunito font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider mb-2">
              {currentImage.category} › {currentImage.subcategory}
            </div>
            <h3 className="font-playfair font-bold text-2xl text-white mb-1">
              {currentImage.title}
            </h3>
            <p className="font-nunito text-sm text-white/70 max-w-2xl mx-auto">
              {currentImage.description}
            </p>

            {currentImage.title === AR_DESIGN.name && (
              <Link
                href={AR_DESIGN.route}
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto mt-4 inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b59540] text-[#1A1A2E] font-nunito font-bold text-[14px] px-6 py-2.5 rounded-full transition-colors duration-300"
              >
                <Box className="w-4 h-4" />
                Try in AR
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Lightbox;