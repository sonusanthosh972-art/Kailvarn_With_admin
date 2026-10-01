import { Manrope, Playfair_Display } from 'next/font/google';
import './globals.css';
import MotionProvider from '@/components/kv/MotionProvider.jsx';

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

export const metadata = {
  title: {
    default: 'KailVarn - Complete Interior Design & Execution in Silvassa, Vapi',
    template: '%s',
  },
  description:
    'Transform Your Space Into Your Dream Home. Complete Interior Design & Execution — Full Home, Kitchen, Furniture & Painting. One Expert Team.',
};

// Root shell shared by the public site (app/(site)) and the admin (app/admin).
// Each of those groups adds its own chrome in its own layout.
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
