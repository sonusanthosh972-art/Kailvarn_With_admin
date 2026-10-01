'use client';

import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Sparkles, MessageCircle, FileText } from 'lucide-react';
import { resizeToJpegBlob, readJsonResponse } from '@/lib/imageUpload.js';

// Downscaling to a single Gemini image tile (~768px) before upload keeps
// the image itself near the cheapest possible input-token cost -- larger
// photos get tiled into multiple ~258-token chunks instead of one.
const MAX_DIMENSION = 768;
const JPEG_QUALITY = 0.82;

export default function RoomAdvisor() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | analyzing | done | error
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setStatus('analyzing');
    setResult(null);
    setErrorMessage('');

    try {
      const jpegBlob = await resizeToJpegBlob(file, MAX_DIMENSION, JPEG_QUALITY);
      const body = new FormData();
      body.append('photo', jpegBlob, 'room.jpg');
      const res = await fetch('/api/analyze-room', { method: 'POST', body });
      const json = await readJsonResponse(res);
      if (!res.ok) throw new Error(json.error || 'Analysis failed.');
      setResult(json);
      setStatus('done');
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }, []);

  const handleNewPhoto = useCallback(() => {
    setPreviewUrl(null);
    setResult(null);
    setErrorMessage('');
    setStatus('idle');
  }, []);

  return (
    <div className="min-h-screen bg-[#070A25]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <Link href="/" className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-nunito">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="font-playfair font-bold text-white text-[20px]">AI Design Advisor</h1>
          <div className="w-[95px]" />
        </div>

        {status === 'idle' && (
          <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/20 rounded-2xl py-16 px-6 cursor-pointer hover:border-[#D9A441]/60 transition-colors">
            <Upload className="w-8 h-8 text-white/50" />
            <span className="text-white/80 font-nunito text-[15px] text-center">
              Upload a photo of your room for a free instant style read
            </span>
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
          </label>
        )}

        {status !== 'idle' && previewUrl && (
          <div className="rounded-2xl overflow-hidden bg-black">
            <img src={previewUrl} alt="Uploaded room" className="w-full h-auto block max-h-[420px] object-cover" />
          </div>
        )}

        {status === 'analyzing' && (
          <div className="mt-5 flex items-center gap-2 text-white/70 font-nunito text-[14px]">
            <Sparkles className="w-4 h-4 animate-pulse text-[#D9A441]" />
            Analyzing your room...
          </div>
        )}

        {status === 'error' && (
          <div className="mt-5 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-300 font-nunito text-[14px]">{errorMessage}</p>
          </div>
        )}

        {status === 'done' && result && (
          <div className="mt-5 bg-white/5 border border-[#D9A441]/30 rounded-2xl p-6">
            {result.style && (
              <p className="font-playfair font-semibold text-white text-[19px] leading-snug mb-4">
                {result.style}
              </p>
            )}
            {result.suggestions?.length > 0 && (
              <ul className="space-y-3">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-white/85 font-nunito text-[14.5px] leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F2B21B] shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {status === 'done' && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/book-consultation"
              className="flex-1 bg-[#F2B21B] hover:bg-[#D9A441] text-[#0B103B] font-nunito font-bold text-[14px] px-6 py-3 rounded-lg text-center transition-colors"
            >
              Book Free Consultation
            </Link>
            <Link
              href="/get-free-quote"
              className="flex-1 border border-white/20 text-white/85 hover:bg-white/10 font-nunito font-bold text-[14px] px-6 py-3 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" /> Get Free Quote
            </Link>
          </div>
        )}

        {(status === 'done' || status === 'error') && (
          <div className="mt-4 text-center">
            <button
              onClick={handleNewPhoto}
              className="inline-flex items-center gap-1.5 text-white/60 hover:text-white font-nunito text-[13px]"
            >
              <Upload className="w-3.5 h-3.5" />
              Try another photo
            </button>
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-white/40 font-nunito text-[12px]">
          <MessageCircle className="w-3.5 h-3.5" />
          Instant AI read -- for a full design plan, book a free consultation.
        </div>
      </div>
    </div>
  );
}
