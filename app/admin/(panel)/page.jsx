'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Images, ImageIcon, FileText, Clock, CalendarCheck, Mail, ArrowRight, UploadCloud, Plus } from 'lucide-react';
import { adminApi, formatDate } from '@/lib/adminApi.js';
import { Alert, Card, PageHeader, Spinner, StatusBadge } from '@/components/admin/ui.jsx';

const TYPE = {
  quote: { label: 'Quote request', href: '/admin/quotes', icon: FileText },
  consultation: { label: 'Consultation', href: '/admin/consultations', icon: CalendarCheck },
  contact: { label: 'Contact enquiry', href: '/admin/contact', icon: Mail },
  design: { label: 'Design', href: '/admin/designs', icon: Images },
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi('/api/admin/stats').then((r) => (r.ok ? setStats(r.data) : setError(r.error?.message)));
  }, []);

  const cards = stats && [
    { label: 'Total Designs', value: stats.totalDesigns, note: `${stats.publishedDesigns} published`, icon: Images, href: '/admin/designs' },
    { label: 'Total Images', value: stats.totalImages, note: 'in Backblaze B2', icon: ImageIcon, href: '/admin/designs' },
    { label: 'New Quote Requests', value: stats.newQuotes, note: 'awaiting first contact', icon: FileText, href: '/admin/quotes', accent: stats.newQuotes > 0 },
    { label: 'Pending Requests', value: stats.pendingQuotes, note: 'new, contacted or in progress', icon: Clock, href: '/admin/quotes' },
    { label: 'Consultations', value: stats.totalConsultations, note: `${stats.newConsultations} new`, icon: CalendarCheck, href: '/admin/consultations', accent: stats.newConsultations > 0 },
    { label: 'Contact Enquiries', value: stats.newContacts, note: 'new', icon: Mail, href: '/admin/contact', accent: stats.newContacts > 0 },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="An overview of your designs and incoming enquiries."
        actions={
          <>
            <Link href="/admin/designs?new=1" className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#0B103B]/20 bg-white px-5 text-[13.5px] font-bold text-[#0B103B] hover:border-[#0B103B]/50"><Plus className="h-4 w-4" /> New project</Link>
            <Link href="/admin/upload" className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#F2B21B] px-5 text-[13.5px] font-bold text-[#0B103B] hover:bg-[#D9A441]"><UploadCloud className="h-4 w-4" /> Upload images</Link>
          </>
        }
      />
      {error && <Alert>{error}</Alert>}
      {!stats && !error && <Spinner />}
      {stats && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map(({ label, value, note, icon: Icon, href, accent }) => (
              <Link key={label} href={href} className="group">
                <Card className={`relative h-full overflow-hidden p-5 transition-[border-color,box-shadow] duration-200 group-hover:border-[#D9A441]/60 group-hover:shadow-[0_18px_40px_-28px_rgba(11,16,59,0.45)] ${accent ? 'border-[#F2B21B]/60' : ''}`}>
                  <div className="flex items-start justify-between">
                    <span className="text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-[#6B675F]">{label}</span>
                    <Icon className="h-5 w-5 text-[#D9A441]" strokeWidth={1.6} aria-hidden="true" />
                  </div>
                  <p className="mt-3 font-serif text-[40px] leading-none text-[#0B103B] tabular-nums">{value}</p>
                  <p className="mt-2 text-[13px] text-[#6B675F]">{note}</p>
                  {/* measurement tick — architectural detail */}
                  <span className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-[#D9A441]/40 to-transparent" aria-hidden="true" />
                </Card>
              </Link>
            ))}
          </div>

          <Card className="mt-6">
            <div className="flex items-center justify-between border-b border-[#0B103B]/10 px-5 py-4">
              <h2 className="font-serif text-[21px] text-[#0B103B]">Recent activity</h2>
            </div>
            {stats.activity.length === 0 ? (
              <p className="px-5 py-10 text-center text-[14px] text-[#6B675F]">Nothing yet — new enquiries and designs will show up here.</p>
            ) : (
              <ul className="divide-y divide-[#0B103B]/[0.07]">
                {stats.activity.map((a) => {
                  const t = TYPE[a.type];
                  return (
                    <li key={`${a.type}-${a.id}`}>
                      <Link href={t.href} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#F5F1E8]/60">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D9A441]/50"><t.icon className="h-4 w-4 text-[#8A6A1C]" strokeWidth={1.75} /></span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14px] font-semibold text-[#0B103B]">{a.label}</span>
                          <span className="block truncate text-[12.5px] text-[#6B675F]">{t.label}{a.detail ? ` · ${a.detail}` : ''}</span>
                        </span>
                        {a.status && <StatusBadge status={a.status} />}
                        <span className="hidden sm:block whitespace-nowrap text-[12.5px] text-[#6B675F]">{formatDate(a.createdAt)}</span>
                        <ArrowRight className="h-4 w-4 text-[#0B103B]/30" aria-hidden="true" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </>
      )}
    </>
  );
}
