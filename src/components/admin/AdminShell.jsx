'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, Images, LayoutTemplate, UploadCloud, FileText, CalendarCheck, Mail, Settings, LogOut, Menu, X, ExternalLink } from 'lucide-react';
import { adminApi } from '@/lib/adminApi.js';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/designs', label: 'Designs', icon: Images },
  { href: '/admin/content/our-design', label: 'Our Design Page', icon: LayoutTemplate },
  { href: '/admin/upload', label: 'Upload Images', icon: UploadCloud },
  { href: '/admin/quotes', label: 'Quote Requests', icon: FileText },
  { href: '/admin/consultations', label: 'Consultations', icon: CalendarCheck },
  { href: '/admin/contact', label: 'Contact Enquiries', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-3 px-2" aria-label="KailVarn admin — dashboard">
      <img src="/brand/kailvarn-mark-192.png" alt="" width={40} height={40} className="h-10 w-10" />
      <span className="flex flex-col">
        <img src="/brand/kailvarn-wordmark.png" alt="KailVarn" width={117} height={18} className="h-[18px] w-auto" />
        <span className="mt-1 text-[9.5px] font-extrabold uppercase tracking-[0.34em] text-white/50">Studio Admin</span>
      </span>
    </Link>
  );
}

function NavList({ pathname, onNavigate }) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Admin">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={`group relative flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-[14px] font-semibold transition-colors ${
              active ? 'bg-white/[0.08] text-white' : 'text-white/65 hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            {active && <span className="absolute left-0 top-2.5 bottom-2.5 w-[2px] rounded-full bg-[#F2B21B]" aria-hidden="true" />}
            <Icon className={`h-[18px] w-[18px] ${active ? 'text-[#F2B21B]' : 'text-white/55 group-hover:text-white/80'}`} strokeWidth={1.75} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminShell({ admin, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  async function logout() {
    setLoggingOut(true);
    await adminApi('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-[#070A25] px-4 py-6">
      <Brand />
      {/* Architectural rule: a thin gold line with a tick, like a drawing dimension */}
      <div className="relative my-6 h-px bg-gradient-to-r from-[#F2B21B]/50 via-white/10 to-transparent" aria-hidden="true">
        <span className="absolute left-0 -top-1 h-2 w-px bg-[#F2B21B]/60" />
      </div>
      <NavList pathname={pathname} onNavigate={() => setOpen(false)} />
      <div className="mt-auto pt-6 border-t border-white/10">
        <Link href="/" target="_blank" className="mb-1 flex min-h-[40px] items-center gap-3 rounded-lg px-3 text-[13px] font-semibold text-white/55 hover:text-white">
          <ExternalLink className="h-4 w-4" strokeWidth={1.75} /> View website
        </Link>
        <button type="button" onClick={logout} disabled={loggingOut} className="flex min-h-[40px] w-full items-center gap-3 rounded-lg px-3 text-[13px] font-semibold text-white/55 hover:text-white disabled:opacity-50">
          <LogOut className="h-4 w-4" strokeWidth={1.75} /> {loggingOut ? 'Signing out…' : 'Logout'}
        </button>
        <p className="mt-3 truncate px-3 text-[11.5px] text-white/35" title={admin?.email}>{admin?.email}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#111]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-[30] hidden w-[260px] lg:block">{sidebar}</aside>

      {/* Mobile top bar + drawer */}
      <header className="sticky top-0 z-[30] flex h-16 items-center justify-between bg-[#070A25] px-4 lg:hidden">
        <Brand />
        <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="flex h-11 w-11 items-center justify-center rounded-lg text-white">
          <Menu className="h-6 w-6" />
        </button>
      </header>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[50] lg:hidden">
            <motion.div className="absolute inset-0 bg-[#070A25]/60" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div className="absolute inset-y-0 left-0 w-[280px]" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
              {sidebar}
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-3 top-5 flex h-10 w-10 items-center justify-center rounded-lg text-white/70">
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="lg:pl-[260px]">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
