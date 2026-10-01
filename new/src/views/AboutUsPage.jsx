'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Users, Layers, Receipt, HardHat, ShieldCheck, MapPin, 
  Target, Eye, Award, CheckCircle2, Phone, X, Check 
} from 'lucide-react';

function AboutUsPage() {
  const scrollVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const problems = [
    {
      icon: Users,
      problem: "Designer + contractor separately expensive",
      solution: "Free designer, one team, zero complexity."
    },
    {
      icon: Layers,
      problem: "Final home looks nothing like design",
      solution: "Modern tools, trained craftsmen, exact execution."
    },
    {
      icon: Receipt,
      problem: "Hidden costs blow budget",
      solution: "Detailed written agreement upfront, every rupee listed."
    },
    {
      icon: HardHat,
      problem: "Multiple contractors don't coordinate",
      solution: "All work by integrated team under one PM."
    },
    {
      icon: CheckCircle2,
      problem: "Poor material quality",
      solution: "Share samples and brands before purchase, you approve."
    },
    {
      icon: ShieldCheck,
      problem: "No accountability after work",
      solution: "Formal warranty, free fixes in warranty period."
    }
  ];

  const team = [
    { name: 'KailVarn Studio', role: 'Interior Designer', bio: 'Creates stunning 3D layouts and manages material selection.', img: 'https://images.unsplash.com/photo-1531497258014-b5736f376b1b' },
    { name: 'On-Site Experts', role: 'Project Manager', bio: 'Ensures everything matches the design perfectly.', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a' },
    { name: 'Master Craftsmen', role: 'Lead Carpenter', bio: 'Precision woodworking and custom furniture builds.', img: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a' },
    { name: 'Civil Team', role: 'Civil & Tile Expert', bio: 'Flawless flooring, wall modifications, and structural work.', img: 'https://images.unsplash.com/photo-1506801462054-05bb84394982' },
    { name: 'Finishing Crew', role: 'Painter & Finish Expert', bio: 'Premium textures, deep color application, and detailing.', img: 'https://images.unsplash.com/photo-1520699049698-acd2fceb8cc0' },
    { name: 'MEP Specialists', role: 'Electrical & Plumbing', bio: 'Safe, hidden wiring and leak-proof plumbing solutions.', img: 'https://images.unsplash.com/photo-1581092921461-7031e4bf0e5e' }
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
            We Don't Just Design Homes — We Build Dreams In Affordable Pricing
          </h1>
          <p className="font-nunito text-[16px] md:text-[18px] text-white/85 max-w-3xl mx-auto text-balance">
            KailVarn brings you an integrated approach to interior design. One team, from beautiful 3D concepts to flawless on-site execution.
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
                Who Is KailVarn?
              </h2>
              <div className="space-y-6">
                <p className="font-nunito font-normal text-[16px] text-[#555] leading-[1.8]">
                  KailVarn was born out of a simple observation: designing and building a home in India is far too stressful. Homeowners are caught between expensive design studios that don't execute, and local contractors who lack professional design vision. We realized there had to be a better way.
                </p>
                <p className="font-nunito font-normal text-[16px] text-[#555] leading-[1.8]">
                  Today, KailVarn operates on a fully integrated model. We combine the creative excellence of premium interior designers with the rigorous discipline of experienced project managers and master craftsmen. We provide the design for free, focus purely on high-quality execution, and guarantee that the final result perfectly matches your approved 3D renders.
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
              The Problems KailVarn Was Built to Solve
            </h2>
            <p className="font-nunito text-[16px] text-[#555] max-w-2xl mx-auto">
              We studied the biggest frustrations homeowners face during interior projects and structured our entire business to eliminate them.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((item, idx) => (
              <motion.div 
                key={idx}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: idx * 0.1 } } }}
                className="bg-white rounded-[14px] p-[28px] shadow-card hover-lift border border-[#E0D8CE]/50"
              >
                <div className="w-[48px] h-[48px] bg-red-50 rounded-xl flex items-center justify-center mb-5">
                  <item.icon className="w-[24px] h-[24px] text-[#C0392B]" />
                </div>
                <h4 className="font-nunito font-bold text-[15px] text-[#C0392B] mb-4">
                  {item.problem}
                </h4>
                <div className="h-[1.5px] w-full bg-gradient-to-r from-[#C9A84C] to-transparent mb-4"></div>
                <p className="font-nunito font-normal text-[14px] text-[#555] leading-relaxed">
                  <strong className="text-[#1C1C1C]">Our Solution:</strong> {item.solution}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MISSION, VISION & VALUES SECTION */}
      <section className="py-[80px] bg-[#1A1A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 mb-16">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
              className="flex-1 text-center md:text-left"
            >
              <Target className="w-[40px] h-[40px] text-[#C9A84C] mx-auto md:mx-0 mb-4" />
              <h3 className="font-playfair font-semibold text-[26px] text-white mb-4">Our Mission</h3>
              <p className="font-nunito text-[16px] text-white/70 leading-relaxed text-balance">
                To deliver complete, stress-free interior design and execution services with absolute transparency, uncompromising quality, and guaranteed results that match our vision exactly.
              </p>
            </motion.div>
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.1 } } }}
              className="flex-1 text-center md:text-left"
            >
              <Eye className="w-[40px] h-[40px] text-[#C9A84C] mx-auto md:mx-0 mb-4" />
              <h3 className="font-playfair font-semibold text-[26px] text-white mb-4">Our Vision</h3>
              <p className="font-nunito text-[16px] text-white/70 leading-relaxed text-balance">
                To become the most trusted and preferred interior design partner in Gujarat and surrounding areas by redefining how home interiors are planned and built.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Quality First", desc: "We never cut corners. Premium materials and finishes always." },
              { title: "Full Transparency", desc: "Written agreements, honest pricing, zero hidden costs." },
              { title: "Affordability", desc: "Premium aesthetic without breaking your bank account." },
              { title: "Reliability", desc: "We commit, deliver on time, and provide formal warranty." }
            ].map((value, idx) => (
              <motion.div 
                key={idx}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: idx * 0.1 } } }}
                className="bg-white/5 border-[1.5px] border-[#C9A84C]/50 rounded-[14px] p-6 text-center hover:bg-white/10 transition-colors"
              >
                <div className="w-[32px] h-[32px] rounded-full bg-[#C9A84C] text-[#1A1A2E] flex items-center justify-center mx-auto mb-4 font-bold">
                  <Check className="w-4 h-4" />
                </div>
                <h4 className="font-nunito font-bold text-[16px] text-white mb-2">{value.title}</h4>
                <p className="font-nunito text-[14px] text-white/60 leading-snug">{value.desc}</p>
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
              What Makes KailVarn Truly Different
            </h2>
            <p className="font-nunito text-[16px] text-[#555] max-w-2xl mx-auto">
              Compare our integrated model with traditional alternatives.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* Card 1 */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className="bg-[#EFEBE4] rounded-[16px] p-8 flex flex-col mt-0 lg:mt-6 border border-[#E0D8CE]"
            >
              <h3 className="font-playfair font-bold text-[24px] text-[#1A1A2E] mb-2">Design Studio Only</h3>
              <p className="font-nunito text-[14px] text-[#555] mb-6">Provides beautiful 3D renders but leaves the heavy lifting to you.</p>
              <ul className="space-y-4 mt-auto">
                <li className="flex items-start gap-3"><X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /> <span className="font-nunito text-[14.5px] text-[#333]">No execution team provided</span></li>
                <li className="flex items-start gap-3"><X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /> <span className="font-nunito text-[14.5px] text-[#333]">You manage contractors daily</span></li>
                <li className="flex items-start gap-3"><X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /> <span className="font-nunito text-[14.5px] text-[#333]">Expensive design fees upfront</span></li>
              </ul>
            </motion.div>

            {/* Card 2 (Highlighted) */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } } }}
              className="bg-white rounded-[16px] p-8 flex flex-col border-[2px] border-[#C9A84C] shadow-[0_10px_40px_rgba(201,168,76,0.15)] relative z-10 lg:-translate-y-4"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#C9A84C] text-[#1A1A2E] font-nunito font-bold text-[12px] uppercase tracking-wider px-4 py-1.5 rounded-full">
                Highly Recommended
              </div>
              <h3 className="font-playfair font-bold text-[28px] text-[#1A1A2E] mb-2 mt-2">KailVarn</h3>
              <p className="font-nunito text-[15px] text-[#555] mb-6 border-b border-gray-100 pb-6">The Complete Solution. One team for design and flawless execution.</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> <span className="font-nunito font-semibold text-[15px] text-[#1A1A2E]">Free professional design</span></li>
                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> <span className="font-nunito font-semibold text-[15px] text-[#1A1A2E]">Full execution by in-house team</span></li>
                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> <span className="font-nunito font-semibold text-[15px] text-[#1A1A2E]">Detailed agreement, no hidden costs</span></li>
                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> <span className="font-nunito font-semibold text-[15px] text-[#1A1A2E]">Result perfectly matches 3D design</span></li>
                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> <span className="font-nunito font-semibold text-[15px] text-[#1A1A2E]">Formal post-delivery warranty</span></li>
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
              <p className="font-nunito text-[14px] text-[#555] mb-6">Executes work but lacks design vision and proper project management.</p>
              <ul className="space-y-4 mt-auto">
                <li className="flex items-start gap-3"><X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /> <span className="font-nunito text-[14.5px] text-[#333]">No 3D visualization or design</span></li>
                <li className="flex items-start gap-3"><X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /> <span className="font-nunito text-[14.5px] text-[#333]">Frequent design mismatches</span></li>
                <li className="flex items-start gap-3"><X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /> <span className="font-nunito text-[14.5px] text-[#333]">Hidden costs pop up mid-project</span></li>
              </ul>
            </motion.div>
          </div>
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
              The KailVarn Expert Team
            </h2>
            <p className="font-nunito text-[16px] text-[#555] max-w-2xl mx-auto">
              Behind every beautiful home is a coordinated team of specialists working in perfect harmony.
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
                <h4 className="font-playfair font-bold text-[18px] md:text-[20px] text-[#1A1A2E] leading-tight">{member.name}</h4>
                <p className="font-nunito font-bold text-[13px] md:text-[14px] text-[#C9A84C] mb-2 uppercase tracking-wide">{member.role}</p>
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
                We Serve Silvassa, Vapi & Surrounding Areas
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
                <strong>Not sure if we cover your area?</strong> Call or WhatsApp us — we'll confirm immediately.
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
              Ready to Work with KailVarn?
            </h2>
            <p className="font-nunito text-[16px] md:text-[18px] text-white/70 mb-8 max-w-2xl mx-auto text-balance">
              Book a free consultation and site visit. Let's discuss your space, understand your vision, and show you exactly how we can bring it to life.
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