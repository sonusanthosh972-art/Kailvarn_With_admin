'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, Phone, MessageCircle, Mail, Trash2, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from '@/constants/adminEnums.js';
import { adminApi, formatDate } from '@/lib/adminApi.js';
import { Alert, Button, Card, ConfirmDialog, Drawer, EmptyState, Field, PageHeader, Spinner, StatusBadge, inputClass } from '@/components/admin/ui.jsx';

// Shared list + detail manager for quotes, consultations and contact
// enquiries. `columns` picks what the table shows; `detailFields` what the
// drawer shows.
export default function LeadsManager({ endpoint, title, subtitle, columns, detailFields, noun }) {
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ loading: true, error: '', items: [], total: 0, byStatus: {}, limit: 25 });
  const [openId, setOpenId] = useState(null);

  // Debounce search typing.
  useEffect(() => {
    const t = setTimeout(() => { setQuery(q.trim()); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [q]);

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    const params = new URLSearchParams({ page: String(page), limit: '25' });
    if (query) params.set('q', query);
    if (status) params.set('status', status);
    const r = await adminApi(`${endpoint}?${params}`);
    if (r.ok) setState({ loading: false, error: '', ...r.data });
    else setState((s) => ({ ...s, loading: false, error: r.error?.message || 'Could not load' }));
  }, [endpoint, page, query, status]);

  useEffect(() => { load(); }, [load]);

  const totalAll = useMemo(() => Object.values(state.byStatus || {}).reduce((a, b) => a + b, 0), [state.byStatus]);
  const pages = Math.max(1, Math.ceil(state.total / (state.limit || 25)));
  const selected = state.items.find((i) => i.id === openId) || null;

  function onChanged(updated) {
    setState((s) => ({ ...s, items: s.items.map((i) => (i.id === updated.id ? updated : i)) }));
    load();
  }
  function onDeleted(id) {
    setOpenId(null);
    setState((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) }));
    load();
  }

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar -mx-1 px-1" role="tablist" aria-label="Filter by status">
          {[{ key: '', label: 'All', n: totalAll }, ...LEAD_STATUSES.map((s) => ({ key: s, label: LEAD_STATUS_LABELS[s], n: state.byStatus?.[s] || 0 }))].map((t) => (
            <button
              key={t.key || 'all'}
              type="button"
              role="tab"
              aria-selected={status === t.key}
              onClick={() => { setStatus(t.key); setPage(1); }}
              className={`shrink-0 min-h-[38px] rounded-lg border px-3.5 text-[13px] font-bold transition-colors ${
                status === t.key ? 'border-[#0B103B] bg-[#0B103B] text-white' : 'border-[#0B103B]/15 bg-white text-[#0B103B]/75 hover:border-[#0B103B]/40'
              }`}
            >
              {t.label} <span className={status === t.key ? 'text-[#F2B21B]' : 'text-[#6B675F]'}>{t.n}</span>
            </button>
          ))}
        </div>
        <label className="relative block lg:w-[320px]">
          <span className="sr-only">Search {noun}s</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B675F]" aria-hidden="true" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, city…" className={`${inputClass} pl-10`} />
        </label>
      </div>

      {state.error && <div className="mb-4"><Alert>{state.error}</Alert></div>}

      <Card className="overflow-hidden">
        {state.loading && !state.items.length ? (
          <Spinner />
        ) : !state.items.length ? (
          <EmptyState icon={Inbox} title={query || status ? 'Nothing matches' : `No ${noun}s yet`} text={query || status ? 'Try a different search or status.' : `New ${noun}s from the website will appear here.`} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#0B103B]/10 bg-[#FAFAF7] text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#0B103B]/70">
                  {columns.map((c) => <th key={c.key} scope="col" className="px-4 py-3 font-extrabold">{c.label}</th>)}
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Date</th>
                  <th scope="col" className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.items.map((item) => (
                  <tr key={item.id} onClick={() => setOpenId(item.id)} className="cursor-pointer border-b border-[#0B103B]/[0.07] last:border-0 hover:bg-[#F5F1E8]/60 transition-colors">
                    {columns.map((c, idx) => (
                      <td key={c.key} className={`px-4 py-3.5 ${idx === 0 ? 'font-bold text-[#0B103B]' : 'text-[#2A2A2A]'}`}>
                        {idx === 0 ? (
                          <button type="button" onClick={(e) => { e.stopPropagation(); setOpenId(item.id); }} className="text-left hover:underline underline-offset-4">
                            {item[c.key] || '—'}
                          </button>
                        ) : (item[c.key] || '—')}
                      </td>
                    ))}
                    <td className="px-4 py-3.5"><StatusBadge status={item.status} /></td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-[#6B675F]">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <ContactActions item={item} compact />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-[13px] text-[#6B675F]">
          <span>Page {page} of {pages} · {state.total} total</span>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></Button>
            <Button size="sm" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages} aria-label="Next page"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}

      <LeadDetail endpoint={endpoint} item={selected} detailFields={detailFields} noun={noun} onClose={() => setOpenId(null)} onChanged={onChanged} onDeleted={onDeleted} />
    </>
  );
}

function waLink(phone, name) {
  const digits = String(phone || '').replace(/\D/g, '');
  const intl = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${intl}?text=${encodeURIComponent(`Hi ${name || ''}, this is KailVarn regarding your enquiry.`)}`;
}

function ContactActions({ item, compact }) {
  const cls = compact
    ? 'flex h-9 w-9 items-center justify-center rounded-lg border border-[#0B103B]/15 text-[#0B103B] hover:border-[#D9A441] hover:text-[#8A6A1C]'
    : 'inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#0B103B]/15 bg-white px-4 text-[13.5px] font-bold text-[#0B103B] hover:border-[#D9A441]';
  return (
    <div className={`flex gap-1.5 ${compact ? 'justify-end' : 'flex-wrap'}`}>
      {item.phone && <a href={`tel:${item.phone}`} className={cls} aria-label={`Call ${item.name}`}><Phone className="h-4 w-4" />{!compact && 'Call'}</a>}
      {item.phone && <a href={waLink(item.phone, item.name)} target="_blank" rel="noopener noreferrer" className={cls} aria-label={`WhatsApp ${item.name}`}><MessageCircle className="h-4 w-4" />{!compact && 'WhatsApp'}</a>}
      {item.email && <a href={`mailto:${item.email}`} className={cls} aria-label={`Email ${item.name}`}><Mail className="h-4 w-4" />{!compact && 'Email'}</a>}
    </div>
  );
}

function LeadDetail({ endpoint, item, detailFields, noun, onClose, onChanged, onDeleted }) {
  const [status, setStatus] = useState('NEW');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (item) { setStatus(item.status); setNotes(item.notes || ''); setMsg(null); }
  }, [item]);

  async function save() {
    setSaving(true);
    const r = await adminApi(`${endpoint}/${item.id}`, { method: 'PATCH', body: { status, notes } });
    setSaving(false);
    if (r.ok) { setMsg({ tone: 'success', text: 'Saved.' }); onChanged(r.data); } else setMsg({ tone: 'error', text: r.error?.message });
  }
  async function remove() {
    setDeleting(true);
    const r = await adminApi(`${endpoint}/${item.id}`, { method: 'DELETE' });
    setDeleting(false);
    setConfirm(false);
    if (r.ok) onDeleted(item.id); else setMsg({ tone: 'error', text: r.error?.message });
  }

  return (
    <>
      <Drawer
        open={Boolean(item)}
        onClose={onClose}
        title={item?.name || ''}
        footer={item && (
          <>
            <Button variant="primary" onClick={save} loading={saving}>Save changes</Button>
            <Button variant="danger" onClick={() => setConfirm(true)} className="ml-auto"><Trash2 className="h-4 w-4" /> Delete</Button>
          </>
        )}
      >
        {item && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <StatusBadge status={item.status} />
              <span className="text-[12.5px] text-[#6B675F]">Received {formatDate(item.createdAt)}</span>
            </div>
            <ContactActions item={item} />
            <dl className="divide-y divide-[#0B103B]/[0.08] rounded-lg border border-[#0B103B]/10 bg-white">
              {detailFields.map((f) => (
                <div key={f.key} className="grid grid-cols-[130px_1fr] gap-3 px-4 py-3">
                  <dt className="text-[11.5px] font-extrabold uppercase tracking-[0.1em] text-[#6B675F] pt-0.5">{f.label}</dt>
                  <dd className="text-[14px] text-[#111] whitespace-pre-wrap break-words">{f.format ? f.format(item[f.key], item) : item[f.key] || '—'}</dd>
                </div>
              ))}
            </dl>
            <Field label="Status" htmlFor="lead-status">
              <select id="lead-status" value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
                {LEAD_STATUSES.map((s) => <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>)}
              </select>
            </Field>
            <Field label="Internal notes" htmlFor="lead-notes" hint="Only visible to admins.">
              <textarea id="lead-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} maxLength={4000} className={`${inputClass} resize-y`} />
            </Field>
            {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
            {item.updatedAt && <p className="text-[12px] text-[#6B675F]">Last updated {formatDate(item.updatedAt)}</p>}
          </div>
        )}
      </Drawer>
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={remove}
        loading={deleting}
        title={`Delete this ${noun}?`}
        text={`${item?.name || 'This entry'} will be permanently removed. This can't be undone.`}
      />
    </>
  );
}
