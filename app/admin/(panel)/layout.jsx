import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/server/auth.js';
import AdminShell from '@/components/admin/AdminShell.jsx';

// Every page in the panel requires a signed-in admin. proxy.js already
// redirects requests without a valid cookie; this also rejects cookies whose
// admin no longer exists in MongoDB.
export default async function PanelLayout({ children }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  return <AdminShell admin={admin}>{children}</AdminShell>;
}
