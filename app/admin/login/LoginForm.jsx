'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Lock } from 'lucide-react';
import { adminApi } from '@/lib/adminApi.js';

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Only allow redirects back into the admin (no open redirect).
  const nextParam = params.get('next') || '';
  const next = nextParam.startsWith('/admin') && !nextParam.startsWith('//') ? nextParam : '/admin';

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const r = await adminApi('/api/admin/login', { method: 'POST', body: { email, password } });
    if (r.ok) {
      router.replace(next);
      router.refresh();
    } else {
      setLoading(false);
      setError(r.error?.message || 'Could not sign in');
    }
  }

  const input = 'w-full min-h-[48px] rounded-lg border border-[#0B103B]/20 bg-white px-4 text-[15px] text-[#111] outline-none transition-[border-color,box-shadow] focus:border-[#D9A441] focus:shadow-[0_0_0_3px_rgba(242,178,27,0.2)]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[420px]"
    >
      <div className="mb-8 flex flex-col items-center text-center">
        <img src="/brand/kailvarn-mark-192.png" alt="" width={72} height={72} className="h-[72px] w-[72px]" />
        <img src="/brand/kailvarn-wordmark.png" alt="KailVarn" width={182} height={28} className="mt-4 h-7 w-auto" />
        <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.34em] text-white/50">Studio Admin</p>
      </div>
      <form onSubmit={submit} className="rounded-xl bg-[#FAFAF7] p-7 sm:p-8 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)]" noValidate>
        <h1 className="font-serif text-[26px] text-[#0B103B]">Sign in</h1>
        <p className="mt-1 mb-6 text-[14px] text-[#6B675F]">Authorised KailVarn staff only.</p>
        <label htmlFor="email" className="mb-1.5 block text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-[#0B103B]">Email</label>
        <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
        <label htmlFor="password" className="mb-1.5 mt-5 block text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-[#0B103B]">Password</label>
        <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
        {error && <p role="alert" className="mt-4 rounded-lg border border-[#B3261E]/30 bg-[#B3261E]/[0.06] px-3.5 py-2.5 text-[13.5px] text-[#8C1D18]">{error}</p>}
        <button type="submit" disabled={loading || !email || !password} className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-[#F2B21B] text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#0B103B] transition-colors hover:bg-[#D9A441] disabled:opacity-50">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </motion.div>
  );
}
