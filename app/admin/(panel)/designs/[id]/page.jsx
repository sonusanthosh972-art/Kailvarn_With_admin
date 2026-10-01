'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Reorder, useDragControls } from 'framer-motion';
import { ArrowLeft, GripVertical, Star, Trash2, ChevronUp, ChevronDown, ExternalLink, Check } from 'lucide-react';
import { DESIGN_CATEGORIES } from '@/constants/adminEnums.js';
import { adminApi, formatBytes } from '@/lib/adminApi.js';
import { Alert, Button, Card, ConfirmDialog, Field, Spinner, StatusBadge, inputClass } from '@/components/admin/ui.jsx';
import Uploader from '@/components/admin/Uploader.jsx';
import VideoManager from '@/components/admin/VideoManager.jsx';

export default function DesignEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [images, setImages] = useState([]);
  const [confirm, setConfirm] = useState(null); // { type: 'project' } | { type: 'image', image }
  const [busy, setBusy] = useState(false);
  const orderTimer = useRef(null);

  const hydrate = useCallback((p) => {
    setProject(p);
    setImages(p.images);
    setForm({
      title: p.title,
      category: p.category,
      status: p.status,
      location: p.location,
      subtitle: p.subtitle || '',
      videoUrl: p.videoUrl || '',
      description: p.description,
      tags: p.tags.join(', '),
    });
  }, []);

  useEffect(() => {
    adminApi(`/api/admin/designs/${id}`).then((r) => (r.ok ? hydrate(r.data) : setError(r.error?.message || 'Project not found')));
  }, [id, hydrate]);

  async function patch(body) {
    const r = await adminApi(`/api/admin/designs/${id}`, { method: 'PATCH', body });
    if (r.ok) { setProject(r.data); setImages(r.data.images); }
    return r;
  }

  async function saveDetails(e) {
    e?.preventDefault();
    setSaving(true);
    setFieldErrors({});
    const r = await patch({
      title: form.title,
      category: form.category,
      status: form.status,
      location: form.location,
      subtitle: form.subtitle,
      videoUrl: form.videoUrl,
      description: form.description,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });
    setSaving(false);
    if (r.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); setError(''); }
    else { setFieldErrors(r.error?.fields || {}); setError(r.error?.message); }
  }

  async function togglePublish() {
    const status = project.status === 'published' ? 'draft' : 'published';
    const r = await patch({ status });
    if (r.ok) setForm((f) => ({ ...f, status })); else setError(r.error?.message);
  }

  // Persist order shortly after the last drag/move (one request, not one per step).
  function commitOrder(next) {
    setImages(next);
    clearTimeout(orderTimer.current);
    orderTimer.current = setTimeout(() => patch({ imageOrder: next.map((i) => i.id) }), 500);
  }
  const move = (idx, dir) => {
    const next = [...images];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    commitOrder(next);
  };

  async function setCover(imageId) {
    const r = await patch({ coverImageId: imageId });
    if (!r.ok) setError(r.error?.message);
  }

  async function saveAlt(imageId, altText) {
    const r = await adminApi(`/api/admin/images/${imageId}`, { method: 'PATCH', body: { altText } });
    if (r.ok) setImages((list) => list.map((i) => (i.id === imageId ? r.data : i)));
    return r.ok;
  }

  async function confirmDelete() {
    setBusy(true);
    if (confirm.type === 'project') {
      const r = await adminApi(`/api/admin/designs/${id}`, { method: 'DELETE' });
      setBusy(false);
      if (r.ok) router.replace('/admin/designs'); else setError(r.error?.message);
    } else {
      const r = await adminApi(`/api/admin/images/${confirm.image.id}`, { method: 'DELETE' });
      setBusy(false);
      if (r.ok) {
        const fresh = await adminApi(`/api/admin/designs/${id}`);
        if (fresh.ok) { setProject(fresh.data); setImages(fresh.data.images); }
      } else setError(r.error?.message);
    }
    setConfirm(null);
  }

  function onUploaded(img) {
    setImages((list) => [...list, img]);
    setProject((p) => ({ ...p, imageCount: (p.imageCount || 0) + 1, coverImageId: p.coverImageId || img.id }));
  }

  function onVideoUpdated(videoUrl) {
    setProject((p) => ({ ...p, videoUrl }));
    setForm((f) => (f ? { ...f, videoUrl: videoUrl || '' } : f));
  }

  if (error && !project) return <Alert>{error}</Alert>;
  if (!project || !form) return <Spinner />;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <Link href="/admin/designs" className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0B103B]/70 hover:text-[#0B103B]">
        <ArrowLeft className="h-4 w-4" /> All designs
      </Link>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-3"><StatusBadge status={project.status} /><span className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#8A6A1C]">{project.category}</span></div>
          <h1 className="font-serif text-[30px] lg:text-[36px] leading-tight text-[#0B103B] break-words">{project.title}</h1>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {project.status === 'published' && (
            <a href={`/our-design?project=${project.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#0B103B]/20 bg-white px-4 text-[13.5px] font-bold text-[#0B103B] hover:border-[#0B103B]/50">
              <ExternalLink className="h-4 w-4" /> View on site
            </a>
          )}
          <Button variant={project.status === 'published' ? 'outline' : 'primary'} onClick={togglePublish} disabled={project.status === 'draft' && images.length === 0} title={images.length === 0 ? 'Upload at least one image first' : undefined}>
            {project.status === 'published' ? 'Unpublish (make draft)' : 'Publish'}
          </Button>
          <Button variant="danger" onClick={() => setConfirm({ type: 'project' })}><Trash2 className="h-4 w-4" /> Delete</Button>
        </div>
      </div>
      {error && <div className="mb-5"><Alert>{error}</Alert></div>}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
        {/* DETAILS */}
        <Card className="h-fit">
          <form onSubmit={saveDetails} className="space-y-4 p-5">
            <h2 className="font-serif text-[21px] text-[#0B103B]">Project details</h2>
            <Field label="Title" htmlFor="d-title" error={fieldErrors.title}><input id="d-title" value={form.title} onChange={set('title')} className={inputClass} maxLength={140} /></Field>
            <Field label="Category" htmlFor="d-cat" error={fieldErrors.category}>
              <select id="d-cat" value={form.category} onChange={set('category')} className={inputClass}>{DESIGN_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
            </Field>
            <Field label="Status" htmlFor="d-status">
              <select id="d-status" value={form.status} onChange={set('status')} className={inputClass}>
                <option value="draft">Draft (hidden)</option>
                <option value="published" disabled={images.length === 0}>Published (visible on site)</option>
              </select>
            </Field>
            <Field label="Card label (subtitle)" htmlFor="d-sub" hint='Small gold label on the gallery card, e.g. "Master Bedroom"'><input id="d-sub" value={form.subtitle} onChange={set('subtitle')} className={inputClass} maxLength={80} /></Field>
            <Field label="Location" htmlFor="d-loc"><input id="d-loc" value={form.location} onChange={set('location')} className={inputClass} maxLength={120} placeholder="Vapi" /></Field>
            <Field label="Walkthrough video URL (optional)" htmlFor="d-video" hint='e.g. /videos/living-room.mp4 or CDN/B2 link. If left empty, the site automatically uses the category video.'>
              <input id="d-video" value={form.videoUrl} onChange={set('videoUrl')} className={inputClass} placeholder="/videos/living-room.mp4" maxLength={500} />
            </Field>
            <Field label="Tags" htmlFor="d-tags" hint="Comma separated, e.g. modern, wooden, false ceiling"><input id="d-tags" value={form.tags} onChange={set('tags')} className={inputClass} /></Field>
            <Field label="Description" htmlFor="d-desc" error={fieldErrors.description}><textarea id="d-desc" rows={5} value={form.description} onChange={set('description')} className={`${inputClass} resize-y`} maxLength={4000} /></Field>
            <Button type="submit" variant="navy" loading={saving} className="w-full">{saved ? <><Check className="h-4 w-4" /> Saved</> : 'Save details'}</Button>
          </form>
        </Card>

        {/* RIGHT COLUMN: VIDEO + IMAGES */}
        <div className="space-y-6 min-w-0">
          {/* WALKTHROUGH VIDEO CARD */}
          <Card className="p-5">
            <h2 className="mb-2 font-serif text-[21px] text-[#0B103B]">Walkthrough video</h2>
            <p className="mb-4 text-[13px] text-[#6B675F]">
              Upload a video walkthrough for this design. If added, clicking this design plays the video full-page. If empty, the site displays its images in the photo lightbox.
            </p>
            <VideoManager
              projectId={project.id}
              currentVideoUrl={project.videoUrl}
              onVideoUpdated={onVideoUpdated}
            />
          </Card>

          {/* IMAGES */}
          <Card className="p-5">
            <h2 className="mb-4 font-serif text-[21px] text-[#0B103B]">Upload images</h2>
            <Uploader projectId={project.id} defaultAlt={project.title} onUploaded={onUploaded} />
          </Card>

          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#0B103B]/10 px-5 py-4">
              <h2 className="font-serif text-[21px] text-[#0B103B]">Images <span className="text-[#6B675F] text-[16px]">({images.length})</span></h2>
              {images.length > 1 && <p className="text-[12.5px] text-[#6B675F]">Drag the handle (or use the arrows) to reorder. The first image shows first on the site.</p>}
            </div>
            {images.length === 0 ? (
              <p className="px-5 py-10 text-center text-[14px] text-[#6B675F]">No images yet — upload some above.</p>
            ) : (
              <Reorder.Group axis="y" values={images} onReorder={commitOrder} className="divide-y divide-[#0B103B]/[0.07]">
                {images.map((img, idx) => (
                  <ImageRow
                    key={img.id}
                    img={img}
                    idx={idx}
                    count={images.length}
                    isCover={project.coverImageId === img.id}
                    onMove={move}
                    onCover={() => setCover(img.id)}
                    onDelete={() => setConfirm({ type: 'image', image: img })}
                    onSaveAlt={saveAlt}
                  />
                ))}
              </Reorder.Group>
            )}
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={confirmDelete}
        loading={busy}
        title={confirm?.type === 'project' ? 'Delete this project?' : 'Delete this image?'}
        text={confirm?.type === 'project'
          ? `"${project.title}" and all ${images.length} of its images will be permanently deleted from the website and from Backblaze B2.`
          : 'The image will be removed from the project and permanently deleted from Backblaze B2.'}
      />
    </>
  );
}

function ImageRow({ img, idx, count, isCover, onMove, onCover, onDelete, onSaveAlt }) {
  const controls = useDragControls();
  const [alt, setAlt] = useState(img.altText);
  const [altState, setAltState] = useState('');
  useEffect(() => setAlt(img.altText), [img.altText]);

  async function blurAlt() {
    if (alt === img.altText) return;
    setAltState('saving');
    const okSaved = await onSaveAlt(img.id, alt);
    setAltState(okSaved ? 'saved' : 'error');
    setTimeout(() => setAltState(''), 1500);
  }

  return (
    <Reorder.Item value={img} dragListener={false} dragControls={controls} className="flex items-center gap-3 bg-white px-3 py-3 sm:px-4" whileDrag={{ boxShadow: '0 18px 40px -20px rgba(11,16,59,0.45)', zIndex: 10 }}>
      <button type="button" onPointerDown={(e) => controls.start(e)} className="hidden sm:flex h-10 w-7 cursor-grab touch-none items-center justify-center text-[#0B103B]/35 hover:text-[#0B103B] active:cursor-grabbing" aria-label="Drag to reorder">
        <GripVertical className="h-5 w-5" />
      </button>
      <span className="w-6 text-center font-serif text-[15px] text-[#6B675F] tabular-nums">{String(idx + 1).padStart(2, '0')}</span>
      <a href={img.publicUrl} target="_blank" rel="noopener noreferrer" className="relative shrink-0">
        <img src={img.thumbUrl} alt={img.altText} loading="lazy" className="h-16 w-24 rounded-md object-cover bg-[#F5F1E8]" />
        {isCover && <span className="absolute -left-1.5 -top-1.5 flex items-center gap-1 rounded-md bg-[#F2B21B] px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#0B103B]"><Star className="h-3 w-3 fill-current" /> Cover</span>}
      </a>
      <div className="min-w-0 flex-1">
        <input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          onBlur={blurAlt}
          aria-label="Alt text"
          placeholder="Alt text (describe the photo)"
          maxLength={300}
          className={`${inputClass} !min-h-[38px] !py-1.5 !text-[13.5px]`}
        />
        <p className="mt-1 truncate text-[11.5px] text-[#6B675F]">
          {img.external ? <span className="mr-1 rounded bg-[#0B103B]/[0.07] px-1.5 py-0.5 font-bold text-[#0B103B]" title="Imported from the old website. To replace it, upload a new photo above, set it as cover, then delete this one.">From old site</span> : null}
          {img.fileName}{img.width && img.height ? ` · ${img.width}×${img.height}` : ''}{img.size ? ` · ${formatBytes(img.size)}` : ''}
          {altState === 'saving' && ' · saving…'}{altState === 'saved' && ' · saved ✓'}{altState === 'error' && ' · could not save'}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <div className="flex flex-col">
          <button type="button" onClick={() => onMove(idx, -1)} disabled={idx === 0} aria-label="Move up" className="flex h-7 w-8 items-center justify-center rounded text-[#0B103B]/60 hover:bg-[#0B103B]/[0.06] disabled:opacity-25"><ChevronUp className="h-4 w-4" /></button>
          <button type="button" onClick={() => onMove(idx, 1)} disabled={idx === count - 1} aria-label="Move down" className="flex h-7 w-8 items-center justify-center rounded text-[#0B103B]/60 hover:bg-[#0B103B]/[0.06] disabled:opacity-25"><ChevronDown className="h-4 w-4" /></button>
        </div>
        {!isCover && <Button size="sm" variant="ghost" onClick={onCover} className="hidden md:inline-flex"><Star className="h-3.5 w-3.5" /> Set cover</Button>}
        {!isCover && <button type="button" onClick={onCover} aria-label="Set as cover" className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-[#0B103B]/60 hover:bg-[#0B103B]/[0.06]"><Star className="h-4 w-4" /></button>}
        <button type="button" onClick={onDelete} aria-label="Delete image" className="flex h-9 w-9 items-center justify-center rounded-lg text-[#B3261E]/70 hover:bg-[#B3261E]/10 hover:text-[#B3261E]"><Trash2 className="h-4 w-4" /></button>
      </div>
    </Reorder.Item>
  );
}
