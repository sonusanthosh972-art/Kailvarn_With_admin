'use client';

import React, { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2, Undo2, RotateCcw, Upload, Sparkles, Eraser, Camera, ImageIcon } from 'lucide-react';
import { PAINT_COLORS } from '@/constants/paintColors.js';
import PaintColorPicker from '@/components/paint/PaintColorPicker.jsx';
import { useSamSelect } from '@/components/paint/useSamSelect.js';
import { resizeToJpegBlob, readJsonResponse } from '@/lib/imageUpload.js';
import { closestAspectRatio } from '@/constants/segmentationConfig.js';
import { DIWALI_OFFER } from '@/constants/offers.js';
import { usePromo } from '@/components/offers/PromoProvider.jsx';

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
// The tone pass is only for the HF model's texture-based masks: the Gemini
// map already excludes objects by understanding the scene, so for it this
// just drops specks.
function refineMaskPerComponent(rawMask, width, height, imageData, rejectOutliers = true) {
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
    if (!rejectOutliers) {
      for (let i = 0; i < component.length; i++) if (component[i]) result[i] = 1;
      continue;
    }
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

// Per-pixel brightness factor for painting a surface: the photo's brightness
// at each pixel divided by its LOCAL typical brightness (box average over
// the surface within ~1/10 of the photo). Dividing by a local baseline
// removes the old paint colour -- a white panel and a brown wall in the same
// mask both come out as the chosen colour -- while keeping shadows, corners
// and light falloff. A quarter of the global median is mixed in so one side
// of a room that is genuinely darker stays a little darker.
// `cover` (the feathered alpha) marks every pixel that gets paint, including
// the soft edge just outside the mask.
function shadeMap(mask, data, width, height, cover) {
  const n = width * height;
  const W1 = width + 1;
  const sum = new Float64Array(W1 * (height + 1));
  const cnt = new Float64Array(W1 * (height + 1));
  const hist = new Uint32Array(256);
  let total = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      const on = mask[p] ? 1 : 0;
      const l = on ? lumaAt(data, p * 4) : 0;
      if (on) { hist[l | 0]++; total++; }
      const q = (y + 1) * W1 + x + 1;
      sum[q] = l + sum[q - W1] + sum[q - 1] - sum[q - W1 - 1];
      cnt[q] = on + cnt[q - W1] + cnt[q - 1] - cnt[q - W1 - 1];
    }
  }
  let globalMedian = 128;
  for (let v = 0, seen = 0; v < 256; v++) {
    seen += hist[v];
    if (seen >= total / 2) { globalMedian = Math.max(v, 1); break; }
  }
  const r = Math.max(24, Math.round(Math.max(width, height) / 10));
  const shade = new Float32Array(n);
  for (let y = 0; y < height; y++) {
    const y0 = Math.max(0, y - r), y1 = Math.min(height - 1, y + r);
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      if (!cover[p]) continue;
      const x0 = Math.max(0, x - r), x1 = Math.min(width - 1, x + r);
      const a = (y1 + 1) * W1 + x1 + 1, b = y0 * W1 + x1 + 1, c = (y1 + 1) * W1 + x0, d = y0 * W1 + x0;
      const local = Math.max(1, (sum[a] - sum[b] - sum[c] + sum[d]) / Math.max(1, cnt[a] - cnt[b] - cnt[c] + cnt[d]));
      const base = local ** 0.75 * globalMedian ** 0.25;
      shade[p] = Math.min(MAX_SHADE, Math.max(MIN_SHADE, lumaAt(data, p * 4) / base));
    }
  }
  return shade;
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

// Decodes the AI color-coded surface map (walls red, ceiling blue,
// everything else black -- see AI_SURFACE_PROMPT) into separate wall and
// ceiling masks at our working canvas resolution. Classification is by
// channel dominance rather than exact color so the model's slightly-off
// reds/blues and soft edges still land in the right class, while
// blended red/blue edge pixels (neither clearly dominant) are left
// unpainted instead of leaking one surface into the other.
// `pad` is how the photo sat inside the padded image that was sent
// ({ padW, padH, ox, oy }): the map is scaled to that padded size and the
// photo's own rectangle cut back out, so nothing is stretched.
function decodeSurfaceMap(dataUrl, width, height, pad = { padW: width, padH: height, ox: 0, oy: 0 }) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const off = document.createElement('canvas');
      off.width = width;
      off.height = height;
      const ctx = off.getContext('2d');
      ctx.drawImage(img, -pad.ox, -pad.oy, pad.padW, pad.padH);
      const data = ctx.getImageData(0, 0, width, height).data;
      const wall = new Uint8Array(width * height);
      const ceiling = new Uint8Array(width * height);
      let wallCount = 0;
      let ceilingCount = 0;
      for (let p = 0; p < width * height; p++) {
        const i = p * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (r > 140 && r > g * 2 && r > b * 2) {
          wall[p] = 1;
          wallCount++;
        } else if (b > 140 && b > r * 2 && b > g * 2) {
          ceiling[p] = 1;
          ceilingCount++;
        }
      }
      resolve({ wall: wallCount ? wall : null, ceiling: ceilingCount ? ceiling : null });
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

