'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Search, Images, MapPin } from 'lucide-react';
import { DESIGN_CATEGORIES } from '@/constants/adminEnums.js';
import { adminApi, formatDate } from '@/lib/adminApi.js';
import { Alert, Button, EmptyState, PageHeader, Spinner, StatusBadge, inputClass } from '@/components/admin/ui.jsx';
import NewProjectDialog from './NewProjectDialog.jsx';

function DesignsList() {
  const router = useRouter();
  const params = useSearchParams();
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState(['draft', 'published'].includes(params.get('status')) ? params.get('status') : '');
  const [category, setCategory] = useState('');
  const [creating, setCreating] = useState(params.get('new') === '1');

  const load = useCallback(async () => {
    const sp = new URLSearchParams();
    if (q.trim()) sp.set('q', q.trim());
    if (status) sp.set('status', status);
    if (category) sp.set('category', category);
    const r = await adminApi(`/api/admin/designs?${sp}`);
    if (r.ok) { setItems(r.data.items); setError(''); } else setError(r.error?.message);
  }, [q, status, category]);

  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);

  return (
    <>
      <PageHeader
        title="Designs"
        subtitle="Portfolio projects shown on the Our Design page once published."
        actions={<Button variant="primary" onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> New project</Button>}
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px_200px]">
        <label className="relative">
          <span className="sr-only">Search designs</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B675F]" aria-hidden="true" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, location, tag…" className={`${inputClass} pl-10`} />
        </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass} aria-label="Filter by status">
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} aria-label="Filter by category">
          <option value="">All categories</option>
          {DESIGN_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {error && <Alert>{error}</Alert>}
      {!items && !error && <Spinner />}
      {items && items.length === 0 && (
        <EmptyState
          icon={Images}
          title={q || status || category ? 'No designs match' : 'No designs yet'}
          text={q || status || category ? 'Try other filters.' : 'Create your first project, upload its photos and publish it to the Our Design page.'}
          action={!(q || status || category) && <Button variant="primary" onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> New project</Button>}
        />
      )}
      {items && items.length > 0 && <p className="mb-3 text-[13px] text-[#6B675F]">{items.length} design{items.length === 1 ? '' : 's'}</p>}
      {items && items.length > 0 && (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((p, i) => (
            <motion.li key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i, 8) * 0.03 }}>
              <Link href={`/admin/designs/${p.id}`} className="group block overflow-hidden rounded-xl border border-[#0B103B]/10 bg-white transition-[border-color,box-shadow] hover:border-[#D9A441]/60 hover:shadow-[0_18px_40px_-28px_rgba(11,16,59,0.45)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#0B103B]">
                  {p.cover ? (
                    <img src={p.cover.thumbUrl} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[13px] text-white/50"><Images className="mr-2 h-5 w-5" /> No images yet</div>
                  )}
                  <span className="absolute left-3 top-3"><StatusBadge status={p.status} /></span>
                </div>
                <div className="p-4">
                  <p className="text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-[#8A6A1C]">{p.category}{p.subtitle && p.subtitle !== p.category ? ` · ${p.subtitle}` : ''}</p>
                  <h3 className="mt-1 font-serif text-[20px] leading-snug text-[#0B103B]">{p.title}</h3>
                  <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-[#6B675F]">
                    <span>{p.imageCount} image{p.imageCount === 1 ? '' : 's'}</span>
                    {p.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{p.location}</span>}
                    <span>Updated {formatDate(p.updatedAt, false)}</span>
                  </p>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      )}

      <NewProjectDialog open={creating} onClose={() => setCreating(false)} onCreated={(p) => router.push(`/admin/designs/${p.id}`)} />
    </>
  );
}

export default function DesignsPage() {
  return <Suspense fallback={<Spinner />}><DesignsList /></Suspense>;
}
