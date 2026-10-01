'use client';

import { useState } from 'react';
import { adminApi } from '@/lib/adminApi.js';
import { Alert, Button, Field, inputClass } from '@/components/admin/ui.jsx';

export default function PasswordForm() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setMsg(null);
    if (form.newPassword !== form.confirm) return setErrors({ confirm: 'Passwords do not match.' });
    setErrors({});
    setSaving(true);
    const r = await adminApi('/api/admin/settings/password', { method: 'POST', body: { currentPassword: form.currentPassword, newPassword: form.newPassword } });
    setSaving(false);
    if (r.ok) { setMsg({ tone: 'success', text: 'Password updated.' }); setForm({ currentPassword: '', newPassword: '', confirm: '' }); }
    else { setErrors(r.error?.fields || {}); setMsg({ tone: 'error', text: r.error?.message }); }
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Field label="Current password" htmlFor="cur" error={errors.currentPassword}>
        <input id="cur" type="password" autoComplete="current-password" value={form.currentPassword} onChange={set('currentPassword')} className={inputClass} />
      </Field>
      <Field label="New password" htmlFor="new" error={errors.newPassword} hint="At least 10 characters.">
        <input id="new" type="password" autoComplete="new-password" value={form.newPassword} onChange={set('newPassword')} className={inputClass} />
      </Field>
      <Field label="Repeat new password" htmlFor="rep" error={errors.confirm}>
        <input id="rep" type="password" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} className={inputClass} />
      </Field>
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      <Button type="submit" variant="navy" loading={saving} disabled={!form.currentPassword || !form.newPassword}>Update password</Button>
    </form>
  );
}
