'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { submitLead } from '@/lib/submitLead.js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, UserX, Palette, Receipt, ShieldCheck, 
  Wallet, ClipboardList, Eye, PhoneCall, FileText, 
  Phone, Mail, Star, MapPin, Loader2, Lock
} from 'lucide-react';
import PageHero from '@/components/kv/PageHero.jsx';

function GetFreeQuotePage() {
  const [submittedData, setSubmittedData] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors, isValid, isSubmitting } 
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      contactMethod: 'Either is Fine',
      message: ''
    }
  });

  const messageValue = watch('message') || '';

  const onSubmit = async (data) => {
    setSubmitError('');
    const result = await submitLead('/api/quotes', data);
    if (!result.ok) {
      setSubmitError(result.message);
      return;
    }
    setSubmittedData(data);
  };

  const scrollVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const usps = [
    { icon: UserX, title: "No Contractor Hassle", desc: "We handle everything from start to finish." },
    { icon: Palette, title: "Free Interior Designer", desc: "Professional design included at no extra cost." },
    { icon: Receipt, title: "No Hidden Cost", desc: "Detailed agreement before work begins." },
    { icon: CheckCircle, title: "Same-as-Design Execution", desc: "Final result matches 3D renders exactly." },
    { icon: ShieldCheck, title: "Warranty on Work", desc: "Formal warranty for peace of mind." },
    { icon: Wallet, title: "Affordable Pricing", desc: "Premium quality without breaking the bank." }
  ];

  const steps = [
    { icon: ClipboardList, title: "Submit Your Request 📋", desc: "Fill out the form with your basic requirements." },
    { icon: Eye, title: "Our Team Reviews 👀", desc: "We analyze your needs to assign the right expert." },
    { icon: PhoneCall, title: "Free Consultation Call 📞", desc: "A quick chat to understand your vision and space." },
    { icon: FileText, title: "Get Your Detailed Quote 📄", desc: "Receive a transparent, itemized cost estimate." }
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
        eyebrow="Free, No Obligation"
        title="Get Your FREE Interior Design Quote"
        emphasis="Design Quote"
        lead="Tell us about your space, and we'll provide a detailed, transparent estimate."
        badges={['100% Free', 'No Hidden Cost', 'Quick Response']}
      />

      {/* 2. QUOTE FORM + TRUST SIDEBAR SECTION */}
      <section className="kv-section bg-[#FAFAF7]">
        <div className="kv-wrap">
          <div className="grid grid-cols-1 lg:grid-cols-[60%_1fr] gap-12">
            
            {/* LEFT COLUMN: Form */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
              <div className="bg-white rounded-lg p-6 md:p-[40px] shadow-card border-t-[4px] border-[#D9A441] relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {!submittedData ? (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <h2 className="font-playfair font-medium text-[28px] text-[#0B103B] mb-2 tracking-[-0.015em] leading-[1.12]">Request Your Free Quote</h2>
                      <p className="font-nunito text-[15px] text-[#6B675F] mb-6 pb-6 border-b border-[#0B103B]/10">
                        Fill in your details below. It takes less than 2 minutes.
                      </p>

                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative">
                        {/* Spam trap: hidden from people, bots fill it in */}
                        <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[10000px] h-px w-px opacity-0" {...register("website")} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* Full Name */}
                          <div>
                            <label className="block font-nunito font-semibold text-[13px] text-[#333] mb-[6px]">Full Name *</label>
                            <input 
                              type="text"
                              placeholder="e.g. Rahul Patel"
                              {...register("name", { required: "Name is required", minLength: { value: 2, message: "Min 2 characters" } })}
                              className={`form-input-base ${errors.name ? 'form-input-error' : 'form-input-focus'}`}
                            />
                            {errors.name && <p className="text-[#E53935] font-nunito text-[12px] mt-1.5">{errors.name.message}</p>}
                          </div>

                          {/* Phone Number */}
                          <div>
                            <label className="block font-nunito font-semibold text-[13px] text-[#333] mb-[6px]">Phone Number *</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-nunito text-[15px] text-[#6B675F]">
                                +91 |
                              </span>
                              <input 
                                type="tel"
                                placeholder="8401226123"
                                {...register("phone", { 
                                  required: "Phone is required", 
                                  pattern: { value: /^[6-9]\d{9}$/, message: "Valid 10-digit number required" }
                                })}
                                className={`form-input-base pl-[60px] ${errors.phone ? 'form-input-error' : 'form-input-focus'}`}
                              />
                            </div>
                            {errors.phone && <p className="text-[#E53935] font-nunito text-[12px] mt-1.5">{errors.phone.message}</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* Email */}
                          <div>
                            <label className="block font-nunito font-semibold text-[13px] text-[#333] mb-[6px]">Email Address (Optional)</label>
                            <input 
                              type="email"
                              placeholder="e.g. name@example.com"
                              {...register("email", { 
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Valid email required" }
                              })}
                              className={`form-input-base ${errors.email ? 'form-input-error' : 'form-input-focus'}`}
                            />
                            {errors.email && <p className="text-[#E53935] font-nunito text-[12px] mt-1.5">{errors.email.message}</p>}
                          </div>

                          {/* City */}
                          <div>
                            <label className="block font-nunito font-semibold text-[13px] text-[#333] mb-[6px]">City / Locality *</label>
                            <input 
                              type="text"
                              placeholder="e.g. Silvassa, Vapi..."
                              {...register("city", { required: "City is required" })}
                              className={`form-input-base ${errors.city ? 'form-input-error' : 'form-input-focus'}`}
                            />
                            {errors.city && <p className="text-[#E53935] font-nunito text-[12px] mt-1.5">{errors.city.message}</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* Service Required */}
                          <div>
                            <label className="block font-nunito font-semibold text-[13px] text-[#333] mb-[6px]">Service Required *</label>
                            <select 
                              {...register("service", { required: "Please select a service" })}
                              className={`form-input-base appearance-none ${errors.service ? 'form-input-error' : 'form-input-focus'}`}
                              style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23555555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundPosition: 'right 16px center', backgroundRepeat: 'no-repeat' }}
                            >
                              <option value="">Select a service...</option>
                              <option value="Full Home Interior">Full Home Interior</option>
                              <option value="Kitchen Interior">Kitchen Interior</option>
                              <option value="Furniture">Furniture</option>
                              <option value="Painting & Wall Finishes">Painting & Wall Finishes</option>
                              <option value="Commercial Interior">Commercial Interior</option>
                              <option value="Multiple Services">Multiple Services</option>
                              <option value="Not Sure">Not Sure — Need Guidance</option>
                            </select>
                            {errors.service && <p className="text-[#E53935] font-nunito text-[12px] mt-1.5">{errors.service.message}</p>}
                          </div>

                          {/* How Did You Find Us */}
                          <div>
                            <label className="block font-nunito font-semibold text-[13px] text-[#333] mb-[6px]">How Did You Find Us? *</label>
                            <select 
                              {...register("source", { required: "Please select an option" })}
                              className={`form-input-base appearance-none ${errors.source ? 'form-input-error' : 'form-input-focus'}`}
                              style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23555555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundPosition: 'right 16px center', backgroundRepeat: 'no-repeat' }}
                            >
                              <option value="">Select an option...</option>
                              <option value="Instagram">Instagram</option>
                              <option value="Facebook">Facebook</option>
                              <option value="Google Search">Google Search</option>
                              <option value="Friend/Family">Friend/Family</option>
                              <option value="WhatsApp">WhatsApp</option>
                              <option value="LinkedIn">LinkedIn</option>
                              <option value="Hoarding/Flex">Hoarding/Flex</option>
                              <option value="Other">Other</option>
                            </select>
                            {errors.source && <p className="text-[#E53935] font-nunito text-[12px] mt-1.5">{errors.source.message}</p>}
                          </div>
                        </div>

                        {/* Additional Requirements */}
                        <div>
                          <div className="flex justify-between items-end mb-[6px]">
                            <label className="block font-nunito font-semibold text-[13px] text-[#333]">Additional Requirements (Optional)</label>
                            <span className="font-nunito text-[11px] text-[#999]">{messageValue.length}/600</span>
                          </div>
                          <textarea 
                            rows={4}
                            placeholder="Tell us about your space, budget, or specific needs..."
                            {...register("message", { maxLength: { value: 600, message: "Max 600 characters" } })}
                            className={`form-input-base resize-y ${errors.message ? 'form-input-error' : 'form-input-focus'}`}
                          />
                          {errors.message && <p className="text-[#E53935] font-nunito text-[12px] mt-1.5">{errors.message.message}</p>}
                        </div>

                        {/* Preferred Contact Method */}
                        <div>
                          <label className="block font-nunito font-semibold text-[13px] text-[#333] mb-[8px]">Preferred Contact Method</label>
                          <div className="flex flex-wrap gap-4">
                            {['Call', 'WhatsApp', 'Either is Fine'].map((method) => (
                              <label key={method} className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                  <input 
                                    type="radio" 
                                    value={method} 
                                    {...register("contactMethod")}
                                    className="peer appearance-none w-4 h-4 border-[1.5px] border-[#D9A441] rounded-full checked:bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-[#F2B21B]/30 transition-all"
                                  />
                                  <div className="absolute w-2 h-2 bg-[#F2B21B] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                </div>
                                <span className="font-nunito text-[14px] text-[#6B675F] group-hover:text-[#111111] transition-colors">{method}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                          <button 
                            type="submit" 
                            disabled={!isValid || isSubmitting}
                            className={`btn-primary w-full !min-h-[56px] flex items-center justify-center gap-2 ${(!isValid || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'btn-shimmer hover:brightness-105 active:scale-[0.98] shadow-md hover:shadow-lg'}`}
                          >
                            {isSubmitting ? (
                              <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                            ) : (
                              '🎁 Get My Free Quote Now'
                            )}
                          </button>
                          {submitError && <p role="alert" className="mt-4 rounded-lg border border-[#C62828]/30 bg-[#C62828]/[0.06] px-4 py-3 font-nunito text-[14px] text-[#8C1D18]">{submitError}</p>}
                          <p className="flex items-center justify-center gap-1.5 mt-4 font-nunito text-[12px] text-[#6B675F]">
                            <Lock className="w-[12px] h-[12px]" /> Your information is safe. We never spam.
                          </p>
                        </div>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 flex flex-col items-center text-center">
                      <div className="w-[80px] h-[80px] bg-[#F2B21B]/10 rounded-full flex items-center justify-center mb-6 animate-scale-in">
                        <CheckCircle className="w-[40px] h-[40px] text-[#D9A441]" />
                      </div>
                      <h3 className="font-playfair font-medium text-[26px] text-[#0B103B] mb-4">Your Quote Request is Received! 🎉</h3>
                      <p className="font-nunito text-[16px] text-[#6B675F] mb-8 max-w-[320px] leading-relaxed">
                        Thank you, <strong className="text-[#111111]">{submittedData.name.split(' ')[0]}</strong>! We've received your request for <strong className="text-[#111111]">{submittedData.service}</strong>.
                      </p>
                      
                      <div className="bg-[#F5F1E8] rounded-xl p-5 w-full text-left mb-8">
                        <h4 className="font-nunito font-bold text-[14px] text-[#111111] mb-3 uppercase tracking-wider">Next Steps:</h4>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3"><span className="text-[#D9A441] font-bold">1.</span> <span className="font-nunito text-[14px] text-[#6B675F]">Our team reviews your requirements.</span></li>
                          <li className="flex items-start gap-3"><span className="text-[#D9A441] font-bold">2.</span> <span className="font-nunito text-[14px] text-[#6B675F]">We call you on {submittedData.phone} to discuss details.</span></li>
                          <li className="flex items-start gap-3"><span className="text-[#D9A441] font-bold">3.</span> <span className="font-nunito text-[14px] text-[#6B675F]">You receive your detailed, free quote.</span></li>
                        </ul>
                      </div>

                      <a href="https://wa.me/918401226123" target="_blank" rel="noreferrer" className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-nunito font-bold text-[16px] py-[16px] rounded-lg transition-transform active:scale-[0.98] shadow-md flex items-center justify-center gap-2 mb-4">
                        <MessageCircleIcon className="w-5 h-5" /> WhatsApp Us for Faster Response
                      </a>
                      <p className="font-nunito text-[13px] text-[#6B675F]">Or call us directly at <a href="tel:8401226123" className="text-[#D9A441] font-bold hover:underline">8401226123</a></p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Sidebar */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } } }}>
              <h3 className="font-playfair font-medium text-[24px] text-[#0B103B] mb-2">Why Choose KailVarn?</h3>
              <p className="font-nunito text-[15px] text-[#6B675F] mb-6">We eliminate the stress of home interiors.</p>

              <div className="space-y-3 mb-8">
                {usps.map((usp, idx) => (
                  <div key={idx} className="bg-white border border-[#0B103B]/10 rounded-lg p-4 flex items-center gap-4 hover:border-[#D9A441] transition-colors group">
                    <div className="w-[40px] h-[40px] rounded-lg bg-[#F2B21B]/10 flex items-center justify-center shrink-0 group-hover:bg-[#F2B21B] transition-colors">
                      <usp.icon className="w-[20px] h-[20px] text-[#D9A441] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-nunito font-bold text-[15px] text-[#111111] leading-tight mb-0.5">{usp.title}</h4>
                      <p className="font-nunito text-[13px] text-[#6B675F] leading-snug">{usp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#F5F1E8] rounded-lg p-5 border border-[#0B103B]/10">
                <h4 className="font-nunito font-bold text-[15px] text-[#111111] mb-3">Still have questions?</h4>
                <div className="flex flex-col gap-2">
                  <a href="tel:8401226123" className="font-nunito font-bold text-[15px] text-[#D9A441] hover:underline flex items-center gap-2">
                    📞 Call 8401226123
                  </a>
                  <a href="https://wa.me/918401226123" target="_blank" rel="noreferrer" className="font-nunito font-bold text-[15px] text-[#25D366] hover:underline flex items-center gap-2">
                    💬 WhatsApp Us
                  </a>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 items-center justify-start border-t border-[#0B103B]/10 pt-6">
                <div className="flex items-center gap-1.5 font-nunito font-semibold text-[13px] text-[#6B675F]">
                  <Star className="w-4 h-4 text-[#D9A441] fill-[#F2B21B]" /> 5-Star Service
                </div>
                <div className="flex items-center gap-1.5 font-nunito font-semibold text-[13px] text-[#6B675F]">
                  <span className="text-[16px]">🏠</span> Many Projects
                </div>
                <div className="flex items-center gap-1.5 font-nunito font-semibold text-[13px] text-[#6B675F]">
                  <MapPin className="w-4 h-4 text-[#D9A441]" /> Silvassa & Vapi
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-[72px] lg:py-[104px] bg-[#F5F1E8]">
        <div className="kv-wrap">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scrollVariants} className="text-center mb-12">
            <h3 className="font-playfair font-medium text-[30px] md:text-[40px] lg:text-[46px] text-[#0B103B] mb-3">What Happens After You Submit?</h3>
            <p className="font-nunito text-[16px] text-[#6B675F] max-w-2xl mx-auto">A simple, transparent process to get your project started.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-[2px] bg-[#E2DED6] z-0"></div>

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
                <p className="font-nunito text-[14px] text-[#6B675F] leading-relaxed">{step.desc}</p>
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
            <p className="font-nunito text-[16px] text-[#6B675F] max-w-2xl mx-auto">Skip the form and reach out to us right now.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Call Card */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="bg-[#FAFAF7] rounded-lg p-8 text-center border border-[#0B103B]/10 hover:shadow-md transition-shadow">
              <div className="w-[60px] h-[60px] bg-[#F2B21B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-[28px] h-[28px] text-[#D9A441]" />
              </div>
              <h4 className="font-nunito font-bold text-[18px] text-[#111111] mb-1">Call Us Directly</h4>
              <a href="tel:8401226123" className="block font-playfair font-bold text-[24px] text-[#D9A441] mb-2 hover:underline">8401226123</a>
              <p className="font-nunito text-[14px] text-[#6B675F] mb-6">Mon–Sat, 9 AM – 7 PM</p>
              <a href="tel:8401226123" className="btn-primary block w-full">
                📞 Tap to Call
              </a>
            </motion.div>

            {/* WhatsApp Card */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } } }} className="bg-[#FAFAF7] rounded-lg p-8 text-center border border-[#0B103B]/10 hover:shadow-md transition-shadow">
              <div className="w-[60px] h-[60px] bg-[#25D366]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircleIcon className="w-[28px] h-[28px] text-[#25D366]" />
              </div>
              <h4 className="font-nunito font-bold text-[18px] text-[#111111] mb-1">WhatsApp Us</h4>
              <a href="https://wa.me/918401226123" target="_blank" rel="noreferrer" className="block font-playfair font-bold text-[24px] text-[#25D366] mb-2 hover:underline">8401226123</a>
              <p className="font-nunito text-[14px] text-[#6B675F] mb-6">Quick response guaranteed</p>
              <a href="https://wa.me/918401226123?text=Hi KailVarn, I'd like a free interior quote." target="_blank" rel="noreferrer" className="block w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-nunito font-bold text-[15px] py-3 rounded-lg transition-transform active:scale-[0.98]">
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
              <p className="font-nunito text-[14px] text-[#6B675F] mb-6">Response within 24 hours</p>
              <a href="mailto:kailvarn0@gmail.com" className="btn-outline-dark block w-full">
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
      <h3 className="font-playfair font-medium text-[26px] md:text-[32px] text-[#0B103B] mb-4">
        What Clients Say After Getting Their Quote
      </h3>

      <p className="font-nunito text-[15px] md:text-[16px] text-[#6B675F] max-w-[650px] mx-auto leading-relaxed">
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
            <p className="font-nunito text-[15px] md:text-[15.5px] text-[#444] italic leading-[1.9]">
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

              <p className="font-nunito text-[12.5px] text-[#888] mt-1">
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

export default GetFreeQuotePage;