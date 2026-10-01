'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Phone, MessageCircle, PenTool, Armchair, ChefHat, Paintbrush as PaintRoller, Hammer, Lightbulb, Box, Droplets, Zap, Bath, CheckCircle2, Bed, DoorClosed, Tv, Library, LayoutGrid, Sofa, Settings, Home, X, Check, Gift, FileText, ShieldCheck } from 'lucide-react';
import PageHero from '@/components/kv/PageHero.jsx';

// --- DATA STRUCTURES TO KEEP JSX CLEAN ---

const fullHomeInclusions = [{
  icon: PenTool,
  title: 'Interior Design',
  desc: 'Complete 3D views & layouts'
}, {
  icon: Armchair,
  title: 'Furniture',
  desc: 'Custom beds, wardrobes & more'
}, {
  icon: ChefHat,
  title: 'Kitchen',
  desc: 'Modular kitchens & counters'
}, {
  icon: PaintRoller,
  title: 'Painting',
  desc: 'Texture, putty & premium paint'
}, {
  icon: Hammer,
  title: 'Civil Work',
  desc: 'Wall shifting & base prep'
}, {
  icon: LayoutGrid,
  title: 'Flooring',
  desc: 'Tiles, marble & wooden floors'
}, {
  icon: Lightbulb,
  title: 'Lighting',
  desc: 'Profile, cove & ambient lights'
}, {
  icon: Box,
  title: 'False Ceiling',
  desc: 'POP & Gypsum designs'
}, {
  icon: Droplets,
  title: 'Plumbing',
  desc: 'Pipes, fittings & fixtures'
}, {
  icon: Zap,
  title: 'Electrical',
  desc: 'Wiring, switches & boards'
}, {
  icon: Bath,
  title: 'Bathroom',
  desc: 'Tiles, vanities & civil work'
}, {
  icon: CheckCircle2,
  title: 'All Required Work',
  desc: 'End-to-end management'
}];
const fullHomeWhy = [{
  title: 'One Team Zero Confusion',
  desc: 'No running behind multiple contractors. We handle everything from design to civil work.'
}, {
  title: 'Free 3D Interior Design',
  desc: 'Get realistic 3D designs of your home before execution starts, at absolutely no extra cost.'
}, {
  title: 'Written Agreement No Surprises',
  desc: 'Detailed quotation with materials and costs written down. You pay exactly what is agreed.'
}, {
  title: 'Same Execution as Design Guaranteed',
  desc: 'Our trained in-house team ensures the final output matches the 3D design perfectly.'
}, {
  title: 'Affordable Without Compromise',
  desc: 'Direct sourcing of materials helps us give you premium quality at reasonable prices.'
}, {
  title: 'Post-Delivery Warranty',
  desc: 'We provide comprehensive warranty on hardware and workmanship for your peace of mind.'
}];
const fullHomeSteps = [{
  num: '01',
  title: 'Site Visit & Understanding'
}, {
  num: '02',
  title: '3D Design Creation'
}, {
  num: '03',
  title: 'Agreement & Cost Finalization'
}, {
  num: '04',
  title: 'Civil & Base Work'
}, {
  num: '05',
  title: 'Furniture & Finish Work'
}, {
  num: '06',
  title: 'Delivery & Walkthrough'
}];
const kitchenInclusions = [{
  icon: Box,
  title: 'Kitchen Furniture',
  desc: 'Cabinets, drawers & trolleys'
}, {
  icon: LayoutGrid,
  title: 'Countertop',
  desc: 'Granite, quartz & marble'
}, {
  icon: Droplets,
  title: 'Plumbing',
  desc: 'Sink & water connections'
}, {
  icon: Zap,
  title: 'Electrical',
  desc: 'Appliance points & wiring'
}, {
  icon: Lightbulb,
  title: 'Lighting',
  desc: 'Under-cabinet & profile lights'
}, {
  icon: CheckCircle2,
  title: 'All Required Work',
  desc: 'Civil prep & tiling'
}];
const kitchenTypes = [{
  name: 'L-Shaped Kitchen',
  img: 'https://images.unsplash.com/photo-1556910103-1c02745a872f'
}, {
  name: 'U-Shaped Kitchen',
  img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a'
}, {
  name: 'Straight Kitchen',
  img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'
}, {
  name: 'Island Kitchen',
  img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3'
}, {
  name: 'Parallel Kitchen',
  img: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae'
}];
const furnitureTypes = [{
  icon: Bed,
  title: 'Beds & Headboards'
}, {
  icon: DoorClosed,
  title: 'Wardrobes'
}, {
  icon: Tv,
  title: 'TV Units & Cabinets'
}, {
  icon: Library,
  title: 'Bookshelves & Racks'
}, {
  icon: LayoutGrid,
  title: 'Partitions'
}, {
  icon: PenTool,
  title: 'Wooden Designs'
}, {
  icon: Sofa,
  title: 'Tables & Chairs'
}, {
  icon: Settings,
  title: 'Custom Furniture'
}];
const paintingInclusions = [{
  icon: CheckCircle2,
  title: 'Inspection & Assessment',
  desc: 'Checking wall condition first'
}, {
  icon: Hammer,
  title: 'Crack Repair',
  desc: 'Fixing all wall imperfections'
}, {
  icon: Droplets,
  title: 'Dampness & Leakage Repair',
  desc: 'Waterproofing base treatment'
}, {
  icon: PenTool,
  title: 'Designer Textures & Finishes',
  desc: 'Premium accent walls'
}, {
  icon: PaintRoller,
  title: 'Complete Painting',
  desc: 'Primer, putty & coats'
}, {
  icon: Settings,
  title: 'All Required Work',
  desc: 'Masking & cleanup included'
}];
const wallFinishes = [{
  name: 'Smooth Matte',
  desc: 'Clean, elegant, non-reflective',
  img: 'https://images.unsplash.com/photo-1562184552-997c461abbe6'
}, {
  name: 'Italian Texture',
  desc: 'Luxurious marble-like feel',
  img: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da'
}, {
  name: 'Sand Texture',
  desc: 'Granular and tactile finish',
  img: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443'
}, {
  name: 'Stucco',
  desc: 'Classic, durable, deep texture',
  img: 'https://images.unsplash.com/photo-1510172951991-856a654063f9'
}, {
  name: 'Venetian Plaster',
  desc: 'High-gloss polished look',
  img: 'https://images.unsplash.com/photo-1558211583-d26f610c1eb1'
}, {
  name: 'Metallic Finish',
  desc: 'Subtle shimmer and glow',
  img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853'
}];

