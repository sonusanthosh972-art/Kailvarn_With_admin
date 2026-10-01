'use client';

import React, { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Sparkles, RotateCcw } from 'lucide-react';
import { PAINT_COLORS } from '@/constants/paintColors.js';
import { resizeToJpegBlob, readJsonResponse } from '@/lib/imageUpload.js';

// Isolated proof-of-concept component: does not import from or modify
// PaintVisualizer.jsx / the existing /api/segment-surfaces route. The
// color math below (hexToRgb/rgbToHsl/hslToRgb) intentionally mirrors
// PaintVisualizer's, duplicated here rather than shared, to keep this
// POC fully self-contained per the isolation requirement.

const MAX_DIMENSION = 900;

function hexToRgb(hex) {
  const v = hex.replace('#', '');
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [h, s, l];
}

function hslToRgb(h, s, l) {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const hue2rgb = (p, q, t) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ];
}

// Rasterizes Gemini's normalized [0,1000] polygons onto a mask the size
// of the working canvas, filling every "polygons" entry and then erasing
// every "excludePolygons" entry from it (destination-out) -- so a window
// or a plant that happens to sit inside a wall's polygon is cut back out
// of the paintable area in one pass.
function rasterizeMask(polygons, excludePolygons, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const traceAndFill = (poly) => {
    ctx.beginPath();
    poly.forEach(([nx, ny], i) => {
      const x = (nx / 1000) * width;
      const y = (ny / 1000) * height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
  };

  ctx.fillStyle = '#fff';
  ctx.globalCompositeOperation = 'source-over';
  for (const poly of polygons) traceAndFill(poly);

  ctx.globalCompositeOperation = 'destination-out';
  for (const poly of excludePolygons) traceAndFill(poly);

  const data = ctx.getImageData(0, 0, width, height).data;
  const mask = new Uint8Array(width * height);
  for (let p = 0; p < width * height; p++) mask[p] = data[p * 4 + 3] > 127 ? 1 : 0;
  return mask;
}

export default function GeminiWallPainter() {
  const canvasRef = useRef(null);
  const originalImageDataRef = useRef(null);
  const wallMaskRef = useRef(null);
  const ceilingMaskRef = useRef(null);
  // Mirror wall/ceiling color state in refs too -- redrawCanvas reads
  // these, not the state, so it can be called synchronously right after
  // a color change without going stale (it's recreated only once, via
  // useCallback with no deps, so an event handler's closure over it
  // never captures an outdated version).
  const wallColorRef = useRef(null);
  const ceilingColorRef = useRef(null);

  const [hasImage, setHasImage] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | analyzing | ready | failed
  const [errorMessage, setErrorMessage] = useState('');
  const [availableSurfaces, setAvailableSurfaces] = useState({ wall: false, ceiling: false });
  const [activeSurface, setActiveSurface] = useState('wall');
  const [wallColorHex, setWallColorHex] = useState(null);
  const [ceilingColorHex, setCeilingColorHex] = useState(null);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const orig = originalImageDataRef.current;
    if (!canvas || !orig) return;
    const ctx = canvas.getContext('2d');
    const out = new Uint8ClampedArray(orig.data);
    const { width, height } = orig;

    const paint = (mask, hex) => {
      if (!mask || !hex) return;
      const { r, g, b } = hexToRgb(hex);
      const [targetH, targetS] = rgbToHsl(r, g, b);
      for (let p = 0; p < mask.length; p++) {
        if (!mask[p]) continue;
        const i = p * 4;
        const [, , l] = rgbToHsl(orig.data[i], orig.data[i + 1], orig.data[i + 2]);
        const [nr, ng, nb] = hslToRgb(targetH, targetS, l);
        out[i] = nr; out[i + 1] = ng; out[i + 2] = nb;
      }
    };
    paint(wallMaskRef.current, wallColorRef.current);
    paint(ceilingMaskRef.current, ceilingColorRef.current);

    ctx.putImageData(new ImageData(out, width, height), 0, 0);
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('analyzing');
    setErrorMessage('');
    setWallColorHex(null);
    setCeilingColorHex(null);
    wallMaskRef.current = null;
    ceilingMaskRef.current = null;
    setAvailableSurfaces({ wall: false, ceiling: false });

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const scale = MAX_DIMENSION / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      originalImageDataRef.current = ctx.getImageData(0, 0, width, height);
      setHasImage(true);
      URL.revokeObjectURL(url);

      (async () => {
        try {
          const body = new FormData();
          body.append('photo', await resizeToJpegBlob(file, MAX_DIMENSION), 'room.jpg');
          const res = await fetch('/api/segment-surfaces-gemini', { method: 'POST', body });
          const resJson = await readJsonResponse(res);
          if (!res.ok) throw new Error(resJson.error || 'Wall detection failed.');

          const excludePolygons = resJson.exclude.map((it) => it.polygon);
          const wallPolygons = resJson.paintable.filter((it) => it.label === 'wall').map((it) => it.polygon);
          const ceilingPolygons = resJson.paintable.filter((it) => it.label === 'ceiling').map((it) => it.polygon);

          const wallMask = wallPolygons.length ? rasterizeMask(wallPolygons, excludePolygons, width, height) : null;
          const ceilingMask = ceilingPolygons.length ? rasterizeMask(ceilingPolygons, excludePolygons, width, height) : null;

          wallMaskRef.current = wallMask;
          ceilingMaskRef.current = ceilingMask;
          setAvailableSurfaces({ wall: !!wallMask, ceiling: !!ceilingMask });
          setActiveSurface(wallMask ? 'wall' : 'ceiling');
          setStatus('ready');
        } catch (err) {
          setErrorMessage(err.message || 'Wall detection failed.');
          setStatus('failed');
        }
      })();
    };
    img.onerror = () => {
      setErrorMessage('Could not load that image.');
      setStatus('failed');
    };
    img.src = url;
  }, []);

  const handleSelectColor = useCallback((hex) => {
    if (activeSurface === 'wall') {
      wallColorRef.current = hex;
      setWallColorHex(hex);
    } else {
      ceilingColorRef.current = hex;
      setCeilingColorHex(hex);
    }
    redrawCanvas();
  }, [activeSurface, redrawCanvas]);

  const handleReset = useCallback(() => {
    wallColorRef.current = null;
    ceilingColorRef.current = null;
    setWallColorHex(null);
    setCeilingColorHex(null);
    redrawCanvas();
  }, [redrawCanvas]);

  const handleNewPhoto = useCallback(() => {
    setHasImage(false);
    setStatus('idle');
    setErrorMessage('');
    originalImageDataRef.current = null;
    wallMaskRef.current = null;
    ceilingMaskRef.current = null;
    wallColorRef.current = null;
    ceilingColorRef.current = null;
    setAvailableSurfaces({ wall: false, ceiling: false });
    setWallColorHex(null);
    setCeilingColorHex(null);
  }, []);

  const activeColorHex = activeSurface === 'wall' ? wallColorHex : ceilingColorHex;

  return (
    <div className="min-h-screen bg-[#070A25]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <Link href="/" className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-nunito">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="font-playfair font-bold text-white text-[20px] text-center">AI Wall &amp; Ceiling Painter</h1>
          <div className="w-[95px]" />
        </div>

        {!hasImage && (
          <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/20 rounded-2xl py-16 px-6 cursor-pointer hover:border-[#D9A441]/60 transition-colors">
            <Upload className="w-8 h-8 text-white/50" />
            <span className="text-white/80 font-nunito text-[15px] text-center">
              Upload a room photo -- Gemini will detect the walls &amp; ceiling
            </span>
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
          </label>
        )}

        <div className="relative rounded-2xl overflow-hidden bg-black" hidden={!hasImage}>
          <canvas ref={canvasRef} className="w-full h-auto block" />
          {status === 'analyzing' && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 text-white text-[12px] font-nunito px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Detecting walls &amp; ceiling...
            </div>
          )}
        </div>

        {status === 'failed' && (
          <div className="mt-5 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-300 font-nunito text-[14px]">{errorMessage}</p>
          </div>
        )}

        {status === 'ready' && (
          <>
            {availableSurfaces.wall && availableSurfaces.ceiling && (
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setActiveSurface('wall')}
                  className={`flex-1 font-nunito font-semibold text-[13px] px-4 py-2.5 rounded-lg border transition-colors ${
                    activeSurface === 'wall'
                      ? 'bg-[#F2B21B] text-[#0B103B] border-[#D9A441]'
                      : 'border-white/20 text-[#0B103B]/80 hover:bg-white/10'
                  }`}
                >
                  Walls
                </button>
                <button
                  onClick={() => setActiveSurface('ceiling')}
                  className={`flex-1 font-nunito font-semibold text-[13px] px-4 py-2.5 rounded-lg border transition-colors ${
                    activeSurface === 'ceiling'
                      ? 'bg-[#F2B21B] text-[#0B103B] border-[#D9A441]'
                      : 'border-white/20 text-[#0B103B]/80 hover:bg-white/10'
                  }`}
                >
                  Ceiling
                </button>
              </div>
            )}

            <p className="mt-5 text-white/70 text-[13px] font-nunito mb-2">
              {activeSurface === 'wall' ? 'Wall Color' : 'Ceiling Color'}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {PAINT_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => handleSelectColor(c.hex)}
                  aria-label={c.name}
                  className={`w-9 h-9 rounded-full border-2 transition-transform ${
                    activeColorHex === c.hex ? 'border-white scale-110' : 'border-white/20'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              <input
                type="color"
                value={activeColorHex || '#ffffff'}
                onChange={(e) => handleSelectColor(e.target.value)}
                className="w-9 h-9 rounded-full border-2 border-white/20 bg-transparent cursor-pointer"
                aria-label="Custom color"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleReset}
                disabled={!wallColorHex && !ceilingColorHex}
                className="flex items-center gap-1.5 border border-white/20 text-white/80 disabled:opacity-30 font-nunito text-[13px] px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Colors
              </button>
              <button
                onClick={handleNewPhoto}
                className="flex items-center gap-1.5 border border-white/20 text-white/80 font-nunito text-[13px] px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Upload className="w-4 h-4" />
                New Photo
              </button>
            </div>
          </>
        )}

        {status === 'failed' && (
          <div className="mt-5 text-center">
            <button
              onClick={handleNewPhoto}
              className="inline-flex items-center gap-1.5 text-white/60 hover:text-white font-nunito text-[13px]"
            >
              <Upload className="w-3.5 h-3.5" />
              Try another photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
