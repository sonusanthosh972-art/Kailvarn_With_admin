'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Our Design', path: '/our-design' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const isActive = (path) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled || isMobileMenuOpen
            ? 'bg-[#1A1A2E] shadow-[var(--shadow-header)]'
            : 'bg-transparent'
        }`}
      >
        <div className="container-custom h-[60px] lg:h-[72px] flex items-center justify-between">
          
          {/* LEFT: Logo */}
          <Link href="/" className="flex items-center group relative z-[51] h-full">
            <img 
              src="https://horizons-cdn.hostinger.com/3b485576-58ad-41b1-b91b-090dfa21215d/27ee2cb2a06dc392bb7be7e76a869f81.png" 
              alt="KailVarn - Interior Design & Execution"
              className="h-10 lg:h-12 w-auto object-contain"
              loading="lazy"
            />
          </Link>

          {/* CENTER: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative font-nunito font-semibold text-[14.5px] transition-colors duration-300 py-2 group ${
                    active ? 'text-[#C9A84C]' : 'text-white/85 hover:text-white'
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-[#C9A84C] transition-all duration-300 ease-out ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            <a 
              href="tel:+918401226123" 
              className="border-[1.5px] border-white/50 text-white font-nunito font-semibold text-[13.5px] px-[20px] py-[9px] rounded-[6px] hover:border-white hover:bg-white hover:text-[#1A1A2E] transition-all duration-300"
            >
              Call Now
            </a>
            <Link 
              href="/get-free-quote" 
              className="btn-gold font-nunito font-bold text-[13.5px] px-[22px] py-[10px] rounded-[6px]"
            >
              Get Free Quote
            </Link>
          </div>

          {/* MOBILE: Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white relative z-[51]"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-[40] lg:hidden backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-[320px] bg-[#1A1A2E] shadow-2xl z-[50] flex flex-col pt-[80px] pb-6 px-6 lg:hidden"
            >
              <nav className="flex flex-col gap-5">
                {navLinks.map((link) => {
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      className={`font-nunito font-semibold text-[20px] ${
                        active ? 'text-[#C9A84C]' : 'text-white/90 hover:text-white'
                      } transition-colors`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto flex flex-col gap-4">
                <a 
                  href="tel:+918401226123" 
                  className="w-full border-[1.5px] border-white/50 text-white font-nunito font-semibold text-[15px] py-3 rounded-[6px] text-center hover:bg-white hover:text-[#1A1A2E] transition-all"
                >
                  Call Now
                </a>
                <Link 
                  href="/get-free-quote" 
                  className="w-full btn-gold text-center font-nunito font-bold text-[15px] py-3 rounded-[6px]"
                >
                  Get Free Quote
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;