import './globals.css';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import FloatingWhatsApp from '@/components/FloatingWhatsApp.jsx';

export const metadata = {
  title: {
    default: 'KailVarn - Complete Interior Design & Execution in Silvassa, Vapi',
    template: '%s',
  },
  description:
    'Transform Your Space Into Your Dream Home. Complete Interior Design & Execution — Full Home, Kitchen, Furniture & Painting. One Expert Team.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-screen">
          <Header />

          {/* Main content area offset for fixed header */}
          <main className="flex-1 pt-[60px] lg:pt-[72px]">{children}</main>

          <Footer />
          <FloatingWhatsApp />
        </div>
      </body>
    </html>
  );
}
