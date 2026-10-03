'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Users, Layers, Receipt, HardHat, ShieldCheck, MapPin, 
  Target, Eye, Award, CheckCircle2, Phone, X, Check 
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
    { name: 'KailVarn Studio', role: 'Interior Designer', bio: 'Creates stunning 3D layouts and manages material selection.', img: 'https://images.unsplash.com/photo-1781888688940-5730c3fd5baf' },
    { name: 'On-Site Experts', role: 'Project Manager', bio: 'Ensures everything matches the design perfectly.', img: 'https://images.unsplash.com/photo-1716037991590-c975184b37df' },
    { name: 'Master Craftsmen', role: 'Lead Carpenter', bio: 'Precision woodworking and custom furniture builds.', img: 'https://images.unsplash.com/photo-1659930087003-2d64e33181f7' },
    { name: 'Civil Team', role: 'Civil & Tile Expert', bio: 'Flawless flooring, wall modifications, and structural work.', img: 'https://images.unsplash.com/photo-1706629503571-c165023a7792' },
    { name: 'Finishing Crew', role: 'Painter & Finish Expert', bio: 'Premium textures, deep color application, and detailing.', img: 'https://images.unsplash.com/photo-1688372199140-cade7ae820fe' },
    { name: 'MEP Specialists', role: 'Electrical & Plumbing', bio: 'Safe, hidden wiring and leak-proof plumbing solutions.', img: 'https://images.unsplash.com/photo-1620566160204-017b23cf046d' }
  ];

  return (
    <div className="bg-[#FAFAF7] min-h-screen text-[#111111]">

      {/* 1. HERO SECTION */}
      <PageHero
        image="https://images.unsplash.com/photo-1724582586529-62622e50c0b3"
        eyebrow="About KailVarn"
        title="We Don't Just Design Homes — We Build Dreams In Affordable Pricing"
        emphasis="Affordable Pricing"
        lead="KailVarn brings you an integrated approach to interior design. One team, from beautiful 3D concepts to flawless on-site execution."
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
                Who Is KailVarn?
              </h2>
              <div className="space-y-6">
                <p className="font-nunito font-normal text-[16px] text-[#6B675F] leading-[1.8]">
                  KailVarn was born out of a simple observation: designing and building a home in India is far too stressful. Homeowners are caught between expensive design studios that don't execute, and local contractors who lack professional design vision. We realized there had to be a better way.
                </p>
                <p className="font-nunito font-normal text-[16px] text-[#6B675F] leading-[1.8]">
                  Today, KailVarn operates on a fully integrated model. We combine the creative excellence of premium interior designers with the rigorous discipline of experienced project managers and master craftsmen. We provide the design for free, focus purely on high-quality execution, and guarantee that the final result perfectly matches your approved 3D renders.
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
            className="text-center mb-16"
          >
            <span className="kv-eyebrow">
              Why We Exist
            </span>
            <h2 className="font-playfair font-medium text-[34px] md:text-[44px] lg:text-[54px] text-[#0B103B] leading-tight mb-4 tracking-[-0.015em]">
              The Problems KailVarn Was Built to Solve
            </h2>
            <p className="font-nunito text-[16px] text-[#6B675F] max-w-2xl mx-auto">
              We studied the biggest frustrations homeowners face during interior projects and structured our entire business to eliminate them.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((item, idx) => (
              <motion.div 
                key={idx}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: idx * 0.1 } } }}
                className="bg-white rounded-lg p-[28px] shadow-card hover-lift border border-[#0B103B]/10"
              >
                <div className="w-[48px] h-[48px] bg-red-50 rounded-xl flex items-center justify-center mb-5">
                  <item.icon className="w-[24px] h-[24px] text-[#C0392B]" />
                </div>
                <h4 className="font-nunito font-bold text-[15px] text-[#C0392B] mb-4">
                  {item.problem}
                </h4>
                <div className="h-[1.5px] w-full bg-gradient-to-r from-[#F2B21B] to-transparent mb-4"></div>
                <p className="font-nunito font-normal text-[14px] text-[#6B675F] leading-relaxed">
                  <strong className="text-[#111111]">Our Solution:</strong> {item.solution}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MISSION, VISION & VALUES SECTION */}
      <section className="kv-section bg-[#0B103B]">
        <div className="kv-wrap">
          <div className="flex flex-col md:flex-row gap-12 mb-16">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
              className="flex-1 text-center md:text-left"
            >
              <Target className="w-[40px] h-[40px] text-[#D9A441] mx-auto md:mx-0 mb-4" />
              <h3 className="font-playfair font-medium text-[26px] text-white mb-4">Our Mission</h3>
              <p className="font-nunito text-[16px] text-white/70 leading-relaxed text-balance">
                To deliver complete, stress-free interior design and execution services with absolute transparency, uncompromising quality, and guaranteed results that match our vision exactly.
              </p>
            </motion.div>
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.1 } } }}
              className="flex-1 text-center md:text-left"
            >
              <Eye className="w-[40px] h-[40px] text-[#D9A441] mx-auto md:mx-0 mb-4" />
              <h3 className="font-playfair font-medium text-[26px] text-white mb-4">Our Vision</h3>
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
                className="bg-white/5 border-[1.5px] border-[#D9A441]/50 rounded-lg p-6 text-center hover:bg-white/10 transition-colors"
              >
                <div className="w-[32px] h-[32px] rounded-full bg-[#F2B21B] text-[#0B103B] flex items-center justify-center mx-auto mb-4 font-bold">
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
      <section className="kv-section bg-[#FAFAF7]">
        <div className="kv-wrap">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants}
            className="text-center mb-16"
          >
            <h2 className="font-playfair font-medium text-[34px] md:text-[44px] lg:text-[54px] text-[#0B103B] leading-tight mb-4 tracking-[-0.015em]">
              What Makes KailVarn Truly Different
            </h2>
            <p className="font-nunito text-[16px] text-[#6B675F] max-w-2xl mx-auto">
              Compare our integrated model with traditional alternatives.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* Card 1 */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className="bg-[#F5F1E8] rounded-lg p-8 flex flex-col mt-0 lg:mt-6 border border-[#0B103B]/10"
            >
              <h3 className="font-playfair font-medium text-[24px] text-[#0B103B] mb-2">Design Studio Only</h3>
              <p className="font-nunito text-[14px] text-[#6B675F] mb-6">Provides beautiful 3D renders but leaves the heavy lifting to you.</p>
              <ul className="space-y-4 mt-auto">
                <li className="flex items-start gap-3"><X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /> <span className="font-nunito text-[14.5px] text-[#333]">No execution team provided</span></li>
                <li className="flex items-start gap-3"><X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /> <span className="font-nunito text-[14.5px] text-[#333]">You manage contractors daily</span></li>
                <li className="flex items-start gap-3"><X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /> <span className="font-nunito text-[14.5px] text-[#333]">Expensive design fees upfront</span></li>
              </ul>
            </motion.div>

            {/* Card 2 (Highlighted) */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } } }}
              className="bg-white rounded-lg p-8 flex flex-col border-[2px] border-[#D9A441] shadow-[0_10px_40px_rgba(242,178,27,0.15)] relative z-10 lg:-translate-y-4"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F2B21B] text-[#0B103B] font-nunito font-bold text-[12px] uppercase tracking-wider px-4 py-1.5 rounded-full">
                Highly Recommended
              </div>
              <h3 className="font-playfair font-medium text-[28px] text-[#0B103B] mb-2 mt-2">KailVarn</h3>
              <p className="font-nunito text-[15px] text-[#6B675F] mb-6 border-b border-gray-100 pb-6">The Complete Solution. One team for design and flawless execution.</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> <span className="font-nunito font-semibold text-[15px] text-[#0B103B]">Free professional design</span></li>
                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> <span className="font-nunito font-semibold text-[15px] text-[#0B103B]">Full execution by in-house team</span></li>
                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> <span className="font-nunito font-semibold text-[15px] text-[#0B103B]">Detailed agreement, no hidden costs</span></li>
                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> <span className="font-nunito font-semibold text-[15px] text-[#0B103B]">Result perfectly matches 3D design</span></li>
                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> <span className="font-nunito font-semibold text-[15px] text-[#0B103B]">Formal post-delivery warranty</span></li>
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

            {/* Card 3 */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } } }}
              className="bg-[#F5F1E8] rounded-lg p-8 flex flex-col mt-0 lg:mt-6 border border-[#0B103B]/10"
            >
              <h3 className="font-playfair font-medium text-[24px] text-[#0B103B] mb-2">Contractor Only</h3>
              <p className="font-nunito text-[14px] text-[#6B675F] mb-6">Executes work but lacks design vision and proper project management.</p>
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
      <section className="kv-section bg-[#F5F1E8]">
        <div className="kv-wrap">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants}
            className="text-center mb-16"
          >
            <h2 className="font-playfair font-medium text-[34px] md:text-[44px] lg:text-[54px] text-[#0B103B] leading-tight mb-4 tracking-[-0.015em]">
              The KailVarn Expert Team
            </h2>
            <p className="font-nunito text-[16px] text-[#6B675F] max-w-2xl mx-auto">
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
                  <img loading="lazy" decoding="async" src={sized(member.img, 256)} alt={member.role} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-playfair font-bold text-[18px] md:text-[20px] text-[#0B103B] leading-tight">{member.name}</h4>
                <p className="font-nunito font-bold text-[13px] md:text-[14px] text-[#D9A441] mb-2 uppercase tracking-wide">{member.role}</p>
                <p className="font-nunito text-[13px] md:text-[14px] text-[#6B675F] max-w-[200px] leading-snug">{member.bio}</p>
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
              className="order-2 lg:order-1"
            >
              <h3 className="font-playfair font-medium text-[30px] md:text-[42px] lg:text-[50px] text-[#0B103B] mb-4">
                We Serve Silvassa, Vapi & Surrounding Areas
              </h3>
              <p className="font-nunito text-[16px] text-[#6B675F] mb-6 leading-relaxed">
                KailVarn provides complete interior design and execution services across Dadra and Nagar Haveli, Daman, and surrounding regions within an approximate 50km radius.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {['Silvassa', 'Vapi', 'Daman', 'Bhilad', 'Kachigam', 'Surangi', 'Dunetha', 'Nani Daman', 'Nearby Areas'].map((area, i) => (
                  <span key={i} className="bg-[#F2B21B]/10 text-[#0B103B] border border-[#D9A441]/30 font-nunito font-semibold text-[13px] px-3 py-1.5 rounded-full">
                    {area}
                  </span>
                ))}
              </div>
              <p className="font-nunito text-[14px] text-[#6B675F] mb-6 bg-[#F5F1E8] p-4 rounded-lg border border-[#D9A441]/40">
                <strong>Not sure if we cover your area?</strong> Call or WhatsApp us — we'll confirm immediately.
              </p>
              <a href="tel:8460150027" className="btn-navy inline-flex">
                <Phone className="w-4 h-4" /> Check Your Area
              </a>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
              className="order-1 lg:order-2 h-[280px] md:h-[380px] rounded-lg overflow-hidden shadow-card border border-[#0B103B]/10"
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
      <section className="bg-[#0B103B] kv-section text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants}>
            <h2 className="font-playfair font-medium text-[36px] md:text-[50px] lg:text-[60px] text-white mb-4 leading-tight tracking-[-0.015em]">
              Ready to Work with KailVarn?
            </h2>
            <p className="font-nunito text-[16px] md:text-[18px] text-white/70 mb-8 max-w-2xl mx-auto text-balance">
              Book a free consultation and site visit. Let's discuss your space, understand your vision, and show you exactly how we can bring it to life.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/book-consultation" className="btn-primary">
                Book Free Consultation
              </Link>
              <a href="tel:8460150027" className="btn-outline">
                <Phone className="w-4 h-4"/> Call 8460150027
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default AboutUsPage;