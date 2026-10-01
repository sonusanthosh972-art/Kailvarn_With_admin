'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, ChevronLeft, ChevronRight, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getVideoForDesign } from '@/constants/portfolioVideos.js';

export default function FullPageVideoPlayer({
  isOpen,
  onClose,
  items = [],
  currentIndex = 0,
  onNavigate,
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimer = useRef(null);

  const currentItem = items[currentIndex] || null;
  const videoSrc = currentItem ? getVideoForDesign(currentItem) : '';

  // Reset states and stop video when switching item or closing
  useEffect(() => {
    setIsLoading(true);
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(false);
  }, [currentIndex, isOpen]);

  // Lock body scroll and listen for keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft' && onNavigate && items.length > 1) {
        e.preventDefault();
        onNavigate('prev');
      } else if (e.key === 'ArrowRight' && onNavigate && items.length > 1) {
        e.preventDefault();
        onNavigate('next');
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm') {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNavigate, items.length]);

  // Autoplay video as soon as it's mounted/loaded
  const handleLoadedData = () => {
    setIsLoading(false);
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Fallback if browser requires user gesture
        setIsPlaying(false);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 1;
      setCurrentTime(cur);
      setProgress((cur / dur) * 100);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleSeek = (e) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(1, clickX / rect.width));
    videoRef.current.currentTime = newProgress * duration;
    setProgress(newProgress * 100);
  };

  // Autohide controls on inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3200);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Clean unmount helper on cancel
  const handleCancel = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
    onClose();
  }, [onClose]);

  if (!isOpen || !currentItem || !videoSrc) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-[#070A25] flex flex-col justify-between overflow-hidden select-none"
          onMouseMove={handleMouseMove}
        >
          {/* ========================================================= */}
          {/* TOP BAR: Title, Counter & CANCEL BUTTON                   */}
          {/* ========================================================= */}
          <div
            className={`absolute top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between transition-opacity duration-300 bg-gradient-to-b from-black/90 via-black/50 to-transparent ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Left: Design Info */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-[0.16em] bg-[#F2B21B] text-[#0B103B]">
                Walkthrough Video
              </span>
              <div>
                <h3 className="text-white font-serif text-[17px] sm:text-[20px] font-medium leading-snug drop-shadow-md">
                  {currentItem.title}
                </h3>
                <p className="text-white/60 text-[12px] font-sans">
                  {currentItem.subcategory || currentItem.category}
                </p>
              </div>
            </div>

            {/* Right: Counter + CANCEL BUTTON ON TOP */}
            <div className="flex items-center gap-3 sm:gap-4">
              {items.length > 1 && (
                <div className="hidden sm:block text-white/60 text-[13px] font-medium font-sans bg-white/10 px-3 py-1 rounded-full">
                  {currentIndex + 1} / {items.length}
                </div>
              )}

              {/* CANCEL / CLOSE BUTTON */}
              <button
                type="button"
                onClick={handleCancel}
                aria-label="Cancel and close video player"
                className="group inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-white/15 hover:bg-[#F2B21B] text-white hover:text-[#0B103B] border border-white/20 hover:border-[#F2B21B] backdrop-blur-md transition-all duration-200 shadow-lg active:scale-95"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-90 duration-200" />
                <span className="text-[12px] sm:text-[13px] font-extrabold uppercase tracking-[0.14em]">
                  Cancel
                </span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* VIDEO CONTAINER (Loads ONLY on Demand)                    */}
          {/* ========================================================= */}
          <div
            className="relative flex-1 w-full h-full flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-30 pointer-events-none bg-black/40">
                <Loader2 className="w-10 h-10 text-[#F2B21B] animate-spin" />
                <span className="text-[13px] font-bold uppercase tracking-[0.16em] text-white/80">
                  Loading walkthrough…
                </span>
              </div>
            )}

            {/* Video Element: ONLY rendered when modal is active */}
            <video
              ref={videoRef}
              src={videoSrc}
              preload="auto"
              playsInline
              loop
              muted={isMuted}
              onLoadedData={handleLoadedData}
              onTimeUpdate={handleTimeUpdate}
              onWaiting={() => setIsLoading(true)}
              onPlaying={() => setIsLoading(false)}
              className="w-full h-full max-h-screen object-contain pointer-events-none"
            />

            {/* Unmute floating pill prompt if muted */}
            {isMuted && !isLoading && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-black/70 hover:bg-[#F2B21B] text-white hover:text-[#0B103B] backdrop-blur-md border border-white/20 hover:border-[#F2B21B] px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer transition-all duration-200 shadow-xl"
              >
                <VolumeX className="w-4 h-4 text-[#F2B21B] group-hover:text-[#0B103B]" />
                <span className="text-[12px] font-bold uppercase tracking-wider">
                  Tap to Unmute Sound
                </span>
              </div>
            )}

            {/* Center Play/Pause transient feedback */}
            {!isPlaying && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div className="w-20 h-20 rounded-full bg-[#F2B21B]/90 text-[#0B103B] flex items-center justify-center shadow-2xl pl-1 backdrop-blur-md">
                  <Play className="w-9 h-9 fill-current" />
                </div>
              </div>
            )}

            {/* Previous / Next Design Video Navigation */}
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate?.('prev');
                  }}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/50 hover:bg-[#F2B21B] text-white hover:text-[#0B103B] border border-white/10 hover:border-[#F2B21B] backdrop-blur-md transition-all duration-200 shadow-lg ${
                    showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  aria-label="Previous design video"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate?.('next');
                  }}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/50 hover:bg-[#F2B21B] text-white hover:text-[#0B103B] border border-white/10 hover:border-[#F2B21B] backdrop-blur-md transition-all duration-200 shadow-lg ${
                    showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  aria-label="Next design video"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* ========================================================= */}
          {/* BOTTOM CONTROLS & LEAD GENERATION CTA                     */}
          {/* ========================================================= */}
          <div
            className={`absolute bottom-0 left-0 right-0 z-50 px-4 sm:px-8 pb-5 pt-12 transition-opacity duration-300 bg-gradient-to-t from-black/95 via-black/70 to-transparent ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress Scrub Bar */}
            <div
              className="relative w-full h-2 bg-white/20 hover:h-3 rounded-full cursor-pointer transition-all duration-150 mb-3 group/bar"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-[#F2B21B] rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md opacity-0 group-hover/bar:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Bottom Row Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Left playback buttons & time */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2 rounded-full text-white hover:text-[#F2B21B] transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-2 rounded-full text-white hover:text-[#F2B21B] transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                <div className="text-[12px] font-sans text-white/70 font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-2 rounded-full text-white hover:text-[#F2B21B] transition-colors sm:hidden"
                  aria-label="Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
              </div>

              {/* Right CTA & Fullscreen button */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <Link
                  href="/book-consultation"
                  onClick={handleCancel}
                  className="btn-gold !min-h-[40px] !py-2 !px-4 !text-[12px] flex items-center gap-1.5"
                >
                  Book Consultation
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="hidden sm:inline-flex p-2 rounded-full text-white hover:text-[#F2B21B] transition-colors"
                  aria-label="Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
