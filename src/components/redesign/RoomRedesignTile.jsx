'use client';

import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Upload, X, RotateCcw, MessageCircle, Check } from 'lucide-react';
import { useWhatsAppLink } from '@/hooks/useWhatsAppLink.js';
import { REDESIGN_STYLES } from '@/constants/redesignStyles.js';
import { resizeToJpegBlob, readJsonResponse } from '@/lib/imageUpload.js';

// Gemini returns ~1024px images, so a 1536px input keeps full detail
// while staying well under the proxy's upload limit.
const UPLOAD_MAX_DIMENSION = 1536;

// Self-contained: renders both the gallery-grid CTA tile (sized to match
// PortfolioCard's aspect-[4/3]) and the upload/generate modal it opens.
// Isolated from PortfolioCard/Lightbox -- doesn't touch either.

function StylePicker({ selectedId, onSelect }) {
  return (
    <div>
      <p className="text-white/70 font-nunito text-[13px] mb-2.5">Choose a style</p>
      <div className="grid grid-cols-5 gap-2.5">
        {REDESIGN_STYLES.map((style, i) => (
          <button
            key={style.id}
            onClick={() => onSelect(style.id)}
            aria-label={style.label}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              selectedId === style.id ? 'border-[#D9A441] scale-[1.04]' : 'border-white/15 hover:border-white/40'
            }`}
          >
            <img src={style.thumbnailUrl} alt={style.label} className="w-full h-full object-cover" />
            {selectedId === style.id && (
              <div className="absolute inset-0 bg-[#F2B21B]/25 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-[#F2B21B] flex items-center justify-center">
                  <Check className="w-3 h-3 text-[#0B103B]" />
                </div>
              </div>
            )}
            <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9.5px] font-nunito text-center py-0.5">
              {i + 1}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function RoomRedesignModal({ onClose }) {
  const { openWhatsApp } = useWhatsAppLink();
  const [selectedStyleId, setSelectedStyleId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | generating | done | error
  const [resultUrl, setResultUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = useCallback((e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setStatus('idle');
    setResultUrl(null);
    setErrorMessage('');
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!file || !selectedStyleId) return;
    setStatus('generating');
    setErrorMessage('');
    try {
      const body = new FormData();
      body.append('photo', await resizeToJpegBlob(file, UPLOAD_MAX_DIMENSION), 'room.jpg');
      body.append('styleId', selectedStyleId);
      const res = await fetch('/api/redesign-room', { method: 'POST', body });
      const json = await readJsonResponse(res);
      if (!res.ok) throw new Error(json.error || 'Redesign failed.');
      setResultUrl(json.image);
      setStatus('done');
    } catch (err) {
      setErrorMessage(err.message || 'Redesign failed. Please try again.');
      setStatus('error');
    }
  }, [file, selectedStyleId]);

  const handleNewPhoto = useCallback(() => {
    setFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setErrorMessage('');
    setStatus('idle');
  }, []);

  const selectedStyle = REDESIGN_STYLES.find((s) => s.id === selectedStyleId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.85)] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#070A25] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-[#070A25] z-10">
          <h3 className="font-playfair font-bold text-white text-[18px] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D9A441]" />
            AI Room Redesign
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {status !== 'done' && <StylePicker selectedId={selectedStyleId} onSelect={setSelectedStyleId} />}

          {!previewUrl && status !== 'done' && (
            <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/20 rounded-2xl py-14 px-6 cursor-pointer hover:border-[#D9A441]/60 transition-colors">
              <Upload className="w-8 h-8 text-white/50" />
              <span className="text-white/80 font-nunito text-[15px] text-center">
                Upload a photo of your living room
              </span>
              <span className="text-white/40 font-nunito text-[12.5px] text-center">
                We'll generate a redesign of the same room in your chosen style -- takes about 10-20 seconds
              </span>
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
            </label>
          )}

          {previewUrl && status !== 'done' && (
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden bg-black">
                <img src={previewUrl} alt="Your room" className="w-full h-auto block max-h-[320px] object-cover" />
              </div>

              {status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                  <p className="text-red-300 font-nunito text-[13.5px]">{errorMessage}</p>
                </div>
              )}

              {!selectedStyleId && status !== 'generating' && (
                <p className="text-[#D9A441] font-nunito text-[12.5px]">Pick a style above to continue.</p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={status === 'generating' || !selectedStyleId}
                  className="flex-1 bg-[#F2B21B] hover:bg-[#D9A441] disabled:opacity-40 disabled:cursor-not-allowed text-[#0B103B] font-nunito font-bold text-[14px] px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {status === 'generating' ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      Generating your redesign...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Redesign
                    </>
                  )}
                </button>
                <button
                  onClick={handleNewPhoto}
                  disabled={status === 'generating'}
                  className="border border-white/20 text-white/80 disabled:opacity-30 font-nunito text-[14px] px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Choose Different Photo
                </button>
              </div>
            </div>
          )}

          {status === 'done' && resultUrl && (
            <div className="space-y-5">
              <div>
                <p className="text-white/50 font-nunito text-[12px] uppercase tracking-wide mb-2">Your Photo</p>
                <div className="rounded-xl overflow-hidden bg-black">
                  <img src={previewUrl} alt="Your original room" className="w-full h-auto block max-h-[260px] object-cover" />
                </div>
              </div>
              <div>
                <p className="text-[#D9A441] font-nunito font-semibold text-[12px] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Redesign -- {selectedStyle?.label}
                </p>
                <div className="rounded-xl overflow-hidden bg-black">
                  <img src={resultUrl} alt="AI redesigned room" className="w-full h-auto block max-h-[360px] object-cover" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => openWhatsApp('a full design plan for my room')}
                  className="flex-1 bg-[#F2B21B] hover:bg-[#D9A441] text-[#0B103B] font-nunito font-bold text-[14px] px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Get This Design Done
                </button>
                <button
                  onClick={handleNewPhoto}
                  className="border border-white/20 text-white/80 font-nunito text-[14px] px-4 py-3 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Try Another Photo
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function RoomRedesignTile() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.button
        layout
        onClick={() => setModalOpen(true)}
        className="group relative w-full aspect-[4/3] rounded-[12px] overflow-hidden bg-gradient-to-br from-[#0B103B] to-[#070A25] border border-[#D9A441]/30 flex flex-col items-center justify-center text-center p-5 hover:border-[#D9A441]/60 transition-colors"
      >
        <div className="w-12 h-12 rounded-full bg-[#F2B21B]/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Sparkles className="w-6 h-6 text-[#D9A441]" />
        </div>
        <h4 className="font-playfair font-bold text-[15px] text-white leading-tight mb-1.5">
          Try AI Redesign
        </h4>
        <p className="font-nunito text-[11.5px] text-white/60 leading-snug">
          Upload your room &amp; see it redesigned
        </p>
      </motion.button>

      <AnimatePresence>
        {modalOpen && <RoomRedesignModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
