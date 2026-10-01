'use client';

import LeadsManager from '@/components/admin/LeadsManager.jsx';

const fmtDate = (v) => (v ? new Date(`${v}T00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) : '—');

export default function ConsultationsPage() {
  return (
    <LeadsManager
      endpoint="/api/admin/consultations"
      title="Consultations"
      subtitle="Bookings from the Book Consultation form."
      noun="consultation"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'city', label: 'City' },
        { key: 'service', label: 'Service' },
        { key: 'preferredDate', label: 'Preferred Date' },
        { key: 'preferredTime', label: 'Time' },
      ]}
      detailFields={[
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' },
        { key: 'city', label: 'City' },
        { key: 'service', label: 'Service' },
        { key: 'projectType', label: 'Project type' },
        { key: 'preferredDate', label: 'Preferred date', format: fmtDate },
        { key: 'preferredTime', label: 'Preferred time' },
        { key: 'message', label: 'Message' },
      ]}
    />
  );
}
