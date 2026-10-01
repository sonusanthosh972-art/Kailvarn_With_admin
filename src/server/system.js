import 'server-only';
import { isB2Configured } from '@/server/b2.js';
import { isDbConfigured } from '@/server/db.js';

// Non-secret configuration summary for the admin Settings page.
export function systemInfo() {
  return {
    db: isDbConfigured() ? `Connected · database "${process.env.MONGODB_DB || 'kailvarn'}"` : 'Not configured',
    storage: isB2Configured() ? `Configured · bucket "${process.env.B2_BUCKET_NAME}"` : 'Not configured',
    delivery: process.env.B2_PUBLIC_URL ? 'Direct from bucket / CDN' : 'Via this site (/api/media, cached 1 year)',
  };
}
