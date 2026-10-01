import { getCurrentAdmin } from '@/server/auth.js';
import { systemInfo } from '@/server/system.js';
import { Card, PageHeader } from '@/components/admin/ui.jsx';
import { formatDate } from '@/lib/adminApi.js';
import PasswordForm from './PasswordForm.jsx';

// Server component: shows configuration status without ever sending
// secrets to the browser (only yes/no + bucket name).
export default async function SettingsPage() {
  const admin = await getCurrentAdmin();
  const sys = systemInfo();
  const rows = [
    ['Signed in as', admin?.email],
    ['Last login', formatDate(admin?.lastLoginAt)],
    ['Database (MongoDB)', sys.db],
    ['Image storage (Backblaze B2)', sys.storage],
    ['Image delivery', sys.delivery],
  ];
  return (
    <>
      <PageHeader title="Settings" subtitle="Your account and system status." />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="border-b border-[#0B103B]/10 px-5 py-4 font-serif text-[21px] text-[#0B103B]">System</h2>
          <dl className="divide-y divide-[#0B103B]/[0.07]">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-[210px_1fr]">
                <dt className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-[#6B675F]">{k}</dt>
                <dd className="text-[14px] text-[#111] break-words">{v || '—'}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <Card>
          <h2 className="border-b border-[#0B103B]/10 px-5 py-4 font-serif text-[21px] text-[#0B103B]">Change password</h2>
          <div className="p-5"><PasswordForm /></div>
        </Card>
      </div>
    </>
  );
}
