'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Talks to public/sam-worker.js (Segment Anything in the browser).
// status: idle -> loading (model download, first time only) -> encoding
// (analysing this photo) -> ready; error if the device can't run it, in which
// case callers fall back to the old colour flood fill.
export function useSamSelect() {
  const workerRef = useRef(null);
  const photoIdRef = useRef(0);
  const pendingRef = useRef(new Map());
  const [status, setStatus] = useState('idle');

  const getWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;
    if (typeof Worker === 'undefined') return null;
    let worker;
    try {
      worker = new Worker('/sam-worker.js', { type: 'module' });
    } catch {
      setStatus('error');
      return null;
    }
    worker.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === 'status') {
        if (msg.status === 'loading') setStatus((s) => (s === 'encoding' ? s : 'loading'));
        if (msg.status === 'error') setStatus('error');
      } else if (msg.type === 'encoded') {
        if (msg.id === photoIdRef.current) setStatus('ready');
      } else if (msg.type === 'mask' || msg.type === 'error') {
        const resolve = pendingRef.current.get(msg.id);
        if (msg.type === 'error' && msg.id === photoIdRef.current && !resolve) setStatus('error');
        if (resolve) {
          pendingRef.current.delete(msg.id);
          resolve(msg.type === 'mask' ? msg : null);
        }
      }
    };
    worker.onerror = () => setStatus('error');
    workerRef.current = worker;
    return worker;
  }, []);

  // Start analysing a photo (call right after it's drawn to the canvas).
  const encode = useCallback((imageData) => {
    const worker = getWorker();
    if (!worker) return;
    photoIdRef.current += 1;
    pendingRef.current.forEach((resolve) => resolve(null));
    pendingRef.current.clear();
    setStatus('encoding');
    const rgba = new Uint8ClampedArray(imageData.data); // copy; the canvas keeps its own
    worker.postMessage({ type: 'encode', id: photoIdRef.current, width: imageData.width, height: imageData.height, rgba }, [rgba.buffer]);
  }, [getWorker]);

  // Mask of the surface under (x, y), both 0..1 of the photo. Resolves to
  // { mask: Uint8Array, width, height, score } or null.
  const select = useCallback((x, y) => {
    const worker = workerRef.current;
    if (!worker || status !== 'ready') return Promise.resolve(null);
    const id = photoIdRef.current;
    return new Promise((resolve) => {
      pendingRef.current.get(id)?.(null);
      pendingRef.current.set(id, resolve);
      worker.postMessage({ type: 'decode', id, points: [{ x, y, label: 1 }] });
    });
  }, [status]);

  const reset = useCallback(() => {
    photoIdRef.current += 1;
    pendingRef.current.forEach((resolve) => resolve(null));
    pendingRef.current.clear();
    setStatus((s) => (s === 'error' ? s : 'idle'));
  }, []);

  useEffect(() => () => workerRef.current?.terminate(), []);

  return { status, encode, select, reset };
}
