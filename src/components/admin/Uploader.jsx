'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UploadCloud, CheckCircle2, AlertCircle, RotateCcw, X, Loader2 } from 'lucide-react';
import { ACCEPTED_IMAGE_TYPES, MAX_RAW_IMAGE_BYTES } from '@/constants/adminEnums.js';
import { adminApi, formatBytes } from '@/lib/adminApi.js';
import { optimiseImage, postFormWithProgress, putWithProgress } from '@/lib/imageProcess.js';
import { inputClass } from '@/components/admin/ui.jsx';

// Drag & drop multi-image uploader for one project.
//   queued -> optimising -> uploading (progress) -> processing -> done | error
// Uploads go browser -> Backblaze B2 via presigned URLs; if the direct PUT is
// blocked (bucket CORS), it falls back to the server upload route.

const CONCURRENCY = 3;
let seq = 0;

const STATUS_TEXT = {
  queued: 'Waiting…',
  optimising: 'Optimising…',
  uploading: 'Uploading…',
  processing: 'Processing…',
  done: 'Uploaded',
  error: 'Failed',
};

export default function Uploader({ projectId, defaultAlt = '', onUploaded, disabled }) {
  const [items, setItems] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [rejected, setRejected] = useState([]);
  const inputRef = useRef(null);
  const running = useRef(0);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const update = useCallback((id, patch) => setItems((list) => list.map((it) => (it.id === id ? { ...it, ...patch } : it))), []);

  // Revoke preview URLs when items go away.
  useEffect(() => () => itemsRef.current.forEach((it) => URL.revokeObjectURL(it.preview)), []);

  function addFiles(fileList) {
    const bad = [];
    const next = [];
    for (const file of Array.from(fileList || [])) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) bad.push(`${file.name}: only JPG, PNG or WEBP`);
      else if (file.size > MAX_RAW_IMAGE_BYTES) bad.push(`${file.name}: larger than ${formatBytes(MAX_RAW_IMAGE_BYTES)}`);
      else next.push({ id: `u${++seq}`, file, preview: URL.createObjectURL(file), status: 'queued', progress: 0, altText: '', error: '' });
    }
    setRejected(bad);
    if (next.length) setItems((list) => [...list, ...next]);
  }

  async function uploadOne(item) {
    const { id, file } = item;
    try {
      update(id, { status: 'optimising', progress: 0, error: '' });
      const opt = await optimiseImage(file).catch(() => ({ blob: file, type: file.type, thumb: null, originalSize: file.size }));
      update(id, { status: 'uploading', optimisedSize: opt.blob.size });

      const altText = (itemsRef.current.find((i) => i.id === id)?.altText || defaultAlt).trim();
      const pres = await adminApi('/api/admin/uploads', {
        method: 'POST',
        body: { projectId, files: [{ name: file.name, type: opt.type, size: opt.blob.size, width: opt.width, height: opt.height, hasThumb: Boolean(opt.thumb) }] },
      });
      if (!pres.ok) throw new Error(pres.error?.message || 'Could not start upload');
      const slot = pres.data.uploads[0];

      let image;
      try {
        await putWithProgress(slot.uploadUrl, opt.blob, opt.type, (p) => update(id, { progress: p * (opt.thumb ? 0.9 : 1) }));
        if (opt.thumb && slot.thumbUploadUrl) await putWithProgress(slot.thumbUploadUrl, opt.thumb, 'image/webp', (p) => update(id, { progress: 0.9 + p * 0.1 }));
        update(id, { status: 'processing', progress: 1 });
        const done = await adminApi('/api/admin/uploads/complete', {
          method: 'POST',
          body: {
            projectId,
            uploadId: slot.uploadId,
            b2Key: slot.b2Key,
            thumbKey: opt.thumb ? slot.thumbKey : '',
            fileName: file.name,
            contentType: opt.type,
            size: opt.blob.size,
            width: opt.width,
            height: opt.height,
            altText,
          },
        });
        if (!done.ok) throw new Error(done.error?.message || 'Could not save the image');
        image = done.data;
      } catch (err) {
        if (err?.status !== 0) throw err;
        // Direct upload blocked (CORS/network) -> go through the server instead.
        const fd = new FormData();
        fd.append('projectId', projectId);
        fd.append('file', new File([opt.blob], file.name, { type: opt.type }));
        if (opt.thumb) fd.append('thumb', new File([opt.thumb], 'thumb.webp', { type: 'image/webp' }));
        if (opt.width) fd.append('width', String(opt.width));
        if (opt.height) fd.append('height', String(opt.height));
        fd.append('altText', altText);
        update(id, { status: 'uploading', progress: 0 });
        image = await postFormWithProgress('/api/admin/uploads/direct', fd, (p) => update(id, { progress: p, status: p >= 1 ? 'processing' : 'uploading' }));
      }
      update(id, { status: 'done', progress: 1 });
      onUploaded?.(image);
    } catch (err) {
      update(id, { status: 'error', error: err?.message || 'Upload failed' });
    }
  }

  // Simple queue with a concurrency cap.
  useEffect(() => {
    if (disabled || !projectId) return;
    const queued = items.filter((i) => i.status === 'queued');
    while (running.current < CONCURRENCY && queued.length) {
      const next = queued.shift();
      running.current += 1;
      update(next.id, { status: 'optimising' });
      uploadOne(next).finally(() => { running.current -= 1; setItems((l) => [...l]); });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, projectId, disabled]);

  const remove = (id) => setItems((list) => {
    const it = list.find((i) => i.id === id);
    if (it) URL.revokeObjectURL(it.preview);
    return list.filter((i) => i.id !== id);
  });
  const retry = (id) => update(id, { status: 'queued', error: '', progress: 0 });
  const clearDone = () => setItems((list) => list.filter((i) => { if (i.status === 'done') URL.revokeObjectURL(i.preview); return i.status !== 'done'; }));

  const counts = items.reduce((a, i) => ({ ...a, [i.status]: (a[i.status] || 0) + 1 }), {});

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (!disabled) addFiles(e.dataTransfer.files); }}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          disabled ? 'border-[#0B103B]/10 bg-white/50 opacity-60' : dragging ? 'border-[#D9A441] bg-[#F2B21B]/[0.08]' : 'border-[#0B103B]/20 bg-white hover:border-[#D9A441]/70'
        }`}
      >
        <UploadCloud className={`h-10 w-10 ${dragging ? 'text-[#D9A441]' : 'text-[#0B103B]/40'}`} strokeWidth={1.4} aria-hidden="true" />
        <p className="mt-3 font-serif text-[19px] text-[#0B103B]">Drag & drop images here</p>
        <p className="mt-1 text-[13px] text-[#6B675F]">JPG, PNG or WEBP · optimised to WebP in your browser before upload</p>
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="mt-5 inline-flex min-h-[44px] items-center rounded-lg bg-[#0B103B] px-5 text-[13.5px] font-bold text-white hover:bg-[#11184D] disabled:cursor-not-allowed"
        >
          Choose images
        </button>
        <input ref={inputRef} type="file" accept={ACCEPTED_IMAGE_TYPES.join(',')} multiple className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
      </div>

      {rejected.length > 0 && (
        <ul className="mt-3 space-y-1 text-[13px] text-[#B3261E]" role="alert">
          {rejected.map((r) => <li key={r}>{r}</li>)}
        </ul>
      )}

      {items.length > 0 && (
        <div className="mt-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[13px] text-[#6B675F]">
            <span>
              {counts.done || 0} of {items.length} uploaded
              {counts.error ? ` · ${counts.error} failed` : ''}
            </span>
            {counts.done > 0 && <button type="button" onClick={clearDone} className="font-bold text-[#0B103B] underline-offset-4 hover:underline">Clear finished</button>}
          </div>
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <AnimatePresence initial={false}>
              {items.map((it) => (
                <motion.li
                  key={it.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.22 }}
                  className="flex gap-3 rounded-lg border border-[#0B103B]/10 bg-white p-3"
                >
                  <img src={it.preview} alt="" className="h-20 w-20 shrink-0 rounded-md object-cover bg-[#F5F1E8]" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-[13.5px] font-semibold text-[#0B103B]" title={it.file.name}>{it.file.name}</p>
                      {it.status !== 'uploading' && it.status !== 'processing' && it.status !== 'optimising' && (
                        <button type="button" onClick={() => remove(it.id)} aria-label={`Remove ${it.file.name}`} className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#6B675F] hover:bg-[#0B103B]/[0.06]">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-[12px] text-[#6B675F]">
                      {formatBytes(it.file.size)}
                      {it.optimisedSize && it.optimisedSize < it.file.size ? ` → ${formatBytes(it.optimisedSize)}` : ''}
                    </p>
                    {it.status === 'queued' && (
                      <input
                        value={it.altText}
                        onChange={(e) => update(it.id, { altText: e.target.value })}
                        placeholder={`Alt text (default: ${defaultAlt || 'project title'})`}
                        aria-label={`Alt text for ${it.file.name}`}
                        className={`${inputClass} !min-h-[34px] mt-1.5 !py-1.5 !text-[13px]`}
                        maxLength={300}
                      />
                    )}
                    <div className="mt-2 flex items-center gap-2 text-[12.5px] font-semibold">
                      {it.status === 'done' ? (
                        <span className="flex items-center gap-1.5 text-[#16613C]"><CheckCircle2 className="h-4 w-4" /> Uploaded ✓</span>
                      ) : it.status === 'error' ? (
                        <>
                          <span className="flex min-w-0 items-center gap-1.5 text-[#B3261E]"><AlertCircle className="h-4 w-4 shrink-0" /> <span className="truncate" title={it.error}>{it.error}</span></span>
                          <button type="button" onClick={() => retry(it.id)} className="ml-auto flex shrink-0 items-center gap-1 text-[#0B103B] hover:underline"><RotateCcw className="h-3.5 w-3.5" /> Retry</button>
                        </>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[#0B103B]/80">
                          {it.status !== 'queued' && <Loader2 className="h-3.5 w-3.5 animate-spin text-[#D9A441]" />}
                          {STATUS_TEXT[it.status]}{it.status === 'uploading' ? ` ${Math.round(it.progress * 100)}%` : ''}
                        </span>
                      )}
                    </div>
                    {(it.status === 'uploading' || it.status === 'processing') && (
                      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[#0B103B]/10" role="progressbar" aria-valuenow={Math.round(it.progress * 100)} aria-valuemin={0} aria-valuemax={100}>
                        <div className="h-full origin-left rounded-full bg-[#D9A441] transition-transform duration-200" style={{ transform: `scaleX(${it.progress})` }} />
                      </div>
                    )}
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      )}
    </div>
  );
}
