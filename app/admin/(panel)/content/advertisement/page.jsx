'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ExternalLink, Loader2, RotateCcw, Trash2, UploadCloud } from 'lucide-react';
import { adminApi, formatDate } from '@/lib/adminApi.js';
import { optimiseImage, postFormWithProgress } from '@/lib/imageProcess.js';
import { ACCEPTED_IMAGE_TYPES } from '@/constants/adminEnums.js';
import { Alert, Button, Card, ConfirmDialog, Field, PageHeader, Spinner, inputClass } from '@/components/admin/ui.jsx';

// Admin -> Advertisement: the site-wide popup + sticky side tab.
// Stored as the "promo" entry of site_content (see PAGE_CONTENT in models.js).
const PAGE = 'promo';

const POPUP_OPTIONS = [
  { id: 'always', label: 'Every time the homepage opens', hint: 'Shows first on every homepage visit or refresh. Closes on ✕ or when the visitor scrolls.' },
  { id: 'session', label: 'Once per visit', hint: 'Opens first thing on the homepage, once per visit. Closes on ✕ or when the visitor scrolls.' },
  { id: 'daily', label: 'Once a day', hint: 'Opens on the homepage at most once a day per visitor.' },
  { id: 'tab', label: 'Never (side tab only)', hint: 'No popup; visitors open it from the side tab.' },
];

const TEXT_SECTIONS = [
  {
    title: 'Banner text',
    fields: [
      { key: 'title', label: 'Offer name', max: 24, half: true, hint: 'e.g. Diwali. Also used on the quote page and saved on leads.' },
      { key: 'tabLabel', label: 'Side tab text', max: 32, half: true, hint: 'Shown on the sticky tab' },
      { key: 'eyebrow', label: 'Small line at the top', max: 40, half: true },
      { key: 'headline', label: 'Headline', max: 70, half: true },
      { key: 'headlineEmphasis', label: 'Highlighted words (gold, on a paint stroke)', max: 40, half: true, hint: 'Must be words from the headline' },
      { key: 'lead', label: 'Short description', max: 160, multiline: true },
      { key: 'offerText', label: 'Offer line (under the %)', max: 40, half: true },
      { key: 'ribbonText', label: 'Gold ribbon text', max: 40, half: true },
    ],
  },
  {
    title: 'Four highlights (leave empty to hide one)',
    fields: [
      { key: 'feature1', label: 'Highlight 1', max: 40, half: true },
      { key: 'feature2', label: 'Highlight 2', max: 40, half: true },
      { key: 'feature3', label: 'Highlight 3', max: 40, half: true },
      { key: 'feature4', label: 'Highlight 4', max: 40, half: true },
    ],
  },
  {
    title: 'Main button',
    fields: [
      { key: 'ctaLabel', label: 'Button text', max: 40, half: true, hint: 'In any text: {discount} = the % number, {title} = the offer name' },
      { key: 'ctaHref', label: 'Button link', max: 300, half: true, hint: 'e.g. /painting-quote' },
    ],
  },
];

function todayInIndia() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
}

function liveStatus(f) {
  if (!f.enabled) return { tone: 'off', text: 'Off: hidden from the website' };
  const today = todayInIndia();
  if (f.startDate && today < f.startDate) return { tone: 'wait', text: `Scheduled: starts ${f.startDate}` };
  if (f.endDate && today > f.endDate) return { tone: 'off', text: `Ended on ${f.endDate}` };
  return { tone: 'live', text: f.endDate ? `Live now, until ${f.endDate}` : 'Live now on every page' };
}

