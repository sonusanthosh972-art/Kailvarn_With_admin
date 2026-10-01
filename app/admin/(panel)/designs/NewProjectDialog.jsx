'use client';

import { useState } from 'react';
import { DESIGN_CATEGORIES } from '@/constants/adminEnums.js';
import { adminApi } from '@/lib/adminApi.js';
import { Alert, Button, Dialog, Field, inputClass } from '@/components/admin/ui.jsx';

export default function NewProjectDialog({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ title: '', category: 'Living Room', location: '', videoUrl: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function create(e) {
    e?.preventDefault();
    setSaving(true);
    setError('');
    const r = await adminApi('/api/admin/designs', { method: 'POST', body: { ...form, status: 'draft' } });
    setSaving(false);
    if (r.ok) { setForm({ title: '', category: 'Living Room', location: '', videoUrl: '' }); onCreated(r.data); }
    else { setErrors(r.error?.fields || {}); setError(r.error?.message); }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="New project"
      footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" onClick={create} loading={saving} disabled={form.title.trim().length < 2}>Create project</Button></>}
    >
      <form onSubmit={create} className="space-y-4">
        <Field label="Project title" htmlFor="np-title" error={errors.title} hint='e.g. "Modern Living Room — Vapi"'>
          <input id="np-title" autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} maxLength={140} />
        </Field>
        <Field label="Category" htmlFor="np-cat" error={errors.category}>
          <select id="np-cat" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
            {DESIGN_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Location (optional)" htmlFor="np-loc">
          <input id="np-loc" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} maxLength={120} placeholder="Vapi" />
        </Field>
        <Field label="Walkthrough video URL (optional)" htmlFor="np-video" hint="e.g. /videos/living-room.mp4 (or leave blank for category video)">
          <input id="np-video" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} className={inputClass} maxLength={500} placeholder="/videos/living-room.mp4" />
        </Field>
        <p className="text-[13px] text-[#6B675F]">It starts as a draft — add images, then publish it when ready.</p>
        {error && <Alert>{error}</Alert>}
      </form>
    </Dialog>
  );
}