// The AI map reliably excludes big objects but tends to paint straight
// over small ceiling fixtures (round lights, downlights, detectors) that
// are nearly the ceiling's own color. Those fixtures have crisp, strong
// outlines, while sunlight and shadow on plaster fade gradually -- so
// find compact sharp-edged blobs inside the ceiling mask and cut them
// (filled, not just their rim) out of it.
function removeCeilingFixtures(mask, imageData, edgeThreshold = 28) {
  const { width, height, data } = imageData;
  const n = width * height;
  const lum = new Float32Array(n);
  for (let p = 0; p < n; p++) {
    const i = p * 4;
    lum[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  // Interior: ceiling pixels at least 4px from the mask edge, so the
  // wall/ceiling boundary itself never counts as a fixture outline.
  let interior = mask;
  for (let k = 0; k < 4; k++) interior = erode(interior, width, height);
  const edges = new Uint8Array(n);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const p = y * width + x;
      if (!interior[p]) continue;
      const gx = lum[p - width + 1] + 2 * lum[p + 1] + lum[p + width + 1]
        - lum[p - width - 1] - 2 * lum[p - 1] - lum[p + width - 1];
      const gy = lum[p + width - 1] + 2 * lum[p + width] + lum[p + width + 1]
        - lum[p - width - 1] - 2 * lum[p - width] - lum[p - width + 1];
      if (Math.hypot(gx, gy) / 4 > edgeThreshold) edges[p] = 1;
    }
  }
  // Grow edges by 4px so the broken arcs of one fixture's rim (a light's
  // top and bottom edges are often detected separately) join into one
  // closed blob.
  let grownEdges = edges;
  for (let k = 0; k < 4; k++) grownEdges = dilate(grownEdges, width, height);
  const outline = maskAnd(grownEdges, mask);
  const fixtures = new Uint8Array(n);
  // Compact outline blobs = fixture rims (long thin lines like a
  // shadow edge spanning the ceiling are left alone).
  const blobs = [];
  forEachComponent(outline, width, height, (pixels, minX, maxX, minY, maxY) => {
    if (pixels.length < 6) return;
    if (maxX - minX > width * 0.2 || maxY - minY > height * 0.15) return;
    blobs.push({ pixels, minX, maxX, minY, maxY });
  });
  // One fixture's rim can still come back as separate arcs (e.g. its
  // top and bottom edge) -- merge blobs whose boxes nearly touch.
  const GAP = 6;
  for (let merged = true; merged;) {
    merged = false;
    for (let i = 0; i < blobs.length && !merged; i++) {
      for (let j = i + 1; j < blobs.length; j++) {
        const a = blobs[i], b = blobs[j];
        if (a.minX - GAP > b.maxX || b.minX - GAP > a.maxX || a.minY - GAP > b.maxY || b.minY - GAP > a.maxY) continue;
        const m = {
          pixels: a.pixels.concat(b.pixels),
          minX: Math.min(a.minX, b.minX), maxX: Math.max(a.maxX, b.maxX),
          minY: Math.min(a.minY, b.minY), maxY: Math.max(a.maxY, b.maxY),
        };
        if (m.maxX - m.minX > width * 0.2 || m.maxY - m.minY > height * 0.15) continue;
        blobs.splice(j, 1);
        blobs[i] = m;
        merged = true;
        break;
      }
    }
  }
  // Fill each blob's convex hull, not just its detected rim -- light
  // fixtures are convex, and the rim often comes back as an open arc.
  for (const { pixels, minX, maxX, minY, maxY } of blobs) {
    const hull = convexHull(pixels, width);
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (insideConvex(hull, x, y)) fixtures[y * width + x] = 1;
      }
    }
  }
  // Ceiling pockets fully enclosed by an outline = fixture interiors.
  const rest = new Uint8Array(n);
  for (let p = 0; p < n; p++) rest[p] = mask[p] && !outline[p] ? 1 : 0;
  const pockets = [];
  let biggest = 0;
  forEachComponent(rest, width, height, (pixels) => {
    pockets.push(pixels);
    if (pixels.length > biggest) biggest = pixels.length;
  });
  for (const pixels of pockets) {
    if (pixels.length < biggest * 0.02) for (const p of pixels) fixtures[p] = 1;
  }
  const grown = dilate(fixtures, width, height);
  const result = new Uint8Array(n);
  for (let p = 0; p < n; p++) result[p] = mask[p] && !grown[p] ? 1 : 0;
  return result;
}

