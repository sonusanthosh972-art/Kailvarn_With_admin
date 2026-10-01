'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PortfolioFilterBar from '@/components/PortfolioFilterBar.jsx';
import PortfolioCard from '@/components/PortfolioCard.jsx';
import Lightbox from '@/components/Lightbox.jsx';
import { portfolioData } from '@/constants/portfolioData.js';

function OurDesignPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Memoize filtered items for performance
  const filteredItems = useMemo(() => {
    return activeFilter === 'All'
      ? portfolioData
      : portfolioData.filter(item => item.category === activeFilter);
  }, [activeFilter]);

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleNavigate = (direction) => {
    if (direction === 'prev') {
      setCurrentImageIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
    } else {
      setCurrentImageIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className="bg-[hsl(var(--portfolio-bg))] min-h-screen">

      {/* HERO SECTION */}
      <section className="relative h-[200px] md:h-[300px] flex flex-col justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 grid-rows-1">
          <img src={portfolioData[0]?.imageUrl} alt="" className="w-full h-full object-cover" />
          <img src={portfolioData[61]?.imageUrl} alt="" className="w-full h-full object-cover hidden md:block" />
          <img src={portfolioData[100]?.imageUrl} alt="" className="w-full h-full object-cover" />
          <img src={portfolioData[140]?.imageUrl} alt="" className="w-full h-full object-cover hidden md:block" />
        </div>
        <div className="absolute inset-0 bg-[rgba(15,15,30,0.65)]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center flex flex-col items-center">
          <div className="inline-block bg-[#C9A84C]/20 border border-[#C9A84C]/40 rounded-full px-3 py-1 mb-4">
            <span className="font-nunito font-bold text-[11px] tracking-widest text-[#C9A84C] uppercase">
              Our Portfolio
            </span>
          </div>
          
          <h1 className="font-playfair font-extrabold text-[30px] md:text-[48px] text-white leading-tight mb-3 text-shadow-sm">
            Designs That Inspire, Spaces That Transform
          </h1>
          <p className="font-nunito text-[16px] md:text-[17px] text-white/85 max-w-2xl mx-auto">
            Browse our portfolio of modern, elegant Indian interior designs — real projects, real quality.
          </p>
        </div>
      </section>

      {/* FILTER BAR */}
      <PortfolioFilterBar 
        activeFilter={activeFilter} 
        setActiveFilter={setActiveFilter} 
      />

      {/* GALLERY SECTION */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[10px] md:gap-[16px]"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <PortfolioCard
                  key={item.id}
                  item={item}
                  index={index}
                  onClick={() => handleImageClick(index)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="font-nunito text-[#555] text-lg">No designs found for this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-[#1A1A2E] py-[80px]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair font-bold text-[32px] md:text-[40px] text-white mb-4 leading-tight">
            Like What You See? Let's Design Your Space
          </h2>
          <p className="font-nunito text-[16px] text-white/70 max-w-2xl mx-auto mb-8">
            Every design you see was built by the same KailVarn team that will design and execute your project — same quality, same care.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/get-free-quote" 
              className="bg-[#C9A84C] hover:bg-[#b59540] text-white font-nunito font-bold text-[15px] px-8 py-3.5 rounded-lg shadow-md transition-all duration-300 text-center active:scale-[0.98]"
            >
              Get Free Design Consultation
            </Link>
            <Link 
              href="/services" 
              className="border-2 border-white/80 text-white hover:bg-white hover:text-[#1A1A2E] font-nunito font-bold text-[15px] px-8 py-3.5 rounded-lg transition-all duration-300 text-center active:scale-[0.98]"
            >
              View Our Services
            </Link>
          </div>
        </div>
      </section>

      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={filteredItems}
        currentIndex={currentImageIndex}
        onNavigate={handleNavigate}
      />

    </div>
  );
}

export default OurDesignPage;