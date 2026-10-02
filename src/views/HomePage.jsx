'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ChefHat, Armchair, Paintbrush as PaintRoller, Users, PencilRuler, FileText, CheckSquare, Umbrella, ShieldCheck, BadgeIndianRupee, PenTool, FileSignature, Hammer, CircleCheck, MessageCircle, Gift, Zap, Phone, Mail, Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

import { useWhatsAppLink } from '@/hooks/useWhatsAppLink.js';
import Reveal, { ImageReveal } from '@/components/kv/Reveal.jsx';
import SectionHeading from '@/components/kv/SectionHeading.jsx';

// --- DATA CONSTANTS ---

const services = [
  {
    id: 'full-home',
    title: 'Full Home Interior',
    ctaText: 'Explore Full Home Interior',
    desc: 'Complete transformation — design to execution. Flooring, false ceiling, lighting, furniture, kitchen, painting, plumbing, civil work & all under one team.',
    img: 'https://images.unsplash.com/photo-1673935144761-57a1c4b1933f',
    icon: Home,
    usps: ['Design + Execution one team', 'No hidden cost', 'Warranty on work']
  },
  {
    id: 'kitchen',
    title: 'Kitchen Interior',
    ctaText: 'Explore Kitchen Interior',
    desc: 'Modern modular kitchens built to last. Furniture, countertop, plumbing, electrical work — done right, done once.',
    img: '/Kitchen.jpeg',
    icon: ChefHat,
    usps: ['Modular + civil work', 'Quality materials', 'On-time delivery']
  },
  {
    id: 'furniture',
    title: 'Custom Furniture',
    ctaText: 'Explore Custom Furniture',
    desc: 'Custom-made beds, wardrobes, racks, partitions & all wooden work — crafted to fit your exact space and style.',
    img: 'https://images.unsplash.com/photo-1697550077312-ff2e9d3603f3',
    icon: Armchair,
    usps: ['Custom to your space', 'Premium wood & finish', 'Guaranteed quality']
  },
  {
    id: 'painting',
    title: 'Painting and Wall Finishes',
    ctaText: 'Explore Painting and Wall Finishes',
    desc: 'Flawless walls. We handle crack repair, dampness treatment, texture finishes, and complete painting with warranty.',
    img: 'https://images.unsplash.com/photo-1561022775-cd329b9cc314',
    icon: PaintRoller,
    usps: ['Crack & damp repair first', 'Texture & designer finishes', 'Long-lasting warranty']
  }
];

const whyUsData = [
  { icon: Users, title: 'One Collaborative Expert Team', desc: "No juggling between multiple contractors. KailVarn's one expert team handles design, civil, electrical, carpentry, painting — all under one roof." },
  { icon: PencilRuler, title: 'Free Interior Designer — No Extra Fees', desc: "Our interior designer is part of our team — included at zero extra cost. No need to hire a separate designer and pay lakhs separately." },
  { icon: FileText, title: 'Work on Agreement — Zero Hidden Cost', desc: "Everything is written in the agreement — what you see is what you pay. No surprise charges, no extra bills after completion." },
  { icon: CheckSquare, title: 'Exact Same Execution as Design', desc: "We use modern tools and a trained team to ensure your final home looks exactly like the 3D design — no compromises, no shortcuts." },
  { icon: Umbrella, title: 'No Contractor Headache', desc: "No running after multiple contractors for each work. We handle everything — you just relax and trust the process." },
  { icon: ShieldCheck, title: 'Warranty on Work — Peace of Mind', desc: "We stand behind our work. KailVarn provides warranty and guarantee on required work so you live worry-free after delivery." }
];

const processSteps = [
  { num: '01', icon: PenTool, title: 'We Understand & Design', desc: 'Our in-house designer understands your vision, budget, and requirements. We create detailed 3D designs and layouts — completely free of cost.', badge: 'FREE' },
  { num: '02', icon: FileSignature, title: 'Transparent Agreement', desc: 'We prepare a clear written agreement — exact materials, costs, timeline, and deliverables. No verbal promises. No surprises later.', badge: 'ZERO HIDDEN COST' },
  { num: '03', icon: Hammer, title: 'Expert Execution', desc: 'Our collaborative expert team starts execution using modern tools, exactly as per the agreed design. Civil, carpentry, painting, electrical — all by one team.', badge: 'ONE TEAM' },
  { num: '04', icon: Home, title: 'Delivery with Warranty', desc: 'We deliver your completed space, do a walkthrough inspection, and hand over with warranty and guarantee on all required work.', badge: 'WITH WARRANTY' }
];

