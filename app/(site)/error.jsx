'use client';

import { useEffect } from 'react';
import Link from 'next/link';

// Shown instead of a blank "Application error" screen when something on a
// page crashes. It renders inside the site layout, so the header, footer and
// WhatsApp button stay usable -- a visitor can still reach us.
export default function SiteError({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="kv-section bg-[#FAFAF7]">
      <div className="kv-wrap max-w-2xl text-center">
        <span className="kv-eyebrow kv-eyebrow--center">Something went wrong</span>
        <h1 className="font-playfair font-medium text-[32px] md:text-[42px] text-[#0B103B] leading-tight mb-5 tracking-[-0.015em]">
          This page didn&rsquo;t load properly
        </h1>
        <p className="font-nunito text-[16px] text-[#6B675F] leading-[1.8] mb-10">
          Please try again. If it keeps happening, you can still reach us from the contact page.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => retry()} className="btn-primary">Try again</button>
          <Link href="/contact" className="btn-outline-dark">Contact us</Link>
        </div>
      </div>
    </section>
  );
}