// The AI map sometimes marks wall coverings as wall: wooden slat panels,
// cladding, tiles, wallpaper. Painted plaster is smooth -- light and shadow
// change across it gradually -- while those coverings are packed with sharp
// edges. So cut out every area where a large share of nearby mask pixels
// sit on a sharp edge. Edges are only counted well inside the mask, so the
// outlines of the TV, sofa or a wall corner never count against the wall.
// On a test photo, slat panels measured 0.3-0.9 edge density and plain
// wall 0.00. The window is wide so a single strong line (a wall corner, the
// wall/ceiling join) stays well under the threshold.
function removeTexturedAreas(mask, imageData, { edgeThreshold = 20, radius = 10, maxDensity = 0.32 } = {}) {
  const { width, height, data } = imageData;
  const n = width * height;
  const lum = new Float32Array(n);
  for (let p = 0; p < n; p++) {
    const i = p * 4;
    lum[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  // Close small gaps first (dilate then erode), so a mask that covers only
  // the strips between slats -- a comb rather than a solid block -- still
  // has an inside to measure.
  let interior = mask;
  for (let k = 0; k < 3; k++) interior = dilate(interior, width, height);
  for (let k = 0; k < 5; k++) interior = erode(interior, width, height);
  // Integral images of edge pixels and interior pixels, so each window's
  // density is O(1) to read.
  const W1 = width + 1;
  const edgeSum = new Uint32Array(W1 * (height + 1));
  const areaSum = new Uint32Array(W1 * (height + 1));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      let edge = 0;
      if (interior[p] && x > 0 && y > 0 && x < width - 1 && y < height - 1) {
        const gx = lum[p - width + 1] + 2 * lum[p + 1] + lum[p + width + 1]
          - lum[p - width - 1] - 2 * lum[p - 1] - lum[p + width - 1];
        const gy = lum[p + width - 1] + 2 * lum[p + width] + lum[p + width + 1]
          - lum[p - width - 1] - 2 * lum[p - width] - lum[p - width + 1];
        if (Math.hypot(gx, gy) / 4 > edgeThreshold) edge = 1;
      }
      const q = (y + 1) * W1 + x + 1;
      edgeSum[q] = edge + edgeSum[q - W1] + edgeSum[q - 1] - edgeSum[q - W1 - 1];
      areaSum[q] = interior[p] + areaSum[q - W1] + areaSum[q - 1] - areaSum[q - W1 - 1];
    }
  }
  const boxSum = (sum, x0, y0, x1, y1) =>
    sum[(y1 + 1) * W1 + x1 + 1] - sum[y0 * W1 + x1 + 1] - sum[(y1 + 1) * W1 + x0] + sum[y0 * W1 + x0];
  const minArea = (2 * radius + 1) ** 2 * 0.3;
  let textured = new Uint8Array(n);
  let found = false;
  for (let y = 0; y < height; y++) {
    const y0 = Math.max(0, y - radius), y1 = Math.min(height - 1, y + radius);
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      if (!mask[p]) continue;
      const x0 = Math.max(0, x - radius), x1 = Math.min(width - 1, x + radius);
      const area = boxSum(areaSum, x0, y0, x1, y1);
      if (area < minArea) continue;
      if (boxSum(edgeSum, x0, y0, x1, y1) / area > maxDensity) {
        textured[p] = 1;
        found = true;
      }
    }
  }
  if (!found) return mask;
  // Grow by the window radius so the panel's own border (and the gaps
  // between slats right at its edge) go too.
  for (let k = 0; k < radius; k++) textured = dilate(textured, width, height);
  // Next to a panel, also drop thin slivers of mask (a few px wide): the
  // strips between slats at the panel's edge that the window missed.
  let zone = textured;
  for (let k = 0; k < radius * 2; k++) zone = dilate(zone, width, height);
  let solid = mask;
  for (let k = 0; k < 3; k++) solid = erode(solid, width, height);
  for (let k = 0; k < 3; k++) solid = dilate(solid, width, height);
  const result = new Uint8Array(n);
  for (let p = 0; p < n; p++) result[p] = mask[p] && !textured[p] && (solid[p] || !zone[p]) ? 1 : 0;
  return result;
}

