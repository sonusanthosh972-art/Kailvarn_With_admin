'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import PortfolioFilterBar from '@/components/PortfolioFilterBar.jsx';
import PortfolioCard from '@/components/PortfolioCard.jsx';
import FullPageVideoPlayer from '@/components/FullPageVideoPlayer.jsx';
import Lightbox from '@/components/Lightbox.jsx';
import RoomRedesignTile from '@/components/redesign/RoomRedesignTile.jsx';
import { portfolioData } from '@/constants/portfolioData.js';
import PageHero from '@/components/kv/PageHero.jsx';
import { OUR_DESIGN_DEFAULTS } from '@/constants/pageContent.js';

const PAGE_SIZE = 24;

// A published project (from /api/designs) as a gallery card: cover image,
// photo count, walkthrough video support.
function projectToCard(p) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category,
    location: p.location,
    subcategory: [p.subtitle || p.category, p.location].filter(Boolean).join(' · '),
    description: p.description,
    imageUrl: p.cover?.thumbUrl,
    photoCount: p.images?.length || 0,
    images: p.images || [],
    videoUrl: p.videoUrl || null,
  };
}

function projectSlides(card) {
  const imgs = card.images || [];
  if (!imgs.length) {
    return [{
      id: card.id,
      title: card.title,
      category: card.category,
      subcategory: card.subcategory || card.category,
      description: card.description || '',
      imageUrl: card.imageUrl,
    }];
  }
  const n = imgs.length;
  return imgs.map((img, i) => ({
    id: img.id || `${card.id}-${i}`,
    title: card.title,
    category: card.category,
    subcategory: [card.location, n > 1 ? `${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}` : ''].filter(Boolean).join(' · ') || card.category,
    description: img.altText && img.altText !== card.title ? img.altText : card.description,
    imageUrl: img.publicUrl || img.thumbUrl || card.imageUrl,
  }));
}

// Site paths use client-side navigation; external/tel/mailto links open normally.
function CtaLink({ href, className, children }) {
  if (!href || href.startsWith('/')) return <Link href={href || '/'} className={className}>{children}</Link>;
  const external = href.startsWith('http');
  return <a href={href} className={className} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}</a>;
}

