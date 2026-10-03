import { Manrope, Playfair_Display } from 'next/font/google';
import './globals.css';
import MotionProvider from '@/components/kv/MotionProvider.jsx';
import { siteUrl } from '@/server/siteUrl.js';
import { pageMetadata, SITE_NAME } from '@/lib/seo.js';

// Self-hosted by next/font (no external request, no layout shift). Exposed
// as CSS variables consumed by globals.css and tailwind.config.js.
const serif = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});
const sans = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

// Defaults for every page; public pages override them through pageMetadata().
// The canonical URL is left to each page so it never leaks to admin/404 pages.
const { alternates: _canonical, ...siteDefaults } = pageMetadata({
  absoluteTitle: 'Interior Designers in Silvassa & Vapi | KailVarn',
  description:
    'Complete home interiors in Silvassa, Vapi & Daman. Free 3D design, then one team builds it all: kitchen, furniture, ceiling, painting. Fixed written price.',
});

export const metadata = {
  metadataBase: new URL(siteUrl()),
  ...siteDefaults,
  title: {
    default: 'Interior Designers in Silvassa & Vapi | KailVarn',
    template: `%s | ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  formatDetection: { telephone: false },
};

// Root shell shared by the public site (app/(site)) and the admin (app/admin).
// Each of those groups adds its own chrome in its own layout.
export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