export default function AdvertisementAdminPage() {
  const [content, setContent] = useState(null);
  const [fields, setFields] = useState(null);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imgBusy, setImgBusy] = useState(null);
  const [removing, setRemoving] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    adminApi(`/api/admin/content/${PAGE}`).then((r) => {
      if (r.ok) { setContent(r.data); setFields(r.data.fields); } else setMsg({ tone: 'error', text: r.error?.message });
    });
  }, []);

  const dirty = content && fields && JSON.stringify(fields) !== JSON.stringify(content.fields);

  async function save() {
    setSaving(true); setMsg(null); setErrors({});
    const r = await adminApi(`/api/admin/content/${PAGE}`, { method: 'PUT', body: { fields } });
    setSaving(false);
    if (r.ok) {
      setContent(r.data); setFields(r.data.fields);
      setMsg({ tone: 'success', text: 'Saved. Visitors see the new advertisement within about a minute (it shows once more to people who already closed it).' });
    } else { setErrors(r.error?.fields || {}); setMsg({ tone: 'error', text: r.error?.message }); }
  }

  async function uploadImage(fileList) {
    const file = fileList?.[0];
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return setMsg({ tone: 'error', text: 'Only JPG, PNG or WEBP images.' });
    setImgBusy(0); setMsg(null);
    try {
      const opt = await optimiseImage(file).catch(() => ({ blob: file, type: file.type, thumb: null }));
      const fd = new FormData();
      fd.append('file', new File([opt.blob], file.name, { type: opt.type }));
      if (opt.thumb) fd.append('thumb', new File([opt.thumb], 'thumb.webp', { type: 'image/webp' }));
      const data = await postFormWithProgress(`/api/admin/content/${PAGE}/images`, fd, (p) => setImgBusy(p));
      setContent((c) => ({ ...c, heroImages: data.heroImages }));
      setMsg({ tone: 'success', text: 'Background image updated.' });
    } catch (err) {
      setMsg({ tone: 'error', text: err.message });
    } finally {
      setImgBusy(null);
    }
  }

  async function removeImage() {
    const r = await adminApi(`/api/admin/content/${PAGE}/images/${removing.id}`, { method: 'DELETE' });
    setRemoving(null);
    if (r.ok) setContent((c) => ({ ...c, heroImages: r.data.heroImages })); else setMsg({ tone: 'error', text: r.error?.message });
  }

  if (!content || !fields) return msg ? <Alert>{msg.text}</Alert> : <Spinner />;

  const set = (k) => (e) => setFields((f) => ({ ...f, [k]: e.target.value }));
  const setBool = (k) => (e) => setFields((f) => ({ ...f, [k]: e.target.checked }));
  const status = liveStatus(fields);
  const fill = (text) => String(text || '').replaceAll('{discount}', String(fields.discount)).replaceAll('{title}', String(fields.title));
  const headline = fill(fields.headline);
  const em = fill(fields.headlineEmphasis);
  const emAt = em ? headline.indexOf(em) : -1;
  const bg = content.heroImages[0]?.url || '/offers/ad-desktop-1600.jpg';

  return (
    <>
      <PageHeader
        title="Advertisement"
        subtitle={content.updatedAt ? `Last edited ${formatDate(content.updatedAt)}${content.updatedBy ? ` by ${content.updatedBy}` : ''}` : 'The popup offer and the sticky side tab shown on every page.'}
        actions={
          <>
            <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#0B103B]/20 bg-white px-4 text-[13.5px] font-bold text-[#0B103B] hover:border-[#0B103B]/50">
              <ExternalLink className="h-4 w-4" /> View website
            </a>
            <Button variant="primary" onClick={save} loading={saving} disabled={!dirty}>Save changes</Button>
          </>
        }
      />
      {msg && <div className="mb-5"><Alert tone={msg.tone}>{msg.text}</Alert></div>}

      {/* Live preview (laptop layout) */}
      <Card className="mb-6 overflow-hidden">
        <div className="relative isolate px-6 py-8 sm:px-10">
          <img src={bg} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover object-[78%_center]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(26,10,4,0.86)_0%,rgba(26,10,4,0.78)_34%,rgba(26,10,4,0.4)_52%,rgba(26,10,4,0)_70%)]" />
          <div className="max-w-[440px] text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#F6E3B4]">Preview · {fill(fields.eyebrow)}</p>
            <p className="mt-2 font-serif text-[30px] font-bold leading-[1.05] text-[#FFF8EC]">
              {emAt >= 0 ? <>{headline.slice(0, emAt)}<span className="rounded bg-[#8E1B1F] px-1 text-[#FFD45A]">{em}</span>{headline.slice(emAt + em.length)}</> : headline}
            </p>
            <p className="mt-2 text-[13px] text-white/90">{fill(fields.lead)}</p>
            <p className="mx-auto mt-4 inline-flex flex-col items-center rounded-xl border-2 border-[#E9B949] bg-[#7A1418] px-6 py-2 text-white">
              <span className="text-[28px] font-extrabold leading-none text-[#FFD45A]">{fields.discount}% OFF</span>
              <span className="mt-1 text-[11px] font-bold uppercase">{fill(fields.offerText)}</span>
            </p>
            {fields.ribbonText && <p className="mt-2"><span className="rounded-full bg-[#F2B21B] px-3 py-0.5 text-[11px] font-extrabold uppercase text-[#3A0A0C]">{fill(fields.ribbonText)}</span></p>}
            <p className="mt-4"><span className="inline-flex rounded-full bg-[#8E1B1F] px-5 py-2 text-[12px] font-extrabold uppercase tracking-[0.08em] text-white">{fill(fields.ctaLabel)} →</span></p>
          </div>
          <span className="absolute right-0 top-1/2 -translate-y-1/2 rounded-l-lg border border-r-0 border-[#E9B949] bg-[#7A1418] px-1.5 py-3 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#FBE7B0] [writing-mode:vertical-rl] rotate-180">
            {fill(fields.tabLabel)}
          </span>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {TEXT_SECTIONS.map((section) => (
            <Card key={section.title} className="p-5">
              <h2 className="mb-4 font-serif text-[21px] text-[#0B103B]">{section.title}</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {section.fields.map((f) => {
                  const changed = fields[f.key] !== content.defaults[f.key];
                  return (
                    <Field key={f.key} label={f.label} htmlFor={`a-${f.key}`} error={errors[f.key]} hint={f.hint} className={f.half ? '' : 'md:col-span-2'}>
                      {f.multiline ? (
                        <textarea id={`a-${f.key}`} rows={2} value={fields[f.key]} onChange={set(f.key)} maxLength={f.max} className={`${inputClass} resize-y`} />
                      ) : (
                        <input id={`a-${f.key}`} value={fields[f.key]} onChange={set(f.key)} maxLength={f.max} className={inputClass} />
                      )}
                      {changed && (
                        <button type="button" onClick={() => setFields((x) => ({ ...x, [f.key]: content.defaults[f.key] }))} className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-bold text-[#57534C] hover:text-[#0B103B]" title={`Original: ${content.defaults[f.key]}`}>
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
            <h2 className="font-serif text-[21px] text-[#0B103B]">Show on website</h2>
            <p className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12.5px] font-bold ${status.tone === 'live' ? 'bg-[#1F7A4D]/10 text-[#16613C]' : status.tone === 'wait' ? 'bg-[#F2B21B]/20 text-[#6B4E00]' : 'bg-[#57534C]/10 text-[#55524B]'}`}>
              <span className={`h-2 w-2 rounded-full ${status.tone === 'live' ? 'bg-[#1F7A4D]' : status.tone === 'wait' ? 'bg-[#D9A441]' : 'bg-[#57534C]'}`} />
              {status.text}
            </p>
            <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-[#0B103B]/15 p-3.5">
              <span className="text-[14px] font-bold text-[#0B103B]">Advertisement on</span>
              <input type="checkbox" checked={fields.enabled} onChange={setBool('enabled')} className="h-5 w-5 cursor-pointer accent-[#D9A441]" />
            </label>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Field label="Start date" htmlFor="a-start" error={errors.startDate}>
                <input id="a-start" type="date" value={fields.startDate} onChange={set('startDate')} className={inputClass} />
              </Field>
              <Field label="End date" htmlFor="a-end" error={errors.endDate}>
                <input id="a-end" type="date" value={fields.endDate} onChange={set('endDate')} className={inputClass} />
              </Field>
            </div>
            <p className="mt-1.5 text-[12.5px] text-[#57534C]">Optional. Leave empty to run until you switch it off. Dates are India time.</p>
            <Field label="Pop-up" className="mt-4" error={errors.popup}>
              <div className="space-y-2">
                {POPUP_OPTIONS.map((o) => (
                  <label key={o.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${fields.popup === o.id ? 'border-[#D9A441] bg-[#FFFBF0]' : 'border-[#0B103B]/15'}`}>
                    <input type="radio" name="popup" checked={fields.popup === o.id} onChange={() => setFields((f) => ({ ...f, popup: o.id }))} className="mt-1 accent-[#D9A441]" />
                    <span>
                      <span className="block text-[13.5px] font-bold text-[#0B103B]">{o.label}</span>
                      <span className="block text-[12.5px] text-[#57534C]">{o.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </Field>
          </Card>

          <Card className="p-5">
            <h2 className="font-serif text-[21px] text-[#0B103B]">Offer</h2>
            <Field label="Discount %" htmlFor="a-discount" error={errors.discount} hint="Also updates the painting quote page and the paint visualizer." className="mt-3">
              <input id="a-discount" type="number" min={1} max={90} value={fields.discount} onChange={(e) => setFields((f) => ({ ...f, discount: e.target.value === '' ? '' : Number(e.target.value) }))} className={inputClass} />
            </Field>
            <label className="mt-4 flex cursor-pointer items-center justify-between gap-3">
              <span className="text-[13.5px] font-semibold text-[#2A2A2A]">Show “Visualise Colours” button</span>
              <input type="checkbox" checked={fields.showVisualizer} onChange={setBool('showVisualizer')} className="h-5 w-5 cursor-pointer accent-[#D9A441]" />
            </label>
            <label className="mt-3 flex cursor-pointer items-center justify-between gap-3">
              <span className="text-[13.5px] font-semibold text-[#2A2A2A]">Show “Paint Consultation” button</span>
              <input type="checkbox" checked={fields.showConsultation} onChange={setBool('showConsultation')} className="h-5 w-5 cursor-pointer accent-[#D9A441]" />
            </label>
          </Card>

          <Card className="p-5">
            <h2 className="font-serif text-[21px] text-[#0B103B]">Background image</h2>
            <p className="mt-1 mb-4 text-[13px] text-[#57534C]">Optional. Without one, the built-in painters photos are used (a wide one on laptops, a square one on phones). An upload replaces both.</p>
            {content.heroImages[0] ? (
              <div className="relative overflow-hidden rounded-lg border border-[#0B103B]/10">
                <img src={content.heroImages[0].thumbUrl} alt="" className="aspect-[16/9] w-full object-cover" />
                <button type="button" onClick={() => setRemoving(content.heroImages[0])} aria-label="Remove background image" className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-md bg-white/95 text-[#B3261E] shadow">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Button onClick={() => fileRef.current?.click()} disabled={imgBusy !== null} className="w-full">
                  {imgBusy !== null ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading {Math.round(imgBusy * 100)}%</> : <><UploadCloud className="h-4 w-4" /> Upload image</>}
                </Button>
                <input ref={fileRef} type="file" accept={ACCEPTED_IMAGE_TYPES.join(',')} className="sr-only" onChange={(e) => { uploadImage(e.target.files); e.target.value = ''; }} />
              </>
            )}
          </Card>
        </div>
      </div>

      <ConfirmDialog open={Boolean(removing)} onClose={() => setRemoving(null)} onConfirm={removeImage} title="Remove the background image?" text="The advertisement goes back to the built-in painters photos." confirmLabel="Remove" />
    </>
  );
}
