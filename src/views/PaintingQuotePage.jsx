'use client';

import Link from 'next/link';
import { CheckCircle, Palette, Phone, MessageCircle, ArrowRight } from 'lucide-react';

import PageHero from '@/components/kv/PageHero.jsx';
import Reveal from '@/components/kv/Reveal.jsx';
import PaintQuoteWizard from '@/components/offers/PaintQuoteWizard.jsx';
import Diya from '@/components/offers/Diya.jsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DIWALI_OFFER, DIWALI_HERO_IMAGE } from '@/constants/offers.js';
import { usePromo } from '@/components/offers/PromoProvider.jsx';

const included = [
  'Free site visit & colour advice at home',
  'Furniture and floor covered before work',
  'Wall prep: cracks filled, putty & primer as needed',
  'Trained, supervised painters',
  'Home cleaned up after the job',
  'Warranty on our work',
];

const steps = [
  { title: 'Request your quote', desc: 'Tap your answers above. It takes under a minute.' },
  { title: 'Free site visit', desc: 'Our expert checks your walls for damp and cracks and helps you pick colours.' },
  { title: 'Fixed written price', desc: 'You get an exact quote with your discount applied. No surprises later.' },
  { title: 'Painted & cleaned', desc: 'We paint on the agreed dates and hand over a clean home.' },
];

const faqs = (offer, promo) => [
  offer && {
    q: `Does the ${promo.discount}% off work with any paint brand?`,
    a: `Yes. Choose Asian Paints, Berger, Nerolac, Dulux, Nippon, Birla Opus or any brand you trust. The discount applies to our painting service, whichever brand you pick.`,
  },
  {
    q: 'Is the site visit really free?',
    a: 'Yes. Our expert visits, measures the walls, checks for damp or cracks and suggests colours. There is no charge and no obligation to book.',
  },
  {
    q: 'Will my house get messy?',
    a: 'We cover furniture and floors before starting and clean up after the work, so your family can keep living at home while we paint.',
  },
  {
    q: 'Will the final price change after work starts?',
    a: 'No. You get a fixed, written quote after the site visit. Anything extra is only done if you approve it in writing first.',
  },
  offer && {
    q: `Can you finish before ${promo.title}?`,
    a: `Slots before ${promo.title} are limited and booked in order. Request your quote early and we will confirm your dates at the site visit.`,
  },
].filter(Boolean);

