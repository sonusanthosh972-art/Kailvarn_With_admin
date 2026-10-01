'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ChefHat, Armchair, Paintbrush as PaintRoller, Users, PencilRuler, FileText, CheckSquare, Umbrella, ShieldCheck, PenTool, FileSignature, Hammer, ChevronDown, Sparkles, Check, MessageCircle, Gift, Zap, Phone, Mail, Star } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

import { useWhatsAppLink } from '@/hooks/useWhatsAppLink.js';

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
    id: 'kitchenInterior',
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

const comparisonTable = [
  { feature: 'Interior Design Provided', kailvarn: '✅ Free', designer: '❌ Not included', contractor: '✅ Paid (expensive)' },
  { feature: 'Execution of Work', kailvarn: '✅ Yes — full', designer: '✅ Yes (labour only)', contractor: '❌ You manage yourself' },
  { feature: 'Single Point of Contact', kailvarn: '✅ One team', designer: '❌ Multiple', contractor: '❌ Multiple' },
  { feature: 'Hidden Cost Risk', kailvarn: '✅ Zero — agreement', designer: '⚠️ High risk', contractor: '⚠️ Medium risk' },
  { feature: 'Design Matches Execution', kailvarn: '✅ Guaranteed', designer: '❌ Rarely matches', contractor: '⚠️ Often mismatch' },
  { feature: 'Warranty on Work', kailvarn: '✅ Yes', designer: '❌ Usually no', contractor: '❌ Not applicable' },
  { feature: 'Affordable Pricing', kailvarn: '✅ Yes', designer: '⚠️ Depends', contractor: '❌ Costly' },
  { feature: 'Modern Tools Used', kailvarn: '✅ Yes', designer: '⚠️ Varies', contractor: '❌ Not their scope' },
  { feature: 'Agreement Signed', kailvarn: '✅ Always', designer: '❌ Rarely', contractor: '⚠️ Consultation only' },
  { feature: 'Stress-Free Experience', kailvarn: '✅ Complete', designer: '❌ Stressful', contractor: '⚠️ Partial' }
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

export default function HomePage() {
  const { openWhatsApp } = useWhatsAppLink();
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 5000, stopOnInteraction: true })]);

  return (
    <div className="bg-[#F8F5F0] text-[#1C1C1C] font-nunito selection:bg-[#C9A84C] selection:text-white">
      {/* SECTION 1 — HERO */}
      <section className="relative min-h-[100dvh] md:min-h-[620px] flex items-center justify-center overflow-hidden pt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1673935144761-57a1c4b1933f")' }}
        />
        <div 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(15,15,30,0.85) 0%, rgba(15,15,30,0.55) 100%)' }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pb-12">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="inline-flex items-center bg-[#C9A84C]/20 border border-[#C9A84C]/40 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="font-nunito font-semibold text-[13px] text-[#C9A84C] tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Silvassa's and Vapi's Trusted Interior Experts
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-playfair font-extrabold text-[36px] md:text-[62px] text-white leading-[1.15] max-w-[780px] mx-auto text-shadow-sm"
          >
            Transform Your Space Into Your Dream Home
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="font-nunito font-normal text-[16px] md:text-[19px] text-white/85 max-w-[640px] mx-auto mt-5 leading-relaxed"
          >
            Complete Interior Design & Execution — Full Home, Kitchen, Furniture & Painting. One Expert Team. Exact Same Execution. No Hidden Cost.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.8 }
              }
            }}
            className="flex flex-row flex-wrap justify-center gap-[20px] mt-8 max-w-[800px] mx-auto"
          >
            {[
              'Free Interior Designer', 'No Hidden Cost', 'Same-as-Design Execution', 
              'No Contractor Hassle', 'Warranty on Work', 'Affordable Pricing'
            ].map((badge, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                }}
                className="glass-panel rounded-full px-4 py-2 flex items-center gap-2"
              >
                <CheckSquare className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span className="font-nunito font-semibold text-[13px] text-white">
                  {badge}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 mt-9 w-full sm:w-auto"
          >
            <Link 
              href="/book-consultation"
              className="bg-[#C9A84C] hover:bg-[#b59540] text-white font-nunito font-bold text-[16px] px-9 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto text-center active:scale-[0.98]"
            >
              Book Free Consultation
            </Link>
            <button 
              onClick={() => openWhatsApp()}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-[#1A1A2E] text-white font-nunito font-bold text-[16px] px-9 py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp Us
            </button>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* SECTION 2 — OUR SERVICES */}
      <section className="bg-[#F8F5F0] py-[80px]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="font-nunito font-semibold text-[12px] tracking-[2.5px] text-[#C9A84C] uppercase block mb-3">
              What We Offer
            </span>
            <h2 className="font-playfair font-bold text-[36px] md:text-[42px] text-[#1C1C1C] mb-4">
              Our Interior Services
            </h2>
            <p className="font-nunito font-normal text-[16px] md:text-[17px] text-[#555555] max-w-[560px] mx-auto leading-relaxed">
              From full home transformation to a single wall — we handle everything under one expert roof.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.div 
                  key={svc.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group bg-white rounded-[16px] shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-1.5 border-t-[3px] border-transparent hover:border-[#C9A84C] flex flex-col overflow-hidden"
                >
                  <div className="h-[220px] overflow-hidden">
                    <img 
                      src={svc.img} 
                      alt={svc.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <Icon className="w-10 h-10 text-[#C9A84C] stroke-[1.5px]" />
                    <h3 className="font-playfair font-semibold text-[22px] text-[#1C1C1C] mt-3">
                      {svc.title}
                    </h3>
                    <p className="font-nunito text-[14.5px] text-[#555] leading-[1.6] mt-2.5">
                      {svc.desc}
                    </p>
                    <ul className="mt-4 space-y-2 flex-1">
                      {svc.usps.map((usp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#C9A84C] mt-0.5 shrink-0" />
                          <span className="font-nunito font-medium text-[13px] text-[#555] leading-tight">
                            {usp}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link 
                      href={`/services#${svc.id}`}
                      className="inline-flex items-center font-nunito font-bold text-[14px] text-[#C9A84C] mt-6 group/link transition-all"
                    >
                      {svc.ctaText}
                      <span className="ml-1 transition-transform group-hover/link:translate-x-1">→</span>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3 — WHY KAILVARN */}
      <section className="bg-[#EFEBE4] py-[80px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="font-nunito font-semibold text-[12px] tracking-[2.5px] text-[#C9A84C] uppercase block mb-3">
              Our Advantage
            </span>
            <h2 className="font-playfair font-bold text-[36px] md:text-[42px] text-[#1C1C1C] mb-4">
              Why Choose KailVarn?
            </h2>
            <p className="font-nunito font-normal text-[16px] md:text-[17px] text-[#555555] max-w-[580px] mx-auto leading-relaxed">
              We're not just a design firm. Not just a contractor. We're your complete interior partner — from first sketch to final delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUsData.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white rounded-[14px] p-7 shadow-sm hover:shadow-md transition-all duration-300 border-b-[3px] border-transparent hover:border-[#C9A84C] hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-[#F8F5F0] rounded-xl flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-[#C9A84C] stroke-[1.5px]" />
                  </div>
                  <h4 className="font-playfair font-semibold text-[20px] text-[#1C1C1C] mb-3 leading-snug">
                    {item.title}
                  </h4>
                  <p className="font-nunito text-[15px] text-[#555] leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4 — HOW WE WORK */}
      <section className="bg-[#F8F5F0] py-[80px] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-nunito font-semibold text-[12px] tracking-[2.5px] text-[#C9A84C] uppercase block mb-3">
              Our Process
            </span>
            <h2 className="font-playfair font-bold text-[36px] md:text-[42px] text-[#1C1C1C] mb-4">
              How KailVarn Works
            </h2>
            <p className="font-nunito font-normal text-[16px] md:text-[17px] text-[#555555] max-w-[560px] mx-auto leading-relaxed">
              A simple, transparent 4-step process — from understanding your vision to delivering your dream space.
            </p>
          </div>

          <div className="relative">
            {/* Desktop connecting line */}
            <div className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-[#C9A84C]/30 z-0"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-6 relative z-10">
              {processSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    className="relative flex flex-col items-center lg:items-start text-center lg:text-left"
                  >
                    {/* Mobile connecting line */}
                    {i !== processSteps.length - 1 && (
                      <div className="lg:hidden absolute top-[60px] bottom-[-40px] left-1/2 w-[2px] border-l-2 border-dashed border-[#C9A84C]/30 -translate-x-1/2 z-[-1]"></div>
                    )}

                    <div className="w-[60px] h-[60px] rounded-full bg-[#C9A84C] flex items-center justify-center mb-6 shadow-md relative z-10 shrink-0">
                      <span className="font-playfair font-bold text-[22px] text-[#1A1A2E]">{step.num}</span>
                    </div>
                    
                    <div className="flex flex-col items-center lg:items-start">
                      <div className="inline-block bg-[#1A1A2E] text-white text-[10px] font-bold px-2 py-1 rounded-sm mb-3 uppercase tracking-wider">
                        {step.badge}
                      </div>
                      <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                        <Icon className="w-5 h-5 text-[#C9A84C]" />
                        <h3 className="font-playfair font-semibold text-[20px] text-[#1C1C1C] leading-tight">
                          {step.title}
                        </h3>
                      </div>
                      <p className="font-nunito text-[14.5px] text-[#555] leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — COMPARISON TABLE */}
      <section className="bg-[#1A1A2E] py-[80px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="font-nunito font-semibold text-[12px] tracking-[2.5px] text-[#C9A84C] uppercase block mb-3">
              How We Are Different
            </span>
            <h2 className="font-playfair font-bold text-[34px] md:text-[40px] text-white mb-4">
              KailVarn vs Designer vs Contractor
            </h2>
            <p className="font-nunito font-normal text-[16px] md:text-[17px] text-white/70 max-w-[600px] mx-auto leading-relaxed">
              Understand why KailVarn is the smarter, better, more complete choice for your interior project.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-x-auto hide-scrollbar rounded-xl border border-white/10 shadow-2xl"
          >
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.06]">
                  <th className="py-5 px-6 font-nunito font-bold text-[16px] text-white/90 border-b border-white/10 w-[30%]">Feature</th>
                  <th className="py-5 px-6 font-nunito font-bold text-[18px] text-[#C9A84C] border-b border-white/10 w-[23%] bg-[#C9A84C]/10 border-x-2 border-t-2 border-[#C9A84C] rounded-t-lg">KailVarn</th>
                  <th className="py-5 px-6 font-nunito font-bold text-[16px] text-white/90 border-b border-white/10 w-[23%]">Designer Only</th>
                  <th className="py-5 px-6 font-nunito font-bold text-[16px] text-white/90 border-b border-white/10 w-[24%]">Contractor Only</th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-nunito font-medium text-[15px] text-white/80">{row.feature}</td>
                    <td className="py-4 px-6 font-nunito font-bold text-[15px] text-white bg-[#C9A84C]/10 border-x-2 border-[#C9A84C]">{row.kailvarn}</td>
                    <td className="py-4 px-6 font-nunito font-normal text-[14.5px] text-white/60">{row.designer}</td>
                    <td className="py-4 px-6 font-nunito font-normal text-[14.5px] text-white/60">{row.contractor}</td>
                  </tr>
                ))}
                {/* Bottom border closer for highlighted column */}
                <tr>
                  <td className="p-0 border-0"></td>
                  <td className="p-0 border-b-2 border-x-2 border-[#C9A84C] bg-[#C9A84C]/10 rounded-b-lg h-2"></td>
                  <td className="p-0 border-0"></td>
                  <td className="p-0 border-0"></td>
                </tr>
              </tbody>
            </table>
          </motion.div>

          <div className="mt-10 text-center">
            <Link 
              href="/get-free-quote"
              className="inline-block bg-[#C9A84C] hover:bg-[#b59540] text-white font-nunito font-bold text-[16px] px-8 py-3.5 rounded-lg shadow-lg transition-all duration-300 active:scale-[0.98]"
            >
              Get Free Quote — See the Difference
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6 — TESTIMONIALS */}
      <section className="bg-[#EFEBE4] py-[80px] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="font-nunito font-semibold text-[12px] tracking-[2.5px] text-[#C9A84C] uppercase block mb-3">
              Client Love
            </span>
            <h2 className="font-playfair font-bold text-[36px] md:text-[42px] text-[#1C1C1C] mb-4">
              What Our Clients Say
            </h2>
            <p className="font-nunito font-normal text-[16px] md:text-[17px] text-[#555555] max-w-[600px] mx-auto leading-relaxed">
              Real words from real clients — families and businesses who trusted KailVarn for their interiors.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="embla overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0" 
            ref={emblaRef}
          >
            <div className="embla__container flex touch-pan-y">
              {testimonials.map((test, i) => (
                <div key={i} className="embla__slide flex-[0_0_90%] md:flex-[0_0_45%] lg:flex-[0_0_33.333%] min-w-0 pl-6 h-auto">
                  <div className="bg-white rounded-[16px] p-7 md:p-8 shadow-sm h-full flex flex-col justify-between border border-black/5 cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform duration-300">
                    <div>
                      <div className="flex gap-1 mb-4">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className="w-4 h-4 text-[#C9A84C] fill-[#C9A84C]" />
                        ))}
                      </div>
                      <p className="font-nunito text-[15.5px] italic text-[#333] leading-[1.7] mb-6 relative z-10">
                        "{test.text}"
                      </p>
                    </div>
                    <div>
                      <div className="w-10 h-[1px] bg-[#C9A84C]/50 mb-4"></div>
                      <h4 className="font-nunito font-bold text-[15px] text-[#1C1C1C]">{test.author}</h4>
                      <p className="font-nunito text-[13px] text-[#C9A84C] font-semibold mt-0.5">
                        {test.location} | {test.service}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 7 — FINAL CTA */}
      <section className="relative bg-[#12121F] py-[100px] overflow-hidden">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#C9A84C 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <span className="font-nunito font-semibold text-[12px] tracking-[2.5px] text-[#C9A84C] uppercase block mb-4">
            Start Your Journey
          </span>
          <h2 className="font-playfair font-bold text-[36px] md:text-[44px] text-white leading-tight mb-5 max-w-[700px]">
            Ready to Create Your Dream Interior?
          </h2>
          <p className="font-nunito text-[16px] md:text-[17px] text-white/70 max-w-[580px] leading-relaxed mb-8">
            Get a FREE consultation and transparent quotation — no commitment, no pressure. Our expert team is ready to understand your vision and turn it into reality.
          </p>

          <div className="flex flex-row flex-wrap justify-center gap-[20px] mb-9">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-white/90" />
              <span className="font-nunito font-medium text-[14px] text-white/90">Free Consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-white/90" />
              <span className="font-nunito font-medium text-[14px] text-white/90">No Hidden Cost</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-white/90" />
              <span className="font-nunito font-medium text-[14px] text-white/90">Fast Response</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Link 
              href="/book-consultation"
              className="bg-[#C9A84C] hover:bg-[#b59540] text-white font-nunito font-bold text-[16px] px-10 py-4 rounded-lg shadow-xl transition-all duration-300 w-full sm:w-auto text-center active:scale-[0.98]"
            >
              Book Free Consultation
            </Link>
            <Link 
              href="/contact"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-[#1A1A2E] text-white font-nunito font-bold text-[16px] px-10 py-4 rounded-lg transition-all duration-300 w-full sm:w-auto text-center active:scale-[0.98]"
            >
              Get Free Quote
            </Link>
          </div>

          <div className="mt-10 font-nunito font-normal text-[14px] text-white/55 flex flex-wrap justify-center gap-4">
            <span>Or reach us directly —</span>
            <a href="tel:8401226123" className="hover:text-white transition-colors flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> 8401226123</a>
            <span className="hidden sm:inline">|</span>
            <button onClick={() => openWhatsApp()} className="hover:text-[#25D366] transition-colors flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> WhatsApp</button>
            <span className="hidden sm:inline">|</span>
            <a href="mailto:kailvarn0@gmail.com" className="hover:text-white transition-colors flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> kailvarn0@gmail.com</a>
          </div>
        </div>
      </section>
    </div>
  );
}