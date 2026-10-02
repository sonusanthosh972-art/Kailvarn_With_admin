'use client';

import React, { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Undo2, RotateCcw, Upload, Sparkles, Eraser } from 'lucide-react';
import { PAINT_COLORS } from '@/constants/paintColors.js';
import { resizeToJpegBlob, readJsonResponse } from '@/lib/imageUpload.js';

const MAX_DIMENSION = 900;

function hexToRgb(hex) {
  const v = hex.replace('#', '');
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  };
}

// Dual-threshold flood fill: a candidate pixel must be close to BOTH the
// neighbor that reached it (tolerates gradual lighting gradients across a
// wall) AND the original tapped pixel (bounds total drift, so the fill
// can't "tunnel" through a soft gradient into unrelated objects on the
// far side of the photo).
function floodFillMask(imageData, startX, startY, tolerance) {
  const { width, height, data } = imageData;
  const mask = new Uint8Array(width * height);
  const visited = new Uint8Array(width * height);
  const tolSq = tolerance * tolerance;
  const seedTolSq = (tolerance * 2.2) * (tolerance * 2.2);

  const startP = startY * width + startX;
  const si = startP * 4;
  const seedR = data[si], seedG = data[si + 1], seedB = data[si + 2];

  mask[startP] = 1;
  visited[startP] = 1;
  const stack = [startP];

  while (stack.length) {
    const p = stack.pop();
    const i = p * 4;
    const r0 = data[i], g0 = data[i + 1], b0 = data[i + 2];
    const x = p % width;
    const y = (p - x) / width;

    const neighbors = [];
    if (x > 0) neighbors.push(p - 1);
    if (x < width - 1) neighbors.push(p + 1);
    if (y > 0) neighbors.push(p - width);
    if (y < height - 1) neighbors.push(p + width);

    for (const n of neighbors) {
      if (visited[n]) continue;
      visited[n] = 1;
      const ni = n * 4;
      const nr = data[ni], ng = data[ni + 1], nb = data[ni + 2];
      const dr = nr - r0, dg = ng - g0, db = nb - b0;
      const localOk = dr * dr + dg * dg + db * db <= tolSq;
      const sr = nr - seedR, sg = ng - seedG, sb = nb - seedB;
      const seedOk = sr * sr + sg * sg + sb * sb <= seedTolSq;
      if (localOk && seedOk) {
        mask[n] = 1;
        stack.push(n);
      }
    }
  }
  return mask;
}

// Pure connectivity flood fill *within* an AI-provided surface mask -- no
// color comparison at all, since correctness now comes from the mask
// itself. This still isolates individual surfaces: if the mask has two
// disconnected regions (e.g. left wall + back wall), tapping one only
// selects that one -- and wall vs ceiling are always kept as separate
// masks so a tap never floods from one into the other across their
// shared edge.
function floodFillWithinMask(maskArr, width, height, startX, startY) {
  const startP = startY * width + startX;
  if (!maskArr[startP]) return null;

  const region = new Uint8Array(width * height);
  const visited = new Uint8Array(width * height);
  region[startP] = 1;
  visited[startP] = 1;
  const stack = [startP];

  while (stack.length) {
    const p = stack.pop();
    const x = p % width;
    const y = (p - x) / width;

    const neighbors = [];
    if (x > 0) neighbors.push(p - 1);
    if (x < width - 1) neighbors.push(p + 1);
    if (y > 0) neighbors.push(p - width);
    if (y < height - 1) neighbors.push(p + width);

    for (const n of neighbors) {
      if (visited[n]) continue;
      visited[n] = 1;
      if (maskArr[n]) {
        region[n] = 1;
        stack.push(n);
      }
    }
  }
  return region;
}

const MIN_COMPONENT_PIXELS = 400;

// A pixel's colour with its brightness divided out. Shadow and sunlight
// change how bright a wall is, not this, so it separates "the same wall in
// shade" from "a red pot in front of the wall".
const CHROMA_TOLERANCE = 0.07;
// Below this brightness a pixel's chromaticity is mostly noise; keep it.
const MIN_JUDGEABLE_LUMA = 40;

