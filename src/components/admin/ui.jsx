'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, X } from 'lucide-react';
import { LEAD_STATUS_LABELS } from '@/constants/adminEnums.js';

// Admin UI primitives — KailVarn navy / gold / cream, restrained motion.

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
      <div>
        <h1 className="font-serif text-[30px] lg:text-[36px] leading-tight text-[#0B103B]">{title}</h1>
        {subtitle && <p className="mt-1.5 text-[14.5px] text-[#6B675F]">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
    </div>
  );
}

const BTN = {
  primary: 'bg-[#F2B21B] text-[#0B103B] hover:bg-[#D9A441] border-[#F2B21B] hover:border-[#D9A441]',
  navy: 'bg-[#0B103B] text-white hover:bg-[#11184D] border-[#0B103B]',
  outline: 'bg-white text-[#0B103B] border-[#0B103B]/20 hover:border-[#0B103B]/50',
  ghost: 'bg-transparent text-[#0B103B] border-transparent hover:bg-[#0B103B]/[0.06]',
  danger: 'bg-white text-[#B3261E] border-[#B3261E]/30 hover:bg-[#B3261E] hover:text-white hover:border-[#B3261E]',
};

export function Button({ variant = 'outline', size = 'md', loading, className = '', children, ...props }) {
  const sz = size === 'sm' ? 'min-h-[36px] px-3.5 text-[12.5px]' : 'min-h-[44px] px-5 text-[13.5px]';
  return (
    <button
      type="button"
      {...props}
      disabled={props.disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border font-bold tracking-[0.02em] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${sz} ${BTN[variant]} ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function Field({ label, error, hint, children, htmlFor, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className="block mb-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-[#0B103B]">
          {label}
        </label>
      )}
      {children}
      {error ? <p className="mt-1.5 text-[12.5px] text-[#B3261E]">{error}</p> : hint ? <p className="mt-1.5 text-[12.5px] text-[#6B675F]">{hint}</p> : null}
    </div>
  );
}

export const inputClass =
  'w-full min-h-[44px] rounded-lg border border-[#0B103B]/20 bg-white px-3.5 py-2.5 text-[14.5px] text-[#111] placeholder:text-[#6B675F]/70 outline-none transition-[border-color,box-shadow] focus:border-[#D9A441] focus:shadow-[0_0_0_3px_rgba(242,178,27,0.18)]';

export function Card({ className = '', children, ...props }) {
  return (
    <div {...props} className={`rounded-xl border border-[#0B103B]/10 bg-white ${className}`}>
      {children}
    </div>
  );
}

const STATUS_STYLES = {
  NEW: 'bg-[#F2B21B]/20 text-[#6B4E00] border-[#F2B21B]/50',
  CONTACTED: 'bg-[#0B103B]/[0.07] text-[#0B103B] border-[#0B103B]/20',
  IN_PROGRESS: 'bg-[#2B5DD8]/10 text-[#1E3F9A] border-[#2B5DD8]/25',
  COMPLETED: 'bg-[#1F7A4D]/10 text-[#16613C] border-[#1F7A4D]/25',
  CLOSED: 'bg-[#6B675F]/10 text-[#55524B] border-[#6B675F]/25',
  published: 'bg-[#1F7A4D]/10 text-[#16613C] border-[#1F7A4D]/25',
  draft: 'bg-[#6B675F]/10 text-[#55524B] border-[#6B675F]/25',
};

export function StatusBadge({ status }) {
  const label = LEAD_STATUS_LABELS[status] || (status === 'published' ? 'Published' : status === 'draft' ? 'Draft' : status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11.5px] font-bold whitespace-nowrap ${STATUS_STYLES[status] || STATUS_STYLES.draft}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      {label}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#D9A441]/50">
          <Icon className="h-6 w-6 text-[#8A6A1C]" strokeWidth={1.5} />
        </span>
      )}
      <p className="font-serif text-[21px] text-[#0B103B]">{title}</p>
      {text && <p className="mt-1.5 max-w-[42ch] text-[14px] text-[#6B675F]">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-2.5 py-16 text-[14px] text-[#6B675F]" role="status">
      <Loader2 className="h-5 w-5 animate-spin text-[#D9A441]" aria-hidden="true" /> {label}
    </div>
  );
}

export function Alert({ tone = 'error', children }) {
  const styles = tone === 'error' ? 'border-[#B3261E]/30 bg-[#B3261E]/[0.06] text-[#8C1D18]' : 'border-[#1F7A4D]/30 bg-[#1F7A4D]/[0.07] text-[#16613C]';
  return <div role={tone === 'error' ? 'alert' : 'status'} className={`rounded-lg border px-4 py-3 text-[14px] ${styles}`}>{children}</div>;
}

// Modal dialog with focus on open + Escape to close.
export function Dialog({ open, onClose, title, children, footer, wide }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[50] flex items-end sm:items-center justify-center p-0 sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
          <div className="absolute inset-0 bg-[#070A25]/55" onClick={onClose} aria-hidden="true" />
          <motion.div
            ref={ref}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full ${wide ? 'sm:max-w-[720px]' : 'sm:max-w-[460px]'} max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-xl bg-[#FAFAF7] shadow-[0_30px_80px_-30px_rgba(7,10,37,0.6)] outline-none`}
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#0B103B]/10 px-6 py-4">
              <h2 className="font-serif text-[21px] text-[#0B103B]">{title}</h2>
              <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-lg text-[#0B103B]/70 hover:bg-[#0B103B]/[0.06]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5">{children}</div>
            {footer && <div className="flex flex-wrap justify-end gap-2.5 border-t border-[#0B103B]/10 px-6 py-4">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title = 'Are you sure?', text, confirmLabel = 'Delete', loading }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </>
      }
    >
      <p className="text-[14.5px] leading-relaxed text-[#2A2A2A]">{text}</p>
    </Dialog>
  );
}

// Side drawer for detail views.
export function Drawer({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[40]">
          <motion.div className="absolute inset-0 bg-[#070A25]/45" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden="true" />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-0 bottom-0 flex w-full max-w-[520px] flex-col bg-[#FAFAF7] shadow-[-30px_0_80px_-40px_rgba(7,10,37,0.6)]"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#0B103B]/10 px-6 py-4">
              <h2 className="font-serif text-[22px] text-[#0B103B] truncate">{title}</h2>
              <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#0B103B]/70 hover:bg-[#0B103B]/[0.06]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && <div className="flex flex-wrap gap-2.5 border-t border-[#0B103B]/10 px-6 py-4">{footer}</div>}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
