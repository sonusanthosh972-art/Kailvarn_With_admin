'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { submitLead } from '@/lib/submitLead.js';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Linkedin, Lock, CheckCircle, ChevronDown, ChevronUp, Send, MessageCircle } from 'lucide-react';
import PageHero from '@/components/kv/PageHero.jsx';
function ContactUsPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    }
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      city: '',
      service: '',
      message: ''
    }
  });
  const onSubmit = async data => {
    setSubmitError('');
    const result = await submitLead('/api/contact', data);
    if (!result.ok) {
      setSubmitError(result.message);
      return;
    }
    setSubmitted(true);
  };
  const scrollVariants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  const faqs = [{
    q: "What is the difference between KailVarn and a normal interior designer?",
    a: "A normal interior designer only gives you design, 3D renders, and drawings — you then have to find and manage your own contractors for execution. KailVarn provides FREE design + full execution under one expert team. You don't need to deal with contractors at all. Design, carpentry, civil, painting, electrical — everything is done by us."
  }, {
    q: "Is the interior designer really free? What's the catch?",
    a: "Yes, completely free. Our interior designer is a full-time member of our team — their cost is included in the project cost. There is no separate 'designer fee.' We believe design is a service we provide, not a separate business. You benefit from professional design without paying anything extra."
  }, {
    q: "How do you ensure the final result looks like the design?",
    a: "We use modern tools, trained craftsmen, and a dedicated project manager who checks every stage against the design. Before starting, we get your approval on the 3D design, materials, and finishes. During execution, the same team that designed oversees the work — which is why there's no mismatch."
  }, {
    q: "What areas do you serve?",
    a: "We currently serve Silvassa, Vapi, and surrounding areas within approximately 50km — including Daman, Bhilad, Kachigam, Surangi, Dunetha, Nani Daman and nearby locations. If you're unsure whether we cover your area, please call or WhatsApp us — we'll confirm immediately."
  }, {
    q: "How does the 'no hidden cost' agreement work?",
    a: "Before any work begins, we prepare a detailed written agreement listing every item — materials, labor, finishes, timelines, and costs. Once you sign, the total cost doesn't change unless YOU request additional work. No mid-project surprise bills, no extra charges for 'unforeseen issues.' What is written is what you pay."
  }, {
    q: "How long does a typical project take?",
    a: "Timeline depends on project scope. A kitchen interior typically takes 3–5 weeks. Furniture-only work takes 2–4 weeks. Full home interior ranges from 6 weeks to 3–4 months depending on size and scope. During design stage, we give you a clear timeline and stick to it."
  }, {
    q: "What kind of warranty do you provide?",
    a: "We provide warranty on carpentry work (wardrobe mechanisms, furniture joints, finishes), painting work (peeling, cracking within warranty period), and other specific work items — all mentioned in the agreement. The exact warranty period is discussed and documented for each category. If any issue arises in the warranty period, we fix it free of charge."
  }, {
    q: "Can I get only one service — like just painting or just furniture?",
    a: "Absolutely! You don't have to take all services. If you only need painting, or only want a modular kitchen, or only need custom furniture — KailVarn handles single-service projects too. Each service is available independently."
  }, {
    q: "What is the process to get started?",
    a: "(1) Call or fill the form to book a free consultation. (2) We do a site visit and understand your requirements. (3) We create a 3D design at zero cost. (4) We share a detailed cost estimate. (5) You approve design and cost, we sign an agreement. (6) Work begins. You can start the process in 5 minutes by calling 8460150027 or clicking 'Get Free Quote.'"
  }, {
    q: "Do you work on commercial spaces like offices, cafés, and shops?",
    a: "Yes! KailVarn designs and executes commercial interiors for offices, cafés, restaurants, retail shops, showrooms, clinics, and other commercial spaces. Our team understandsboth residential and commercial requirements. Check our design portfolio for commercial interior examples."
  }];
  const contactItems = [{
    icon: Phone,
    label: "CALL US",
    value: "8460150027",
    note: "Mon–Sat, 9 AM – 7 PM",
    link: "tel:+918460150027"
  }, {
    icon: Phone,
    label: "WHATSAPP",
    value: "8460150027",
    note: "Quick response on WhatsApp",
    link: "https://wa.me/918460150027?text=Hi KailVarn, I want to enquire about interior services."
  }, {
    icon: Mail,
    label: "EMAIL",
    value: "kailvarn0@gmail.com",
    note: "We respond within 24 hours",
    link: "mailto:kailvarn0@gmail.com"
  }, {
    icon: MapPin,
    label: "SERVICE AREAS",
    value: "Silvassa, Vapi & 50km Nearby",
    note: "Serving Daman, Bhilad, Kachigam & surrounding areas",
    link: null
  }, {
    icon: Clock,
    label: "WORKING HOURS",
    value: "Monday to Saturday",
    note: "9:00 AM — 7:00 PM",
    link: null
  }];
  return <div className="bg-[#FAFAF7] min-h-screen text-[#111111]">

      {/* 1. PAGE HERO SECTION */}
      <PageHero
        image="https://images.unsplash.com/photo-1688584270387-01810506c2ec"
        breadcrumb="Contact Us"
        eyebrow="Get In Touch"
        title="We'd Love to Hear From You"
        emphasis="From You"
        lead="Have a question about your project? Want to know costs? Just want to say hello? We're here — reach out any way you prefer."
      />

      {/* 2. CONTACT INFO + FORM SECTION */}
      <section className="kv-section bg-[#FAFAF7]">
        <div className="kv-wrap">
          <div className="grid grid-cols-1 lg:grid-cols-[40%_1fr] gap-12 lg:gap-12">
            
            {/* Left Column: Contact Info */}
            <motion.div initial="hidden" whileInView="visible" viewport={{
            once: true
          }} variants={{
            hidden: {
              opacity: 0,
              x: -30
            },
            visible: {
              opacity: 1,
              x: 0,
              transition: {
                duration: 0.6
              }
            }
          }}>
              <h2 className="font-playfair font-medium text-[28px] text-[#0B103B] mb-2 tracking-[-0.015em] leading-[1.12]">Contact Information</h2>
              <p className="font-nunito text-[15px] text-[#6B675F] mb-8">Reach us through any channel — we respond quickly.</p>
              
              <div className="space-y-6 mb-10">
                {contactItems.map((item, idx) => {
                const Icon = item.icon;
                const content = <div className="flex gap-4 items-start group">
                      <div className="w-[44px] h-[44px] rounded-xl bg-[#F2B21B]/[0.12] flex items-center justify-center shrink-0 group-hover:bg-[#F2B21B] transition-colors duration-300">
                        <Icon className="w-[20px] h-[20px] text-[#D9A441] group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div>
                        <div className="font-nunito font-semibold text-[11px] tracking-[1.5px] text-[#D9A441] uppercase mb-1">{item.label}</div>
                        <div className="font-nunito font-semibold text-[16px] text-[#111111] mb-0.5">{item.value}</div>
                        <div className="font-nunito text-[13px] text-[#6B675F]">{item.note}</div>
                      </div>
                    </div>;
                return item.link ? <a key={idx} href={item.link} target={item.link.startsWith('http') ? '_blank' : '_self'} rel="noreferrer" className="block outline-none focus-visible:ring-2 focus-visible:ring-[#F2B21B] rounded-lg">
                      {content}
                    </a> : <div key={idx}>{content}</div>;
              })}
              </div>

              <div className="pt-6 border-t border-[#0B103B]/10">
                <h3 className="font-nunito font-semibold text-[13px] text-[#6B675F] mb-4 uppercase tracking-wider">Follow Us</h3>
                <div className="flex gap-3 mb-8">
                  {[{
                  icon: Instagram,
                  link: "https://instagram.com"
                }, {
                  icon: Facebook,
                  link: "https://facebook.com"
                }, {
                  icon: Linkedin,
                  link: "https://linkedin.com"
                }].map((social, i) => <a key={i} href={social.link} target="_blank" rel="noreferrer" className="w-[40px] h-[40px] rounded-full bg-[#F5F1E8] flex items-center justify-center text-[#6B675F] hover:bg-[#F2B21B] hover:text-[#0B103B] transition-colors duration-300">
                      <social.icon className="w-[18px] h-[18px]" />
                    </a>)}
                </div>

                <div className="flex flex-col gap-3">
                  <a href="tel:+918460150027" className="btn-primary w-full">
                    <Phone className="w-[18px] h-[18px]" /> Call Now
                  </a>
                  <a href="https://wa.me/918460150027" target="_blank" rel="noreferrer" className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-nunito font-bold text-[15px] py-3 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                    <MessageCircle className="w-[18px] h-[18px]" /> WhatsApp Now
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Form Card */}
            <motion.div initial="hidden" whileInView="visible" viewport={{
            once: true
          }} variants={{
            hidden: {
              opacity: 0,
              x: 30
            },
            visible: {
              opacity: 1,
              x: 0,
              transition: {
                duration: 0.6
              }
            }
          }}>
              <div className="bg-white rounded-lg p-6 md:p-[36px] shadow-card border border-[#0B103B]/10">
                <AnimatePresence mode="wait">
                  {!submitted ? <motion.div key="form" initial={{
                  opacity: 0
                }} animate={{
                  opacity: 1
                }} exit={{
                  opacity: 0
                }}>
                      <h3 className="font-playfair font-medium text-[26px] text-[#0B103B] mb-2">Send Us an Enquiry</h3>
                      <p className="font-nunito text-[14.5px] text-[#6B675F] mb-8">Fill in the details and our team will get back to you within a few hours.</p>

                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative">
                        {/* Spam trap: hidden from people, bots fill it in */}
                        <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[10000px] h-px w-px opacity-0" {...register("website")} />
                        {/* Name */}
                        <div>
                          <label className="block font-nunito font-semibold text-[13px] text-[#333] mb-[6px]">Your Full Name *</label>
                          <input type="text" placeholder="e.g. Rahul Patel" {...register("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters"
                        }
                      })} className={`w-full bg-white border-[1.5px] ${errors.name ? 'border-[#E53935] focus:ring-[#E53935]/15' : 'border-[#0B103B]/10 focus:border-[#D9A441] focus:ring-[#F2B21B]/15'} rounded-[8px] px-4 py-3 font-nunito text-[15px] text-[#111111] placeholder:text-[#999] outline-none focus:ring-[3px] transition-all`} />
                          {errors.name && <p className="text-[#E53935] font-nunito text-[12px] mt-1.5">{errors.name.message}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block font-nunito font-semibold text-[13px] text-[#333] mb-[6px]">Phone Number *</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-nunito text-[15px] text-[#6B675F] flex items-center gap-1.5">
                              +91 |
                            </span>
                            <input type="tel" placeholder="e.g. 8460150027" {...register("phone", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[6-9]\d{9}$/,
                            message: "Please enter a valid 10-digit Indian number"
                          }
                        })} className={`w-full bg-white border-[1.5px] ${errors.phone ? 'border-[#E53935] focus:ring-[#E53935]/15' : 'border-[#0B103B]/10 focus:border-[#D9A441] focus:ring-[#F2B21B]/15'} rounded-[8px] pl-[64px] pr-4 py-3 font-nunito text-[15px] text-[#111111] placeholder:text-[#999] outline-none focus:ring-[3px] transition-all`} />
                          </div>
                          {errors.phone && <p className="text-[#E53935] font-nunito text-[12px] mt-1.5">{errors.phone.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block font-nunito font-semibold text-[13px] text-[#333] mb-[6px]">Email Address</label>
                          <input type="email" placeholder="e.g. kailvarn0@gmail.com" {...register("email", {
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address"
                        }
                      })} className={`w-full bg-white border-[1.5px] ${errors.email ? 'border-[#E53935] focus:ring-[#E53935]/15' : 'border-[#0B103B]/10 focus:border-[#D9A441] focus:ring-[#F2B21B]/15'} rounded-[8px] px-4 py-3 font-nunito text-[15px] text-[#111111] placeholder:text-[#999] outline-none focus:ring-[3px] transition-all`} />
                          {errors.email && <p className="text-[#E53935] font-nunito text-[12px] mt-1.5">{errors.email.message}</p>}
                        </div>

                        {/* City */}
                        <div>
                          <label className="block font-nunito font-semibold text-[13px] text-[#333] mb-[6px]">Your City / Locality *</label>
                          <input type="text" placeholder="e.g. Silvassa, Vapi, Bhilad..." {...register("city", {
                        required: "City / Locality is required"
                      })} className={`w-full bg-white border-[1.5px] ${errors.city ? 'border-[#E53935] focus:ring-[#E53935]/15' : 'border-[#0B103B]/10 focus:border-[#D9A441] focus:ring-[#F2B21B]/15'} rounded-[8px] px-4 py-3 font-nunito text-[15px] text-[#111111] placeholder:text-[#999] outline-none focus:ring-[3px] transition-all`} />
                          {errors.city && <p className="text-[#E53935] font-nunito text-[12px] mt-1.5">{errors.city.message}</p>}
                        </div>

                        {/* Service */}
                        <div>
                          <label className="block font-nunito font-semibold text-[13px] text-[#333] mb-[6px]">Service You're Interested In *</label>
                          <select {...register("service", {
                        required: "Please select a service"
                      })} className={`w-full bg-white border-[1.5px] ${errors.service ? 'border-[#E53935] focus:ring-[#E53935]/15' : 'border-[#0B103B]/10 focus:border-[#D9A441] focus:ring-[#F2B21B]/15'} rounded-[8px] px-4 py-3 font-nunito text-[15px] text-[#111111] outline-none focus:ring-[3px] transition-all appearance-none`} style={{
                        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23555555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 16px center',
                        backgroundRepeat: 'no-repeat'
                      }}>
                            <option value="">Select a service...</option>
                            <option value="Full Home Interior">Full Home Interior</option>
                            <option value="Kitchen Interior">Kitchen Interior</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Painting">Painting & Wall Finishes</option>
                            <option value="Commercial">Commercial Interior</option>
                            <option value="Multiple">Multiple Services</option>
                            <option value="Not Sure">Not Sure — Need Guidance</option>
                          </select>
                          {errors.service && <p className="text-[#E53935] font-nunito text-[12px] mt-1.5">{errors.service.message}</p>}
                        </div>

                        {/* Message */}
                        <div>
                          <label className="block font-nunito font-semibold text-[13px] text-[#333] mb-[6px]">Your Message or Question</label>
                          <textarea rows={4} placeholder="Tell us about your space, any specific requirements, or questions you have..." {...register("message", {
                        maxLength: {
                          value: 500,
                          message: "Maximum 500 characters allowed"
                        }
                      })} className="w-full bg-white border-[1.5px] border-[#0B103B]/10 focus:border-[#D9A441] focus:ring-[3px] focus:ring-[#F2B21B]/15 rounded-[8px] px-4 py-3 font-nunito text-[15px] text-[#111111] placeholder:text-[#999] outline-none transition-all resize-y" />
                          {errors.message && <p className="text-[#E53935] font-nunito text-[12px] mt-1.5">{errors.message.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                          <button type="submit" disabled={isSubmitting} className={`btn-primary w-full !min-h-[56px] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-105 active:scale-[0.98] shadow-md hover:shadow-lg'}`}>
                            {isSubmitting ? 'Sending...' : 'Send My Enquiry 📩'}
                          </button>
                          {submitError && <p role="alert" className="mt-4 rounded-lg border border-[#C62828]/30 bg-[#C62828]/[0.06] px-4 py-3 font-nunito text-[14px] text-[#8C1D18]">{submitError}</p>}
                          <p className="flex items-center justify-center gap-1.5 mt-4 font-nunito text-[12px] text-[#6B675F]">
                            <Lock className="w-[12px] h-[12px]" /> Your information is safe with us. We never share your details.
                          </p>
                        </div>
                      </form>
                    </motion.div> : <motion.div key="success" initial={{
                  opacity: 0,
                  scale: 0.9
                }} animate={{
                  opacity: 1,
                  scale: 1
                }} className="h-full min-h-[500px] flex flex-col items-center justify-center text-center">
                      <motion.div initial={{
                    scale: 0
                  }} animate={{
                    scale: 1
                  }} transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.1
                  }}>
                        <CheckCircle className="w-[80px] h-[80px] text-green-500 mb-6" />
                      </motion.div>
                      <h4 className="font-playfair font-bold text-[24px] text-[#111111] mb-3">Enquiry Sent Successfully!</h4>
                      <p className="font-nunito text-[16px] text-[#6B675F] mb-8 max-w-[300px] leading-relaxed">
                        Thank you for reaching out! Our team will call or WhatsApp you within a few hours to discuss your project.
                      </p>
                      <a href="https://wa.me/918460150027" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-nunito font-bold text-[15px] px-8 py-3.5 rounded-lg transition-transform active:scale-[0.98] shadow-md">
                        <MessageCircleIcon className="w-5 h-5" /> WhatsApp Us for Faster Reply
                      </a>
                    </motion.div>}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. GOOGLE MAP SECTION */}
      <section className="pb-[88px] lg:pb-[128px] bg-[#FAFAF7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h4 className="font-nunito font-bold text-[20px] text-[#111111] text-center mb-6">We Are Here — Silvassa & Vapi</h4>
          <div className="h-[280px] md:h-[380px] rounded-lg overflow-hidden shadow-card border border-[#0B103B]/10 mb-4">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.41709392634!2d72.90472!3d20.273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0dd4a9c5a1b8f%3A0x3b3b3b3b3b3b3b3b!2sSilvassa%2C%20Dadra%20and%20Nagar%20Haveli!5e0!3m2!1sen!2sin!4v1234567890" width="100%" height="100%" style={{
            border: 0
          }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="KailVarn Location Map"></iframe>
          </div>
          <p className="font-nunito text-[14px] text-[#6B675F] text-center">
            Also serving: Daman | Bhilad | Kachigam | Surangi | Dunetha | Nani Daman | surrounding 50km
          </p>
        </div>
      </section>

      {/* 4. FAQ SECTION */}
      <section className="kv-section bg-[#F5F1E8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={scrollVariants} className="text-center mb-12">
            <span className="kv-eyebrow kv-eyebrow--center">Frequently Asked Questions</span>
            <h2 className="font-playfair font-medium text-[34px] md:text-[44px] lg:text-[54px] text-[#0B103B] mb-4 tracking-[-0.015em] leading-[1.12]">Answers to Common Questions</h2>
            <p className="font-nunito text-[16px] md:text-[17px] text-[#6B675F]">
              Have a question? Most answers are right here. If not — just call or WhatsApp us.
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => <motion.div key={idx} initial={{
            opacity: 0,
            y: 10
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.3,
            delay: idx * 0.05
          }} className="bg-white rounded-lg shadow-sm border border-[#0B103B]/10 overflow-hidden">
                <button onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)} className="w-full px-[24px] py-[20px] flex items-center justify-between bg-white hover:bg-gray-50/50 transition-colors text-left outline-none focus-visible:ring-2 focus-visible:ring-[#F2B21B]">
                  <span className="font-nunito font-semibold text-[15.5px] text-[#111111] pr-4 leading-snug">{faq.q}</span>
                  <div className="shrink-0 text-[#D9A441]">
                    {openFaqIndex === idx ? <ChevronUp className="w-[20px] h-[20px]" /> : <ChevronDown className="w-[20px] h-[20px]" />}
                  </div>
                </button>
                <AnimatePresence>
                  {openFaqIndex === idx && <motion.div initial={{
                height: 0,
                opacity: 0
              }} animate={{
                height: "auto",
                opacity: 1
              }} exit={{
                height: 0,
                opacity: 0
              }} transition={{
                duration: 0.3,
                ease: "easeInOut"
              }}>
                      <div className="px-[24px] pb-[20px] pt-1">
                        <div className="w-full h-[1px] bg-gray-100 mb-4"></div>
                        <p className="font-nunito text-[15px] text-[#6B675F] leading-[1.7]">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>}
                </AnimatePresence>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* 5. CONTACT PAGE FINAL CTA SECTION */}
      <section className="bg-[#0B103B] kv-section text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={scrollVariants}>
            <h2 className="font-playfair font-medium text-[32px] md:text-[42px] lg:text-[50px] text-white mb-4 leading-tight tracking-[-0.015em]">
              Still Have Questions? Let's Talk.
            </h2>
            <p className="font-nunito text-[16px] text-white/70 mb-10 max-w-2xl mx-auto text-balance">
              The best way to understand your project needs is a quick 10-minute conversation. Call us, WhatsApp us, or book a free site visit.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a href="tel:+918460150027" className="btn-outline w-full sm:w-auto">
                <Phone className="w-[18px] h-[18px]" /> Call 8460150027
              </a>
              <a href="https://wa.me/918460150027?text=Hi KailVarn, I want to enquire about interior services" target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white font-nunito font-bold text-[15px] px-8 py-3.5 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                <MessageCircleIcon className="w-[18px] h-[18px]" /> WhatsApp Now
              </a>
              <Link href="/book-consultation" className="btn-primary w-full sm:w-auto">
                Book Free Consultation →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>;
}

// Separate component for MessageCircle because it was missing an explicit import alias in previous version
function MessageCircleIcon(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>;
}
export default ContactUsPage;