function medianOfHistogram(hist, count) {
  const half = count / 2;
  let seen = 0;
  for (let v = 0; v < hist.length; v++) {
    seen += hist[v];
    if (seen >= half) return (v + 0.5) / hist.length;
  }
  return 0.5;
}

// Cleans up the AI mask one connected surface at a time: drops tiny specks
// (segmentation noise), then removes pixels whose colour TONE is far from the
// surface's -- objects the model bled into the wall, like a red pot or a
// wooden shelf. Comparing tone rather than raw RGB is what matters: the
// previous RGB-distance version also threw out shadowed corners and sunlit
// patches, about 38% of a correctly detected wall in testing. This keeps
// 99%+ of a clean wall. Per component, because two walls can differ.
function refineMaskPerComponent(rawMask, width, height, imageData) {
  const { data } = imageData;
  const visited = new Uint8Array(rawMask.length);
  const result = new Uint8Array(rawMask.length);
  for (let p = 0; p < rawMask.length; p++) {
    if (!rawMask[p] || visited[p]) continue;
    const startX = p % width;
    const startY = (p - startX) / width;
    const component = floodFillWithinMask(rawMask, width, height, startX, startY);
    let count = 0;
    for (let i = 0; i < component.length; i++) {
      if (component[i]) {
        visited[i] = 1;
        count++;
      }
    }
    if (count < MIN_COMPONENT_PIXELS) continue;
    const histR = new Uint32Array(256);
    const histG = new Uint32Array(256);
    for (let i = 0; i < component.length; i++) {
      if (!component[i]) continue;
      const j = i * 4;
      const sum = data[j] + data[j + 1] + data[j + 2] + 1;
      histR[Math.min(255, (data[j] / sum) * 256) | 0]++;
      histG[Math.min(255, (data[j + 1] / sum) * 256) | 0]++;
    }
    const typicalR = medianOfHistogram(histR, count);
    const typicalG = medianOfHistogram(histG, count);
    for (let i = 0; i < component.length; i++) {
      if (!component[i]) continue;
      const j = i * 4;
      const luma = 0.299 * data[j] + 0.587 * data[j + 1] + 0.114 * data[j + 2];
      const sum = data[j] + data[j + 1] + data[j + 2] + 1;
      const dr = data[j] / sum - typicalR;
      const dg = data[j + 1] / sum - typicalG;
      if (luma < MIN_JUDGEABLE_LUMA || dr * dr + dg * dg <= CHROMA_TOLERANCE * CHROMA_TOLERANCE) result[i] = 1;
    }
  }
  return result;
}

// How bright the original photo is at a pixel (Rec. 601 luma, 0-255).
const lumaAt = (data, i) => 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

// A painted pixel's brightness relative to the surface's typical brightness
// is clamped to this range, so a stray very dark or blown-out pixel can't
// turn the chosen colour black or white.
const MIN_SHADE = 0.35;
const MAX_SHADE = 1.6;

// The typical (median) brightness of a surface, via a 256-bin histogram so
// it stays linear-time on a full-size mask.
function medianLuma(mask, data) {
  const hist = new Uint32Array(256);
  let count = 0;
  for (let p = 0; p < mask.length; p++) {
    if (!mask[p]) continue;
    hist[lumaAt(data, p * 4) | 0]++;
    count++;
  }
  if (count === 0) return 1;
  const half = count / 2;
  let seen = 0;
  for (let v = 0; v < 256; v++) {
    seen += hist[v];
    if (seen >= half) return Math.max(v, 1);
  }
  return 255;
}