// "Designer Only" = you hire a separate interior designer (paid design, no execution).
// "Contractor Only" = you hire a contractor (execution only, no design).
const comparisonTable = [
  { feature: 'Interior Design Provided', kailvarn: '✅ Free', designer: '✅ Paid (expensive)', contractor: '❌ Not included' },
  { feature: 'Execution of Work', kailvarn: '✅ Yes — full', designer: '❌ You manage contractors', contractor: '✅ Yes (labour only)' },
  { feature: 'Single Point of Contact', kailvarn: '✅ One team', designer: '❌ Multiple', contractor: '❌ Multiple' },
  { feature: 'Hidden Cost Risk', kailvarn: '✅ Zero — agreement', designer: '⚠️ Medium risk', contractor: '⚠️ High risk' },
  { feature: 'Design Matches Execution', kailvarn: '✅ Guaranteed', designer: '⚠️ Often mismatch', contractor: '❌ Rarely matches' },
  { feature: 'Warranty on Work', kailvarn: '✅ Yes', designer: '❌ Not applicable', contractor: '❌ Usually no' },
  { feature: 'Affordable Pricing', kailvarn: '✅ Yes', designer: '❌ Costly', contractor: '⚠️ Depends' },
  { feature: 'Modern Tools Used', kailvarn: '✅ Yes', designer: '❌ Not their scope', contractor: '⚠️ Varies' },
  { feature: 'Agreement Signed', kailvarn: '✅ Always', designer: '⚠️ Consultation only', contractor: '❌ Rarely' },
  { feature: 'Stress-Free Experience', kailvarn: '✅ Complete', designer: '⚠️ Partial', contractor: '❌ Stressful' }
];

// TODO: replace these stock photos with real KailVarn project photos
// (ideally before/after pairs) and add the client's area to each caption.
const recentProjects = [
  { img: 'https://images.unsplash.com/photo-1680007889201-114ac772447d', title: 'Open-Plan Living & Kitchen', tag: 'Full Home' },
  { img: '/Kitchen.jpeg', title: 'Modular Kitchen', tag: 'Kitchen' },
  { img: 'https://images.unsplash.com/photo-1668586704152-36f3504f9823', title: 'Living Room with Wall Panelling', tag: 'Full Home' },
  { img: 'https://images.unsplash.com/photo-1697550077312-ff2e9d3603f3', title: 'Bedroom Wardrobe', tag: 'Furniture' },
  { img: 'https://images.unsplash.com/photo-1561022775-cd329b9cc314', title: 'Textured Feature Wall', tag: 'Painting' },
  { img: 'https://images.unsplash.com/photo-1558442086-8ea19a79cd4d', title: 'Living Room & False Ceiling', tag: 'Full Home' }
];

const heroTrustBadges = [
  { icon: '🏆', text: '100+ Homes Delivered' },
  { icon: '🛡️', text: '5-Year Warranty' },
  { icon: '📍', text: 'Serving Silvassa & Vapi' }
];

const testimonials = [
  { text: "KailVarn ne humara poora ghar transform kar diya — bilkul waise hi jaisa design mein dikhaya tha. Ek bhi paisa extra nahi liya. Best decision tha.", author: "Rajesh Patel", location: "Silvassa", service: "Full Home" },
  { text: "Kitchen renovation ke liye bahut sari jagah quote liya, lekin KailVarn ne best quality diya affordable price mein aur koi hidden charge nahi. Very happy!", author: "Priya Shah", location: "Vapi", service: "Kitchen" },
  { text: "Wardrobe and bedroom furniture made by KailVarn is outstanding. Exactly what I wanted. Quality is top class. Highly recommend.", author: "Amit Desai", location: "Silvassa", service: "Furniture" },
  { text: "Painting aur texture work itna sundar hua ki sab neighbour poochh rahe hain. Crack repair bhi properly kiya — no short cuts.", author: "Neha Joshi", location: "Vapi", service: "Painting" },
  { text: "Pehle main nervous tha ki itna kaam kaun sambhalega. KailVarn ne ek hi team se poora kaam kiya — no headache at all. Thank you KailVarn!", author: "Suresh Mehta", location: "Silvassa", service: "Full Home" },
  { text: "Commercial office ka interior KailVarn ne kiya — modern, professional aur budget mein. Clients aur staff dono impress hain.", author: "Disha Trivedi", location: "Vapi", service: "Commercial" },
  { text: "Designer aur contractor ke paise alag alag nahi dene pade. KailVarn mein sab included tha. Transparent aur on-time delivery. 5 stars.", author: "Kiran Rao", location: "Silvassa", service: "Full Home" }
];


