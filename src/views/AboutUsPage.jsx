'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users, Box, IndianRupee, Handshake, SwatchBook, ShieldCheck,
  Target, Eye, Hammer, Gem, Phone, MessageCircle, Minus, Check
} from 'lucide-react';
import PageHero from '@/components/kv/PageHero.jsx';

// Unsplash originals are 2-4 MB; ask for roughly the rendered size instead.
const sized = (url, w) => `${url}?auto=format&fit=crop&w=${w}&q=72`;

function AboutUsPage() {
  const scrollVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const problems = [
    {
      icon: Users,
      title: "One Team. Zero Confusion.",
      problem: "Designer, contractor, carpenter, electrician and painter often work separately.",
      solution: "One coordinated team working toward one approved vision."
    },
    {
      icon: Box,
      title: "See It Before We Build It",
      problem: "You approve a design and hope the final result looks the same.",
      solution: "Detailed 3D visualization lets you understand your home before work begins."
    },
    {
      icon: IndianRupee,
      title: "Know Where Every Rupee Goes",
      problem: "Costs keep appearing as the project goes on.",
      solution: "A detailed written agreement gives you clarity before work begins."
    },
    {
      icon: Handshake,
      title: "One Team. One Responsibility.",
      problem: "When something goes wrong, everyone points at someone else.",
      solution: "Our integrated team takes responsibility from start to finish."
    },
    {
      icon: SwatchBook,
      title: "Choose What Goes Into Your Home",
      problem: "Materials are often selected without enough visibility.",
      solution: "We show you material options, samples and brands, and you make the final choice."
    },
    {
      icon: ShieldCheck,
      title: "We Don't Disappear After Handover",
      problem: "Once the work is finished, support becomes difficult to find.",
      solution: "Our formal warranty gives you continued support after your home is delivered."
    }
  ];

  const team = [
    { role: 'Interior Designer', tagline: 'Turning ideas into spaces', bio: 'Creates layouts, 3D designs and material concepts that reflect your lifestyle.', img: 'https://images.unsplash.com/photo-1781888688940-5730c3fd5baf' },
    { role: 'Project Manager', tagline: 'Turning plans into progress', bio: 'Coordinates every stage, keeps the work aligned with the design and keeps you informed.', img: 'https://images.unsplash.com/photo-1716037991590-c975184b37df' },
    { role: 'Master Carpenter', tagline: 'Crafting what you imagined', bio: 'Precision carpentry, custom furniture and detailed woodwork.', img: 'https://images.unsplash.com/photo-1659930087003-2d64e33181f7' },
    { role: 'Civil & Tile Expert', tagline: 'Getting the foundations right', bio: 'Flooring, wall modifications, tiling and civil work, done with precision.', img: 'https://images.unsplash.com/photo-1706629503571-c165023a7792' },
    { role: 'Painter & Finish Expert', tagline: "Giving the home its final character", bio: 'Clean surfaces, rich colours, textures and careful finishing.', img: 'https://images.unsplash.com/photo-1688372199140-cade7ae820fe' },
    { role: 'Electrical & Plumbing', tagline: "The systems you depend on", bio: 'Safe, reliable electrical and plumbing work, built for long-term use.', img: 'https://images.unsplash.com/photo-1620566160204-017b23cf046d' }
  ];

  return (
    <div className="bg-[#FAFAF7] min-h-screen text-[#111111]">

      {/* 1. HERO SECTION */}
      <PageHero
        image="https://images.unsplash.com/photo-1724582586529-62622e50c0b3"
        eyebrow="About KailVarn"
        title="We Don't Just Build Homes. We Build the Feeling of Home."
        emphasis="We Build the Feeling of Home."
        lead="KailVarn brings design, craftsmanship and execution together under one roof — making the journey of creating your home simpler, more transparent, and truly yours."
      />

      {/* 2. WHO WE ARE SECTION */}
      <section className="kv-section bg-[#FAFAF7]">
        <div className="kv-wrap">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants}
              className="lg:w-[55%]"
            >
              <span className="kv-eyebrow">
                Our Story
              </span>
              <h2 className="font-playfair font-medium text-[34px] md:text-[44px] lg:text-[54px] text-[#0B103B] leading-tight mb-6 tracking-[-0.015em]">
                More Than Interiors. <em className="italic text-[#D9A441]">We Build Homes With Purpose</em>
              </h2>
              <p className="font-playfair text-[21px] md:text-[24px] leading-[1.45] text-[#0B103B] border-l-2 border-[#F2B21B] pl-5 mb-8">
                A home is not just a property. It is where a family lives, celebrates, grows and creates memories.
              </p>
              <div className="space-y-6">
                <p className="font-nunito font-normal text-[16.5px] lg:text-[17px] text-[#57534C] leading-[1.85]">
                  In India, building a home is a dream — often <strong className="font-semibold text-[#0B103B]">a lifetime of savings</strong>. Yet the journey can become complicated, with designers, contractors and multiple teams working separately, until somewhere between them your original vision gets lost.
                </p>
                <p className="font-nunito font-normal text-[16.5px] lg:text-[17px] text-[#57534C] leading-[1.85]">
                  KailVarn was created to make that journey simpler. We bring <strong className="font-semibold text-[#0B103B]">professional design, skilled craftsmanship and complete execution together under one team</strong>. From the first idea to the final detail, we take responsibility for bringing your vision to life — with a written agreement, transparent pricing and careful attention to quality.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
              className="lg:w-[45%] w-full h-[400px] md:h-[500px] grid grid-cols-2 gap-4"
            >
              {/* Two columns, the right one starting lower: a staggered look
                  where no photo can overlap another. */}
              <div className="flex flex-col gap-4 pb-8 min-h-0">
                <div className="flex-1 min-h-0 rounded-lg overflow-hidden shadow-md">
                  <img loading="lazy" decoding="async" src={sized("https://images.unsplash.com/photo-1713192706971-03900dcf5706", 640)} alt="Modern living room with warm lighting" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex-1 min-h-0 rounded-lg overflow-hidden shadow-md">
                  <img loading="lazy" decoding="async" src={sized("https://images.unsplash.com/photo-1771327811766-5f4149190b3d", 640)} alt="Bedroom with wooden wall panelling" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
              <div className="flex flex-col gap-4 pt-8 min-h-0">
                <div className="flex-1 min-h-0 rounded-lg overflow-hidden shadow-md">
                  <img loading="lazy" decoding="async" src={sized("https://images.unsplash.com/photo-1585128833500-ec98262cb4f5", 640)} alt="Bright modular kitchen with wooden worktop" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex-1 min-h-0 rounded-lg overflow-hidden shadow-md">
                  <img loading="lazy" decoding="async" src={sized("https://images.unsplash.com/photo-1686040087857-9e3ab3947f41", 640)} alt="Kids bedroom design" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEMS WE SOLVE SECTION */}
      <section className="kv-section bg-[#F5F1E8]">
        <div className="kv-wrap">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants}
            className="text-center mb-14 lg:mb-16"
          >
            <span className="kv-eyebrow">
              The KailVarn Difference
            </span>
            <h2 className="font-playfair font-medium text-[34px] md:text-[44px] lg:text-[54px] text-[#0B103B] leading-tight mb-4 tracking-[-0.015em]">
              Why We Built KailVarn
            </h2>
            <p className="font-playfair italic text-[22px] md:text-[26px] text-[#8A6A1C] mb-4">
              Because your home deserves better.
            </p>
            <p className="font-nunito text-[16.5px] lg:text-[17px] leading-[1.75] text-[#57534C] max-w-2xl mx-auto">
              Building a home shouldn&apos;t mean managing five different teams. Here is what usually goes wrong — and how we do it differently.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((item, idx) => (
              <motion.div 
                key={idx}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: idx * 0.08 } } }}
                className="bg-white rounded-lg p-[28px] shadow-card hover-lift border border-[#0B103B]/10 flex flex-col"
              >
                <div className="w-[48px] h-[48px] bg-[#F5F1E8] border border-[#D9A441]/50 rounded-full flex items-center justify-center mb-5">
                  <item.icon aria-hidden="true" className="w-[22px] h-[22px] text-[#8A6A1C]" strokeWidth={1.5} />
                </div>
                <h3 className="font-playfair font-medium text-[22px] leading-snug text-[#0B103B] mb-5">
                  {item.title}
                </h3>
                <p className="font-nunito font-extrabold text-[11.5px] uppercase tracking-[0.2em] text-[#57534C] mb-1.5">
                  The usual way
                </p>
                <p className="font-nunito font-normal text-[15px] text-[#57534C] leading-[1.65] mb-4">
                  {item.problem}
                </p>
                <div className="mt-auto pt-4 border-t border-dashed border-[#0B103B]/15">
                  <p className="font-nunito font-extrabold text-[11.5px] uppercase tracking-[0.2em] text-[#8A6A1C] mb-1.5">
                    With KailVarn
                  </p>
                  <p className="font-nunito font-semibold text-[15px] text-[#0B103B] leading-[1.65]">
                    {item.solution}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4A. STANDALONE BRAND PROMISE */}
      <section className="py-[72px] lg:py-[96px] bg-[#0B103B] border-b border-white/10">
        <div className="kv-wrap">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-block font-nunito font-extrabold text-[11.5px] uppercase tracking-[0.26em] text-[#F2B21B] mb-5">
              Our Promise
            </span>
            <h2 className="font-playfair font-medium text-[36px] md:text-[52px] lg:text-[64px] text-white leading-[1.08] tracking-[-0.02em]">
              Your Home. Your Vision. <em className="italic text-[#F6D47C]">Our Responsibility.</em>
            </h2>
            <p className="font-nunito text-[16.5px] lg:text-[18px] leading-[1.8] text-white/75 max-w-2xl mx-auto mt-6">
              From the first sketch to the final detail, the responsibility is never passed from one person to another. One team. One point of responsibility. One finished home.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4B. MISSION, VISION & VALUES SECTION */}
      <section className="kv-section bg-[#0B103B]">
        <div className="kv-wrap">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {[
              { icon: Target, label: 'Our Mission', statement: 'To make creating a home feel as special as living in one.', support: 'By bringing professional design, skilled craftsmanship and disciplined project management together, we deliver homes where what you imagined is what you finally receive.' },
              { icon: Eye, label: 'Our Vision', statement: 'To become a name families trust with the place they call home.', support: 'A new standard for home interiors across Gujarat and beyond, where beautiful design, honest pricing and dependable execution come together.' }
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: idx * 0.1 } } }}
                className="border-t border-[#F2B21B]/50 pt-8"
              >
                <h2 className="flex items-center gap-2.5 font-nunito font-extrabold text-[11.5px] uppercase tracking-[0.26em] text-[#F2B21B] mb-5">
                  <item.icon aria-hidden="true" className="w-4 h-4" strokeWidth={1.75} /> {item.label}
                </h2>
                <p className="font-playfair text-[26px] md:text-[30px] text-white leading-[1.25] mb-5">
                  {item.statement}
                </p>
                <p className="font-nunito text-[16px] text-white/75 leading-[1.75]">
                  {item.support}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Hammer, title: "Craftsmanship Without Compromise", desc: "From the first cut of wood to the final coat of paint, every finish deserves care." },
              { icon: Eye, title: "Complete Transparency", desc: "You always know what you are paying for, what is being used, and where your project stands." },
              { icon: Gem, title: "Premium Made Practical", desc: "Thoughtful design, smart material choices and lasting value, without unreasonable spending." },
              { icon: ShieldCheck, title: "A Promise We Stand Behind", desc: "Clear commitments, regular updates and formal warranty support after handover." }
            ].map((value, idx) => (
              <motion.div 
                key={idx}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: idx * 0.1 } } }}
                className="bg-white/[0.04] border border-white/10 rounded-lg p-6 hover:bg-white/[0.08] hover:border-[#D9A441]/50 transition-colors"
              >
                <value.icon aria-hidden="true" className="w-6 h-6 text-[#F6D47C] mb-5" strokeWidth={1.5} />
                <h3 className="font-playfair font-medium text-[20px] leading-snug text-white mb-2">
                  {value.title}
                </h3>
                <p className="font-nunito text-[14.5px] text-white/75 leading-[1.65]">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHAT MAKES US DIFFERENT SECTION */}
      <section className="kv-section bg-[#FAFAF7]">
        <div className="kv-wrap">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants}
            className="text-center mb-14 lg:mb-20"
          >
            <span className="kv-eyebrow">
              A Better Way to Build
            </span>
            <h2 className="font-playfair font-medium text-[34px] md:text-[44px] lg:text-[54px] text-[#0B103B] leading-tight mb-4 tracking-[-0.015em]">
              What Makes KailVarn <em className="italic text-[#D9A441]">Truly Different</em>
            </h2>
            <p className="font-nunito text-[16.5px] lg:text-[17px] leading-[1.75] text-[#57534C] max-w-2xl mx-auto">
              Most homeowners have two choices. There is a better one.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* Card 1 */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className="bg-[#F5F1E8] rounded-lg p-8 flex flex-col mt-0 lg:mt-6 border border-[#0B103B]/10"
            >
              <h3 className="font-playfair font-medium text-[24px] text-[#0B103B] mb-2">Designer Only</h3>
              <p className="font-nunito text-[15px] leading-[1.7] text-[#57534C] mb-6">
                Creates the vision but doesn&apos;t execute it.
              </p>
              <ul className="space-y-4 pt-6 border-t border-[#0B103B]/10">
                <li className="flex items-start gap-3">
                  <Minus aria-hidden="true" className="w-4 h-4 text-[#57534C] mt-1 shrink-0" />
                  <span className="font-nunito text-[15px] text-[#2A2A2A]">No execution team</span>
                </li>
                <li className="flex items-start gap-3">
                  <Minus aria-hidden="true" className="w-4 h-4 text-[#57534C] mt-1 shrink-0" />
                  <span className="font-nunito text-[15px] text-[#2A2A2A]">You coordinate the contractors yourself</span>
                </li>
                <li className="flex items-start gap-3">
                  <Minus aria-hidden="true" className="w-4 h-4 text-[#57534C] mt-1 shrink-0" />
                  <span className="font-nunito text-[15px] text-[#2A2A2A]">Design and site work often drift apart</span>
                </li>
              </ul>
            </motion.div>

            {/* Card 2 (Highlighted) - Static wrapper preserves lg:-translate-y-4 alongside Framer Motion */}
            <div className="lg:-translate-y-4 flex">
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } } }}
                className="bg-white rounded-lg p-8 flex flex-col w-full border-[2px] border-[#D9A441] shadow-[0_10px_40px_rgba(242,178,27,0.15)] relative z-10"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-[#0B103B] text-[#F6D47C] font-nunito font-bold text-[11.5px] uppercase tracking-[0.18em] px-4 py-1.5 rounded-full">
                  Design + Execution
                </div>
                <h3 className="font-playfair font-medium text-[28px] text-[#0B103B] mb-2 mt-2">KailVarn</h3>
                <p className="font-nunito text-[15.5px] leading-[1.7] text-[#57534C] mb-6 border-b border-[#0B103B]/10 pb-6">
                  One team takes responsibility, from the first drawing to the final handover.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check aria-hidden="true" className="w-4 h-4 text-[#8A6A1C] mt-1 shrink-0" strokeWidth={2.5} />
                    <span className="font-nunito font-semibold text-[15px] text-[#0B103B]">Free professional design</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check aria-hidden="true" className="w-4 h-4 text-[#8A6A1C] mt-1 shrink-0" strokeWidth={2.5} />
                    <span className="font-nunito font-semibold text-[15px] text-[#0B103B]">3D visualization before work begins</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check aria-hidden="true" className="w-4 h-4 text-[#8A6A1C] mt-1 shrink-0" strokeWidth={2.5} />
                    <span className="font-nunito font-semibold text-[15px] text-[#0B103B]">Execution by our own trained team</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check aria-hidden="true" className="w-4 h-4 text-[#8A6A1C] mt-1 shrink-0" strokeWidth={2.5} />
                    <span className="font-nunito font-semibold text-[15px] text-[#0B103B]">Written agreement, no hidden costs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check aria-hidden="true" className="w-4 h-4 text-[#8A6A1C] mt-1 shrink-0" strokeWidth={2.5} />
                    <span className="font-nunito font-semibold text-[15px] text-[#0B103B]">What you approve in 3D is what we build</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check aria-hidden="true" className="w-4 h-4 text-[#8A6A1C] mt-1 shrink-0" strokeWidth={2.5} />
                    <span className="font-nunito font-semibold text-[15px] text-[#0B103B]">Formal post-delivery warranty</span>
                  </li>
                </ul>
                <div className="mt-8 text-center flex flex-col gap-3">
                  <Link href="/book-consultation" className="btn-navy w-full">
                    Book Free Consultation
                  </Link>
                  <Link href="/get-free-quote" className="btn-outline-dark w-full">
                    Get Free Quote
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Card 3 */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } } }}
              className="bg-[#F5F1E8] rounded-lg p-8 flex flex-col mt-0 lg:mt-6 border border-[#0B103B]/10"
            >
              <h3 className="font-playfair font-medium text-[24px] text-[#0B103B] mb-2">Contractor Only</h3>
              <p className="font-nunito text-[15px] leading-[1.7] text-[#57534C] mb-6">
                Executes the work but doesn&apos;t always understand the vision.
              </p>
              <ul className="space-y-4 pt-6 border-t border-[#0B103B]/10">
                <li className="flex items-start gap-3">
                  <Minus aria-hidden="true" className="w-4 h-4 text-[#57534C] mt-1 shrink-0" />
                  <span className="font-nunito text-[15px] text-[#2A2A2A]">No 3D visualization before work begins</span>
                </li>
                <li className="flex items-start gap-3">
                  <Minus aria-hidden="true" className="w-4 h-4 text-[#57534C] mt-1 shrink-0" />
                  <span className="font-nunito text-[15px] text-[#2A2A2A]">Design decisions are made on site</span>
                </li>
                <li className="flex items-start gap-3">
                  <Minus aria-hidden="true" className="w-4 h-4 text-[#57534C] mt-1 shrink-0" />
                  <span className="font-nunito text-[15px] text-[#2A2A2A]">Costs can change as work progresses</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants}
            className="font-playfair text-[26px] md:text-[34px] leading-[1.25] text-[#0B103B] text-center max-w-[22em] mx-auto mt-14 lg:mt-20"
          >
            The same vision you approve is <em className="italic text-[#D9A441]">the vision we build.</em>
          </motion.p>
        </div>
      </section>

      {/* 6. OUR TEAM SECTION */}
      <section className="kv-section bg-[#F5F1E8]">
        <div className="kv-wrap">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants}
            className="text-center mb-14 lg:mb-16"
          >
            <span className="kv-eyebrow">
              Integrated Expertise
            </span>
            <h2 className="font-playfair font-medium text-[34px] md:text-[44px] lg:text-[54px] text-[#0B103B] leading-tight mb-4 tracking-[-0.015em]">
              The People Behind <em className="italic text-[#D9A441]">Your Home</em>
            </h2>
            <p className="font-nunito text-[16.5px] lg:text-[17px] leading-[1.75] text-[#57534C] max-w-2xl mx-auto">
              Great homes are created by people who know their craft and work together. Our job is to make sure every specialist works toward the same vision — <strong className="font-semibold text-[#0B103B]">yours.</strong>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12 max-w-[960px] mx-auto">
            {team.map((member, idx) => (
              <motion.div 
                key={idx}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: idx * 0.08 } } }}
                className="text-center flex flex-col items-center bg-white/60 sm:bg-transparent p-6 sm:p-0 rounded-lg border border-[#0B103B]/5 sm:border-0"
              >
                <div className="w-[112px] h-[112px] md:w-[124px] md:h-[124px] rounded-full overflow-hidden mb-4 border-[3px] border-white shadow-md">
                  <img loading="lazy" decoding="async" src={sized(member.img, 256)} alt={member.role} className="w-full h-full object-cover" />
                </div>
                <p className="font-nunito font-extrabold text-[11.5px] md:text-[12px] text-[#8A6A1C] mb-1.5 uppercase tracking-[0.18em]">
                  {member.role}
                </p>
                <h3 className="font-playfair font-medium text-[19px] md:text-[21px] text-[#0B103B] leading-tight mb-2.5">
                  {member.tagline}
                </h3>
                <p className="font-nunito text-[14.5px] md:text-[15px] text-[#57534C] max-w-[260px] leading-[1.65]">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SERVICE AREAS MAP SECTION */}
      <section className="py-[72px] lg:py-[104px] bg-white">
        <div className="kv-wrap">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants}
            >
              <span className="kv-eyebrow">
                Where We Work
              </span>
              <h2 className="font-playfair font-medium text-[30px] md:text-[42px] lg:text-[50px] text-[#0B103B] leading-tight mb-4">
                We Serve Silvassa, Vapi &amp; <em className="italic text-[#D9A441]">Surrounding Areas</em>
              </h2>
              <p className="font-nunito text-[16px] text-[#57534C] mb-6 leading-relaxed">
                KailVarn provides complete interior design and execution services across Dadra and Nagar Haveli, Daman, and surrounding regions within an approximate 50km radius.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {['Silvassa', 'Vapi', 'Daman', 'Bhilad', 'Kachigam', 'Surangi', 'Dunetha', 'Nani Daman', 'Nearby Areas'].map((area, i) => (
                  <span key={i} className="bg-[#F2B21B]/10 text-[#0B103B] border border-[#D9A441]/35 font-nunito font-semibold text-[13px] px-3.5 py-1.5 rounded-full">
                    {area}
                  </span>
                ))}
              </div>
              <p className="font-nunito text-[14.5px] text-[#57534C] mb-6 bg-[#F5F1E8] p-4 rounded-lg border border-[#D9A441]/40">
                <strong className="text-[#0B103B]">Not sure whether we serve your location?</strong> Call or WhatsApp us — we&apos;ll be happy to check.
              </p>
              <div className="flex flex-wrap items-center gap-3.5">
                <a href="tel:8460150027" className="btn-primary">
                  <Phone aria-hidden="true" className="w-4 h-4" /> Call 8460150027
                </a>
                <a
                  href="https://wa.me/918460150027?text=Hi%20KailVarn%2C%20I%20would%20like%20to%20check%20if%20you%20serve%20my%20location."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-dark inline-flex items-center gap-2"
                >
                  <MessageCircle aria-hidden="true" className="w-4 h-4" /> WhatsApp Us
                </a>
              </div>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
              className="h-[280px] md:h-[380px] rounded-lg overflow-hidden shadow-card border border-[#0B103B]/10"
            >
              <iframe 
                src="https://maps.google.com/maps?q=Silvassa,+Dadra+and+Nagar+Haveli&t=&z=11&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="KailVarn Service Area Map around Silvassa and Vapi"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. ABOUT PAGE CTA SECTION */}
      <section className="bg-[#0B103B] kv-section text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants}>
            <h2 className="font-playfair font-medium text-[36px] md:text-[50px] lg:text-[60px] text-white mb-4 leading-tight tracking-[-0.015em]">
              Your Dream Home Starts With a <em className="italic text-[#F6D47C]">Conversation.</em>
            </h2>
            <p className="font-nunito text-[16px] md:text-[18px] text-white/75 mb-8 max-w-2xl mx-auto text-balance leading-[1.75]">
              You don&apos;t need every decision figured out today. Tell us what you have in mind — we&apos;ll help you understand what is possible, what it will take, and how we can bring it to life.
            </p>
            <p className="font-playfair italic text-[22px] md:text-[28px] text-[#F6D47C] mb-10">
              Let&apos;s build something you&apos;ll be proud to call home.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/book-consultation" className="btn-primary">
                Book Free Consultation
              </Link>
              <a href="tel:8460150027" className="btn-outline inline-flex items-center justify-center gap-2">
                <Phone aria-hidden="true" className="w-4 h-4"/> Call 8460150027
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default AboutUsPage;