// Per-pixel paint coverage (0-1): the mask softened by a 3x3 box blur, so
// painted edges blend into furniture and trim instead of looking cut out.
function featherMask(mask, width, height) {
  const across = new Float32Array(mask.length);
  for (let y = 0; y < height; y++) {
    const row = y * width;
    for (let x = 0; x < width; x++) {
      const l = x > 0 ? mask[row + x - 1] : mask[row + x];
      const r = x < width - 1 ? mask[row + x + 1] : mask[row + x];
      across[row + x] = (l + mask[row + x] + r) / 3;
    }
  }
  const out = new Float32Array(mask.length);
  for (let y = 0; y < height; y++) {
    const up = (y > 0 ? y - 1 : y) * width;
    const down = (y < height - 1 ? y + 1 : y) * width;
    const row = y * width;
    for (let x = 0; x < width; x++) {
      out[row + x] = (across[up + x] + across[row + x] + across[down + x]) / 3;
    }
  }
  return out;
}

// Decodes a base64 PNG mask (from the surface-segmentation API, at the
// original photo's resolution) into a Uint8Array sized to match our
// (possibly downscaled) working canvas, so pixel indices line up.
function loadMaskAsArray(base64Png, width, height) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const off = document.createElement('canvas');
      off.width = width;
      off.height = height;
      const ctx = off.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const data = ctx.getImageData(0, 0, width, height).data;
      const arr = new Uint8Array(width * height);
      for (let p = 0; p < width * height; p++) {
        arr[p] = data[p * 4] > 127 ? 1 : 0;
      }
      resolve(arr);
    };
    img.onerror = reject;
    img.src = `data:image/png;base64,${base64Png}`;
  });
}

