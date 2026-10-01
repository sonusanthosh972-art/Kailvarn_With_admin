'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Navy header in the brand's own colours (logo navy #0C103D + gold), fixed
// to the top. The layout offsets <main> by its height (pt-[68px] lg:pt-[80px]);
// once scrolled it turns fully opaque and gains a shadow. Mobile gets a
// full-screen navy menu below the bar.
// Brand assets are cut from the supplied logo files (public/brand/).

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Our Design', path: '/our-design' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact Us', path: '/contact' }
];

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock page scroll behind the open menu, and let Escape close it.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setIsMobileMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isMobileMenuOpen]);

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b border-[#F2B21B]/20 backdrop-blur-md transition-[background-color,box-shadow] duration-300 ${
          isScrolled || isMobileMenuOpen
            ? 'bg-[#0B103B] shadow-[0_10px_30px_-12px_rgba(7,10,37,0.6)]'
            : 'bg-[#0B103B]/[0.96]'
        }`}
      >
        <div className="kv-wrap h-[68px] lg:h-[80px] flex items-center justify-between gap-6">
          <Link href="/" className="kv-logo-link group flex items-center gap-3 shrink-0" aria-label="KailVarn — Interior Design & Execution, home">
            <img
              src="/brand/kailvarn-mark-192.png"
              alt=""
              width={52}
              height={52}
              className="h-11 w-11 lg:h-[52px] lg:w-[52px] transition-transform duration-500 ease-kv-out group-hover:rotate-[-6deg]"
            />
            <img
              src="/brand/kailvarn-wordmark.png"
              alt="KailVarn"
              width={156}
              height={24}
              className="h-[21px] w-auto lg:h-6"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8 xl:gap-10" aria-label="Main">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative py-1.5 text-[12.5px] font-bold uppercase tracking-[0.16em] transition-colors duration-300 ${
                    active ? 'text-[#F2B21B]' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute left-0 -bottom-0.5 h-[2px] w-full origin-left bg-[#F2B21B] transition-transform duration-300 ease-kv-out ${
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <a
              href="tel:+918460150027"
              className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-[0.12em] text-white hover:text-[#F2B21B] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#F2B21B]" strokeWidth={1.75} />
              Call Now
            </a>
            <Link href="/get-free-quote" className="btn-primary !min-h-[46px] !px-6 !text-[12px]">
              Get Free Quote
            </Link>
          </div>

          {/* Mobile menu toggle — two lines that turn into an X */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative w-11 h-11 -mr-2 flex flex-col items-center justify-center gap-[7px]"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <span className={`block h-[2px] w-[26px] bg-white transition-transform duration-300 ease-kv-out ${isMobileMenuOpen ? 'translate-y-[4.5px] rotate-45' : ''}`} />
            <span className={`block h-[2px] w-[26px] bg-white transition-transform duration-300 ease-kv-out ${isMobileMenuOpen ? '-translate-y-[4.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </header>

      {/* MOBILE MENU — full-screen navy, large serif links */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.21, 1] }}
            className="fixed inset-x-0 top-[68px] bottom-0 z-[45] lg:hidden bg-[#070A25] overflow-y-auto"
          >
            <div className="kv-wrap min-h-full flex flex-col justify-between py-10">
              <nav className="flex flex-col" aria-label="Mobile">
                {navLinks.map((link, i) => {
                  const active = isActive(link.path);
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.05 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={link.path}
                        aria-current={active ? 'page' : undefined}
                        className={`flex items-center justify-between py-4 border-b border-white/[0.12] font-serif text-[32px] leading-tight transition-colors ${
                          active ? 'text-[#F2B21B]' : 'text-white hover:text-[#F2B21B]'
                        }`}
                      >
                        {link.name}
                        <span className="text-[18px] text-[#F2B21B]/70" aria-hidden="true">→</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="flex flex-col gap-3 pt-10">
                <a href="tel:+918460150027" className="btn-outline w-full">
                  <Phone className="w-4 h-4" strokeWidth={1.75} /> Call Now
                </a>
                <Link href="/get-free-quote" className="btn-primary w-full">
                  Get Free Quote
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
