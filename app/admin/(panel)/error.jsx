'use client';

import { useEffect } from 'react';
import { Alert, Button } from '@/components/admin/ui.jsx';

// Keeps the admin sidebar usable when one screen crashes.
export default function AdminError({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-xl space-y-4">
      <Alert>This screen hit an error and couldn&rsquo;t load. Your data is safe.</Alert>
      <Button type="button" onClick={() => retry()}>Try again</Button>
    </div>
  );
}