function maskAnd(a, b) {
  const out = new Uint8Array(a.length);
  for (let p = 0; p < a.length; p++) out[p] = a[p] && b[p] ? 1 : 0;
  return out;
}

function erode(mask, width, height) {
  const out = new Uint8Array(mask.length);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const p = y * width + x;
      out[p] = mask[p] && mask[p - 1] && mask[p + 1] && mask[p - width] && mask[p + width] ? 1 : 0;
    }
  }
  return out;
}

function dilate(mask, width, height) {
  const out = new Uint8Array(mask.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      out[p] = mask[p]
        || (x > 0 && mask[p - 1]) || (x < width - 1 && mask[p + 1])
        || (y > 0 && mask[p - width]) || (y < height - 1 && mask[p + width]) ? 1 : 0;
    }
  }
  return out;
}

function forEachComponent(mask, width, height, visit) {
  const seen = new Uint8Array(mask.length);
  const stack = [];
  for (let s = 0; s < mask.length; s++) {
    if (!mask[s] || seen[s]) continue;
    const pixels = [];
    let minX = width, maxX = 0, minY = height, maxY = 0;
    seen[s] = 1;
    stack.push(s);
    while (stack.length) {
      const p = stack.pop();
      pixels.push(p);
      const x = p % width, y = (p - x) / width;
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      if (x > 0 && mask[p - 1] && !seen[p - 1]) { seen[p - 1] = 1; stack.push(p - 1); }
      if (x < width - 1 && mask[p + 1] && !seen[p + 1]) { seen[p + 1] = 1; stack.push(p + 1); }
      if (y > 0 && mask[p - width] && !seen[p - width]) { seen[p - width] = 1; stack.push(p - width); }
      if (y < height - 1 && mask[p + width] && !seen[p + width]) { seen[p + width] = 1; stack.push(p + width); }
    }
    visit(pixels, minX, maxX, minY, maxY);
  }
}

// Andrew's monotone chain over each row's leftmost/rightmost pixel (the
// only points that can be on the hull), counter-clockwise.
function convexHull(pixels, width) {
  const rows = new Map();
  for (const p of pixels) {
    const x = p % width, y = (p - x) / width;
    const r = rows.get(y);
    if (!r) rows.set(y, [x, x]);
    else { if (x < r[0]) r[0] = x; if (x > r[1]) r[1] = x; }
  }
  const pts = [];
  for (const [y, [a, b]] of rows) { pts.push([a, y]); if (b !== a) pts.push([b, y]); }
  pts.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  if (pts.length < 3) return pts;
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [], upper = [];
  for (const pt of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], pt) <= 0) lower.pop();
    lower.push(pt);
  }
  for (let i = pts.length - 1; i >= 0; i--) {
    const pt = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], pt) <= 0) upper.pop();
    upper.push(pt);
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}

function insideConvex(hull, x, y) {
  if (hull.length < 3) return hull.some(([hx, hy]) => hx === x && hy === y);
  for (let i = 0; i < hull.length; i++) {
    const [ax, ay] = hull[i];
    const [bx, by] = hull[(i + 1) % hull.length];
    if ((bx - ax) * (y - ay) - (by - ay) * (x - ax) < 0) return false;
  }
  return true;
}

