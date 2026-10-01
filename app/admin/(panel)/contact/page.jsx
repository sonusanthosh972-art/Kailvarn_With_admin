'use client';

import LeadsManager from '@/components/admin/LeadsManager.jsx';

export default function ContactEnquiriesPage() {
  return (
    <LeadsManager
      endpoint="/api/admin/contact"
      title="Contact Enquiries"
      subtitle="Messages from the Contact Us form."
      noun="enquiry"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' },
        { key: 'city', label: 'City' },
        { key: 'service', label: 'Service' },
      ]}
      detailFields={[
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' },
        { key: 'city', label: 'City' },
        { key: 'service', label: 'Service' },
        { key: 'message', label: 'Message' },
      ]}
    />
  );
}
