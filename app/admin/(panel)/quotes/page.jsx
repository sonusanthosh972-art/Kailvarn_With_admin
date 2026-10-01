'use client';

import LeadsManager from '@/components/admin/LeadsManager.jsx';

export default function QuotesPage() {
  return (
    <LeadsManager
      endpoint="/api/admin/quotes"
      title="Quote Requests"
      subtitle="Submissions from the Get Free Quote form."
      noun="quote request"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'city', label: 'City' },
        { key: 'service', label: 'Service' },
        { key: 'projectType', label: 'Project Type' },
      ]}
      detailFields={[
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' },
        { key: 'city', label: 'City' },
        { key: 'service', label: 'Service' },
        { key: 'projectType', label: 'Project type' },
        { key: 'budget', label: 'Budget' },
        { key: 'contactMethod', label: 'Preferred contact' },
        { key: 'source', label: 'Found us via' },
        { key: 'message', label: 'Requirements' },
      ]}
    />
  );
}
