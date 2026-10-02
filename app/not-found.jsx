import Link from 'next/link';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export const metadata = {
  title: 'Page not found | KailVarn',
  robots: { index: false, follow: true },
};

const SUGGESTIONS = [
  { href: '/our-design', label: 'Our Design' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

// Every URL that matches no route lands here with a real 404 status. This
// used to be a catch-all route that rendered the homepage instead, so typos,
// /robots.txt, /sitemap.xml and bot probes all came back "200 OK" -- each one a
// fresh server render. Next serves this page prerendered, so they now cost
// nothing. It sits at the app root (outside the (site) group), so it brings
// the site header and footer with it.
export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-clip">
      <Header />
      <main className="flex-1 pt-[68px] lg:pt-[80px]">
        <section className="kv-section bg-[#FAFAF7]">
          <div className="kv-wrap max-w-2xl text-center">
            <span className="kv-eyebrow kv-eyebrow--center">Error 404</span>
            <h1 className="font-playfair font-medium text-[34px] md:text-[44px] lg:text-[54px] text-[#0B103B] leading-tight mb-5 tracking-[-0.015em]">
              We couldn&rsquo;t find that page
            </h1>
            <p className="font-nunito text-[16px] text-[#6B675F] leading-[1.8] mb-10">
              The link may be old, or the address may have a typo. Here are a few places to pick up from.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <Link href="/" className="btn-primary">Back to Home</Link>
              <Link href="/get-free-quote" className="btn-outline-dark">Get a Free Quote</Link>
            </div>
            <nav aria-label="Popular pages" className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-nunito text-[15px]">
              {SUGGESTIONS.map((s) => (
                <Link key={s.href} href={s.href} className="text-[#8A6A1C] underline underline-offset-4 hover:text-[#0B103B]">
                  {s.label}
                </Link>
              ))}
            </nav>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