export default function PaintingQuotePage() {
  const promo = usePromo();
  const offer = promo.active;

  return (
    <div className="bg-[#FAFAF7] text-[#111111]">
      <PageHero
        image={DIWALI_HERO_IMAGE.src}
        eyebrow={offer ? `${promo.title} Offer · ${promo.discount}% Off Painting` : 'Painting Quote'}
        title={offer ? `Claim ${promo.discount}% Off Your Home Painting` : 'Get a Quote for Your Home Painting'}
        emphasis="Home Painting"
        lead="Tell us about your walls in under a minute. Our painting expert visits for free, helps you choose colours and gives you a fixed written price."
        badges={['Free Site Visit', 'Any Paint Brand', 'Fixed Written Price']}
      />

      {/* ---- Form + sidebar ---- */}
      <section id="paint-quote" className="kv-section scroll-mt-24 bg-[#FAFAF7]">
        <div className="kv-wrap">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] gap-10 lg:gap-12 items-start">
            <Reveal>
              <div className="bg-white rounded-lg p-6 md:p-10 shadow-card border-t-[4px] border-[#D9A441]">
                <PaintQuoteWizard />
              </div>
            </Reveal>

            <Reveal delay={0.15} className="space-y-6">
              {offer && (
                <div className="kv-offer-aura rounded-lg border border-[#F2B21B]/60 bg-[linear-gradient(135deg,#3E080B_0%,#7A1418_55%,#3E080B_100%)] p-6 text-white">
                  <div className="flex items-center gap-3">
                    <Diya className="h-11 w-11 shrink-0" />
                    <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#F6D47C]">{promo.title} Special</p>
                  </div>
                  <p className="mt-3 font-serif text-[40px] font-bold leading-none text-[#FFD66B]">Flat {promo.discount}% Off</p>
                  <p className="mt-2 font-nunito text-[15px] leading-[1.6] text-white/85">
                    on painting services, with any paint brand you choose.
                  </p>
                  <p className="mt-4 border-t border-white/15 pt-4 font-nunito text-[13.5px] text-white/75">
                    Limited {promo.title} slots. Book your free site visit early.
                  </p>
                </div>
              )}

              <div className="rounded-lg border border-[#0B103B]/10 bg-white p-6">
                <h3 className="font-serif text-[22px] text-[#0B103B]">Every paint job includes</h3>
                <ul className="mt-4 space-y-3">
                  {included.map((item) => (
                    <li key={item} className="flex items-start gap-3 font-nunito text-[14.5px] leading-[1.55] text-[#2A2A2A]">
                      <CheckCircle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#D9A441]" strokeWidth={1.75} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-[#0B103B] p-6 text-white">
                <Palette className="h-7 w-7 text-[#F2B21B]" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-3 font-serif text-[22px]">Confused about colours?</h3>
                <p className="mt-2 font-nunito text-[14.5px] leading-[1.6] text-white/75">
                  Upload a photo of your room and see new shades on your own walls before you decide.
                </p>
                <Link href={DIWALI_OFFER.visualizerPath} className="btn-primary mt-5 w-full">
                  Try the Colour Visualizer <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="rounded-lg border border-[#0B103B]/10 bg-[#F5F1E8] p-5">
                <p className="font-nunito text-[15px] font-bold text-[#111111]">Rather talk to us?</p>
                <div className="mt-3 flex flex-col gap-1">
                  <a href="tel:8460150027" className="inline-flex min-h-[40px] items-center gap-2 font-nunito text-[15px] font-bold text-[#8A6A1C] hover:underline">
                    <Phone className="h-4 w-4" aria-hidden="true" /> Call 8460150027
                  </a>
                  <a
                    href={`https://wa.me/918460150027?text=${encodeURIComponent(`Hi KailVarn! I'd like a painting quote${offer ? ` with the ${promo.title} ${promo.discount}% offer` : ''}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[40px] items-center gap-2 font-nunito text-[15px] font-bold text-[#1A8F47] hover:underline"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp us
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section className="kv-section bg-[#F5F1E8]">
        <div className="kv-wrap">
          <Reveal as="h2" className="kv-subhead">How it works</Reveal>
          <div className="relative">
          <span className="absolute left-[12%] right-[12%] top-[54px] hidden h-px bg-[#D9A441]/60 lg:block" aria-hidden="true" />
          <ol className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 0.08} className="relative rounded-lg border border-[#0B103B]/10 bg-white p-6 text-center">
                <span className="mx-auto mb-5 flex h-[60px] w-[60px] items-center justify-center rounded-full border-4 border-white bg-[#F2B21B] font-serif text-[24px] font-bold text-[#0B103B] shadow-md">
                  {i + 1}
                </span>
                <h3 className="font-nunito text-[16px] font-bold text-[#0B103B]">{step.title}</h3>
                <p className="mt-2 font-nunito text-[15px] leading-[1.65] text-[#57534C]">{step.desc}</p>
              </Reveal>
            ))}
          </ol>
          </div>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className="kv-section bg-[#FAFAF7]">
        <div className="kv-wrap max-w-[860px]">
          <Reveal as="h2" className="kv-subhead">Questions families ask us</Reveal>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs(offer, promo).map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`} className="rounded-lg border border-[#0B103B]/10 bg-white px-5 sm:px-6">
                <AccordionTrigger className="py-5 text-left font-nunito text-[16px] font-bold text-[#0B103B] hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 font-nunito text-[15px] leading-[1.7] text-[#57534C]">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-10 text-center">
            <a href="#paint-quote" className="btn-primary">
              {offer ? `Claim ${promo.discount}% Off Now` : 'Get My Free Quote'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