export default function PaintVisualizer() {
  const canvasRef = useRef(null);
  const originalImageDataRef = useRef(null);
  // Each region is { key: 'wall' | 'ceiling' | null, mask, color: {r,g,b} | null }.
  // 'wall'/'ceiling' regions are auto-created the moment AI detection
  // succeeds, pre-selecting the whole surface -- color starts null (no
  // tint shown) until the user picks one. key: null is only used by the
  // tap-to-select fallback when AI detection fails.
  const regionsRef = useRef([]);
  const activeRegionIndexRef = useRef(-1);

  const [hasImage, setHasImage] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [selectedColor, setSelectedColor] = useState(PAINT_COLORS[0].hex);
  const [wallColorHex, setWallColorHex] = useState(null);
  const [ceilingColorHex, setCeilingColorHex] = useState(null);
  const [availableSurfaces, setAvailableSurfaces] = useState({ wall: false, ceiling: false });
  const [tolerance, setTolerance] = useState(28);
  const [regionCount, setRegionCount] = useState(0);
  const [segmentationStatus, setSegmentationStatus] = useState('idle'); // idle | loading | ready | failed
  const [eraseMode, setEraseMode] = useState(false);
  const [brushSize, setBrushSize] = useState(32);
  const isErasingRef = useRef(false);
  const brushCursorRef = useRef(null);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const orig = originalImageDataRef.current;
    if (!canvas || !orig) return;
    const ctx = canvas.getContext('2d');
    const out = new Uint8ClampedArray(orig.data);
    const { width, height } = orig;

    // Paints the chosen colour itself, scaled by how much lighter or darker
    // each pixel is than the surface's typical brightness. That keeps the
    // room's light and shadow while the wall reads as the colour picked. (The
    // old approach kept each pixel's absolute lightness and swapped only hue
    // and saturation, so on a white wall every colour came out pastel: navy
    // rendered as light blue.)
    for (const region of regionsRef.current) {
      if (!region.color) continue;
      region.baseLuma ??= medianLuma(region.mask, orig.data);
      region.alpha ??= featherMask(region.mask, width, height);
      const { r, g, b } = region.color;
      const { alpha, baseLuma } = region;
      for (let p = 0; p < alpha.length; p++) {
        const a = alpha[p];
        if (!a) continue;
        const i = p * 4;
        const shade = Math.min(MAX_SHADE, Math.max(MIN_SHADE, lumaAt(orig.data, i) / baseLuma));
        out[i] = out[i] * (1 - a) + r * shade * a;
        out[i + 1] = out[i + 1] * (1 - a) + g * shade * a;
        out[i + 2] = out[i + 2] * (1 - a) + b * shade * a;
      }
    }

    ctx.putImageData(new ImageData(out, width, height), 0, 0);
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoadingImage(true);
    setSegmentationStatus('loading');
    setWallColorHex(null);
    setCeilingColorHex(null);
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
      regionsRef.current = [];
      activeRegionIndexRef.current = -1;
      setRegionCount(0);
      setHasImage(true);
      setLoadingImage(false);
      URL.revokeObjectURL(url);

      // Kick off AI wall/ceiling detection in the background. On success,
      // both surfaces are pre-selected immediately (whole-mask regions,
      // color still null) -- the user's only remaining action is picking
      // a color, no tapping required. On failure, fall back to the old
      // tap-and-flood-fill flow.
      (async () => {
        try {
          const body = new FormData();
          body.append('photo', await resizeToJpegBlob(file, MAX_DIMENSION), 'room.jpg');
          const res = await fetch('/api/segment-surfaces', { method: 'POST', body });
          if (!res.ok) throw new Error('segmentation failed');
          const json = await readJsonResponse(res);
          const imageData = originalImageDataRef.current;
          const newRegions = [];
          if (json.masks.wall) {
            const raw = await loadMaskAsArray(json.masks.wall, width, height);
            newRegions.push({ key: 'wall', mask: refineMaskPerComponent(raw, width, height, imageData), color: null });
          }
          if (json.masks.ceiling) {
            const raw = await loadMaskAsArray(json.masks.ceiling, width, height);
            newRegions.push({ key: 'ceiling', mask: refineMaskPerComponent(raw, width, height, imageData), color: null });
          }
          if (newRegions.length === 0) throw new Error('no surfaces detected');
          regionsRef.current = newRegions;
          activeRegionIndexRef.current = -1;
          setRegionCount(newRegions.length);
          setAvailableSurfaces({
            wall: newRegions.some((r) => r.key === 'wall'),
            ceiling: newRegions.some((r) => r.key === 'ceiling'),
          });
          setSegmentationStatus('ready');
        } catch {
          setSegmentationStatus('failed');
        }
      })();
    };
    img.onerror = () => {
      setLoadingImage(false);
      setSegmentationStatus('idle');
    };
    img.src = url;
  }, []);

  const getCanvasCoords = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.min(canvas.width - 1, Math.max(0, Math.floor((e.clientX - rect.left) * scaleX)));
    const y = Math.min(canvas.height - 1, Math.max(0, Math.floor((e.clientY - rect.top) * scaleY)));
    return [x, y];
  }, []);

  // Tap-to-select only exists as the fallback when AI detection fails --
  // when it succeeds, both surfaces are already pre-selected and tapping
  // the canvas does nothing (color pickers are the only interaction).
  const handleCanvasClick = useCallback((e) => {
    if (!hasImage || eraseMode || segmentationStatus !== 'failed') return;
    const [x, y] = getCanvasCoords(e);
    const mask = floodFillMask(originalImageDataRef.current, x, y, tolerance);
    const region = { key: null, mask, color: hexToRgb(selectedColor) };
    regionsRef.current = [...regionsRef.current, region];
    activeRegionIndexRef.current = regionsRef.current.length - 1;
    setRegionCount(regionsRef.current.length);
    redrawCanvas();
  }, [hasImage, eraseMode, segmentationStatus, tolerance, selectedColor, redrawCanvas, getCanvasCoords]);

  // Manual touch-up brush: works like a real eraser tool -- removes
  // paint from whatever is actually under the brush, across ALL painted
  // regions (not just the last wall/ceiling you tapped), so anything the
  // AI wrongly included (a lamp, an AC unit, anything) can be erased back
  // out no matter which color it ended up under.
  const eraseAt = useCallback((canvasX, canvasY) => {
    const canvas = canvasRef.current;
    if (!canvas || regionsRef.current.length === 0) return;
    const { width, height } = canvas;
    const r2 = brushSize * brushSize;
    const minX = Math.max(0, Math.floor(canvasX - brushSize));
    const maxX = Math.min(width - 1, Math.ceil(canvasX + brushSize));
    const minY = Math.max(0, Math.floor(canvasY - brushSize));
    const maxY = Math.min(height - 1, Math.ceil(canvasY + brushSize));
    for (const region of regionsRef.current) {
      const mask = region.mask;
      let changed = false;
      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          const dx = x - canvasX, dy = y - canvasY;
          const p = y * width + x;
          if (dx * dx + dy * dy <= r2 && mask[p]) {
            mask[p] = 0;
            changed = true;
          }
        }
      }
      if (changed) region.alpha = null;
    }
    redrawCanvas();
  }, [brushSize, redrawCanvas]);

  // Positions the visible brush-outline indicator directly via the DOM
  // (not React state) so it can track every pointer move at full frame
  // rate without triggering a re-render per pixel of movement.
  const updateBrushCursor = useCallback((e, visible) => {
    const cursor = brushCursorRef.current;
    const canvas = canvasRef.current;
    if (!cursor || !canvas) return;
    if (!visible) {
      cursor.style.opacity = '0';
      return;
    }
    const containerRect = canvas.parentElement.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const displayDiameter = brushSize * 2 * (canvasRect.width / canvas.width);
    cursor.style.left = `${e.clientX - containerRect.left}px`;
    cursor.style.top = `${e.clientY - containerRect.top}px`;
    cursor.style.width = `${displayDiameter}px`;
    cursor.style.height = `${displayDiameter}px`;
    cursor.style.opacity = '1';
  }, [brushSize]);

  const handlePointerDown = useCallback((e) => {
    if (!eraseMode) return;
    e.preventDefault();
    isErasingRef.current = true;
    updateBrushCursor(e, true);
    const [x, y] = getCanvasCoords(e);
    eraseAt(x, y);
  }, [eraseMode, getCanvasCoords, eraseAt, updateBrushCursor]);

  const handlePointerMove = useCallback((e) => {
    if (!eraseMode) return;
    updateBrushCursor(e, isErasingRef.current);
    if (!isErasingRef.current) return;
    e.preventDefault();
    const [x, y] = getCanvasCoords(e);
    eraseAt(x, y);
  }, [eraseMode, getCanvasCoords, eraseAt, updateBrushCursor]);

  const handlePointerUp = useCallback((e) => {
    isErasingRef.current = false;
    updateBrushCursor(e, false);
  }, [updateBrushCursor]);

  // Fallback-mode only: colors whichever region the last tap created.
  const handleSelectColor = useCallback((hex) => {
    setSelectedColor(hex);
    const idx = activeRegionIndexRef.current;
    if (idx >= 0 && regionsRef.current[idx]) {
      regionsRef.current[idx] = { ...regionsRef.current[idx], color: hexToRgb(hex) };
      redrawCanvas();
    }
  }, [redrawCanvas]);

  // AI-mode: colors the pre-selected wall or ceiling region directly --
  // no tapping, no "active region" bookkeeping needed.
  const setSurfaceColor = useCallback((key, hex) => {
    const idx = regionsRef.current.findIndex((r) => r.key === key);
    if (idx === -1) return;
    regionsRef.current[idx] = { ...regionsRef.current[idx], color: hexToRgb(hex) };
    redrawCanvas();
  }, [redrawCanvas]);

  const handleSelectWallColor = useCallback((hex) => {
    setWallColorHex(hex);
    setSurfaceColor('wall', hex);
  }, [setSurfaceColor]);

  const handleSelectCeilingColor = useCallback((hex) => {
    setCeilingColorHex(hex);
    setSurfaceColor('ceiling', hex);
  }, [setSurfaceColor]);

  const handleUndo = useCallback(() => {
    regionsRef.current = regionsRef.current.slice(0, -1);
    activeRegionIndexRef.current = regionsRef.current.length - 1;
    setRegionCount(regionsRef.current.length);
    redrawCanvas();
  }, [redrawCanvas]);

  const handleResetPaint = useCallback(() => {
    // Keep AI-detected wall/ceiling regions (just clear their color back
    // to unpainted) but drop any ad-hoc tapped regions from fallback mode.
    regionsRef.current = regionsRef.current
      .filter((r) => r.key)
      .map((r) => ({ ...r, color: null }));
    activeRegionIndexRef.current = -1;
    setWallColorHex(null);
    setCeilingColorHex(null);
    setRegionCount(regionsRef.current.length);
    setEraseMode(false);
    redrawCanvas();
  }, [redrawCanvas]);

  const handleNewPhoto = useCallback(() => {
    setHasImage(false);
    regionsRef.current = [];
    originalImageDataRef.current = null;
    setSegmentationStatus('idle');
    setRegionCount(0);
    setEraseMode(false);
    setWallColorHex(null);
    setCeilingColorHex(null);
    setAvailableSurfaces({ wall: false, ceiling: false });
  }, []);

  return (
    <div className="min-h-screen bg-[#070A25]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <Link href="/our-design" className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-nunito">
            <ArrowLeft className="w-4 h-4" />
            Back to Designs
          </Link>
          <h1 className="font-playfair font-bold text-white text-[20px]">Wall &amp; Ceiling Paint Visualizer</h1>
          <div className="w-[100px]" />
        </div>

        {!hasImage && (
          <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/20 rounded-2xl py-16 px-6 cursor-pointer hover:border-[#D9A441]/60 transition-colors">
            <Upload className="w-8 h-8 text-white/50" />
            <span className="text-white/80 font-nunito text-[15px] text-center">
              {loadingImage ? 'Loading photo...' : 'Upload a photo of your room to try wall & ceiling colors'}
            </span>
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
          </label>
        )}

        {/* Canvas stays mounted even before an image is chosen, so canvasRef
            is already a real element by the time handleFileChange runs --
            it's just hidden until there's something to show. */}
        <div className="relative rounded-2xl overflow-hidden bg-black" hidden={!hasImage}>
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{ touchAction: eraseMode ? 'none' : 'auto' }}
            className={`w-full h-auto block ${eraseMode ? 'cursor-cell' : 'cursor-crosshair'}`}
          />
          {eraseMode && (
            <div
              ref={brushCursorRef}
              className="absolute rounded-full border-2 border-white pointer-events-none"
              style={{
                opacity: 0,
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
                transition: 'opacity 0.1s',
              }}
            />
          )}
          {segmentationStatus === 'loading' && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 text-white text-[12px] font-nunito px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Detecting walls &amp; ceiling...
            </div>
          )}
          {segmentationStatus === 'failed' && (
            <div className="absolute top-3 left-3 bg-black/60 text-white/80 text-[12px] font-nunito px-3 py-1.5 rounded-full max-w-[85%]">
              Wall/ceiling detection unavailable -- using approximate selection.
            </div>
          )}
          {segmentationStatus === 'failed' && regionCount === 0 && !eraseMode && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6">
              <p className="bg-black/60 text-white text-[13px] font-nunito px-4 py-2 rounded-full text-center">
                Tap a wall or ceiling to select it
              </p>
            </div>
          )}
          {eraseMode && (
            <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none px-6">
              <p className="bg-black/60 text-white text-[13px] font-nunito px-4 py-2 rounded-full text-center">
                Drag over anything wrongly painted to remove it
              </p>
            </div>
          )}
        </div>

        {hasImage && (
          <>
            {segmentationStatus === 'ready' && (
              <p className="mt-5 text-white/70 text-[13px] font-nunito">
                Walls and ceiling detected automatically -- just pick a color below.
              </p>
            )}

            {segmentationStatus === 'ready' && availableSurfaces.wall && (
              <div className="mt-4">
                <p className="text-white/70 text-[13px] font-nunito mb-2">Wall Color</p>
                <div className="flex flex-wrap gap-2.5">
                  {PAINT_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => handleSelectWallColor(c.hex)}
                      aria-label={c.name}
                      className={`w-9 h-9 rounded-full border-2 transition-transform ${
                        wallColorHex === c.hex ? 'border-white scale-110' : 'border-white/20'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                  <input
                    type="color"
                    value={wallColorHex || '#ffffff'}
                    onChange={(e) => handleSelectWallColor(e.target.value)}
                    className="w-9 h-9 rounded-full border-2 border-white/20 bg-transparent cursor-pointer"
                    aria-label="Custom wall color"
                  />
                </div>
              </div>
            )}

            {segmentationStatus === 'ready' && availableSurfaces.ceiling && (
              <div className="mt-4">
                <p className="text-white/70 text-[13px] font-nunito mb-2">Ceiling Color</p>
                <div className="flex flex-wrap gap-2.5">
                  {PAINT_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => handleSelectCeilingColor(c.hex)}
                      aria-label={`Ceiling ${c.name}`}
                      className={`w-9 h-9 rounded-full border-2 transition-transform ${
                        ceilingColorHex === c.hex ? 'border-white scale-110' : 'border-white/20'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                  <input
                    type="color"
                    value={ceilingColorHex || '#ffffff'}
                    onChange={(e) => handleSelectCeilingColor(e.target.value)}
                    className="w-9 h-9 rounded-full border-2 border-white/20 bg-transparent cursor-pointer"
                    aria-label="Custom ceiling color"
                  />
                </div>
              </div>
            )}

            {segmentationStatus === 'failed' && (
              <div className="mt-5 flex flex-wrap gap-2.5">
                {PAINT_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => handleSelectColor(c.hex)}
                    aria-label={c.name}
                    className={`w-9 h-9 rounded-full border-2 transition-transform ${
                      selectedColor === c.hex ? 'border-white scale-110' : 'border-white/20'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => handleSelectColor(e.target.value)}
                  className="w-9 h-9 rounded-full border-2 border-white/20 bg-transparent cursor-pointer"
                  aria-label="Custom color"
                />
              </div>
            )}

            {segmentationStatus === 'failed' && (
              <div className="mt-5">
                <label className="flex items-center justify-between text-white/70 text-[13px] font-nunito mb-1.5">
                  <span>Selection sensitivity</span>
                  <span>{tolerance}</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-white/40 text-[12px] font-nunito mt-1">
                  If the color leaks past the surface, lower this. If it doesn&apos;t cover the whole surface, raise it -- then tap it again.
                </p>
              </div>
            )}

            {eraseMode && (
              <div className="mt-5">
                <label className="flex items-center justify-between text-white/70 text-[13px] font-nunito mb-1.5">
                  <span>Eraser size</span>
                  <span>{brushSize}</span>
                </label>
                <input
                  type="range"
                  min="8"
                  max="60"
                  step="2"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => setEraseMode((v) => !v)}
                disabled={regionCount === 0}
                className={`flex items-center gap-1.5 border font-nunito text-[13px] px-4 py-2 rounded-lg transition-colors disabled:opacity-30 ${
                  eraseMode
                    ? 'bg-[#F2B21B] text-[#0B103B] border-[#D9A441]'
                    : 'border-white/20 text-[#0B103B]/80 hover:bg-white/10'
                }`}
              >
                <Eraser className="w-4 h-4" />
                {eraseMode ? 'Done Erasing' : 'Fix a Wrong Area'}
              </button>
              {segmentationStatus === 'failed' && (
                <button
                  onClick={handleUndo}
                  disabled={regionCount === 0}
                  className="flex items-center gap-1.5 border border-white/20 text-white/80 disabled:opacity-30 font-nunito text-[13px] px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Undo2 className="w-4 h-4" />
                  Undo Last
                </button>
              )}
              <button
                onClick={handleResetPaint}
                disabled={regionCount === 0}
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
      </div>
    </div>
  );
}
