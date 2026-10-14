'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, UserX, Palette, Receipt, ShieldCheck, 
  Wallet, ClipboardList, Eye, PhoneCall, FileText, 
  Phone, Mail, Star, MapPin, Loader2, Lock, ArrowRight, House
} from 'lucide-react';
import PageHero from '@/components/kv/PageHero.jsx';
import EstimateWizard from '@/components/estimate/EstimateWizard.jsx';

function GetFreeQuotePage() {
  const scrollVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const usps = [
    { icon: UserX, title: "No Contractor Hassle", desc: "We handle everything from start to finish." },
    { icon: Palette, title: "Free Interior Designs Consultation", desc: "Professional design included at no extra cost." },
    { icon: Receipt, title: "No Hidden Cost", desc: "Detailed agreement before work begins." },
    { icon: CheckCircle, title: "Same-as-Design Execution", desc: "Final result matches 3D renders exactly." },
    { icon: ShieldCheck, title: "Warranty on Work", desc: "Formal warranty for peace of mind." },
    { icon: Wallet, title: "Affordable Pricing", desc: "Premium quality without breaking the bank." }
  ];

  const steps = [
    { icon: ClipboardList, title: "Get Your Instant Estimate", desc: "See an itemised price range for your home in under a minute." },
    { icon: PhoneCall, title: "Free Consultation Call", desc: "Our designer calls to understand your needs and style." },
    { icon: Eye, title: "Free Site Visit & 3D Design", desc: "We measure your home and design it in 3D before any work." },
    { icon: FileText, title: "Final Quote & Agreement", desc: "An exact, written quote with zero hidden cost." }
  ];

  const testimonials = [
    { name: "Dinesh Shah", city: "Silvassa", quote: "The quote was incredibly detailed. No hidden charges, and the final cost was exactly what was promised. Highly recommend KailVarn!" },
    { name: "Anita Joshi", city: "Vapi", quote: "I loved how transparent they were during the consultation. The free design service saved us a lot of money." },
    { name: "Suresh Patel", city: "Bhilad", quote: "Very professional team. They explained every line item in the quote so we knew exactly what we were paying for." }
  ];

  return (
    <div className="bg-[#FAFAF7] min-h-screen text-[#111111]">

      {/* 1. HERO SECTION */}
      <PageHero
        image="https://images.unsplash.com/photo-1698235459657-2b0189454dfb"
        eyebrow="Free Estimate Calculator"
        title="Get Your Interior Estimate in 60 Seconds"
        emphasis="Interior Estimate"
        lead="Answer five quick questions about your home and see an itemised estimate for every package, instantly."
        badges={['100% Free', 'Instant Estimate', 'No Hidden Cost']}
      />

      {/* 2. QUOTE FORM + TRUST SIDEBAR SECTION */}
      <section className="kv-section bg-[#FAFAF7]">
        <div className="kv-wrap">
          <div className="grid grid-cols-1 lg:grid-cols-[60%_1fr] gap-12">
            
            {/* LEFT COLUMN: Form */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
              <div className="bg-white rounded-lg p-6 md:p-[40px] shadow-card border-t-[4px] border-[#D9A441] relative overflow-hidden">
                <EstimateWizard />
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Sidebar */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } } }}>
              <h3 className="font-playfair font-medium text-[24px] text-[#0B103B] mb-2">Why Choose KailVarn?</h3>
              <p className="font-nunito text-[15px] text-[#57534C] mb-6">We eliminate the stress of home interiors.</p>

              <div className="space-y-3 mb-8">
                {usps.map((usp, idx) => (
                  <div key={idx} className="bg-white border border-[#0B103B]/10 rounded-lg p-4 flex items-center gap-4 hover:border-[#D9A441] transition-colors group">
                    <div className="w-[40px] h-[40px] rounded-lg bg-[#F2B21B]/10 flex items-center justify-center shrink-0 group-hover:bg-[#F2B21B] transition-colors">
                      <usp.icon className="w-[20px] h-[20px] text-[#D9A441] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-nunito font-bold text-[15px] text-[#111111] leading-tight mb-0.5">{usp.title}</h4>
                      <p className="font-nunito text-[14px] text-[#57534C] leading-[1.55]">{usp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-[#0B103B] p-5 sm:p-6 text-white shadow-[0_18px_40px_-24px_rgba(11,16,59,0.7)]">
                <h4 className="font-playfair text-[21px] leading-tight">Still have questions?</h4>
                <p className="mt-1 font-nunito text-[13.5px] text-white/65">Talk to our team, Mon–Sat, 9 AM – 7 PM.</p>
                <div className="mt-5 flex flex-col gap-2.5">
                  <a href="tel:8460150027" className="group flex min-h-[60px] items-center gap-3.5 rounded-lg border border-white/12 bg-white/[0.04] px-3.5 py-2.5 transition-colors hover:border-[#F2B21B]/60 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2B21B]">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2B21B] text-[#0B103B]">
                      <Phone className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-nunito text-[12px] font-bold uppercase tracking-[0.12em] text-white/55">Call us</span>
                      <span className="block font-nunito text-[16px] font-bold tabular-nums tracking-[0.02em] text-white">84601 50027</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-white/40 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-[#F2B21B]" aria-hidden="true" />
                  </a>
                  <a href="https://wa.me/918460150027?text=Hi%20KailVarn%2C%20I%20have%20a%20question%20about%20my%20interior%20estimate." target="_blank" rel="noreferrer" className="group flex min-h-[60px] items-center gap-3.5 rounded-lg border border-white/12 bg-white/[0.04] px-3.5 py-2.5 transition-colors hover:border-[#25D366]/70 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                      <WhatsAppIcon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-nunito text-[12px] font-bold uppercase tracking-[0.12em] text-white/55">WhatsApp</span>
                      <span className="block font-nunito text-[16px] font-bold text-white">Chat with our team</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-white/40 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-[#25D366]" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <ul className="mt-6 grid grid-cols-3 divide-x divide-[#0B103B]/10 rounded-xl border border-[#0B103B]/10 bg-white">
                {[
                  { icon: Star, label: '5-Star Service', fill: true },
                  { icon: House, label: '100+ Homes Delivered' },
                  { icon: MapPin, label: 'Silvassa & Vapi' },
                ].map(({ icon: Icon, label, fill }) => (
                  <li key={label} className="flex flex-col items-center gap-1.5 px-2 py-4 text-center">
                    <Icon className={`h-5 w-5 text-[#D9A441] ${fill ? 'fill-[#F2B21B]' : ''}`} strokeWidth={1.75} aria-hidden="true" />
                    <span className="font-nunito text-[12.5px] font-semibold leading-tight text-[#2A2A2A]">{label}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-[72px] lg:py-[104px] bg-[#F5F1E8]">
        <div className="kv-wrap">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants} className="text-center mb-12">
            <h3 className="font-playfair font-medium text-[30px] md:text-[40px] lg:text-[46px] text-[#0B103B] mb-3">What Happens After Your Estimate?</h3>
            <p className="font-nunito text-[16px] text-[#57534C] max-w-2xl mx-auto">A simple, transparent process to get your project started.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-[54px] left-[12%] right-[12%] h-px bg-[#D9A441]/60 z-0"></div>

            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: idx * 0.1 } } }}
                className="bg-white rounded-lg p-[24px] shadow-sm border border-[#0B103B]/10 relative z-10 text-center hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-[60px] h-[60px] bg-[#F2B21B] rounded-full flex items-center justify-center mx-auto mb-5 text-[#0B103B] font-playfair font-bold text-[24px] shadow-md border-4 border-white">
                  {idx + 1}
                </div>
                <h4 className="font-nunito font-bold text-[16px] text-[#0B103B] mb-2">{step.title}</h4>
                <p className="font-nunito text-[15px] text-[#57534C] leading-[1.7]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DIRECT CONTACT OPTIONS SECTION */}
      <section className="py-[72px] lg:py-[104px] bg-white">
        <div className="kv-wrap">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants} className="text-center mb-12">
            <h3 className="font-playfair font-medium text-[30px] md:text-[40px] lg:text-[46px] text-[#0B103B] mb-3">Prefer to Contact Directly?</h3>
            <p className="font-nunito text-[16px] text-[#57534C] max-w-2xl mx-auto">Skip the form and reach out to us right now.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Call Card */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="bg-[#FAFAF7] rounded-lg p-8 text-center border border-[#0B103B]/10 hover:shadow-md transition-shadow">
              <div className="w-[60px] h-[60px] bg-[#F2B21B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-[28px] h-[28px] text-[#D9A441]" />
              </div>
              <h4 className="font-nunito font-bold text-[18px] text-[#111111] mb-1">Call Us Directly</h4>
              <a href="tel:8460150027" className="block font-playfair font-bold text-[24px] text-[#8A6A1C] mb-2 hover:underline">8460150027</a>
              <p className="font-nunito text-[14px] text-[#57534C] mb-6">Mon–Sat, 9 AM – 7 PM</p>
              <a href="tel:8460150027" className="btn-primary w-full">
                📞 Tap to Call
              </a>
            </motion.div>

            {/* WhatsApp Card */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } } }} className="bg-[#FAFAF7] rounded-lg p-8 text-center border border-[#0B103B]/10 hover:shadow-md transition-shadow">
              <div className="w-[60px] h-[60px] bg-[#25D366]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircleIcon className="w-[28px] h-[28px] text-[#25D366]" />
              </div>
              <h4 className="font-nunito font-bold text-[18px] text-[#111111] mb-1">WhatsApp Us</h4>
              <a href="https://wa.me/918460150027" target="_blank" rel="noreferrer" className="block font-playfair font-bold text-[24px] text-[#25D366] mb-2 hover:underline">8460150027</a>
              <p className="font-nunito text-[14px] text-[#57534C] mb-6">Quick response guaranteed</p>
              <a href="https://wa.me/918460150027?text=Hi KailVarn, I'd like a free interior quote." target="_blank" rel="noreferrer" className="kv-btn w-full bg-[#25D366] hover:bg-[#1FB457] text-white">
                💬 Chat on WhatsApp
              </a>
            </motion.div>

            {/* Email Card */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } } }} className="bg-[#FAFAF7] rounded-lg p-8 text-center border border-[#0B103B]/10 hover:shadow-md transition-shadow">
              <div className="w-[60px] h-[60px] bg-[#0B103B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-[28px] h-[28px] text-[#0B103B]" />
              </div>
              <h4 className="font-nunito font-bold text-[18px] text-[#111111] mb-1">Email Us</h4>
              <a href="mailto:kailvarn0@gmail.com" className="block font-playfair font-bold text-[20px] text-[#0B103B] mb-2 hover:underline truncate">kailvarn0@gmail.com</a>
              <p className="font-nunito text-[14px] text-[#57534C] mb-6">Response within 24 hours</p>
              <a href="mailto:kailvarn0@gmail.com" className="btn-outline-dark w-full">
                ✉️ Send Email
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. MINI TESTIMONIALS SECTION */}
<section className="py-[72px] lg:py-[104px] bg-[#F5F1E8]">
  <div className="kv-wrap">

    {/* Section Heading */}
    <div className="text-center mb-12">
      <h3 className="font-playfair font-medium text-[30px] md:text-[40px] lg:text-[46px] leading-[1.15] text-[#0B103B] mb-4">
        What Clients Say After Getting Their Quote
      </h3>

      <p className="font-nunito text-[15px] md:text-[16px] text-[#57534C] max-w-[650px] mx-auto leading-relaxed">
        Genuine feedback from homeowners and businesses who trusted KailVarn for their interior journey.
      </p>
    </div>

    {/* Testimonial Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">

      {testimonials.map((test, idx) => (
        <motion.div
          key={idx}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                delay: idx * 0.1
              }
            }
          }}
          className="bg-white rounded-lg p-7 md:p-8 shadow-sm border border-[#0B103B]/10 hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between"
        >

          {/* Quote */}
          <div className="mb-7">
            <p className="font-nunito text-[16px] text-[#2A2A2A] italic leading-[1.85]">
              "{test.quote}"
            </p>
          </div>

          {/* Client Info */}
          <div className="flex items-center gap-4 pt-4 border-t border-[#0B103B]/10">

            {/* Avatar */}
            <div className="w-11 h-11 rounded-full bg-[#0B103B] text-white flex items-center justify-center font-playfair font-bold text-[17px] shrink-0">
              {test.name.charAt(0)}
            </div>

            {/* Name + City */}
            <div>
              <h5 className="font-nunito font-bold text-[15px] text-[#111111] leading-tight">
                {test.name}
              </h5>

              <p className="font-nunito text-[13px] text-[#57534C] mt-1">
                {test.city}
              </p>
            </div>

          </div>

        </motion.div>
      ))}

    </div>
  </div>
</section>

    </div>
  );
}

// Helper icon component
function MessageCircleIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
    </svg>
  );
}

// WhatsApp brand mark (lucide has no WhatsApp logo).
function WhatsAppIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 8.23 8.24c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06a6.7 6.7 0 0 1-1.99-1.23 7.5 7.5 0 0 1-1.38-1.72c-.14-.25 0-.38.11-.5.11-.11.25-.29.37-.44.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  );
}

export default GetFreeQuotePage;
