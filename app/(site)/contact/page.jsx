import { pageMetadata, jsonLdHtml } from '@/lib/seo.js';
import { faqJsonLd } from '@/constants/faqs.js';
import ContactUsPage from '@/views/ContactUsPage.jsx';

export const metadata = pageMetadata({
  title: 'Contact Us – Interior Design in Silvassa & Vapi',
  description:
    'Call or WhatsApp KailVarn on 8460150027, or send an enquiry. Interior design and execution in Silvassa, Vapi, Daman and nearby areas. Open Mon–Sat, 9 AM–7 PM.',
  path: '/contact',
});

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(faqJsonLd())} />
      <ContactUsPage />
    </>
  );
}
