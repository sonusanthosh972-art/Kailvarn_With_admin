'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, RotateCcw, Trash2, UploadCloud, Loader2, Images, Check } from 'lucide-react';
import { adminApi, formatDate } from '@/lib/adminApi.js';
import { optimiseImage, postFormWithProgress } from '@/lib/imageProcess.js';
import { ACCEPTED_IMAGE_TYPES } from '@/constants/adminEnums.js';
import { Alert, Button, Card, ConfirmDialog, Field, PageHeader, Spinner, inputClass } from '@/components/admin/ui.jsx';

const PAGE = 'our-design';

const SECTIONS = [
  {
    title: 'Hero (top of the page)',
    fields: [
      { key: 'heroEyebrow', label: 'Small label above the title', max: 60 },
      { key: 'heroTitle', label: 'Title', max: 140 },
      { key: 'heroEmphasis', label: 'Gold italic ending of the title', max: 140, hint: 'Must be the last words of the title (or empty).' },
      { key: 'heroLead', label: 'Intro text', max: 400, multiline: true },
    ],
  },
  {
    title: 'Gallery',
    fields: [{ key: 'galleryEmptyText', label: 'Message when a category has no designs', max: 200 }],
  },
  {
    title: 'Bottom call to action',
    fields: [
      { key: 'ctaTitle', label: 'Title', max: 140 },
      { key: 'ctaText', label: 'Text', max: 500, multiline: true },
      { key: 'ctaPrimaryLabel', label: 'Gold button — label', max: 60, half: true },
      { key: 'ctaPrimaryHref', label: 'Gold button — link', max: 300, half: true, hint: 'e.g. /get-free-quote' },
      { key: 'ctaSecondaryLabel', label: 'Outline button — label', max: 60, half: true },
      { key: 'ctaSecondaryHref', label: 'Outline button — link', max: 300, half: true, hint: 'e.g. /services' },
    ],
  },
];