// --- COMPONENT ---

export default function ServicesPage() {
  const [activeSection, setActiveSection] = useState('full-home');
  const filterBarRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        const primaryEntry = visibleEntries.reduce((prev, current) => prev.intersectionRatio > current.intersectionRatio ? prev : current);
        const newActiveId = primaryEntry.target.id;
        setActiveSection(newActiveId);

        // Mobile auto-scroll for filter bar
        if (window.innerWidth <= 768 && filterBarRef.current) {
          const activeButton = filterBarRef.current.querySelector(`[data-target="${newActiveId}"]`);
          if (activeButton) {
            const container = filterBarRef.current;
            const scrollLeft = activeButton.offsetLeft - (container.clientWidth / 2) + (activeButton.clientWidth / 2);
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
          }
        }
      }
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0, 0.25, 0.5]
    });
    
    ['full-home', 'kitchen', 'furniture', 'painting'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  const scrollTo = id => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  return <div className="bg-[#FAFAF7] min-h-screen text-[#111111]">

      {/* SECTION 1 — PAGE HERO BANNER */}
      <PageHero
        image="https://images.unsplash.com/photo-1699842223719-630261e5b56c"
        breadcrumb="Services"
        eyebrow="What We Offer"
        title="Our Interior Services"
        emphasis="Services"
        lead="Everything you need to build your dream space — designed, executed, and delivered by one expert team."
      />

      {/* SECTION 2 — STICKY FILTER BAR */}
      <div className="sticky top-[68px] lg:top-[80px] z-40 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#0B103B]/10 py-4">
        <div className="kv-wrap">
          <div 
            ref={filterBarRef}
            className="flex overflow-x-auto hide-scrollbar gap-2 justify-start lg:justify-center snap-x snap-mandatory pb-1"
          >
            {[{
            id: 'full-home',
            icon: Home,
            label: 'Full Home'
          }, {
            id: 'kitchen',
            icon: ChefHat,
            label: 'Kitchen'
          }, {
            id: 'furniture',
            icon: Armchair,
            label: 'Furniture'
          }, {
            id: 'painting',
            icon: PaintRoller,
            label: 'Painting'
          }].map(tab => {
            const Icon = tab.icon;
            return (
              <button 
                key={tab.id} 
                data-target={tab.id}
                onClick={() => scrollTo(tab.id)} 
                aria-current={activeSection === tab.id ? 'true' : undefined}
                className={`snap-center shrink-0 flex items-center gap-2 px-5 py-3 rounded-md text-[11.5px] font-extrabold uppercase tracking-[0.18em] transition-colors duration-300 border ${activeSection === tab.id ? 'bg-[#F2B21B] text-[#0B103B] border-[#F2B21B]' : 'bg-transparent text-[#0B103B]/75 border-[#0B103B]/20 hover:border-[#D9A441] hover:text-[#8A6A1C]'}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
          </div>
        </div>
      </div>

      {/* SECTION 3 — FULL HOME SERVICE */}
      <section id="full-home" className="scroll-mt-[160px]">
        {/* 3A: 2-column layout */}
        <div className="kv-wrap py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="order-2 lg:order-1 h-full">
              <div className="relative rounded-lg overflow-hidden aspect-[4/5] shadow-lg group">
                <img src="https://images.unsplash.com/photo-1693748792488-c0374f6ceb74" alt="Full Home Interior by KailVarn" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-104" />
              </div>
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="order-1 lg:order-2">
              <span className="kv-eyebrow">
                Full Home Interior
              </span>
              <h2 className="font-playfair font-medium text-[32px] md:text-[42px] lg:text-[50px] text-[#0B103B] leading-tight mb-5 tracking-[-0.015em]">
                Complete Home Transformation — Start to Finish
              </h2>
              <p className="font-nunito text-[16px] text-[#6B675F] leading-relaxed mb-8">
                Building your dream home shouldn't be a headache. We provide an end-to-end service where our designers and execution team work together to deliver exactly what you envisioned.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex flex-col gap-1 bg-white p-4 rounded-xl shadow-sm border border-[#0B103B]/10">
                  <p className="text-[14px] text-red-500/80 font-nunito strike-through flex items-center"><X className="w-4 h-4 text-red-500 mr-2 shrink-0" /> Dealing with 5 different contractors</p>
                  <p className="text-[15px] text-[#0B103B] font-nunito font-bold flex items-center"><Check className="w-4 h-4 text-green-600 mr-2 shrink-0" /> One dedicated team for the entire project</p>
                </div>
                <div className="flex flex-col gap-1 bg-white p-4 rounded-xl shadow-sm border border-[#0B103B]/10">
                  <p className="text-[14px] text-red-500/80 font-nunito strike-through flex items-center"><X className="w-4 h-4 text-red-500 mr-2 shrink-0" /> Final look doesn't match the 3D design</p>
                  <p className="text-[15px] text-[#0B103B] font-nunito font-bold flex items-center"><Check className="w-4 h-4 text-green-600 mr-2 shrink-0" /> Exact replication of approved 3D designs</p>
                </div>
                <div className="flex flex-col gap-1 bg-white p-4 rounded-xl shadow-sm border border-[#0B103B]/10">
                  <p className="text-[14px] text-red-500/80 font-nunito strike-through flex items-center"><X className="w-4 h-4 text-red-500 mr-2 shrink-0" /> Hidden costs added during work</p>
                  <p className="text-[15px] text-[#0B103B] font-nunito font-bold flex items-center"><Check className="w-4 h-4 text-green-600 mr-2 shrink-0" /> 100% Transparent written agreement</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/book-consultation" className="btn-primary">
                  Book Free Consultation
                </Link>
                <Link href="/get-free-quote" className="btn-outline-dark">
                  Get Free Quote
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 3B: Everything Included */}
        <div className="bg-[#F5F1E8] py-16">
          <div className="kv-wrap">
            <h3 className="font-playfair font-medium text-[30px] md:text-[40px] lg:text-[46px] text-center text-[#0B103B] mb-10">
              Everything Included in Full Home Interior
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {fullHomeInclusions.map((inc, i) => {
              const Icon = inc.icon;
              return <motion.div key={i} initial={{
                opacity: 0,
                y: 15
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.4,
                delay: i * 0.05
              }} className="bg-white rounded-xl p-5 md:p-6 text-center shadow-sm hover-lift">
                    <div className="w-12 h-12 mx-auto bg-[#FAFAF7] rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#D9A441] stroke-[1.5px]" />
                    </div>
                    <h4 className="font-nunito font-bold text-[14px] md:text-[15px] text-[#111111] mb-1.5">{inc.title}</h4>
                    <p className="font-nunito text-[12.5px] md:text-[13px] text-[#6B675F] leading-snug">{inc.desc}</p>
                  </motion.div>;
            })}
            </div>
          </div>
        </div>

        {/* 3C: Why KailVarn */}
        <div className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="font-playfair font-medium text-[30px] md:text-[40px] lg:text-[46px] text-center text-[#0B103B] mb-10">
              Why KailVarn for Full Home?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {fullHomeWhy.map((reason, i) => <div key={i} className="flex gap-4 items-start">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-[#F2B21B]/10 flex items-center justify-center mt-1">
                    <CheckCircle2 className="w-5 h-5 text-[#D9A441]" />
                  </div>
                  <div>
                    <h4 className="font-nunito font-bold text-[16px] md:text-[18px] text-[#111111] mb-2">{reason.title}</h4>
                    <p className="font-nunito text-[14px] md:text-[15px] text-[#6B675F] leading-relaxed">{reason.desc}</p>
                  </div>
                </div>)}
            </div>
          </div>
        </div>

        {/* 3D: How We Execute */}
        <div className="bg-[#F5F1E8] py-16 overflow-hidden">
          <div className="kv-wrap">
            <h3 className="font-playfair font-medium text-[30px] md:text-[40px] lg:text-[46px] text-center text-[#0B103B] mb-10">
              How We Execute Full Home Interior
            </h3>
            <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-4 md:pb-0">
              {fullHomeSteps.map((step, i) => <div key={i} className="snap-center shrink-0 w-[240px] md:w-auto bg-white rounded-xl p-6 shadow-sm border border-[#0B103B]/10 relative">
                  <span className="absolute top-4 right-4 font-playfair font-bold text-[32px] text-[#FAFAF7] select-none">{step.num}</span>
                  <div className="w-8 h-8 rounded-full bg-[#0B103B] text-[#D9A441] font-bold flex items-center justify-center text-[13px] mb-4 relative z-10">
                    {step.num}
                  </div>
                  <h4 className="font-nunito font-bold text-[15px] text-[#111111] leading-snug relative z-10">{step.title}</h4>
                </div>)}
            </div>
          </div>
        </div>

        {/* 3E: CTA Banner */}
        <div className="bg-[#0B103B] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="font-playfair font-medium text-[30px] md:text-[42px] lg:text-[50px] text-white mb-4">
              Start Your Full Home Interior Project Today
            </h3>
            <p className="font-nunito text-[16px] text-white/70 mb-8 max-w-2xl mx-auto">
              Our experts are ready to visit your site, understand your vision, and provide a detailed plan.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <span className="bg-white/10 text-white text-[13px] font-nunito px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/20 flex items-center gap-1.5"><Gift className="w-3.5 h-3.5" /> Free Design</span>
              <span className="bg-white/10 text-white text-[13px] font-nunito px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/20 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Agreement-Based</span>
              <span className="bg-white/10 text-white text-[13px] font-nunito px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/20 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Warranty</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/book-consultation" className="btn-primary">
                Book Free Consultation
              </Link>
              <Link href="/get-free-quote" className="btn-outline">
                <FileText className="w-4 h-4" /> Get Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — KITCHEN SERVICE */}
      <section id="kitchen" className="scroll-mt-[160px]">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#F2B21B]/30 to-transparent"></div>
        
        {/* 4A: 2-column reversed */}
        <div className="kv-wrap py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="order-2 lg:order-1">
              <span className="kv-eyebrow">
                Kitchen Interior
              </span>
              <h2 className="font-playfair font-medium text-[32px] md:text-[42px] lg:text-[50px] text-[#0B103B] leading-tight mb-5 tracking-[-0.015em]">
                Modern Kitchens Built for Indian Homes
              </h2>
              <p className="font-nunito text-[16px] text-[#6B675F] leading-relaxed mb-8">
                The heart of your home deserves the best materials and smart design. We handle the entire kitchen setup—from granite countertops and plumbing to premium modular cabinets.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex flex-col gap-1 bg-white p-4 rounded-xl shadow-sm border border-[#0B103B]/10">
                  <p className="text-[14px] text-red-500/80 font-nunito strike-through flex items-center"><X className="w-4 h-4 text-red-500 mr-2 shrink-0" /> Wood swelling due to water</p>
                  <p className="text-[15px] text-[#0B103B] font-nunito font-bold flex items-center"><Check className="w-4 h-4 text-green-600 mr-2 shrink-0" /> 100% BWP Marine Grade Plywood used</p>
                </div>
                <div className="flex flex-col gap-1 bg-white p-4 rounded-xl shadow-sm border border-[#0B103B]/10">
                  <p className="text-[14px] text-red-500/80 font-nunito strike-through flex items-center"><X className="w-4 h-4 text-red-500 mr-2 shrink-0" /> Plumber and carpenter delays</p>
                  <p className="text-[15px] text-[#0B103B] font-nunito font-bold flex items-center"><Check className="w-4 h-4 text-green-600 mr-2 shrink-0" /> Complete civil, plumbing & wood work by us</p>
                </div>
                <div className="flex flex-col gap-1 bg-white p-4 rounded-xl shadow-sm border border-[#0B103B]/10">
                  <p className="text-[14px] text-red-500/80 font-nunito strike-through flex items-center"><X className="w-4 h-4 text-red-500 mr-2 shrink-0" /> Drawers jamming after 6 months</p>
                  <p className="text-[15px] text-[#0B103B] font-nunito font-bold flex items-center"><Check className="w-4 h-4 text-green-600 mr-2 shrink-0" /> Branded hardware with replacement warranty</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/book-consultation" className="btn-primary">
                  Book Free Consultation
                </Link>
                <Link href="/get-free-quote" className="btn-outline-dark">
                  Get Free Kitchen Quote
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="order-1 lg:order-2 h-full">
              <div className="relative rounded-lg overflow-hidden aspect-[4/5] shadow-lg group">
                <img src="https://images.unsplash.com/photo-1588854337236-6889d631faa8" alt="Modern Modular Kitchen by KailVarn" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-104" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* 4B & 4C & 4D Combined Content Area */}
        <div className="bg-white py-16">
          <div className="kv-wrap">
            <h3 className="font-playfair font-medium text-[30px] md:text-[40px] lg:text-[46px] text-center text-[#0B103B] mb-10">
              What's Included in Kitchen Interior
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-20">
              {kitchenInclusions.map((inc, i) => {
              const Icon = inc.icon;
              return <div key={i} className="bg-[#FAFAF7] rounded-xl p-5 border border-[#0B103B]/10 flex items-start gap-4 hover-lift">
                    <div className="shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Icon className="w-5 h-5 text-[#D9A441]" />
                    </div>
                    <div>
                      <h4 className="font-nunito font-bold text-[14px] md:text-[15px] text-[#111111] mb-1">{inc.title}</h4>
                      <p className="font-nunito text-[12.5px] md:text-[13px] text-[#6B675F] leading-snug">{inc.desc}</p>
                    </div>
                  </div>;
            })}
            </div>

            <h3 className="font-playfair font-medium text-[30px] md:text-[40px] lg:text-[46px] text-center text-[#0B103B] mb-10">
              Kitchen Layouts We Design
            </h3>
            <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 pb-6 mb-20">
              {kitchenTypes.map((type, i) => <div key={i} className="snap-center shrink-0 w-[260px] group cursor-pointer">
                  <div className="h-[200px] rounded-xl overflow-hidden mb-3 shadow-sm">
                    <img src={type.img} alt={type.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <h4 className="font-nunito font-bold text-[15px] text-[#111111] text-center">{type.name}</h4>
                </div>)}
            </div>

            <div className="bg-[#F5F1E8] rounded-lg p-8 md:p-12">
              <h3 className="font-playfair font-medium text-[30px] md:text-[40px] lg:text-[46px] text-center text-[#0B103B] mb-10">
                Why KailVarn for Kitchen?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h4 className="font-nunito font-bold text-[17px] text-[#0B103B] mb-2 flex items-center gap-2"><ChefHat className="text-[#D9A441] w-5 h-5" /> Kitchen Experts</h4>
                  <p className="font-nunito text-[14.5px] text-[#6B675F]">We understand Indian cooking habits. Ergonomic triangle layouts, heavy-duty hinges, and deep storage for large utensils.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h4 className="font-nunito font-bold text-[17px] text-[#0B103B] mb-2 flex items-center gap-2"><Box className="text-[#D9A441] w-5 h-5" /> Materials that Last</h4>
                  <p className="font-nunito text-[14.5px] text-[#6B675F]">Strictly Marine Grade BWP Plywood for wet areas, scratch-resistant acrylic/laminate finishes, and anti-rust hardware.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h4 className="font-nunito font-bold text-[17px] text-[#0B103B] mb-2 flex items-center gap-2"><Droplets className="text-[#D9A441] w-5 h-5" /> No Plumber Runs</h4>
                  <p className="font-nunito text-[14.5px] text-[#6B675F]">We handle the sink installation, piping, and granite cutting ourselves. No coordinating with outside plumbers.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h4 className="font-nunito font-bold text-[17px] text-[#0B103B] mb-2 flex items-center gap-2"><PenTool className="text-[#D9A441] w-5 h-5" /> 3D Visualization First</h4>
                  <p className="font-nunito text-[14.5px] text-[#6B675F]">See exactly where your stove, sink, and fridge will go in detailed 3D before we cut a single piece of wood.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4E: CTA Banner */}
        <div className="bg-[#0B103B] py-14 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h3 className="font-playfair font-medium text-[24px] md:text-[28px] text-white mb-2">
                Get Your Dream Kitchen Designed — Free
              </h3>
              <p className="font-nunito text-[15px] text-white/70">
                Schedule a site visit and let our designers plan your space.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link href="/book-consultation" className="btn-primary">
                Book Consultation
              </Link>
              <Link href="/get-free-quote" className="bg-white/10 hover:bg-white/20 text-white font-nunito font-bold text-[15px] px-6 py-3 rounded-lg border border-white/20 whitespace-nowrap active:scale-[0.98] transition-all text-center">
                Get Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — FURNITURE SERVICE */}
      <section id="furniture" className="scroll-mt-[160px]">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#F2B21B]/30 to-transparent"></div>
        
        {/* 5A: 2-column layout */}
        <div className="kv-wrap py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="order-2 lg:order-1 h-full">
              <div className="relative rounded-lg overflow-hidden aspect-[4/5] shadow-lg group">
                <img src="https://images.unsplash.com/photo-1631889993877-71e193bf79b8" alt="Custom Furniture by KailVarn" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-104" />
              </div>
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="order-1 lg:order-2">
              <span className="kv-eyebrow">
                Custom Furniture
              </span>
              <h2 className="font-playfair font-medium text-[32px] md:text-[42px] lg:text-[50px] text-[#0B103B] leading-tight mb-5 tracking-[-0.015em]">
                Custom Furniture Crafted for Your Exact Space
              </h2>
              <p className="font-nunito text-[16px] text-[#6B675F] leading-relaxed mb-8">
                Ready-made furniture rarely fits perfectly. Our expert carpenters build custom wardrobes, beds, and units that maximize your storage and elevate your interiors.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex flex-col gap-1 bg-white p-4 rounded-xl shadow-sm border border-[#0B103B]/10">
                  <p className="text-[14px] text-red-500/80 font-nunito strike-through flex items-center"><X className="w-4 h-4 text-red-500 mr-2 shrink-0" /> Gaps above wardrobes collecting dust</p>
                  <p className="text-[15px] text-[#0B103B] font-nunito font-bold flex items-center"><Check className="w-4 h-4 text-green-600 mr-2 shrink-0" /> Floor-to-ceiling seamless fit</p>
                </div>
                <div className="flex flex-col gap-1 bg-white p-4 rounded-xl shadow-sm border border-[#0B103B]/10">
                  <p className="text-[14px] text-red-500/80 font-nunito strike-through flex items-center"><X className="w-4 h-4 text-red-500 mr-2 shrink-0" /> Flimsy particle board furniture</p>
                  <p className="text-[15px] text-[#0B103B] font-nunito font-bold flex items-center"><Check className="w-4 h-4 text-green-600 mr-2 shrink-0" /> Heavy-duty branded plywood used</p>
                </div>
                <div className="flex flex-col gap-1 bg-white p-4 rounded-xl shadow-sm border border-[#0B103B]/10">
                  <p className="text-[14px] text-red-500/80 font-nunito strike-through flex items-center"><X className="w-4 h-4 text-red-500 mr-2 shrink-0" /> Peeling edges after a few months</p>
                  <p className="text-[15px] text-[#0B103B] font-nunito font-bold flex items-center"><Check className="w-4 h-4 text-green-600 mr-2 shrink-0" /> Machine edge-banding for flawless finish</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/book-consultation" className="btn-primary">
                  Book Free Consultation
                </Link>
                <Link href="/get-free-quote" className="btn-outline-dark">
                  Get Free Quote
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 5B & 5C & 5D Combined */}
        <div className="bg-[#F5F1E8] py-16">
          <div className="kv-wrap">
            <h3 className="font-playfair font-medium text-[30px] md:text-[40px] lg:text-[46px] text-center text-[#0B103B] mb-10">
              Types of Furniture We Create
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
              {furnitureTypes.map((type, i) => {
              const Icon = type.icon;
              return <div key={i} className="bg-white rounded-xl p-5 text-center shadow-sm border border-[#0B103B]/10 hover-lift">
                    <Icon className="w-8 h-8 text-[#D9A441] mx-auto mb-3 stroke-[1.5px]" />
                    <h4 className="font-nunito font-bold text-[14px] md:text-[15px] text-[#111111]">{type.title}</h4>
                  </div>;
            })}
            </div>

            <div className="bg-white rounded-lg p-8 md:p-12 mb-20 border border-[#0B103B]/10">
              <h3 className="font-playfair font-medium text-[30px] md:text-[40px] lg:text-[46px] text-center text-[#0B103B] mb-10">
                Premium Materials & Finishes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-nunito font-bold text-[18px] text-[#0B103B] border-b-2 border-[#D9A441]/30 pb-2 mb-4">Core Material</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 font-nunito text-[15px] text-[#6B675F]"><CheckCircle2 className="w-4 h-4 text-[#D9A441]" /> BWR Grade Plywood</li>
                    <li className="flex items-center gap-2 font-nunito text-[15px] text-[#6B675F]"><CheckCircle2 className="w-4 h-4 text-[#D9A441]" /> BWP Marine Plywood</li>
                    <li className="flex items-center gap-2 font-nunito text-[15px] text-[#6B675F]"><CheckCircle2 className="w-4 h-4 text-[#D9A441]" /> HDHMR Boards</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-nunito font-bold text-[18px] text-[#0B103B] border-b-2 border-[#D9A441]/30 pb-2 mb-4">Outer Finish</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 font-nunito text-[15px] text-[#6B675F]">
                      <div className="w-4 h-4 rounded-sm bg-gradient-to-br from-gray-200 to-gray-400 border border-gray-300"></div> High-Gloss Laminate
                    </li>
                    <li className="flex items-center gap-2 font-nunito text-[15px] text-[#6B675F]">
                      <div className="w-4 h-4 rounded-sm bg-stone-300 border border-gray-300"></div> Matte Laminate
                    </li>
                    <li className="flex items-center gap-2 font-nunito text-[15px] text-[#6B675F]">
                      <div className="w-4 h-4 rounded-sm bg-amber-800 border border-gray-300"></div> Wood Veneer & Polish
                    </li>
                    <li className="flex items-center gap-2 font-nunito text-[15px] text-[#6B675F]">
                      <div className="w-4 h-4 rounded-sm bg-blue-100 border border-gray-300"></div> Acrylic & PU Paint
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-nunito font-bold text-[18px] text-[#0B103B] border-b-2 border-[#D9A441]/30 pb-2 mb-4">Fittings & Hardware</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 font-nunito text-[15px] text-[#6B675F]"><CheckCircle2 className="w-4 h-4 text-[#D9A441]" /> Hettich</li>
                    <li className="flex items-center gap-2 font-nunito text-[15px] text-[#6B675F]"><CheckCircle2 className="w-4 h-4 text-[#D9A441]" /> Hafele</li>
                    <li className="flex items-center gap-2 font-nunito text-[15px] text-[#6B675F]"><CheckCircle2 className="w-4 h-4 text-[#D9A441]" /> Ebco</li>
                    <li className="flex items-center gap-2 font-nunito text-[15px] text-[#6B675F]"><CheckCircle2 className="w-4 h-4 text-[#D9A441]" /> Soft-close hinges default</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="font-playfair font-medium text-[30px] md:text-[40px] lg:text-[46px] text-center text-[#0B103B] mb-10">
              Why KailVarn for Furniture?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm flex gap-4 items-start">
                <div className="shrink-0 w-10 h-10 bg-[#F2B21B]/10 rounded-lg flex justify-center items-center mt-1">
                  <LayoutGrid className="w-5 h-5 text-[#D9A441]" />
                </div>
                <div>
                  <h4 className="font-nunito font-bold text-[17px] text-[#111111] mb-2">Exact Space Fit</h4>
                  <p className="font-nunito text-[14.5px] text-[#6B675F]">We measure your space to the millimeter so every wardrobe and unit fits flush against your walls.</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm flex gap-4 items-start">
                <div className="shrink-0 w-10 h-10 bg-[#F2B21B]/10 rounded-lg flex justify-center items-center mt-1">
                  <CheckCircle2 className="w-5 h-5 text-[#D9A441]" />
                </div>
                <div>
                  <h4 className="font-nunito font-bold text-[17px] text-[#111111] mb-2">Material Transparency</h4>
                  <p className="font-nunito text-[14.5px] text-[#6B675F]">You see the branded plywood and laminate sheets before we cut them. No cheap substitutes.</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm flex gap-4 items-start">
                <div className="shrink-0 w-10 h-10 bg-[#F2B21B]/10 rounded-lg flex justify-center items-center mt-1">
                  <Hammer className="w-5 h-5 text-[#D9A441]" />
                </div>
                <div>
                  <h4 className="font-nunito font-bold text-[17px] text-[#111111] mb-2">In-house Craftsmen</h4>
                  <p className="font-nunito text-[14.5px] text-[#6B675F]">Our skilled carpenters have years of experience creating intricate designs and clean finishes.</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm flex gap-4 items-start">
                <div className="shrink-0 w-10 h-10 bg-[#F2B21B]/10 rounded-lg flex justify-center items-center mt-1">
                  <ShieldCheck className="w-5 h-5 text-[#D9A441]" />
                </div>
                <div>
                  <h4 className="font-nunito font-bold text-[17px] text-[#111111] mb-2">Warranty on Work</h4>
                  <p className="font-nunito text-[14.5px] text-[#6B675F]">Hardware replacements and workmanship guarantees are written into your contract.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5E: CTA Banner */}
        <div className="bg-[#0B103B] py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h3 className="font-playfair font-medium text-[24px] md:text-[28px] text-white mb-2">
                Get Custom Furniture Designed for Your Home
              </h3>
              <p className="font-nunito text-[15px] text-white/70">
                Book a consultation and get accurate 3D views of your furniture.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link href="/book-consultation" className="btn-primary">
                Book Consultation
              </Link>
              <Link href="/get-free-quote" className="bg-white/10 hover:bg-white/20 text-white font-nunito font-bold text-[15px] px-6 py-3 rounded-lg border border-white/20 whitespace-nowrap active:scale-[0.98] transition-all text-center">
                Get Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — PAINTING SERVICE */}
      <section id="painting" className="scroll-mt-[160px]">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#F2B21B]/30 to-transparent"></div>
        
        {/* 6A: 2-column reversed */}
        <div className="kv-wrap py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="order-2 lg:order-1">
              <span className="kv-eyebrow">
                Painting & Wall Finishes
              </span>
              <h2 className="font-playfair font-medium text-[32px] md:text-[42px] lg:text-[50px] text-[#0B103B] leading-tight mb-5 tracking-[-0.015em]">
                Beautiful, Long-Lasting Walls — Inside and Out
              </h2>
              <p className="font-nunito text-[16px] text-[#6B675F] leading-relaxed mb-8">
                Painting isn't just about color; it's about wall health. We treat dampness, repair cracks, and apply premium paints and textures for a flawless finish.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex flex-col gap-1 bg-white p-4 rounded-xl shadow-sm border border-[#0B103B]/10">
                  <p className="text-[14px] text-red-500/80 font-nunito strike-through flex items-center"><X className="w-4 h-4 text-red-500 mr-2 shrink-0" /> Paint peeling off due to wall dampness</p>
                  <p className="text-[15px] text-[#0B103B] font-nunito font-bold flex items-center"><Check className="w-4 h-4 text-green-600 mr-2 shrink-0" /> Waterproofing & dampness treatment first</p>
                </div>
                <div className="flex flex-col gap-1 bg-white p-4 rounded-xl shadow-sm border border-[#0B103B]/10">
                  <p className="text-[14px] text-red-500/80 font-nunito strike-through flex items-center"><X className="w-4 h-4 text-red-500 mr-2 shrink-0" /> Uneven finish and visible brush strokes</p>
                  <p className="text-[15px] text-[#0B103B] font-nunito font-bold flex items-center"><Check className="w-4 h-4 text-green-600 mr-2 shrink-0" /> Proper base putty and mechanical sanding</p>
                </div>
                <div className="flex flex-col gap-1 bg-white p-4 rounded-xl shadow-sm border border-[#0B103B]/10">
                  <p className="text-[14px] text-red-500/80 font-nunito strike-through flex items-center"><X className="w-4 h-4 text-red-500 mr-2 shrink-0" /> Messy floors after the painters leave</p>
                  <p className="text-[15px] text-[#0B103B] font-nunito font-bold flex items-center"><Check className="w-4 h-4 text-green-600 mr-2 shrink-0" /> Complete masking & post-painting cleanup</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/book-consultation" className="btn-primary">
                  Book Free Consultation
                </Link>
                <Link href="/get-free-quote" className="btn-outline-dark">
                  Get Free Quote
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="order-1 lg:order-2 h-full">
              <div className="relative rounded-lg overflow-hidden aspect-[4/5] shadow-lg group">
                <img src="https://images.unsplash.com/photo-1566288940339-fc6dd14a5849" alt="Painting & Wall Finishes by KailVarn" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-104" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* 6B & 6C & 6D Combined */}
        <div className="bg-white py-16">
          <div className="kv-wrap">
            <h3 className="font-playfair font-medium text-[30px] md:text-[40px] lg:text-[46px] text-center text-[#0B103B] mb-10">
              What's Included in Painting Service
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-20">
              {paintingInclusions.map((inc, i) => {
              const Icon = inc.icon;
              return <div key={i} className="bg-[#FAFAF7] rounded-xl p-5 border border-[#0B103B]/10 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 hover-lift">
                    <div className="shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 md:mb-0">
                      <Icon className="w-5 h-5 text-[#D9A441]" />
                    </div>
                    <div>
                      <h4 className="font-nunito font-bold text-[14px] md:text-[15px] text-[#111111] mb-1">{inc.title}</h4>
                      <p className="font-nunito text-[12.5px] md:text-[13px] text-[#6B675F] leading-snug">{inc.desc}</p>
                    </div>
                  </div>;
            })}
            </div>

            <h3 className="font-playfair font-medium text-[30px] md:text-[40px] lg:text-[46px] text-center text-[#0B103B] mb-10">
              Wall Finish Types
            </h3>
            <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 pb-6 mb-20">
              {wallFinishes.map((type, i) => <div key={i} className="snap-center shrink-0 w-[220px] group cursor-pointer relative overflow-hidden rounded-xl">
                  <div className="h-[280px]">
                    <img src={type.img} alt={type.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                    <h4 className="font-nunito font-bold text-[16px] text-white leading-tight">{type.name}</h4>
                    <p className="font-nunito text-[13px] text-white/80 mt-1">{type.desc}</p>
                  </div>
                </div>)}
            </div>

            <div className="bg-[#F5F1E8] rounded-lg p-8 md:p-12">
              <h3 className="font-playfair font-medium text-[30px] md:text-[40px] lg:text-[46px] text-center text-[#0B103B] mb-10">
                Why KailVarn for Painting?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                  <div className="w-10 h-10 bg-[#F2B21B]/10 rounded-full flex justify-center items-center mx-auto mb-4">
                    <Hammer className="w-5 h-5 text-[#D9A441]" />
                  </div>
                  <h4 className="font-nunito font-bold text-[16px] text-[#0B103B] mb-2">Repair First, Paint Later</h4>
                  <p className="font-nunito text-[13.5px] text-[#6B675F]">We don't just paint over cracks. We treat the root cause of wall damage first.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                  <div className="w-10 h-10 bg-[#F2B21B]/10 rounded-full flex justify-center items-center mx-auto mb-4">
                    <CheckCircle2 className="w-5 h-5 text-[#D9A441]" />
                  </div>
                  <h4 className="font-nunito font-bold text-[16px] text-[#0B103B] mb-2">Branded Paints Only</h4>
                  <p className="font-nunito text-[13.5px] text-[#6B675F]">Strict use of Asian Paints, Dulux, or Jotun in genuine sealed buckets.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                  <div className="w-10 h-10 bg-[#F2B21B]/10 rounded-full flex justify-center items-center mx-auto mb-4">
                    <Settings className="w-5 h-5 text-[#D9A441]" />
                  </div>
                  <h4 className="font-nunito font-bold text-[16px] text-[#0B103B] mb-2">Clean & Professional</h4>
                  <p className="font-nunito text-[13.5px] text-[#6B675F]">Furniture and floors are masked. We leave your home spotless.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                  <div className="w-10 h-10 bg-[#F2B21B]/10 rounded-full flex justify-center items-center mx-auto mb-4">
                    <ShieldCheck className="w-5 h-5 text-[#D9A441]" />
                  </div>
                  <h4 className="font-nunito font-bold text-[16px] text-[#0B103B] mb-2">Warranty on Work</h4>
                  <p className="font-nunito text-[13.5px] text-[#6B675F]">Backed by service warranty against peeling and flaking due to application faults.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6E: CTA Banner */}
        <div className="bg-[#0B103B] py-14 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h3 className="font-playfair font-medium text-[24px] md:text-[28px] text-white mb-2">
                Get Beautiful, Durable Walls for Your Home
              </h3>
              <p className="font-nunito text-[15px] text-white/70">
                Let our experts inspect your walls and recommend the right finish.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link href="/book-consultation" className="btn-primary">
                Book Consultation
              </Link>
              <Link href="/get-free-quote" className="bg-white/10 hover:bg-white/20 text-white font-nunito font-bold text-[15px] px-6 py-3 rounded-lg border border-white/20 whitespace-nowrap active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-center">
                Get Free Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — FINAL CTA */}
      <section className="bg-[#0B103B] kv-section relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(#D9A441 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }}></div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-playfair font-medium text-[36px] md:text-[50px] lg:text-[60px] text-white leading-tight mb-5 tracking-[-0.015em]">
            Not Sure Which Service You Need?
          </h2>
          <p className="font-nunito text-[16px] md:text-[18px] text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">
            Book a free consultation with our interior designer. We will visit your site, understand your requirements, and help you choose the best path forward.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link href="/book-consultation" className="btn-primary w-full sm:w-auto">
              Book Free Consultation
            </Link>
            <a href="https://wa.me/918401226123" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-nunito font-bold text-[16px] px-10 py-4 rounded-lg shadow-xl transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2 active:scale-[0.98]">
              <MessageCircle className="w-5 h-5" /> WhatsApp Us Now
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 font-nunito text-[14px] text-white/50 border-t border-white/10 pt-8">
            <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> 8401226123</span>
            <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> kailvarn0@gmail.com</span>
            <span className="flex items-center gap-2"><PenTool className="w-4 h-4" /> Silvassa & Vapi</span>
          </div>
        </div>
      </section>
    </div>;
}