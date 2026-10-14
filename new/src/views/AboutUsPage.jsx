'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users, Box, IndianRupee, Handshake, SwatchBook, ShieldCheck,
  Target, Eye, Hammer, Gem, Phone, Minus, Check
} from 'lucide-react';

function AboutUsPage() {
  const scrollVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const problems = [
    { icon: Users, title: "One Team. Zero Confusion.", problem: "Designer, contractor, carpenter, electrician and painter often work separately.", solution: "One coordinated team working toward one approved vision." },
    { icon: Box, title: "See It Before We Build It", problem: "You approve a design and hope the final result looks the same.", solution: "Detailed 3D visualization lets you understand your home before work begins." },
    { icon: IndianRupee, title: "Know Where Every Rupee Goes", problem: "Costs keep appearing as the project goes on.", solution: "A detailed written agreement gives you clarity before work begins." },
    { icon: Handshake, title: "One Team. One Responsibility.", problem: "When something goes wrong, everyone points at someone else.", solution: "Our integrated team takes responsibility from start to finish." },
    { icon: SwatchBook, title: "Choose What Goes Into Your Home", problem: "Materials are often selected without enough visibility.", solution: "We show you material options, samples and brands, and you make the final choice." },
    { icon: ShieldCheck, title: "We Don't Disappear After Handover", problem: "Once the work is finished, support becomes difficult to find.", solution: "Our formal warranty gives you continued support after your home is delivered." }
  ];

  const team = [
    { role: 'Interior Designer', tagline: 'Turning ideas into spaces', bio: 'Creates layouts, 3D designs and material concepts that reflect your lifestyle.', img: 'https://images.unsplash.com/photo-1531497258014-b5736f376b1b' },
    { role: 'Project Manager', tagline: 'Turning plans into progress', bio: 'Coordinates every stage, keeps the work aligned with the design and keeps you informed.', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a' },
    { role: 'Master Carpenter', tagline: 'Crafting what you imagined', bio: 'Precision carpentry, custom furniture and detailed woodwork.', img: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a' },
    { role: 'Civil & Tile Expert', tagline: 'Getting the foundations right', bio: 'Flooring, wall modifications, tiling and civil work, done with precision.', img: 'https://images.unsplash.com/photo-1506801462054-05bb84394982' },
    { role: 'Painter & Finish Expert', tagline: 'Giving the home its final character', bio: 'Clean surfaces, rich colours, textures and careful finishing.', img: 'https://images.unsplash.com/photo-1520699049698-acd2fceb8cc0' },
    { role: 'Electrical & Plumbing', tagline: 'The systems you depend on', bio: 'Safe, reliable electrical and plumbing work, built for long-term use.', img: 'https://images.unsplash.com/photo-1581092921461-7031e4bf0e5e' }
  ];

  return (
    <div className="bg-[#F8F5F0] min-h-screen text-[#1C1C1C]">

      {/* 1. HERO SECTION */}
      <section className="relative h-[240px] md:h-[360px] flex flex-col justify-center overflow-hidden pt-16">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1699842223719-630261e5b56c")' }}
        />
        <div className="absolute inset-0 bg-[#0F0F1E]/[0.68]" />
        
        <motion.div 
          initial="hidden" animate="visible" variants={scrollVariants}
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center"
        >
          <div className="inline-block bg-[#C9A84C]/20 border border-[#C9A84C]/40 rounded-full px-3 py-1 mb-4">
            <span className="font-nunito font-bold text-[11px] tracking-widest text-[#C9A84C] uppercase">
              About KailVarn
            </span>
          </div>
          
          <h1 className="font-playfair font-extrabold text-[32px] md:text-[50px] text-white leading-tight mb-4 text-shadow-sm text-balance">
            We Don&apos;t Just Build Homes. <em className="italic text-[#C9A84C]">We Build the Feeling of Home.</em>
          </h1>
          <p className="font-nunito text-[16px] md:text-[18px] text-white/85 max-w-3xl mx-auto text-balance">
            KailVarn brings design, craftsmanship and execution together under one roof — making the journey of creating your home simpler, more transparent, and truly yours.
          </p>
        </motion.div>
      </section>

      {/* 2. WHO WE ARE SECTION */}
      <section className="py-[80px] bg-[#F8F5F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants}
              className="lg:w-[55%]"
            >
              <span className="font-nunito font-bold text-[12px] tracking-[2.5px] text-[#C9A84C] uppercase block mb-3">
                Our Story
              </span>
              <h2 className="font-playfair font-bold text-[32px] md:text-[40px] text-[#1C1C1C] leading-tight mb-6">
                More Than Interiors. <em className="italic text-[#C9A84C]">We Build Homes With Purpose</em>
              </h2>
              <p className="font-playfair text-[21px] md:text-[24px] leading-[1.45] text-[#1A1A2E] border-l-2 border-[#C9A84C] pl-5 mb-8">
                A home is not just a property. It is where a family lives, celebrates, grows and creates memories.
              </p>
              <div className="space-y-6">
                <p className="font-nunito font-normal text-[16px] text-[#555] leading-[1.8]">
                  In India, building a home is a dream — often <strong className="font-semibold text-[#1A1A2E]">a lifetime of savings</strong>. Yet the journey can become complicated, with designers, contractors and multiple teams working separately, until somewhere between them your original vision gets lost.
                </p>
                <p className="font-nunito font-normal text-[16px] text-[#555] leading-[1.8]">
                  KailVarn was created to make that journey simpler. We bring <strong className="font-semibold text-[#1A1A2E]">professional design, skilled craftsmanship and complete execution together under one team</strong>. From the first idea to the final detail, we take responsibility for bringing your vision to life — with a written agreement, transparent pricing and careful attention to quality.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
              className="lg:w-[45%] w-full h-[400px] md:h-[500px] grid grid-cols-2 grid-rows-2 gap-4"
            >
              <div className="rounded-2xl overflow-hidden shadow-md">
                <img src="https://images.unsplash.com/photo-1693748792488-c0374f6ceb74" alt="Interior space" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md mt-8">
                <img src="https://images.unsplash.com/photo-1585128833500-ec98262cb4f5" alt="Interior detail" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md -mt-8">
                <img src="https://images.unsplash.com/photo-1688584270387-01810506c2ec" alt="Modern room" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md">
                <img src="https://images.unsplash.com/photo-1686040087857-9e3ab3947f41" alt="Kids bedroom design" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEMS WE SOLVE SECTION */}
      <section className="py-[80px] bg-[#EFEBE4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants}
            className="text-center mb-16"
          >
            <span className="font-nunito font-bold text-[12px] tracking-[2.5px] text-[#C9A84C] uppercase block mb-3">
              Why We Exist
            </span>
            <h2 className="font-playfair font-bold text-[32px] md:text-[40px] text-[#1C1C1C] leading-tight mb-4">
              Why We Built KailVarn
            </h2>
            <p className="font-playfair italic text-[22px] md:text-[26px] text-[#8A6A1C] mb-4">Because your home deserves better.</p>
            <p className="font-nunito text-[16px] text-[#555] max-w-2xl mx-auto">
              Building a home shouldn&apos;t mean managing five different teams. Here is what usually goes wrong — and how we do it differently.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((item, idx) => (
              <motion.div 
                key={idx}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: idx * 0.1 } } }}
                className="bg-white rounded-[14px] p-[28px] shadow-card hover-lift border border-[#E0D8CE]/50 flex flex-col"
              >
                <div className="w-[48px] h-[48px] bg-[#F8F5F0] border border-[#C9A84C]/50 rounded-full flex items-center justify-center mb-5">
                  <item.icon className="w-[22px] h-[22px] text-[#8A6A1C]" strokeWidth={1.5} />
                </div>
                <h4 className="font-playfair font-bold text-[21px] leading-snug text-[#1A1A2E] mb-5">
                  {item.title}
                </h4>
                <p className="font-nunito font-extrabold text-[10.5px] uppercase tracking-[0.22em] text-[#888] mb-1.5">The usual way</p>
                <p className="font-nunito font-normal text-[14.5px] text-[#555] leading-relaxed mb-4">{item.problem}</p>
                <div className="mt-auto pt-4 border-t border-dashed border-[#E0D8CE]">
                  <p className="font-nunito font-extrabold text-[10.5px] uppercase tracking-[0.22em] text-[#8A6A1C] mb-1.5">With KailVarn</p>
                  <p className="font-nunito font-semibold text-[14.5px] text-[#1A1A2E] leading-relaxed">{item.solution}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MISSION, VISION & VALUES SECTION */}
      <section className="py-[80px] bg-[#1A1A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Brand promise */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants}
            className="text-center mb-16"
          >
            <h2 className="font-playfair font-bold text-[34px] md:text-[48px] lg:text-[56px] text-white leading-[1.1]">
              Your Home. Your Vision. <em className="italic text-[#C9A84C]">Our Responsibility.</em>
            </h2>
            <p className="font-nunito text-[16px] md:text-[18px] leading-relaxed text-white/70 max-w-2xl mx-auto mt-6">
              From the first sketch to the final detail, the responsibility is never passed from one person to another. One team. One point of responsibility. One finished home.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
            {[
              { icon: Target, label: 'Our Mission', statement: 'To make creating a home feel as special as living in one.', support: 'By bringing professional design, skilled craftsmanship and disciplined project management together, we deliver homes where what you imagined is what you finally receive.' },
              { icon: Eye, label: 'Our Vision', statement: 'To become a name families trust with the place they call home.', support: 'A new standard for home interiors across Gujarat and beyond, where beautiful design, honest pricing and dependable execution come together.' }
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: idx * 0.1 } } }}
                className="border-t border-[#C9A84C]/50 pt-8"
              >
                <p className="flex items-center gap-2.5 font-nunito font-extrabold text-[11.5px] uppercase tracking-[0.26em] text-[#C9A84C] mb-5">
                  <item.icon className="w-4 h-4" strokeWidth={1.75} /> {item.label}
                </p>
                <p className="font-playfair text-[26px] md:text-[30px] text-white leading-[1.25] mb-5">{item.statement}</p>
                <p className="font-nunito text-[16px] text-white/70 leading-relaxed">{item.support}</p>
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
                className="bg-white/5 border border-white/10 rounded-[14px] p-6 hover:bg-white/10 hover:border-[#C9A84C]/50 transition-colors"
              >
                <value.icon className="w-6 h-6 text-[#C9A84C] mb-5" strokeWidth={1.5} />
                <h4 className="font-playfair font-semibold text-[19px] leading-snug text-white mb-2">{value.title}</h4>
                <p className="font-nunito text-[14px] text-white/70 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHAT MAKES US DIFFERENT SECTION */}
      <section className="py-[80px] bg-[#F8F5F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants}
            className="text-center mb-16"
          >
            <h2 className="font-playfair font-bold text-[32px] md:text-[40px] text-[#1C1C1C] leading-tight mb-4">
              What Makes KailVarn <em className="italic text-[#C9A84C]">Truly Different</em>
            </h2>
            <p className="font-nunito text-[16px] text-[#555] max-w-2xl mx-auto">
              Most homeowners have two choices. There is a better one.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* Card 1 */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className="bg-[#EFEBE4] rounded-[16px] p-8 flex flex-col mt-0 lg:mt-6 border border-[#E0D8CE]"
            >
              <h3 className="font-playfair font-bold text-[24px] text-[#1A1A2E] mb-2">Designer Only</h3>
              <p className="font-nunito text-[14px] text-[#555] mb-6">Creates the vision but doesn&apos;t execute it.</p>
              <ul className="space-y-4 mt-auto">
                <li className="flex items-start gap-3"><Minus className="w-4 h-4 text-[#888] mt-0.5 shrink-0" /> <span className="font-nunito text-[14.5px] text-[#333]">No execution team</span></li>
                <li className="flex items-start gap-3"><Minus className="w-4 h-4 text-[#888] mt-0.5 shrink-0" /> <span className="font-nunito text-[14.5px] text-[#333]">You coordinate the contractors yourself</span></li>
                <li className="flex items-start gap-3"><Minus className="w-4 h-4 text-[#888] mt-0.5 shrink-0" /> <span className="font-nunito text-[14.5px] text-[#333]">Design and site work often drift apart</span></li>
              </ul>
            </motion.div>

            {/* Card 2 (Highlighted) */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } } }}
              className="bg-white rounded-[16px] p-8 flex flex-col border-[2px] border-[#C9A84C] shadow-[0_10px_40px_rgba(201,168,76,0.15)] relative z-10 lg:-translate-y-4"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-[#1A1A2E] text-[#C9A84C] font-nunito font-bold text-[12px] uppercase tracking-wider px-4 py-1.5 rounded-full">
                Design + Execution
              </div>
              <h3 className="font-playfair font-bold text-[28px] text-[#1A1A2E] mb-2 mt-2">KailVarn</h3>
              <p className="font-nunito text-[15px] text-[#555] mb-6 border-b border-gray-100 pb-6">One team takes responsibility, from the first drawing to the final handover.</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-[#8A6A1C] mt-0.5 shrink-0" strokeWidth={2.5} /> <span className="font-nunito font-semibold text-[15px] text-[#1A1A2E]">Free professional design</span></li>
                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-[#8A6A1C] mt-0.5 shrink-0" strokeWidth={2.5} /> <span className="font-nunito font-semibold text-[15px] text-[#1A1A2E]">3D visualization before work begins</span></li>
                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-[#8A6A1C] mt-0.5 shrink-0" strokeWidth={2.5} /> <span className="font-nunito font-semibold text-[15px] text-[#1A1A2E]">Execution by our own trained team</span></li>
                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-[#8A6A1C] mt-0.5 shrink-0" strokeWidth={2.5} /> <span className="font-nunito font-semibold text-[15px] text-[#1A1A2E]">Written agreement, no hidden costs</span></li>
                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-[#8A6A1C] mt-0.5 shrink-0" strokeWidth={2.5} /> <span className="font-nunito font-semibold text-[15px] text-[#1A1A2E]">What you approve in 3D is what we build</span></li>
                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-[#8A6A1C] mt-0.5 shrink-0" strokeWidth={2.5} /> <span className="font-nunito font-semibold text-[15px] text-[#1A1A2E]">Formal post-delivery warranty</span></li>
              </ul>
              <div className="mt-8 text-center flex flex-col gap-3">
                 <Link href="/book-consultation" className="inline-block bg-[#1A1A2E] text-white font-nunito font-bold text-[15px] px-8 py-3 rounded-lg w-full transition-transform active:scale-[0.98] hover:bg-[#2a2a4a]">
                    Book Free Consultation
                 </Link>
                 <Link href="/get-free-quote" className="inline-block bg-transparent border-2 border-[#1A1A2E] text-[#1A1A2E] font-nunito font-bold text-[15px] px-8 py-3 rounded-lg w-full transition-all active:scale-[0.98] hover:bg-[#1A1A2E] hover:text-white">
                    Get Free Quote
                 </Link>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } } }}
              className="bg-[#EFEBE4] rounded-[16px] p-8 flex flex-col mt-0 lg:mt-6 border border-[#E0D8CE]"
            >
              <h3 className="font-playfair font-bold text-[24px] text-[#1A1A2E] mb-2">Contractor Only</h3>
              <p className="font-nunito text-[14px] text-[#555] mb-6">Executes the work but doesn&apos;t always understand the vision.</p>
              <ul className="space-y-4 mt-auto">
                <li className="flex items-start gap-3"><Minus className="w-4 h-4 text-[#888] mt-0.5 shrink-0" /> <span className="font-nunito text-[14.5px] text-[#333]">No 3D visualization before work begins</span></li>
                <li className="flex items-start gap-3"><Minus className="w-4 h-4 text-[#888] mt-0.5 shrink-0" /> <span className="font-nunito text-[14.5px] text-[#333]">Design decisions are made on site</span></li>
                <li className="flex items-start gap-3"><Minus className="w-4 h-4 text-[#888] mt-0.5 shrink-0" /> <span className="font-nunito text-[14.5px] text-[#333]">Costs can change as work progresses</span></li>
              </ul>
            </motion.div>
          </div>

          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants}
            className="font-playfair text-[26px] md:text-[34px] leading-[1.25] text-[#1A1A2E] text-center max-w-[22em] mx-auto mt-14"
          >
            The same vision you approve is <em className="italic text-[#C9A84C]">the vision we build.</em>
          </motion.p>
        </div>
      </section>

      {/* 6. OUR TEAM SECTION */}
      <section className="py-[80px] bg-[#EFEBE4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants}
            className="text-center mb-16"
          >
            <h2 className="font-playfair font-bold text-[32px] md:text-[40px] text-[#1C1C1C] leading-tight mb-4">
              The People Behind <em className="italic text-[#C9A84C]">Your Home</em>
            </h2>
            <p className="font-nunito text-[16px] text-[#555] max-w-2xl mx-auto">
              Great homes are created by people who know their craft and work together. Our job is to make sure every specialist works toward the same vision — <strong className="font-semibold text-[#1A1A2E]">yours.</strong>
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10">
            {team.map((member, idx) => (
              <motion.div 
                key={idx}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: idx * 0.1 } } }}
                className="text-center flex flex-col items-center"
              >
                <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full overflow-hidden mb-4 border-[3px] border-white shadow-md">
                  <img src={member.img} alt={member.role} className="w-full h-full object-cover" />
                </div>
                <p className="font-nunito font-bold text-[12px] md:text-[13px] text-[#8A6A1C] mb-1.5 uppercase tracking-wide">{member.role}</p>
                <h4 className="font-playfair font-bold text-[17px] md:text-[19px] text-[#1A1A2E] leading-tight mb-2">{member.tagline}</h4>
                <p className="font-nunito text-[13px] md:text-[14px] text-[#555] max-w-[200px] leading-snug">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SERVICE AREAS MAP SECTION */}
      <section className="py-[60px] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants}
              className="order-2 lg:order-1"
            >
              <h3 className="font-playfair font-bold text-[28px] md:text-[36px] text-[#1C1C1C] mb-4">
                We Serve Silvassa, Vapi & <em className="italic text-[#C9A84C]">Surrounding Areas</em>
              </h3>
              <p className="font-nunito text-[16px] text-[#555] mb-6 leading-relaxed">
                KailVarn provides complete interior design and execution services across Dadra and Nagar Haveli, Daman, and surrounding regions within an approximate 50km radius.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {['Silvassa', 'Vapi', 'Daman', 'Bhilad', 'Kachigam', 'Surangi', 'Dunetha', 'Nani Daman', 'Nearby Areas'].map((area, i) => (
                  <span key={i} className="bg-[#C9A84C]/10 text-[#1A1A2E] border border-[#C9A84C]/30 font-nunito font-semibold text-[13px] px-3 py-1.5 rounded-full">
                    {area}
                  </span>
                ))}
              </div>
              <p className="font-nunito text-[14px] text-[#555] mb-6 bg-[#EFEBE4] p-4 rounded-lg border-l-4 border-[#C9A84C]">
                <strong className="text-[#1A1A2E]">Not sure whether we serve your location?</strong> Call or WhatsApp us. We&apos;ll be happy to check.
              </p>
              <a href="tel:8401226123" className="inline-flex items-center justify-center gap-2 bg-[#1A1A2E] text-white font-nunito font-bold text-[15px] px-8 py-3.5 rounded-lg transition-transform active:scale-[0.98] hover:bg-[#2a2a4a]">
                <Phone className="w-4 h-4" /> Check Your Area
              </a>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
              className="order-1 lg:order-2 h-[280px] md:h-[380px] rounded-[16px] overflow-hidden shadow-card border border-[#E0D8CE]"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.41709392634!2d72.90472!3d20.273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0dd4a9c5a1b8f%3A0x3b3b3b3b3b3b3b3b!2sSilvassa%2C%20Dadra%20and%20Nagar%20Haveli!5e0!3m2!1sen!2sin!4v1234567890" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Service Area Map"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. ABOUT PAGE CTA SECTION */}
      <section className="bg-[#1A1A2E] py-[80px] text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants}>
            <h2 className="font-playfair font-bold text-[36px] md:text-[44px] text-white mb-4 leading-tight">
              Your Dream Home Starts With a <em className="italic text-[#C9A84C]">Conversation.</em>
            </h2>
            <p className="font-nunito text-[16px] md:text-[18px] text-white/70 mb-8 max-w-2xl mx-auto text-balance">
              You don&apos;t need every decision figured out today. Tell us what you have in mind — we&apos;ll help you understand what is possible, what it will take, and how we can bring it to life.
            </p>
            <p className="font-playfair italic text-[22px] md:text-[28px] text-[#C9A84C] mb-10">
              Let&apos;s build something you&apos;ll be proud to call home.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/book-consultation" className="bg-[#C9A84C] hover:bg-[#b59540] text-white font-nunito font-bold text-[16px] px-8 py-4 rounded-lg shadow-md transition-all active:scale-[0.98]">
                Book Free Consultation
              </Link>
              <a href="tel:8401226123" className="border-2 border-white/80 text-white hover:bg-white hover:text-[#1A1A2E] font-nunito font-bold text-[16px] px-8 py-4 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                <Phone className="w-4 h-4"/> Call 8401226123
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default AboutUsPage;