export default function OurDesignContentPage() {
  const [content, setContent] = useState(null);
  const [fields, setFields] = useState(null);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [counts, setCounts] = useState(null);
  const [heroBusy, setHeroBusy] = useState(null); // progress 0..1 while uploading
  const [removing, setRemoving] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    adminApi(`/api/admin/content/${PAGE}`).then((r) => {
      if (r.ok) { setContent(r.data); setFields(r.data.fields); } else setMsg({ tone: 'error', text: r.error?.message });
    });
    adminApi('/api/admin/designs').then((r) => {
      if (r.ok) setCounts({ published: r.data.items.filter((p) => p.status === 'published').length, draft: r.data.items.filter((p) => p.status === 'draft').length });
    });
  }, []);

  const dirty = content && fields && JSON.stringify(fields) !== JSON.stringify(content.fields);

  async function save() {
    setSaving(true); setMsg(null); setErrors({});
    const r = await adminApi(`/api/admin/content/${PAGE}`, { method: 'PUT', body: { fields } });
    setSaving(false);
    if (r.ok) { setContent(r.data); setFields(r.data.fields); setMsg({ tone: 'success', text: 'Saved — the Our Design page is updated.' }); }
    else { setErrors(r.error?.fields || {}); setMsg({ tone: 'error', text: r.error?.message }); }
  }

  async function uploadHero(fileList) {
    const file = fileList?.[0];
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return setMsg({ tone: 'error', text: 'Only JPG, PNG or WEBP images.' });
    setHeroBusy(0); setMsg(null);
    try {
      const opt = await optimiseImage(file).catch(() => ({ blob: file, type: file.type, thumb: null }));
      const fd = new FormData();
      fd.append('file', new File([opt.blob], file.name, { type: opt.type }));
      if (opt.thumb) fd.append('thumb', new File([opt.thumb], 'thumb.webp', { type: 'image/webp' }));
      const data = await postFormWithProgress(`/api/admin/content/${PAGE}/images`, fd, (p) => setHeroBusy(p));
      setContent((c) => ({ ...c, heroImages: data.heroImages }));
      setMsg({ tone: 'success', text: 'Hero image added.' });
    } catch (err) {
      setMsg({ tone: 'error', text: err.message });
    } finally {
      setHeroBusy(null);
    }
  }

  async function removeHero() {
    const r = await adminApi(`/api/admin/content/${PAGE}/images/${removing.id}`, { method: 'DELETE' });
    setRemoving(null);
    if (r.ok) setContent((c) => ({ ...c, heroImages: r.data.heroImages })); else setMsg({ tone: 'error', text: r.error?.message });
  }

  if (!content || !fields) return msg ? <Alert>{msg.text}</Alert> : <Spinner />;

  const set = (k) => (e) => setFields((f) => ({ ...f, [k]: e.target.value }));
  const titleMain = fields.heroEmphasis && fields.heroTitle.endsWith(fields.heroEmphasis) ? fields.heroTitle.slice(0, fields.heroTitle.length - fields.heroEmphasis.length) : fields.heroTitle;
  const titleEm = fields.heroEmphasis && fields.heroTitle.endsWith(fields.heroEmphasis) ? fields.heroEmphasis : '';

  return (
    <>
      <PageHeader
        title="Our Design Page"
        subtitle={content.updatedAt ? `Last edited ${formatDate(content.updatedAt)}${content.updatedBy ? ` by ${content.updatedBy}` : ''}` : 'Showing the original website text — edit anything below.'}
        actions={
          <>
            <a href="/our-design" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#0B103B]/20 bg-white px-4 text-[13.5px] font-bold text-[#0B103B] hover:border-[#0B103B]/50">
              <ExternalLink className="h-4 w-4" /> View page
            </a>
            <Button variant="primary" onClick={save} loading={saving} disabled={!dirty}>Save changes</Button>
          </>
        }
      />
      {msg && <div className="mb-5"><Alert tone={msg.tone}>{msg.text}</Alert></div>}

      {/* Live hero preview */}
      <Card className="mb-6 overflow-hidden">
        <div className="relative isolate bg-[#070A25] px-6 py-10 sm:px-10">
          {content.heroImages[0] && <img src={content.heroImages[0].url} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35" />}
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#F2B21B]">Preview · {fields.heroEyebrow}</p>
          <p className="font-serif text-[28px] sm:text-[36px] leading-tight text-white">{titleMain}{titleEm && <em className="italic text-[#F6D47C]">{titleEm}</em>}</p>
          <p className="mt-3 max-w-[60ch] text-[14px] text-white/75">{fields.heroLead}</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {SECTIONS.map((section) => (
            <Card key={section.title} className="p-5">
              <h2 className="mb-4 font-serif text-[21px] text-[#0B103B]">{section.title}</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {section.fields.map((f) => {
                  const changed = fields[f.key] !== content.defaults[f.key];
                  return (
                    <Field key={f.key} label={f.label} htmlFor={`c-${f.key}`} error={errors[f.key]} hint={f.hint} className={f.half ? '' : 'md:col-span-2'}>
                      {f.multiline ? (
                        <textarea id={`c-${f.key}`} rows={3} value={fields[f.key]} onChange={set(f.key)} maxLength={f.max} className={`${inputClass} resize-y`} />
                      ) : (
                        <input id={`c-${f.key}`} value={fields[f.key]} onChange={set(f.key)} maxLength={f.max} className={inputClass} />
                      )}
                      {changed && (
                        <button type="button" onClick={() => setFields((x) => ({ ...x, [f.key]: content.defaults[f.key] }))} className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-bold text-[#6B675F] hover:text-[#0B103B]" title={`Original: ${content.defaults[f.key]}`}>
                          <RotateCcw className="h-3 w-3" /> Reset to original
                        </button>
                      )}
                    </Field>
                  );
                })}
              </div>
            </Card>
          ))}
          <div className="flex justify-end">
            <Button variant="primary" onClick={save} loading={saving} disabled={!dirty}>{dirty ? 'Save changes' : <><Check className="h-4 w-4" /> All changes saved</>}</Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="font-serif text-[21px] text-[#0B103B]">Hero images</h2>
            <p className="mt-1 mb-4 text-[13px] text-[#6B675F]">Up to {content.maxHeroImages}. Leave empty to use the latest published designs automatically.</p>
            {content.heroImages.length > 0 && (
              <ul className="mb-4 grid grid-cols-2 gap-2.5">
                {content.heroImages.map((img) => (
                  <li key={img.id} className="group relative overflow-hidden rounded-lg border border-[#0B103B]/10">
                    <img src={img.thumbUrl} alt="" className="aspect-[4/3] w-full object-cover" />
                    <button type="button" onClick={() => setRemoving(img)} aria-label="Remove hero image" className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-md bg-white/95 text-[#B3261E] shadow">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {content.heroImages.length < content.maxHeroImages && (
              <>
                <Button onClick={() => fileRef.current?.click()} disabled={heroBusy !== null} className="w-full">
                  {heroBusy !== null ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading {Math.round(heroBusy * 100)}%</> : <><UploadCloud className="h-4 w-4" /> Add hero image</>}
                </Button>
                <input ref={fileRef} type="file" accept={ACCEPTED_IMAGE_TYPES.join(',')} className="sr-only" onChange={(e) => { uploadHero(e.target.files); e.target.value = ''; }} />
              </>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="font-serif text-[21px] text-[#0B103B]">Gallery designs</h2>
            <p className="mt-1 text-[13.5px] text-[#2A2A2A]">
              Every card in the gallery is a design project. Edit its title, text, category and photos in <strong>Designs</strong>.
            </p>
            {counts && (
              <div className="mt-4 grid grid-cols-2 gap-2.5 text-center">
                <Link href="/admin/designs?status=published" className="rounded-lg border border-[#0B103B]/10 p-3 hover:border-[#D9A441]/60">
                  <span className="block font-serif text-[26px] text-[#0B103B] tabular-nums">{counts.published}</span>
                  <span className="text-[11.5px] font-bold uppercase tracking-[0.1em] text-[#16613C]">Published</span>
                </Link>
                <Link href="/admin/designs?status=draft" className="rounded-lg border border-[#0B103B]/10 p-3 hover:border-[#D9A441]/60">
                  <span className="block font-serif text-[26px] text-[#0B103B] tabular-nums">{counts.draft}</span>
                  <span className="text-[11.5px] font-bold uppercase tracking-[0.1em] text-[#6B675F]">Drafts</span>
                </Link>
              </div>
            )}
            <p className="mt-3 text-[12.5px] text-[#6B675F]">Drafts are hidden. Add a photo to a draft and publish it to show it on the page.</p>
            <Link href="/admin/designs" className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#0B103B] text-[13.5px] font-bold text-white hover:bg-[#11184D]">
              <Images className="h-4 w-4" /> Manage designs
            </Link>
          </Card>
        </div>
      </div>

      <ConfirmDialog open={Boolean(removing)} onClose={() => setRemoving(null)} onConfirm={removeHero} title="Remove this hero image?" text="It will be removed from the page and deleted from Backblaze B2." confirmLabel="Remove" />
    </>
  );
}
