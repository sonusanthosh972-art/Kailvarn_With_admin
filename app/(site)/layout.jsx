import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import FloatingWhatsApp from '@/components/FloatingWhatsApp.jsx';
import ChatWidget from '@/components/ChatWidget.jsx';
import PromoProvider from '@/components/offers/PromoProvider.jsx';
import PromoAd from '@/components/offers/PromoAd.jsx';
import { businessJsonLd, jsonLdHtml } from '@/lib/seo.js';

// Public website chrome. The admin (app/admin) has its own layout.
export default function SiteLayout({ children }) {
  return (
    // overflow-x-clip: slide-in animations start off-screen (x: ±30px);
    // without this, phones get a sideways scroll. `clip` (not `hidden`)
    // keeps position: sticky working inside pages.
    // PromoProvider: site-wide advertisement settings (Admin -> Advertisement),
    // shared by the popup/side tab and the pages that mention the offer.
    <PromoProvider>
    <div className="flex flex-col min-h-screen overflow-x-clip">
      {/* Business details (services, area, hours) for Google and AI search */}
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(businessJsonLd())} />
      <Header />
      {/* Main content area offset for the fixed header */}
      <main className="flex-1 pt-[68px] lg:pt-[80px]">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <ChatWidget />
      <PromoAd />
    </div>
    </PromoProvider>
  );
}