// Unsplash serves any width on request; asking for roughly the rendered size
// keeps the page fast. Local images are returned unchanged.
const sized = (url, w) => (url.startsWith('https://images.unsplash.com') ? `${url}?auto=format&fit=crop&w=${w}&q=78` : url);

const EASE = [0.16, 1, 0.3, 1];

const heroBadgeIcons = [PencilRuler, FileText, CheckSquare, Umbrella, ShieldCheck, BadgeIndianRupee];
const heroBadges = ['Free Interior Designer', 'No Hidden Cost', 'Same-as-Design Execution', 'No Contractor Hassle', 'Warranty on Work', 'Affordable Pricing'];

// Asymmetric portfolio layout: wide / standard / tall, repeating.
const projectLayout = [
  'lg:col-span-8 lg:row-span-1',
  'lg:col-span-4 lg:row-span-2',
  'lg:col-span-4',
  'lg:col-span-4',
  'lg:col-span-4 lg:row-span-1',
  'lg:col-span-8',
];

function TestimonialSlider() {
  const [index, setIndex] = useState(0);
  const count = testimonials.length;
  const go = (dir) => setIndex((i) => (i + dir + count) % count);

  return (
    <div className="max-w-[880px] mx-auto text-center">
      <span className="block font-serif text-[110px] leading-[0.6] text-[#F2B21B] mb-8 select-none" aria-hidden="true">&ldquo;</span>

      {/* Every quote sits in the same grid cell, so the block is always as
          tall as the longest quote — switching never shifts the page. */}
      <div className="grid" aria-live="polite">
        {testimonials.map((test, i) => (
          <figure
            key={test.author}
            aria-hidden={i !== index}
            className={`[grid-area:1/1] transition-[opacity,transform] duration-700 ease-kv-expo ${
              i === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <div className="flex justify-center gap-1 mb-7" role="img" aria-label="Rated 5 out of 5 stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-[18px] h-[18px] text-[#F2B21B] fill-[#F2B21B]" aria-hidden="true" />
              ))}
            </div>
            <blockquote className="font-serif italic text-[22px] sm:text-[27px] lg:text-[33px] leading-[1.5] text-[#0B103B]">
              "{test.text}"
            </blockquote>
            <figcaption className="mt-9">
              <span className="block text-[13.5px] font-extrabold uppercase tracking-[0.24em] text-[#0B103B]">{test.author}</span>
              <span className="block mt-1.5 text-[14px] tracking-[0.06em] text-[#6B675F]">
                {test.location} | {test.service}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="flex items-center justify-center gap-6 mt-12">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous testimonial"
          className="w-[52px] h-[52px] rounded-full border border-[#0B103B]/25 text-[#0B103B] flex items-center justify-center hover:bg-[#0B103B] hover:text-white hover:border-[#0B103B] transition-colors duration-300"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={1.75} />
        </button>
        <div className="flex items-center gap-2.5">
          {testimonials.map((test, i) => (
            <button
              key={test.author}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial from ${test.author}`}
              aria-current={i === index}
              className="p-1.5"
            >
              <span className={`block h-2 rounded-full transition-all duration-500 ease-kv-expo ${i === index ? 'w-6 bg-[#D9A441]' : 'w-2 bg-[#0B103B]/20'}`} />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next testimonial"
          className="w-[52px] h-[52px] rounded-full border border-[#0B103B]/25 text-[#0B103B] flex items-center justify-center hover:bg-[#0B103B] hover:text-white hover:border-[#0B103B] transition-colors duration-300"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { openWhatsApp } = useWhatsAppLink();

  return (
    <div className="bg-[#FAFAF7] text-[#111111]">
      {/* ============ HERO ============ */}
      <section className="relative isolate flex items-end min-h-[calc(100svh-68px)] lg:min-h-[calc(100svh-80px)] overflow-hidden bg-[#070A25] text-white">
        <div className="absolute inset-0 -z-10">
          <img
            src={sized('https://images.unsplash.com/photo-1673935144761-57a1c4b1933f', 2000)}
            alt=""
            fetchPriority="high"
            className="kv-settle w-full h-full object-cover"
          />
          {/* Two shades: bottom-heavy for the text block, plus a left-side
              wash so the copy stays readable over bright ceilings/lights. */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,37,0.55)_0%,rgba(7,10,37,0.3)_30%,rgba(7,10,37,0.72)_70%,rgba(7,10,37,0.94)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,10,37,0.7)_0%,rgba(7,10,37,0.35)_45%,rgba(7,10,37,0)_75%)]" />
        </div>

        <div className="kv-wrap w-full pt-24 pb-14 lg:pt-32 lg:pb-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-4 mb-7 text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.3em] text-[#F2B21B]"
          >
            <span className="kv-draw block w-11 h-[2px] bg-[#F2B21B] shrink-0" style={{ animationDelay: '0.3s' }} aria-hidden="true" />
            Silvassa's and Vapi's Trusted Interior Experts
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
            className="kv-h1 max-w-[13em] text-white text-shadow-sm"
          >
            Transform Your Space Into Your <em className="text-[#F6D47C]">Dream Home</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
            className="mt-7 max-w-[600px] text-[16px] sm:text-[18px] leading-[1.75] text-white/80"
          >
            Complete Interior Design & Execution — Full Home, Kitchen, Furniture & Painting. One Expert Team. Exact Same Execution. No Hidden Cost.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link href="/book-consultation" className="btn-primary w-full sm:w-auto">
              Book Free Consultation
            </Link>
            <button type="button" onClick={() => openWhatsApp()} className="btn-outline w-full sm:w-auto">
              <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.75} /> WhatsApp Us
            </button>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="mt-12 lg:mt-14 pt-6 border-t border-white/20 max-w-[680px] flex flex-col sm:flex-row flex-wrap gap-y-2.5 sm:gap-x-0 text-[12px] sm:text-[12.5px] font-bold uppercase tracking-[0.16em] text-white/80"
          >
            {heroTrustBadges.map((badge, i) => (
              <li key={badge.text} className="flex items-center">
                {i > 0 && <span className="hidden sm:block mx-4 w-1 h-1 rounded-full bg-[#F2B21B]" aria-hidden="true" />}
                <span className="mr-2" aria-hidden="true">{badge.icon}</span>
                {badge.text}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Architectural scroll cue — a thin gold line, desktop only */}
        <div className="hidden lg:flex absolute right-10 bottom-0 flex-col items-center gap-4 pb-6" aria-hidden="true">
          <span className="w-px h-16 bg-gradient-to-b from-[#F2B21B] to-transparent" />
        </div>
      </section>

      {/* ============ TRUST STRIP ============ */}
      <section className="bg-[#0B103B] border-t border-[#F2B21B]/30" aria-label="Why homeowners choose KailVarn">
        <ul className="kv-wrap grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-x-6 gap-y-5 py-7 lg:py-8">
          {heroBadges.map((badge, i) => {
            const Icon = heroBadgeIcons[i];
            return (
              <li key={badge} className="flex items-center gap-3 text-[11.5px] sm:text-[12px] font-bold uppercase tracking-[0.1em] leading-snug text-white/85">
                <Icon className="w-[22px] h-[22px] shrink-0 text-[#F2B21B]" strokeWidth={1.5} aria-hidden="true" />
                {badge}
              </li>
            );
          })}
        </ul>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="kv-section bg-[#F5F1E8]">
        <div className="kv-wrap">
          <SectionHeading
            eyebrow="What We Offer"
            title="Our Interior Services"
            emphasis="Services"
            lead="From full home transformation to a single wall — we handle everything under one expert roof."
            split
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-16">
            {services.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <Reveal key={svc.id} delay={(i % 2) * 0.12} className={i % 2 === 1 ? 'md:mt-20' : ''}>
                  <article className="group flex flex-col h-full">
                    <Link href={`/services#${svc.id}`} className="block relative overflow-hidden rounded-md bg-[#0B103B] aspect-[4/3]" tabIndex={-1} aria-hidden="true">
                      <img
                        src={sized(svc.img, 1200)}
                        alt=""
                        loading="lazy"
                        className="kv-photo w-full h-full object-cover"
                      />
                      <span className="absolute left-5 bottom-5 w-12 h-12 rounded-full bg-[#FAFAF7]/95 flex items-center justify-center shadow-[0_10px_24px_-12px_rgba(7,10,37,0.6)]">
                        <Icon className="w-[22px] h-[22px] text-[#8A6A1C]" strokeWidth={1.5} />
                      </span>
                    </Link>
                    <div className="pt-7 flex flex-col flex-1">
                      <h3 className="font-serif text-[28px] lg:text-[34px] leading-tight text-[#0B103B]">
                        <Link href={`/services#${svc.id}`} className="hover:text-[#8A6A1C] transition-colors">{svc.title}</Link>
                      </h3>
                      <p className="mt-3 text-[15.5px] leading-[1.75] text-[#6B675F] max-w-[34em]">{svc.desc}</p>
                      <ul className="list-none p-0 mt-5 mb-7 border-t border-[#0B103B]/10">
                        {svc.usps.map((usp) => (
                          <li key={usp} className="flex items-center gap-3 py-3 border-b border-[#0B103B]/10 text-[14px] font-semibold tracking-[0.02em] text-[#0B103B]">
                            <CircleCheck className="w-[18px] h-[18px] shrink-0 fill-[#F2B21B] text-[#FAFAF7]" aria-hidden="true" />
                            {usp}
                          </li>
                        ))}
                      </ul>
                      {/* Clear call to action: opens this service's full details on the Services page */}
                      <Link
                        href={`/services#${svc.id}`}
                        className="btn-outline-dark mt-auto w-full sm:w-auto sm:self-start !min-h-[54px] !px-6 !text-[13.5px] group-hover:border-[#0B103B]"
                      >
                        {svc.ctaText}
                        <ArrowRight className="kv-arrow w-[18px] h-[18px] shrink-0 group-hover:translate-x-1" strokeWidth={2} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ RECENT PROJECTS ============ */}
      <section className="kv-section bg-[#070A25] text-white">
        <div className="kv-wrap">
          <SectionHeading
            dark
            eyebrow="Our Work"
            title="Recent Projects"
            emphasis="Projects"
            lead="Real spaces designed and executed by one KailVarn team — exactly as designed."
            split
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[300px] gap-4 lg:gap-5">
            {recentProjects.map((project, i) => (
              <Reveal key={project.title} delay={(i % 3) * 0.08} className={`${projectLayout[i % projectLayout.length]} min-h-[280px] sm:min-h-[300px]`}>
                <figure className="group relative h-full overflow-hidden rounded-md bg-[#11184D] m-0">
                  <img
                    src={sized(project.img, 1200)}
                    alt={project.title}
                    loading="lazy"
                    className="kv-photo absolute inset-0 w-full h-full object-cover"
                  />
                  <figcaption className="absolute inset-0 flex flex-col justify-end p-6 lg:p-7 bg-gradient-to-t from-[#070A25]/85 via-[#070A25]/20 to-transparent lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 ease-kv-out">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#F2B21B] mb-2">{project.tag}</span>
                    <span className="font-serif text-[22px] lg:text-[26px] leading-snug text-white">{project.title}</span>
                    <span className="block mt-3 h-[2px] w-16 bg-[#F2B21B] origin-left lg:scale-x-0 lg:group-hover:scale-x-100 transition-transform duration-500 delay-100 ease-kv-out" aria-hidden="true" />
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 lg:mt-14 flex justify-center">
            <Link href="/our-design" className="btn-outline w-full sm:w-auto">
              View All Designs <ArrowRight className="kv-arrow w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ WHY KAILVARN ============ */}
      <section className="kv-section bg-[#FAFAF7]">
        <div className="kv-wrap grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-20 items-start">
          <div className="lg:sticky lg:top-[120px]">
            <SectionHeading
              eyebrow="Our Advantage"
              title="Why Choose KailVarn?"
              emphasis="KailVarn?"
              lead="We're not just a design firm. Not just a contractor. We're your complete interior partner — from first sketch to final delivery."
              className="!mb-10"
            />
            <ImageReveal className="relative hidden lg:block">
              <img
                src={sized('https://images.unsplash.com/photo-1668586704152-36f3504f9823', 1100)}
                alt="A finished KailVarn-style living room with wall panelling"
                loading="lazy"
                className="w-full h-[420px] object-cover rounded-md"
              />
              {/* Architectural corner marks */}
              <span className="absolute -left-3 -top-3 w-10 h-10 border-l border-t border-[#D9A441]" aria-hidden="true" />
              <span className="absolute -right-3 -bottom-3 w-10 h-10 border-r border-b border-[#D9A441]" aria-hidden="true" />
            </ImageReveal>
          </div>

          <ul className="border-t border-[#0B103B]/12">
            {whyUsData.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal as="li" key={item.title} delay={Math.min(i, 3) * 0.06} y={16} className="grid grid-cols-[56px_1fr] sm:grid-cols-[72px_1fr] gap-5 sm:gap-6 py-8 lg:py-9 border-b border-[#0B103B]/12">
                  <span className="w-14 h-14 rounded-full border border-[#D9A441]/60 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#8A6A1C]" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-sans font-extrabold text-[19px] lg:text-[21px] tracking-[0.01em] text-[#0B103B] mb-2">{item.title}</h3>
                    <p className="text-[15.5px] leading-[1.75] text-[#6B675F] max-w-[34em]">{item.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ============ HOW WE WORK ============ */}
      <section className="kv-section bg-[#F5F1E8] overflow-hidden">
        <div className="kv-wrap">
          <SectionHeading
            eyebrow="Our Process"
            title="How KailVarn Works"
            emphasis="Works"
            lead="A simple, transparent 4-step process — from understanding your vision to delivering your dream space."
            split
          />

          <div className="relative">
            {/* The gold line draws across once the steps are in view */}
            <div className="hidden lg:block absolute top-[27px] left-0 right-0 h-px bg-[#0B103B]/15" aria-hidden="true" />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '0px 0px -20% 0px' }}
              transition={{ duration: 1.6, ease: EASE }}
              className="hidden lg:block absolute top-[27px] left-0 right-0 h-px bg-[#D9A441] origin-left"
              aria-hidden="true"
            />

            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12 relative">
              {processSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <Reveal as="li" key={step.num} delay={0.2 + i * 0.12} y={18}>
                    <span className="relative w-[54px] h-[54px] rounded-full bg-[#F5F1E8] border border-[#D9A441] flex items-center justify-center font-serif text-[19px] text-[#0B103B] mb-7">
                      <span className="absolute inset-[6px] rounded-full border border-[#D9A441]/50" aria-hidden="true" />
                      {step.num}
                    </span>
                    <span className="block text-[11px] font-extrabold uppercase tracking-[0.26em] text-[#8A6A1C] mb-3">{step.badge}</span>
                    <h3 className="flex items-center gap-2.5 font-sans font-extrabold text-[20px] text-[#0B103B] mb-3">
                      <Icon className="w-5 h-5 text-[#D9A441] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                      {step.title}
                    </h3>
                    <p className="text-[15px] leading-[1.75] text-[#6B675F]">{step.desc}</p>
                  </Reveal>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* ============ COMPARISON ============ */}
      <section className="kv-section bg-[#0B103B] text-white">
        <div className="kv-wrap">
          <SectionHeading
            dark
            align="center"
            eyebrow="How We Are Different"
            title="KailVarn vs Designer vs Contractor"
            lead="Understand why KailVarn is the smarter, better, more complete choice for your interior project."
          />
          <p className="lg:hidden -mt-6 mb-6 text-center text-[12px] font-bold uppercase tracking-[0.2em] text-[#F2B21B]">
            Swipe the table to compare →
          </p>

          <Reveal className="overflow-x-auto hide-scrollbar rounded-lg border border-white/12">
            <table className="w-full min-w-[680px] text-left border-collapse">
              <thead>
                <tr className="text-[11.5px] font-extrabold uppercase tracking-[0.16em]">
                  <th scope="col" className="sticky left-0 z-10 bg-[#11184D] py-5 px-4 md:px-6 text-white/80 w-[28%]">Feature</th>
                  <th scope="col" className="py-5 px-4 md:px-6 bg-[#F2B21B] text-[#0B103B] w-[24%] border-x border-[#F2B21B]">KailVarn</th>
                  <th scope="col" className="py-5 px-4 md:px-6 bg-[#11184D] text-white/80 w-[24%]">Designer Only</th>
                  <th scope="col" className="py-5 px-4 md:px-6 bg-[#11184D] text-white/80 w-[24%]">Contractor Only</th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((row) => (
                  <tr key={row.feature} className="border-t border-white/10 text-[14px] md:text-[15px]">
                    <th scope="row" className="sticky left-0 z-10 bg-[#0B103B] py-4 px-4 md:px-6 font-bold text-white">{row.feature}</th>
                    <td className="py-4 px-4 md:px-6 font-bold text-white bg-white/[0.05] border-x border-[#F2B21B]/45">{row.kailvarn}</td>
                    <td className="py-4 px-4 md:px-6 text-white/65">{row.designer}</td>
                    <td className="py-4 px-4 md:px-6 text-white/65">{row.contractor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          <div className="mt-12 text-center">
            <Link href="/get-free-quote" className="btn-outline w-full sm:w-auto">
              Get Free Quote — See the Difference
            </Link>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="kv-section bg-[#FAFAF7]">
        <div className="kv-wrap">
          <SectionHeading
            align="center"
            eyebrow="Client Love"
            title="What Our Clients Say"
            lead="Real words from real clients — families and businesses who trusted KailVarn for their interiors."
          />
          <Reveal>
            <TestimonialSlider />
          </Reveal>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="relative isolate overflow-hidden bg-[#070A25] text-white py-28 lg:py-36">
        {/* Architectural rings */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <span className="absolute w-[520px] h-[520px] rounded-full border border-[#F2B21B]/15" />
          <span className="absolute w-[800px] h-[800px] rounded-full border border-[#F2B21B]/[0.08]" />
          <span className="absolute w-[1100px] h-[1100px] rounded-full border border-[#F2B21B]/[0.05]" />
        </div>

        <div className="kv-wrap text-center flex flex-col items-center">
          <Reveal className="flex flex-col items-center">
            <span className="kv-eyebrow kv-eyebrow--center kv-eyebrow--dark">Start Your Journey</span>
            <h2 className="kv-h1 !text-[clamp(38px,5.4vw,72px)] max-w-[12em] text-white">
              Ready to Create Your <em className="text-[#F6D47C]">Dream Interior?</em>
            </h2>
            <p className="mt-6 max-w-[580px] text-[16px] sm:text-[17px] leading-[1.75] text-white/70">
              Get a FREE consultation and transparent quotation — no commitment, no pressure. Our expert team is ready to understand your vision and turn it into reality.
            </p>
          </Reveal>

          <ul className="mt-9 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[12px] font-bold uppercase tracking-[0.16em] text-white/85">
            <li className="flex items-center gap-2.5"><Gift className="w-4 h-4 text-[#F2B21B]" strokeWidth={1.75} aria-hidden="true" /> Free Consultation</li>
            <li className="flex items-center gap-2.5"><FileText className="w-4 h-4 text-[#F2B21B]" strokeWidth={1.75} aria-hidden="true" /> No Hidden Cost</li>
            <li className="flex items-center gap-2.5"><Zap className="w-4 h-4 text-[#F2B21B]" strokeWidth={1.75} aria-hidden="true" /> Fast Response</li>
          </ul>

          <div className="mt-11 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/book-consultation" className="btn-primary w-full sm:w-auto">
              Book Free Consultation
            </Link>
            <Link href="/get-free-quote" className="btn-outline w-full sm:w-auto">
              Get Free Quote
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center items-center gap-x-5 gap-y-3 text-[14px] text-white/60">
            <span>Or reach us directly —</span>
            <a href="tel:8460150027" className="hover:text-[#F2B21B] transition-colors flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> 8460150027</a>
            <span className="hidden sm:inline text-white/25">|</span>
            <button type="button" onClick={() => openWhatsApp()} className="hover:text-[#25D366] transition-colors flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> WhatsApp</button>
            <span className="hidden sm:inline text-white/25">|</span>
            <a href="mailto:kailvarn0@gmail.com" className="hover:text-[#F2B21B] transition-colors flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> kailvarn0@gmail.com</a>
          </div>
        </div>
      </section>
    </div>
  );
}