function OurDesignPage() {
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('All');
  // Admin-editable page text + hero images (/admin/content/our-design)
  const [content, setContent] = useState({ fields: OUR_DESIGN_DEFAULTS, heroImages: [] });
  useEffect(() => {
    fetch('/api/content/our-design').then((r) => r.json()).then((j) => {
      if (j?.ok) setContent({ fields: { ...OUR_DESIGN_DEFAULTS, ...j.data.fields }, heroImages: j.data.heroImages || [] });
    }).catch(() => {});
  }, []);
  const t = content.fields;
  const [videoPlayerOpen, setVideoPlayerOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageSlides, setImageSlides] = useState([]);

  // 'loading' -> 'live' (admin-managed projects) or 'legacy' (static data,
  // used until the first project is published).
  const [mode, setMode] = useState('loading');
  const [live, setLive] = useState({ items: [], total: 0, page: 0, categories: [], allTotal: 0 });
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinel = useRef(null);

  const fetchPage = useCallback(async (category, page) => {
    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
    if (category && category !== 'All') params.set('category', category);
    const res = await fetch(`/api/designs?${params}`);
    const json = await res.json().catch(() => null);
    return json?.ok ? json.data : null;
  }, []);

  // First load decides live vs legacy.
  useEffect(() => {
    let cancelled = false;
    fetchPage('All', 1).then((data) => {
      if (cancelled) return;
      if (data && data.total > 0) {
        setLive({ items: data.items.map(projectToCard), total: data.total, page: 1, categories: data.categories, allTotal: data.total });
        setMode('live');
      } else setMode('legacy');
    }).catch(() => !cancelled && setMode('legacy'));
    return () => { cancelled = true; };
  }, [fetchPage]);

  // Category change in live mode -> reload from page 1.
  const changeFilter = useCallback(async (category) => {
    setActiveFilter(category);
    if (mode !== 'live') return;
    setLoadingMore(true);
    const data = await fetchPage(category, 1);
    setLoadingMore(false);
    if (data) setLive((l) => ({ ...l, items: data.items.map(projectToCard), total: data.total, page: 1, categories: data.categories }));
  }, [mode, fetchPage]);

  const hasMore = mode === 'live' && live.items.length < live.total;
  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    const data = await fetchPage(activeFilter, live.page + 1);
    setLoadingMore(false);
    if (data) setLive((l) => ({ ...l, items: [...l.items, ...data.items.map(projectToCard)], page: l.page + 1, total: data.total }));
  }, [hasMore, loadingMore, fetchPage, activeFilter, live.page]);

  // Load the next page automatically when the end of the grid comes into view.
  useEffect(() => {
    if (!hasMore || !sentinel.current) return;
    const io = new IntersectionObserver((entries) => entries[0].isIntersecting && loadMore(), { rootMargin: '600px 0px' });
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [hasMore, loadMore]);

  // Memoize filtered items for performance
  const filteredItems = useMemo(() => {
    if (mode === 'live') return live.items;
    if (mode === 'loading') return [];
    return activeFilter === 'All'
      ? portfolioData
      : portfolioData.filter(item => item.category === activeFilter);
  }, [activeFilter, mode, live.items]);

  const handleCardClick = (index) => {
    const item = filteredItems[index];
    if (item?.videoUrl) {
      // Has video -> Open FullPageVideoPlayer!
      setCurrentVideoIndex(index);
      setVideoPlayerOpen(true);
    } else {
      // Images only -> Open Lightbox!
      if (mode === 'live') {
        setImageSlides(projectSlides(item));
        setCurrentImageIndex(0);
      } else {
        setImageSlides(filteredItems);
        setCurrentImageIndex(index);
      }
      setLightboxOpen(true);
    }
  };

  // Deep link: /our-design?project=<slug> opens that project's video or lightbox.
  useEffect(() => {
    const slug = searchParams.get('project');
    if (!slug) return;
    const idx = filteredItems.findIndex((it) => it.slug === slug || it.id === slug);
    if (idx >= 0) {
      handleCardClick(idx);
    }
  }, [searchParams, filteredItems]);

  const handleVideoNavigate = (direction) => {
    // Only cycle between items that actually have videos
    const videoItemsIndices = filteredItems
      .map((it, idx) => (it.videoUrl ? idx : null))
      .filter((idx) => idx !== null);

    if (!videoItemsIndices.length) return;

    const currentPos = videoItemsIndices.indexOf(currentVideoIndex);
    let nextPos;
    if (direction === 'prev') {
      nextPos = currentPos <= 0 ? videoItemsIndices.length - 1 : currentPos - 1;
    } else {
      nextPos = currentPos >= videoItemsIndices.length - 1 ? 0 : currentPos + 1;
    }
    setCurrentVideoIndex(videoItemsIndices[nextPos]);
  };

  const handleImageNavigate = (direction) => {
    if (direction === 'prev') {
      setCurrentImageIndex((prev) => (prev === 0 ? imageSlides.length - 1 : prev - 1));
    } else {
      setCurrentImageIndex((prev) => (prev === imageSlides.length - 1 ? 0 : prev + 1));
    }
  };

  const heroImages = content.heroImages.length
    ? content.heroImages.map((i) => i.url)
    : mode === 'live'
    ? live.items.slice(0, 4).map((c) => c.imageUrl)
    : [portfolioData[0]?.imageUrl, portfolioData[61]?.imageUrl, portfolioData[100]?.imageUrl, portfolioData[140]?.imageUrl];

  return (
    <div className="bg-[hsl(var(--portfolio-bg))] min-h-screen">

      {/* HERO SECTION */}
      <PageHero
        images={heroImages}
        eyebrow={t.heroEyebrow}
        title={t.heroTitle}
        emphasis={t.heroEmphasis}
        lead={t.heroLead}
      />

      {/* FILTER BAR */}
      <PortfolioFilterBar
        activeFilter={activeFilter}
        setActiveFilter={changeFilter}
        liveCategories={mode === 'live' ? live.categories : undefined}
        liveTotal={live.allTotal}
      />

      {/* GALLERY SECTION */}
      <section className="py-12 md:py-16">
        <div className="kv-wrap">
          <motion.div 
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5"
          >
            <RoomRedesignTile />
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <PortfolioCard
                  key={item.id}
                  item={item}
                  index={index}
                  onClick={() => handleCardClick(index)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {mode === 'loading' && (
            <div className="flex items-center justify-center gap-2 py-20 font-nunito text-[#6B675F]" role="status">
              <Loader2 className="w-5 h-5 animate-spin text-[#D9A441]" aria-hidden="true" /> Loading designs…
            </div>
          )}

          {hasMore && (
            <div ref={sentinel} className="flex justify-center pt-10">
              <button type="button" onClick={loadMore} disabled={loadingMore} className="btn-outline-dark">
                {loadingMore ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading…</> : 'Load more designs'}
              </button>
            </div>
          )}

          {mode !== 'loading' && filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="font-nunito text-[#6B675F] text-lg">{t.galleryEmptyText}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative isolate overflow-hidden bg-[#070A25] kv-section">
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <span className="absolute w-[520px] h-[520px] rounded-full border border-[#F2B21B]/15" />
          <span className="absolute w-[820px] h-[820px] rounded-full border border-[#F2B21B]/[0.07]" />
        </div>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="font-playfair font-medium text-[34px] md:text-[44px] lg:text-[54px] text-white mb-4 leading-tight tracking-[-0.015em]">
            {t.ctaTitle}
          </h2>
          <p className="font-nunito text-[16px] text-white/70 max-w-2xl mx-auto mb-8">
            {t.ctaText}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {t.ctaPrimaryLabel && <CtaLink href={t.ctaPrimaryHref} className="btn-primary">{t.ctaPrimaryLabel}</CtaLink>}
            {t.ctaSecondaryLabel && <CtaLink href={t.ctaSecondaryHref} className="btn-outline">{t.ctaSecondaryLabel}</CtaLink>}
          </div>
        </div>
      </section>

      {/* FULL PAGE VIDEO PLAYER (Plays when clicked design has a video) */}
      <FullPageVideoPlayer
        isOpen={videoPlayerOpen}
        onClose={() => setVideoPlayerOpen(false)}
        items={filteredItems}
        currentIndex={currentVideoIndex}
        onNavigate={handleVideoNavigate}
      />

      {/* IMAGE LIGHTBOX (Opens when clicked design has images only) */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={imageSlides}
        currentIndex={currentImageIndex}
        onNavigate={handleImageNavigate}
      />

    </div>
  );
}

export default function OurDesignPageWithSuspense() {
  return (
    <Suspense>
      <OurDesignPage />
    </Suspense>
  );
}