// The AI map occasionally marks a window / the sky outside it as ceiling
// (it's a bright, flat, blue-ish region). The real ceiling is always the
// topmost overhead plane, so keep only ceiling components that start
// above the bottom edge of the largest ceiling component -- that drops a
// stray patch sitting down at window height while still allowing a
// ceiling split in two by a beam or light fixture.
function keepOverheadCeiling(mask, width, height) {
  const visited = new Uint8Array(mask.length);
  const components = [];
  for (let p = 0; p < mask.length; p++) {
    if (!mask[p] || visited[p]) continue;
    const x0 = p % width;
    const comp = floodFillWithinMask(mask, width, height, x0, (p - x0) / width);
    let count = 0, minY = height, maxY = 0;
    for (let i = 0; i < comp.length; i++) {
      if (!comp[i]) continue;
      visited[i] = 1;
      count++;
      const y = (i - (i % width)) / width;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    components.push({ comp, count, minY, maxY });
  }
  if (components.length <= 1) return mask;
  const main = components.reduce((a, b) => (b.count > a.count ? b : a));
  const result = new Uint8Array(mask.length);
  for (const c of components) {
    if (c !== main && c.minY > main.maxY) continue;
    for (let i = 0; i < c.comp.length; i++) if (c.comp[i]) result[i] = 1;
  }
  return result;
}

// Gemini only returns maps in a few fixed aspect ratios. Letterbox the photo
// with black onto exactly the nearest one, so the map comes back the same
// shape as what was sent and needs no stretching to line up.
function padToAspect(canvas) {
  const { width, height } = canvas;
  const [rw, rh] = closestAspectRatio(width, height).split(':').map(Number);
  const ratio = rw / rh;
  const padW = width / height > ratio ? width : Math.round(height * ratio);
  const padH = width / height > ratio ? Math.round(width / ratio) : height;
  const ox = Math.round((padW - width) / 2);
  const oy = Math.round((padH - height) / 2);
  const off = document.createElement('canvas');
  off.width = padW;
  off.height = padH;
  const ctx = off.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, padW, padH);
  ctx.drawImage(canvas, ox, oy);
  return { canvas: off, padW, padH, ox, oy };
}

function canvasToJpegBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('encode failed'))), 'image/jpeg', 0.9);
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
  const [uploadError, setUploadError] = useState('');
  const [eraseMode, setEraseMode] = useState(false);
  const [brushSize, setBrushSize] = useState(32);
  const isErasingRef = useRef(false);
  const brushCursorRef = useRef(null);
  // Segment Anything in the browser: precise tap-to-select (falls back to
  // the colour flood fill while it loads, or if the device can't run it).
  const promo = usePromo();
  const { status: samStatus, encode: samEncode, select: samSelect, reset: samReset } = useSamSelect();
  const smartSelect = samStatus === 'ready';
  const [selecting, setSelecting] = useState(false);
  // Optional AI realistic preview (one paid call, only when the visitor asks).
  const [preview, setPreview] = useState({ status: 'idle', image: null, error: '' });

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const orig = originalImageDataRef.current;
    if (!canvas || !orig) return;
    const ctx = canvas.getContext('2d');
    const out = new Uint8ClampedArray(orig.data);
    const { width, height } = orig;

    // Paints the chosen colour itself, scaled by how much lighter or darker
    // each pixel is than the surface's local typical brightness (shadeMap). That keeps the
    // room's light and shadow while the wall reads as the colour picked. (The
    // old approach kept each pixel's absolute lightness and swapped only hue
    // and saturation, so on a white wall every colour came out pastel: navy
    // rendered as light blue.)
    for (const region of regionsRef.current) {
      if (!region.color) continue;
      if (!region.alpha) {
        region.alpha = featherMask(region.mask, width, height);
        region.shade = shadeMap(region.mask, orig.data, width, height, region.alpha);
      }
      const { r, g, b } = region.color;
      const { alpha, shade: shadeOf } = region;
      for (let p = 0; p < alpha.length; p++) {
        const a = alpha[p];
        if (!a) continue;
        const i = p * 4;
        const shade = shadeOf[p];
        out[i] = out[i] * (1 - a) + r * shade * a;
        out[i + 1] = out[i + 1] * (1 - a) + g * shade * a;
        out[i + 2] = out[i + 2] * (1 - a) + b * shade * a;
      }
    }

    ctx.putImageData(new ImageData(out, width, height), 0, 0);
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    // Clear the input so picking the same photo again still fires onChange.
    e.target.value = '';
    if (!file) return;
    setUploadError('');
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
      samEncode(originalImageDataRef.current);
      regionsRef.current = [];
      activeRegionIndexRef.current = -1;
      setRegionCount(0);
      setHasImage(true);
      setLoadingImage(false);
      URL.revokeObjectURL(url);

      // Snapshot the unpainted, downscaled photo now (toBlob reads the
      // canvas at call time) -- sending this instead of the raw upload
      // keeps the request small and guarantees the AI map is computed on
      // exactly the pixels we paint over.
      const padded = padToAspect(canvas);
      const photoBlobPromise = canvasToJpegBlob(padded.canvas);

      // Kick off AI wall/ceiling detection in the background. On success,
      // both surfaces are pre-selected immediately (whole-mask regions,
      // color still null) -- the user's only remaining action is picking
      // a color, no tapping required. Tries the Gemini scene-understanding
      // detector first, then the HF ADE20K model; if both fail, falls
      // back to the old tap-and-flood-fill flow.
      const detectWithGemini = async () => {
        const body = new FormData();
        body.append('photo', await photoBlobPromise, 'room.jpg');
        body.append('width', String(padded.padW));
        body.append('height', String(padded.padH));
        const res = await fetch('/api/segment-surfaces-ai', { method: 'POST', body });
        if (!res.ok) throw new Error('ai segmentation failed');
        const json = await readJsonResponse(res);
        const photo = originalImageDataRef.current;
        const masks = await decodeSurfaceMap(json.surfaceMap, width, height, padded);
        if (masks.wall) masks.wall = removeTexturedAreas(masks.wall, photo);
        if (masks.ceiling) {
          masks.ceiling = removeCeilingFixtures(
            removeTexturedAreas(keepOverheadCeiling(masks.ceiling, width, height), photo),
            photo,
          );
        }
        return { ...masks, fromAi: true };
      };
      const detectWithSegformer = async () => {
        const body = new FormData();
        body.append('photo', await resizeToJpegBlob(file, MAX_DIMENSION), 'room.jpg');
        const res = await fetch('/api/segment-surfaces', { method: 'POST', body });
        if (!res.ok) throw new Error('segmentation failed');
        const json = await readJsonResponse(res);
        return {
          wall: json.masks.wall ? await loadMaskAsArray(json.masks.wall, width, height) : null,
          ceiling: json.masks.ceiling ? await loadMaskAsArray(json.masks.ceiling, width, height) : null,
        };
      };

      (async () => {
        try {
          let masks;
          try {
            masks = await detectWithGemini();
            if (!masks.wall && !masks.ceiling) throw new Error('no surfaces in ai map');
          } catch {
            masks = await detectWithSegformer();
          }
          const imageData = originalImageDataRef.current;
          const newRegions = [];
          if (masks.wall) {
            newRegions.push({ key: 'wall', mask: refineMaskPerComponent(masks.wall, width, height, imageData, !masks.fromAi), color: null });
          }
          if (masks.ceiling) {
            newRegions.push({ key: 'ceiling', mask: refineMaskPerComponent(masks.ceiling, width, height, imageData, !masks.fromAi), color: null });
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
      URL.revokeObjectURL(url);
      setLoadingImage(false);
      setSegmentationStatus('idle');
      // Usually an HEIC photo on a browser that can't decode it.
      setUploadError("This photo couldn't be opened. Please choose a JPG or PNG photo, or take a new one with the camera.");
    };
    img.src = url;
  }, [samEncode]);

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
  // Uses SAM's outline of the tapped surface when it's ready, otherwise
  // the colour flood fill.
  const handleCanvasClick = useCallback(async (e) => {
    if (!hasImage || eraseMode || segmentationStatus !== 'failed' || selecting) return;
    const [x, y] = getCanvasCoords(e);
    const orig = originalImageDataRef.current;
    let mask = null;
    if (smartSelect) {
      setSelecting(true);
      const result = await samSelect((x + 0.5) / orig.width, (y + 0.5) / orig.height);
      setSelecting(false);
      // Ignore a result for a photo that has since been replaced
      if (originalImageDataRef.current !== orig) return;
      if (result && result.width === orig.width && result.height === orig.height) mask = result.mask;
    }
    if (!mask) mask = floodFillMask(orig, x, y, tolerance);
    const region = { key: null, mask, color: hexToRgb(selectedColor) };
    regionsRef.current = [...regionsRef.current, region];
    activeRegionIndexRef.current = regionsRef.current.length - 1;
    setRegionCount(regionsRef.current.length);
    redrawCanvas();
  }, [hasImage, eraseMode, segmentationStatus, selecting, smartSelect, samSelect, tolerance, selectedColor, redrawCanvas, getCanvasCoords]);

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
    setPreview({ status: 'idle', image: null, error: '' });
    redrawCanvas();
  }, [redrawCanvas]);

  const handleNewPhoto = useCallback(() => {
    samReset();
    setPreview({ status: 'idle', image: null, error: '' });
    setHasImage(false);
    regionsRef.current = [];
    originalImageDataRef.current = null;
    setSegmentationStatus('idle');
    setRegionCount(0);
    setEraseMode(false);
    setWallColorHex(null);
    setCeilingColorHex(null);
    setAvailableSurfaces({ wall: false, ceiling: false });
  }, [samReset]);

  // Sends the original photo + the browser-painted version; Gemini returns a
  // photorealistic render. Colours go as hex codes only.
  const canPreview = segmentationStatus === 'ready' ? Boolean(wallColorHex || ceilingColorHex) : segmentationStatus === 'failed' && regionCount > 0;
  const handleAiPreview = useCallback(async () => {
    const canvas = canvasRef.current;
    const orig = originalImageDataRef.current;
    if (!canvas || !orig) return;
    setEraseMode(false);
    setPreview({ status: 'loading', image: null, error: '' });
    try {
      const origCanvas = document.createElement('canvas');
      origCanvas.width = orig.width;
      origCanvas.height = orig.height;
      origCanvas.getContext('2d').putImageData(orig, 0, 0);
      const body = new FormData();
      body.append('photo', await canvasToJpegBlob(origCanvas), 'room.jpg');
      body.append('guide', await canvasToJpegBlob(canvas), 'painted.jpg');
      body.append('width', String(orig.width));
      body.append('height', String(orig.height));
      if (segmentationStatus === 'ready') {
        if (wallColorHex) body.append('wall', wallColorHex);
        if (ceilingColorHex) body.append('ceiling', ceilingColorHex);
      }
      const res = await fetch('/api/paint-preview', { method: 'POST', body });
      const json = await readJsonResponse(res).catch(() => null);
      if (!res.ok || !json?.image) throw new Error(json?.error || 'AI preview failed. Please try again.');
      setPreview({ status: 'done', image: json.image, error: '' });
    } catch (err) {
      setPreview({ status: 'error', image: null, error: err?.message || 'AI preview failed. Please try again.' });
    }
  }, [segmentationStatus, wallColorHex, ceilingColorHex]);

  return (
    <div className="min-h-screen bg-[#070A25]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* Phones: back link on its own line, title below. sm+: three columns
            with the title truly centred (equal 1fr side columns). */}
        <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4">
          <Link href="/our-design" className="inline-flex min-h-[40px] items-center gap-1.5 justify-self-start whitespace-nowrap text-white/70 hover:text-white text-sm font-nunito">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Designs
          </Link>
          <h1 className="font-playfair font-bold text-white text-[22px] leading-tight sm:text-[20px] sm:text-center">Wall &amp; Ceiling Paint Visualizer</h1>
          <span className="hidden sm:block" aria-hidden="true" />
        </div>

        {/* Festival offer: from trying colours straight to booking the painters */}
        {promo.active && (
          <Link
            href={DIWALI_OFFER.quotePath}
            className="group mb-5 flex items-center justify-between gap-3 rounded-xl border border-[#F2B21B]/50 bg-[linear-gradient(135deg,#3E080B_0%,#7A1418_100%)] px-4 py-3 font-nunito text-white"
          >
            <span className="text-[13.5px] sm:text-[14.5px] leading-snug">
              <strong className="text-[#FFD66B]">{promo.title} offer: {promo.discount}% off painting</strong>
              <span className="text-white/80"> with any paint brand. Like a colour? Get it painted.</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-bold uppercase tracking-[0.12em] text-[#F6D47C]">
              Claim <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
        )}

        {!hasImage && (
          <div className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-white/20 rounded-2xl py-12 sm:py-16 px-5 text-center">
            <Upload className="w-8 h-8 text-white/50" aria-hidden="true" />
            <p className="text-white/80 font-nunito text-[15px] max-w-[340px]">
              {loadingImage ? 'Loading photo...' : 'Add a photo of your room to try wall & ceiling colours'}
            </p>
            {/* Two inputs: `capture` opens the camera directly on phones but
                hides the gallery, so picking an existing photo needs its own
                button. The camera button only shows on touch devices. */}
            <div className="flex w-full max-w-[420px] flex-col gap-3 sm:flex-row sm:justify-center">
              <label className="btn-primary hidden w-full cursor-pointer sm:w-auto [@media(pointer:coarse)]:inline-flex">
                <Camera className="h-4 w-4" aria-hidden="true" /> Take photo
                <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={handleFileChange} disabled={loadingImage} />
              </label>
              <label className="btn-outline w-full cursor-pointer sm:w-auto">
                <ImageIcon className="h-4 w-4" aria-hidden="true" /> Choose from gallery
                <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} disabled={loadingImage} />
              </label>
            </div>
            {uploadError && <p role="alert" className="max-w-[420px] rounded-lg border border-[#E57373]/40 bg-[#E57373]/10 px-4 py-3 font-nunito text-[13.5px] text-[#FFCDD2]">{uploadError}</p>}
          </div>
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
              AI is detecting walls &amp; ceiling (up to ~30s)...
            </div>
          )}
          {segmentationStatus === 'failed' && (
            <div className="absolute top-3 left-3 bg-black/60 text-white/80 text-[12px] font-nunito px-3 py-1.5 rounded-full max-w-[85%]">
              {smartSelect
                ? <span className="inline-flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#F2B21B]" aria-hidden="true" />Smart select on -- tap each wall or ceiling to paint it.</span>
                : samStatus === 'loading' || samStatus === 'encoding'
                  ? <span className="inline-flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 animate-pulse" aria-hidden="true" />Getting smart select ready... you can tap now.</span>
                  : 'Wall/ceiling detection unavailable -- using approximate selection.'}
            </div>
          )}
          {segmentationStatus === 'failed' && (regionCount === 0 || selecting) && !eraseMode && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6">
              <p className="bg-black/60 text-white text-[13px] font-nunito px-4 py-2 rounded-full text-center">
                {selecting ? 'Selecting...' : 'Tap a wall or ceiling to select it'}
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
                <PaintColorPicker value={wallColorHex} onChange={handleSelectWallColor} label="Wall colour" />
              </div>
            )}

            {segmentationStatus === 'ready' && availableSurfaces.ceiling && (
              <div className="mt-4">
                <p className="text-white/70 text-[13px] font-nunito mb-2">Ceiling Color</p>
                <PaintColorPicker value={ceilingColorHex} onChange={handleSelectCeilingColor} label="Ceiling colour" defaultCollection="shvet" />
                <p className="mt-1 text-white/40 text-[12px] font-nunito">Tip: whites and soft off-whites make a ceiling feel higher and brighter.</p>
              </div>
            )}

            {segmentationStatus === 'failed' && (
              <div className="mt-5">
                <PaintColorPicker value={selectedColor} onChange={handleSelectColor} label="Colour" />
              </div>
            )}

            {segmentationStatus === 'failed' && !smartSelect && (
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
                    : 'border-white/20 text-white/80 hover:bg-white/10'
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

            {canPreview && (
              <div className="mt-6 rounded-xl border border-[#F2B21B]/40 bg-white/[0.04] p-4 sm:p-5">
                {preview.status === 'done' ? (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <p className="flex items-center gap-1.5 font-nunito text-[13px] font-bold text-[#F6D47C]">
                        <Sparkles className="h-4 w-4" aria-hidden="true" /> AI realistic preview
                      </p>
                      <button type="button" onClick={() => setPreview({ status: 'idle', image: null, error: '' })} className="min-h-[36px] px-2 font-nunito text-[13px] text-white/70 hover:text-white">
                        Close
                      </button>
                    </div>
                    <img src={preview.image} alt="AI preview of your room with the chosen paint colours" className="mt-3 w-full rounded-lg" />
                    <p className="mt-2 font-nunito text-[12px] text-white/50">
                      AI renders can change small details. Confirm the final shade on a physical shade card.
                    </p>
                    <Link href={promo.active ? DIWALI_OFFER.quotePath : '/painting-quote'} className="btn-primary mt-4 w-full sm:w-auto">
                      {promo.active ? `Love it? Get it painted with ${promo.discount}% off` : 'Love it? Get a painting quote'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-nunito text-[14px] font-bold text-white">Happy with your colours?</p>
                      <p className="mt-0.5 font-nunito text-[12.5px] text-white/60">
                        {preview.status === 'loading'
                          ? 'Creating a realistic preview... this takes about 20-30 seconds.'
                          : 'See a realistic AI render of your room in these colours.'}
                      </p>
                      {preview.status === 'error' && <p role="alert" className="mt-1.5 font-nunito text-[12.5px] text-[#FF9C8F]">{preview.error}</p>}
                    </div>
                    <button type="button" onClick={handleAiPreview} disabled={preview.status === 'loading'} className="btn-primary w-full shrink-0 !min-h-[46px] sm:w-auto">
                      {preview.status === 'loading'
                        ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Creating...</>
                        : <><Sparkles className="h-4 w-4" aria-hidden="true" /> AI realistic preview</>}
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
